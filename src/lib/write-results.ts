import { MultipleBenchmarkRunResults, ORM, Database, BenchmarkOptions } from "./types";
import * as fs from "fs";

export default function writeResults(orm: ORM, db: Database, results: MultipleBenchmarkRunResults, benchmarkOptions: BenchmarkOptions) {
  const filePath = `./results/results-${orm}-${db}-${benchmarkOptions.size}-${benchmarkOptions.fakerSeed}-${Date.now()}.csv`
  console.log(`write results to ${filePath}.`);

  // Extract headers
  const headers = Array.from(new Set(results.flatMap((batch) => batch.map((item) => item.query))));

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

  // Write to CSV
  // const filename = `./results/${orm}-results-${Date.now()}.csv`;
  const csvStream = fs.createWriteStream(filePath);

  csvStream.write(headers.join(",") + "\n");
  rows.forEach((row) => {
    csvStream.write(row.join(",") + "\n");
  });

  csvStream.end();

  console.log(`results for ${orm} written to: ${filePath}`);
}
