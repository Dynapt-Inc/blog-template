// Node 18+ (global fetch)
// install: npm i libsodium-wrappers

async function getAzureAccessToken(
  clientId: string,
  clientSecret: string,
  tenantId: string
): Promise<string> {
  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);
  params.append("scope", "https://management.azure.com/.default");
  params.append("grant_type", "client_credentials");

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get Azure access token: ${error}`);
  }
  const tokenData = await response.json();
  return tokenData.access_token;
}

async function findRegistryResourceGroup(
  subscriptionId: string,
  registryName: string,
  accessToken: string
): Promise<string | null> {
  const resourceGroupsUrl = `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups?api-version=2023-07-01`;
  const resourceGroupsResponse = await fetch(resourceGroupsUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  if (!resourceGroupsResponse.ok) return null;

  const resourceGroups = await resourceGroupsResponse.json();
  for (const rg of resourceGroups.value ?? []) {
    const rgName = rg.name;
    const registryUrl = `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${rgName}/providers/Microsoft.ContainerRegistry/registries/${registryName}?api-version=2023-07-01`;
    const registryResponse = await fetch(registryUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    if (registryResponse.ok) return rgName;
  }
  return null;
}

async function getACRCredentials(): Promise<{
  username: string;
  password: string;
} | null> {
  const clientId = process.env.AZURE_CLIENT_ID!;
  const clientSecret = process.env.AZURE_CLIENT_SECRET!;
  const tenantId = process.env.AZURE_TENANT_ID!;
  const subscriptionId = process.env.AZURE_SUBSCRIPTION_ID!;

  if (!clientId || !clientSecret || !tenantId || !subscriptionId) return null;

  const accessToken = await getAzureAccessToken(
    clientId,
    clientSecret,
    tenantId
  );

  const registryUrl =
    process.env.AZURE_CONTAINER_REGISTRY_URL || "hostedwebsitesacr.azurecr.io";
  const registryName = registryUrl.replace(".azurecr.io", "");
  let resourceGroupName = process.env.ACR_RG || "Hosted-Websites";

  let credentialsUrl = `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.ContainerRegistry/registries/${registryName}/listCredentials?api-version=2023-07-01`;

  let response = await fetch(credentialsUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      const found = await findRegistryResourceGroup(
        subscriptionId,
        registryName,
        accessToken
      );
      if (!found) return null;
      resourceGroupName = found;
      credentialsUrl = `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.ContainerRegistry/registries/${registryName}/listCredentials?api-version=2023-07-01`;
      response = await fetch(credentialsUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) return null;
    } else {
      return null;
    }
  }

  const credentials = await response.json();
  if (!credentials.username) return null;
  const password =
    credentials.passwords?.[0]?.value ||
    credentials.passwords?.[1]?.value ||
    null;
  if (!password) return null;

  return { username: credentials.username, password };
}

async function encryptSecret(
  secret: string,
  publicKey: string
): Promise<string> {
  const sodiumModule = await import("libsodium-wrappers");
  const sodium = sodiumModule.default;
  await sodium.ready;

  const publicKeyBytes = sodium.from_base64(
    publicKey,
    sodium.base64_variants.ORIGINAL
  );
  const encryptedBytes = sodium.crypto_box_seal(secret, publicKeyBytes);
  return sodium.to_base64(encryptedBytes, sodium.base64_variants.ORIGINAL);
}

export async function addGitHubSecrets(
  owner: string,
  repoName: string
): Promise<void> {
  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) throw new Error("GITHUB_TOKEN not found");

  // 1) Get repo public key
  const publicKeyResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repoName}/actions/secrets/public-key`,
    {
      headers: {
        Authorization: `token ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );
  if (!publicKeyResponse.ok) {
    throw new Error(
      `Failed to get repository public key: ${await publicKeyResponse.text()}`
    );
  }
  const publicKeyData = await publicKeyResponse.json();
  const keyId: string = publicKeyData.key_id;
  const publicKey: string = publicKeyData.key;

  // 2) Compose secrets: Azure creds JSON + ACR creds
  const acr = await getACRCredentials();
  if (!acr) throw new Error("ACR credentials not found");

  const azureCredentialsJson = JSON.stringify(
    {
      clientId: process.env.AZURE_CLIENT_ID,
      clientSecret: process.env.AZURE_CLIENT_SECRET,
      subscriptionId: process.env.AZURE_SUBSCRIPTION_ID,
      tenantId: process.env.AZURE_TENANT_ID,
    },
    null,
    2
  );

  const secrets: Record<string, string | undefined> = {
    AZURE_SUBSCRIPTION_ID: process.env.AZURE_SUBSCRIPTION_ID,
    AZURE_TENANT_ID: process.env.AZURE_TENANT_ID,
    AZURE_CLIENT_ID: process.env.AZURE_CLIENT_ID,
    AZURE_CLIENT_SECRET: process.env.AZURE_CLIENT_SECRET,
    AZURE_CREDENTIALS: azureCredentialsJson,
    REGISTRY_USERNAME: acr.username,
    REGISTRY_PASSWORD: acr.password,
  };

  // 3) Encrypt and PUT each secret
  for (const [name, value] of Object.entries(secrets)) {
    if (!value) continue;
    const encrypted_value = await encryptSecret(value, publicKey);
    const put = await fetch(
      `https://api.github.com/repos/${owner}/${repoName}/actions/secrets/${name}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ encrypted_value, key_id: keyId }),
      }
    );
    if (!put.ok) {
      throw new Error(`Failed to set secret ${name}: ${await put.text()}`);
    }
  }
}

export async function createPrivateRepoIfMissing(
  owner: string,
  repoName: string
): Promise<void> {
  const token = process.env.GITHUB_TOKEN!;
  // Check if exists
  const check = await fetch(
    `https://api.github.com/repos/${owner}/${repoName}`,
    {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );
  if (check.ok) return;

  // Create
  const resp = await fetch(`https://api.github.com/user/repos`, {
    method: "POST",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github.v3+json",
    },
    body: JSON.stringify({ name: repoName, private: true, auto_init: true }),
  });
  if (!resp.ok) throw new Error(`Failed to create repo: ${await resp.text()}`);
}

if (require.main === module) {
  const owner = process.env.GITHUB_OWNER as string;
  const repo = process.env.GITHUB_REPO as string;
  if (!owner || !repo) {
    console.error("GITHUB_OWNER and GITHUB_REPO are required env vars");
    process.exit(1);
  }
  createPrivateRepoIfMissing(owner, repo)
    .then(() => addGitHubSecrets(owner, repo))
    .then(() => console.log("Secrets updated."))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
