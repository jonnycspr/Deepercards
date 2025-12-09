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
    }
    
    const categoryColumns = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'categories' AND column_name = 'fill_type'
    `);
    
    if (!categoryColumns.rows || categoryColumns.rows.length === 0) {
      console.log("[migrate] Adding new category customization columns...");
      await db.execute(sql`ALTER TABLE categories ADD COLUMN IF NOT EXISTS fill_type TEXT DEFAULT 'solid'`);
      await db.execute(sql`ALTER TABLE categories ADD COLUMN IF NOT EXISTS gradient_from TEXT`);
      await db.execute(sql`ALTER TABLE categories ADD COLUMN IF NOT EXISTS gradient_to TEXT`);
      await db.execute(sql`ALTER TABLE categories ADD COLUMN IF NOT EXISTS gradient_angle INTEGER DEFAULT 180`);
      await db.execute(sql`ALTER TABLE categories ADD COLUMN IF NOT EXISTS text_color TEXT`);
      await db.execute(sql`ALTER TABLE categories ADD COLUMN IF NOT EXISTS border_color TEXT DEFAULT '#FFFFFF'`);
      await db.execute(sql`ALTER TABLE categories ADD COLUMN IF NOT EXISTS border_width INTEGER DEFAULT 8`);
      await db.execute(sql`ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url TEXT`);
      console.log("[migrate] Category customization columns added");
    }
    
    // Add icon_image_url column for separate icon image
    const iconImageColumn = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'categories' AND column_name = 'icon_image_url'
    `);
    
    if (!iconImageColumn.rows || iconImageColumn.rows.length === 0) {
      console.log("[migrate] Adding icon_image_url column...");
      await db.execute(sql`ALTER TABLE categories ADD COLUMN IF NOT EXISTS icon_image_url TEXT`);
      console.log("[migrate] icon_image_url column added");
    }
    
    console.log("[migrate] Schema is up to date");
  } catch (error) {
    console.error("[migrate] Migration error:", error);
  }
}
