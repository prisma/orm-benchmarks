export default async function measure(label: string, query: any) {
  const startTime = performance.now();
  let result = await query;
  const endTime = performance.now();

  // Calculate the elapsed time
  const elapsedTime = endTime - startTime;

  console.log(`${label}: ${elapsedTime}ms`);

  return {
    query: label,
    time: elapsedTime,
    // only collect data if DEBUG mode is turned on
    data: process.env.DEBUG === 'benchmarks:compare-results' ? result : null, 
  };
}

