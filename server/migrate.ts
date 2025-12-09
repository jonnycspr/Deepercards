import { db } from "./db";
import { sql } from "drizzle-orm";

export async function runMigrations() {
  console.log("[migrate] Checking database schema...");
  
  try {
    const result = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'email'
    `);
    
    const hasEmailColumn = result.rows && result.rows.length > 0;
    
    if (!hasEmailColumn) {
      console.log("[migrate] Adding email column to users table...");
      
      const hasUsernameColumn = await db.execute(sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'username'
      `);
      
      if (hasUsernameColumn.rows && hasUsernameColumn.rows.length > 0) {
        await db.execute(sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255)`);
        await db.execute(sql`UPDATE users SET email = username WHERE email IS NULL`);
        await db.execute(sql`ALTER TABLE users DROP COLUMN IF EXISTS username`);
        console.log("[migrate] Migrated username to email column");
      } else {
        await db.execute(sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255)`);
        console.log("[migrate] Added email column");
      }
    } else {
      console.log("[migrate] Schema is up to date");
    }
  } catch (error) {
    console.error("[migrate] Migration error:", error);
  }
}
