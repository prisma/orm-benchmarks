import { extractDatabase } from "./lib/utils";
import runBenchmarksPg from "./run-benchmarks-pg";
import runBenchmarksMySQL from "./run-benchmarks-mysql";

const iterations = Number(process.env.ITERATIONS) || 5;
const size = Number(process.env.SIZE) || 1000;
const fakerSeed = Number(process.env.SEED) || 42;

async function main() {
  
  if (!process.env.DATABASE_URL) {
    console.error(`No database URL provided`)
    return
  }
  const databaseUrl = process.env.DATABASE_URL

  const database = extractDatabase(databaseUrl);

  if (database === "postgresql") {
    console.log(`Running benchmarks on ${databaseUrl}.`);
    await runBenchmarksPg({ databaseUrl, iterations, size, fakerSeed });
  }
  else if (database === "mysql") {
    console.log(`Running benchmarks on ${databaseUrl}.`);
    await runBenchmarksMySQL({ databaseUrl, iterations, size, fakerSeed });
  }
  else {
    console.log(`${database} is not yet available.`);
  }
}

main();
