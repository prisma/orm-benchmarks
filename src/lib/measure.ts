export default async function measure(query: any) {
  const startTime = performance.now();
  await query();
  const endTime = performance.now();

  // Calculate the elapsed time
  const elapsedTime = endTime - startTime;

  console.log(`Elapsed time: ${elapsedTime} milliseconds`);

  return elapsedTime;
}
