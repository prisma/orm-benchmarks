import prepare from "./lib/prepare";
import { prismaPg } from "./prisma-postgres";
import { typeormPg } from "./typeorm-postgres";
import { drizzlePg, closeDrizzlePg } from "./drizzle-postgres";
import * as fs from 'fs';


const ITERATIONS = 3;

type ORM = "prisma" | "drizzle" | "typeorm";
type QueryResult = {
  query: string;
  time: number;
  data: any;
};
type SingleBenchmarkRunResult = QueryResult[];
type MultipleBenchmarkRunResults = SingleBenchmarkRunResult[];
type AllResults = { [key in ORM]: MultipleBenchmarkRunResults }

async function runBenchmarks() {
  const prismaResults: MultipleBenchmarkRunResults = [];
  for (let i = 0; i < ITERATIONS; i++) {
    await prepare();
    prismaResults.push(await prismaPg());
  }
  writeResults("prisma", prismaResults);

  const drizzleResults: MultipleBenchmarkRunResults = [];
  for (let i = 0; i < ITERATIONS; i++) {
    await prepare();
    drizzleResults.push(await drizzlePg());
  }
  await closeDrizzlePg();
  writeResults("drizzle", drizzleResults);

  const typeormResults: MultipleBenchmarkRunResults = [];
  for (let i = 0; i < ITERATIONS; i++) {
    await prepare();
    typeormResults.push(await typeormPg());
  }
  writeResults("typeorm", typeormResults);

  compareResults({
    prisma: prismaResults,
    drizzle: drizzleResults,
    typeorm: typeormResults,

  })
}

runBenchmarks();

function writeResults(orm: ORM, results: MultipleBenchmarkRunResults) {
  console.log(`results for ${orm}:`)
  console.dir(results, { depth: null });

  const headers = Array.from(new Set(results.flatMap((batch) => batch.map((item) => item.query))));
  console.log(`headers`, headers)

  // Extract rows
  const rows = results.map((batch) => {
    const row: { [key: string]: number | string } = {};
    batch.forEach((item) => {
      row[item.query] = item.time;
    });
    // Ensure all headers are included in each row, even if they are missing in the batch
    headers.forEach((header) => {
      if (!(header in row)) {
        row[header] = "";
      }
    });
    return headers.map((header) => row[header]);
  });
  console.log(`rows`, rows)

  // Write to CSV
  const filename = `./results/${orm}-results-${Date.now()}.csv`
  const csvStream = fs.createWriteStream(filename);

  csvStream.write(headers.join(",") + "\n");
  rows.forEach((row) => {
    csvStream.write(row.join(",") + "\n");
  });

  csvStream.end();

  console.log(`results for ${orm} written to: ${filename}`);

}

function compareResults(allResults: AllResults) {

  const orms: ORM[] = ["prisma", "drizzle", "typeorm"];

   // Assuming each ORM has the same set of queries in the same order
   const numberOfRuns = allResults[orms[0]].length;

   console.log(numberOfRuns)

}