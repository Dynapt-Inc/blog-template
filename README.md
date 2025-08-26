## Blog Template

This is a Next.js + TypeScript + Tailwind blog template designed for programmatic content updates via Git.

### Local Development

```bash
npm install
npm run dev
```

Open http://localhost:3000

### Add a Post

- Create a markdown or text file in `src/content/posts/`, e.g. `my-post.md`.
- First non-empty line becomes the title; rest is the content. An excerpt is auto-derived.

### Continuous Deployment (Azure Container Apps)

On push to `main`, GitHub Actions builds and deploys the app.

Required GitHub secrets:

- `AZURE_CLIENT_ID`
- `AZURE_TENANT_ID`
- `AZURE_SUBSCRIPTION_ID`
- `AZURE_RESOURCE_GROUP`
- `AZURE_CONTAINER_APP_NAME`
- `ACR_NAME` (Azure Container Registry name)
- `ACR_LOGIN_SERVER` (e.g. `myregistry.azurecr.io`)

When a new post is committed, the workflow builds an image and updates the Container App.
