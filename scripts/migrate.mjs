import { migrate } from "drizzle-orm/postgres-js/migrator"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error("DATABASE_URL is required to run migrations")
}

const client = postgres(connectionString, { max: 1 })

try {
  await migrate(drizzle(client), { migrationsFolder: "./drizzle" })
  console.log("Database migrations completed")
} finally {
  await client.end()
}
