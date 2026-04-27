import pg from "pg";
const { Client } = pg;
import dotenv from "dotenv";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../../../.env") });

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log("Adding payment_reference column to hospitals table...");
    await client.query('ALTER TABLE hospitals ADD COLUMN IF NOT EXISTS payment_reference TEXT UNIQUE;');
    console.log("Successfully added column.");
  } catch (error) {
    console.error("Error adding column:", error);
  } finally {
    await client.end();
  }
}

main();
