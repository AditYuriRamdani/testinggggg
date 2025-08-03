// migrate.js
const { config } = require("dotenv");
const { neon } = require("@neondatabase/serverless");
const { drizzle } = require("drizzle-orm/neon-http");
const { migrate } = require("drizzle-orm/neon-http/migrator");

// Memuat variabel lingkungan secara eksplisit dari file .env.local
config({ path: ".env.local" });

// Lakukan pengecekan yang ketat
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in .env.local file");
}

console.log("DATABASE_URL is loaded successfully.");
console.log("URL: ", connectionString);

const sql = neon(connectionString);
const db = drizzle(sql);

async function main() {
  console.log("Running migrations...");

  await migrate(db, { migrationsFolder: "./src/drizzle" });

  console.log("Migrations finished!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
