import { MultipleBenchmarkRunResults, ORM, Database, BenchmarkOptions } from "./types";
import * as fs from "fs";
import * as path from 'path';

export default function writeResults(
  orm: ORM,
  db: Database,
  results: MultipleBenchmarkRunResults,
  benchmarkOptions: BenchmarkOptions,
  resultsDirectoryTimestamp: string
) {

  // Create dedicated results directory for this benchmark run
  const resultsDir = path.join('.', `results/${db}-${benchmarkOptions.size}-${benchmarkOptions.iterations}-${resultsDirectoryTimestamp}`);

  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, {recursive: true});
    console.log(`Results directory didn't exist, created directory: ${resultsDir}`);
  }

  const filePath = path.join(resultsDir, `${orm}.csv`);
  console.log(`Write results to ${filePath}.`);

  // Extract headers
  const headers = Array.from(new Set(results.flatMap((batch) => batch.map((item) => item.query))));

  // Extract rows
  const rows = results.map((batch) => {
    const row: { [key: string]: number | string; } = {};
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

  console.log(`Results for ${orm} written to: ${filePath}`);
}
