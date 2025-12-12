// Script to seed local test questions
// Run with: tsx scripts/seed-local-questions.ts

import { seedLocalQuestions } from "../server/local-questions";

async function main() {
  try {
    await seedLocalQuestions();
    console.log("Local questions seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed local questions:", error);
    process.exit(1);
  }
}

main();

