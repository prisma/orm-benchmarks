import prepare from "./lib/prepare";
import { prismaPg } from "./prisma-postgres";
import { typeormPg } from "./typeorm-postgres";
import { drizzlePg, closeDrizzlePg } from "./drizzle-postgres";
import * as fs from 'fs';


const ITERATIONS = 2;

type ORM = "prisma" | "drizzle" | "typeorm";
type ORMResults = {
  [key in ORM]: MultipleBenchmarkRunResults;
};
type QueryWithTime = {
  query: string;
  time: number;
};

type SingleBenchmarkRunResults = QueryWithTime[];
type MultipleBenchmarkRunResults = SingleBenchmarkRunResults[];

async function runBenchmarks() {
  const prismaResults: MultipleBenchmarkRunResults = [];
  for (let i = 0; i < ITERATIONS; i++) {
    await prepare();
    prismaResults.push(await prismaPg());
  }

  const drizzleResults: MultipleBenchmarkRunResults = [];
  for (let i = 0; i < ITERATIONS; i++) {
    await prepare();
    drizzleResults.push(await drizzlePg());
  }
  await closeDrizzlePg();

  const typeormResults: MultipleBenchmarkRunResults = [];
  for (let i = 0; i < ITERATIONS; i++) {
    await prepare();
    typeormResults.push(await typeormPg());
  }

  writeResults("prisma", prismaResults);
  writeResults("drizzle", drizzleResults);
  writeResults("typeorm", typeormResults);
}

runBenchmarks();

function writeResults(orm: ORM, results: MultipleBenchmarkRunResults) {
  console.log(`results for ${orm}:`)
  console.dir(results, { depth: null });

  const headers = Array.from(new Set(results.flatMap((batch) => batch.map((item) => item.query))));
  console.log(`headers`, headers)

  // Extract rows of times
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

  // const header = [""].concat(results["prisma"].map((item: { query: any }) => item.query));

  // OLD
  // const rows = [];

  // for (const key in results) {
  //   const row = [key].concat(results[key].map((item: { time: any }) => item.time));
  //   rows.push(row);
  // }

  // const csvContent = [header, ...rows].map((row) => row.join(",")).join("\n");
  // console.log(csvContent);

  // fs.writeFileSync(`./results/results-${Date.now()}.csv`, csvContent);
}
