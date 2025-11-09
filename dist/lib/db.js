import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";
let pool = null;
function readEnv(name) {
    const value = process.env[name];
    if (!value || !value.trim()) {
        throw new Error(`[cosmos-db] Missing required environment variable ${name}.`);
    }
    return value.trim();
}
function parsePort(raw) {
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) {
        throw new Error(`[cosmos-db] Expected COSMOS_MYSQL_PORT to be a number, received "${raw}".`);
    }
    return parsed;
}
function resolveSslOptions() {
    var _a;
    const sslMode = (process.env.COSMOS_MYSQL_SSL || "required").toLowerCase();
    if (["skip", "disabled", "false", "off"].includes(sslMode)) {
        return undefined;
    }
    const certSource = (_a = process.env.COSMOS_MYSQL_CA_CERT) === null || _a === void 0 ? void 0 : _a.trim();
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
        throw new Error(`[cosmos-db] COSMOS_MYSQL_CA_CERT file not found at ${resolved}.`);
    }
    return { ca: fs.readFileSync(resolved, "utf8") };
}
function createPool() {
    const host = readEnv("COSMOS_MYSQL_HOST");
    const port = parsePort(readEnv("COSMOS_MYSQL_PORT"));
    const user = readEnv("COSMOS_MYSQL_USERNAME");
    const password = readEnv("COSMOS_MYSQL_PASSWORD");
    const database = readEnv("COSMOS_MYSQL_DATABASE");
    const options = {
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
export function getPool() {
    if (!pool) {
        pool = createPool();
    }
    return pool;
}
export async function withConnection(handler) {
    const activePool = getPool();
    const connection = await activePool.getConnection();
    try {
        return await handler(connection);
    }
    finally {
        connection.release();
    }
}
export async function pingDatabase() {
    await withConnection(async (connection) => connection.ping());
}
