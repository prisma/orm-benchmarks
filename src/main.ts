import prepare from "./lib/prepare";
import { prismaPg } from "./prisma-postgres";
import { typeormPg } from "./typeorm-postgres";
import { drizzlePg } from "./drizzle-postgres";
import * as fs from "fs";

async function runBenchmarks() {
  await prepare();
  console.log(`db ready`);
  const prismaResults = await prismaPg();

  await prepare();
  const drizzleResults = await drizzlePg();

  await prepare();
  const typeormResults = await typeormPg();

  const results: any = { prisma: prismaResults, drizzle: drizzleResults, typeorm: typeormResults };
  // const results: any = { prisma: prismaResults, typeorm: typeormResults };

  writeResults(results);
}

runBenchmarks();

function writeResults(results: any) {
  const header = [""].concat(results["prisma"].map((item: { query: any }) => item.query));
  const rows = [];

  for (const key in results) {
    const row = [key].concat(results[key].map((item: { time: any }) => item.time));
    rows.push(row);
  }

  const csvContent = [header, ...rows].map((row) => row.join(",")).join("\n");
  console.log(csvContent);

  fs.writeFileSync(`./results/results-${Date.now()}.csv`, csvContent);
}
