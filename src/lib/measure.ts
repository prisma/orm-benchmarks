export default async function measure(label: string, query: any) {
  const startTime = performance.now();
  const result = await query;
  const endTime = performance.now();
  
  // Calculate the elapsed time
  const elapsedTime = endTime - startTime;

  console.log(`${label}: ${elapsedTime}ms`);

  return {
    query: label,
    time: elapsedTime,
    data: result
  };
}