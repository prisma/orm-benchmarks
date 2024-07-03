export default async function measure(label: string, query: any) {
  const startTime = performance.now();
  let result = await query;
  const endTime = performance.now();

  // Calculate the elapsed time
  const elapsedTime = endTime - startTime;

  console.log(`${label}: ${elapsedTime}ms`);

  // if (Array.isArray(result)) {
  //   // is Array
  //   result = result.map((obj: any) => {
  //     deleteFieldIfExists(obj, "createdAt");
  //     if (obj.hasOwnProperty("orders")) {
  //       obj["orders"] = obj["orders"].map((order: any) => deleteFieldIfExists(order, "date"));
  //     }
  //   });
  //   result = result.map((obj: any) => deleteFieldIfExists(obj, "date"));

  // } else if (typeof result === "object" && result.hasOwnProperty("orders")) {
  //   result["orders"].map((obj: any) => deleteFieldIfExists(obj, "date"));
  // } else if (typeof result === "object") {
  //   result = deleteFieldIfExists(result, "createdAt");
  //   result = deleteFieldIfExists(result, "date");
  // }

  return {
    query: label,
    time: elapsedTime,
    data: result,
  };
}

function deleteFieldIfExists(obj: any, field: string) {
  if (Boolean(obj) && obj.hasOwnProperty(field)) {
    delete obj[field];
  }
  return obj;
}
