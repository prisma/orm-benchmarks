export default async function measure(label: string, query: any) {
  const startTime = performance.now();
  await query;
  const endTime = performance.now();

  // Calculate the elapsed time
  const elapsedTime = endTime - startTime;

  console.log(`${label}: ${elapsedTime}ms`);

  return elapsedTime;
}
