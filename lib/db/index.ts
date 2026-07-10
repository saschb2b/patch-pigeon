import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

export const isDatabaseConfigured = Boolean(process.env.DATABASE_URL)
const connectionString =
  process.env.DATABASE_URL ?? "postgresql://invalid:invalid@127.0.0.1:1/invalid"
const configuredPoolSize = Number.parseInt(process.env.DB_POOL_MAX ?? "10", 10)
const poolSize = Number.isFinite(configuredPoolSize) && configuredPoolSize > 0
  ? configuredPoolSize
  : 10

const globalForDb = globalThis as unknown as {
  client: ReturnType<typeof postgres> | undefined
}

const client = globalForDb.client ?? postgres(connectionString, { max: poolSize })
if (process.env.NODE_ENV !== "production") globalForDb.client = client

export const db = drizzle(client, { schema })
export { schema }
