import prepare from "./lib/prepare";
import { prismaPg } from "./prisma-postgres";
import { typeormPg } from "./typeorm-postgres";
import { drizzlePg } from "./drizzle-postgres";

const ITERATIONS = 2

async function runBenchmarks() {

  const prismaResults = []
  for (let i = 0; i < ITERATIONS; i++) {
    await prepare();
    prismaResults.push(await prismaPg())
  }

  const drizzleResults = []
  for (let i = 0; i < ITERATIONS; i++) {
    await prepare();
    drizzleResults.push(await drizzlePg())
  }

  const typeormResults = []
  for (let i = 0; i < ITERATIONS; i++) {
    await prepare();
    typeormResults.push(await typeormPg())
  }
  await prepare();

  const results: any = { prisma: prismaResults, drizzle: drizzleResults, typeorm: typeormResults };

  writeResults(results);
}

runBenchmarks();

function writeResults(results: any) {

  console.log(results)

  // const header = [""].concat(results["prisma"].map((item: { query: any }) => item.query));
  // const rows = [];

  // for (const key in results) {
  //   const row = [key].concat(results[key].map((item: { time: any }) => item.time));
  //   rows.push(row);
  // }

  // const csvContent = [header, ...rows].map((row) => row.join(",")).join("\n");
  // console.log(csvContent);

  // fs.writeFileSync(`./results/results-${Date.now()}.csv`, csvContent);
}
