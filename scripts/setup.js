const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("[v0] Setting up Wakamiru Consulting platform...");

try {
  // Generate Prisma Client
  console.log("[v0] Generating Prisma client...");
  execSync("npx prisma generate", { stdio: "inherit", cwd: process.cwd() });

  // Create database file if it doesn't exist
  const dbPath = path.join(process.cwd(), "prisma", "dev.db");
  if (!fs.existsSync(path.dirname(dbPath))) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  }

  // Run migrations
  console.log("[v0] Running migrations...");
  execSync("npx prisma migrate deploy", { stdio: "inherit", cwd: process.cwd() });

  // Seed database
  console.log("[v0] Seeding database...");
  execSync("node scripts/init-db.js", { stdio: "inherit", cwd: process.cwd() });

  console.log("[v0] Setup completed successfully!");
} catch (error) {
  console.error("[v0] Setup failed:", error.message);
  process.exit(1);
}
