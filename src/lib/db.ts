import fs from "fs";
import path from "path";
import mysql, { type Pool, type PoolConnection, type PoolOptions } from "mysql2/promise";

type RequiredEnv =
  | "COSMOS_MYSQL_HOST"
  | "COSMOS_MYSQL_PORT"
  | "COSMOS_MYSQL_USERNAME"
  | "COSMOS_MYSQL_PASSWORD"
  | "COSMOS_MYSQL_DATABASE";

let pool: Pool | null = null;

function readEnv(name: RequiredEnv): string {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(
      `[cosmos-db] Missing required environment variable ${name}.`
    );
  }
  return value.trim();
}

function parsePort(raw: string): number {
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) {
    throw new Error(
      `[cosmos-db] Expected COSMOS_MYSQL_PORT to be a number, received "${raw}".`
    );
  }
  return parsed;
}

function resolveSslOptions(): PoolOptions["ssl"] {
  const sslMode = (process.env.COSMOS_MYSQL_SSL || "required").toLowerCase();
  if (["skip", "disabled", "false", "off"].includes(sslMode)) {
    return undefined;
  }

  const certSource = process.env.COSMOS_MYSQL_CA_CERT?.trim();
  if (!certSource) {
    return { rejectUnauthorized: true };
  }

  if (certSource.includes("BEGIN CERTIFICATE")) {
    return { ca: certSource };
  }

  const resolved = path.isAbsolute(certSource)
    ? certSource
    : path.join(process.cwd(), certSource);

  if (!fs.existsSync(resolved)) {
    throw new Error(
      `[cosmos-db] COSMOS_MYSQL_CA_CERT file not found at ${resolved}.`
    );
  }

  return { ca: fs.readFileSync(resolved, "utf8") };
}

function createPool(): Pool {
  const host = readEnv("COSMOS_MYSQL_HOST");
  const port = parsePort(readEnv("COSMOS_MYSQL_PORT"));
  const user = readEnv("COSMOS_MYSQL_USERNAME");
  const password = readEnv("COSMOS_MYSQL_PASSWORD");
  const database = readEnv("COSMOS_MYSQL_DATABASE");

  const options: PoolOptions = {
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: Number(process.env.COSMOS_MYSQL_POOL_MAX || 10),
    queueLimit: 0,
    ssl: resolveSslOptions(),
  };

  return mysql.createPool(options);
}

export function getPool(): Pool {
  if (!pool) {
    pool = createPool();
  }
  return pool;
}

export type DbConnection = PoolConnection;

export async function withConnection<T>(
  handler: (connection: PoolConnection) => Promise<T>
): Promise<T> {
  const activePool = getPool();
  const connection = await activePool.getConnection();
  try {
    return await handler(connection);
  } finally {
    connection.release();
  }
}

export async function pingDatabase(): Promise<void> {
  await withConnection(async (connection) => connection.ping());
}

