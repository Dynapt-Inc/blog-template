import { type Pool, type PoolConnection } from "mysql2/promise";
export declare function getPool(): Pool;
export type DbConnection = PoolConnection;
export declare function withConnection<T>(handler: (connection: PoolConnection) => Promise<T>): Promise<T>;
export declare function pingDatabase(): Promise<void>;
