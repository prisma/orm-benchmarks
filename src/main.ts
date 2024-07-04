import { extractDatabase } from "./lib/utils";
import runBenchmarksPg from "./run-benchmarks-pg";
// import runBenchmarksMySQL from "./run-benchmarks-mysql";

const databaseUrl = process.env.DATABASE_URL || "postgresql://nikolasburk:nikolasburk@localhost:5432/benchmark";
const iterations = Number(process.env.ITERATIONS) || 1;
const size = Number(process.env.ITERATIONS) || 1000
const fakerSeed = Number (process.env.SEED) || 42

async function main() {
  const database = extractDatabase(databaseUrl);

  if (database === "postgresql") {
    console.log(`Running benchmarks on ${databaseUrl}.`);
    await runBenchmarksPg({ databaseUrl, iterations, size, fakerSeed });
  }
  // else if (database === "mysql") {
    // console.log(`Running benchmarks on ${databaseUrl}.`);
    // await runBenchmarksMySQL({ databaseUrl, iterations });
  // } 
  else {
    console.log(`${database} is not yet available.`);
  }
}

main();
