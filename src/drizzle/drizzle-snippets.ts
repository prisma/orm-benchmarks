export const drizzleSnippets = {
  "drizzle-findMany": `
db.query.Customer.findMany()`,

  "drizzle-findMany-filter-paginate-order": `
db.query.Customer.findMany({
  where: eq(schema.Customer.isActive, true),
  orderBy: [desc(schema.Customer.createdAt)],
  offset: 0,
  limit: 10,
})`,

  "drizzle-findMany-1-level-nesting": `
db.query.Customer.findMany({
  with: {
    orders: true,
  },
})`,

  "drizzle-findFirst": `
db.query.Customer.findFirst()`,

  "drizzle-findFirst-1-level-nesting": `
db.query.Customer.findFirst({
  with: {
    orders: true,
  },
})`,

  "drizzle-findUnique": `
db.query.Customer.findFirst({
  where: eq(schema.Customer.id, 1),
})`,

  "drizzle-findUnique-1-level-nesting": `
db.query.Customer.findFirst({
  where: eq(schema.Customer.id, 1),
  with: {
    orders: true,
  },
})`,

  "drizzle-create": `
db.insert(schema.Customer).values({
  name: "John Doe",
  email: "john.doe@example.com",
  isActive: false,
}).returning()`,

  "drizzle-nested-create": `
db.transaction(async (trx) => {
  // Insert customer
  const customer = await trx.insert(schema.Customer).values({
    name: "John Doe",
    email: "john.doe@example.com",
    isActive: false,
  }).returning();

  const customerId = customer[0].id;

  // Insert order with the associated customerId
  const insertedOrder = await trx.insert(schema.Order).values({
    customerId: customerId,
    date: \`\${new Date().toISOString()}\`,
    totalAmount: "100.5",
  }).returning();

  const orderId = insertedOrder[0].id;

  // Insert products with the associated orderId
  await trx.insert(schema._OrderProducts).values([
    {
      A: orderId,
      B: 1,
    },
    {
      A: orderId,
      B: 2,
    },
  ]);
})`,

  "drizzle-update": `
db.update(schema.Customer).set({ name: "John Doe Updated" }).where(eq(schema.Customer.id, 1))`,

  "drizzle-nested-update": `
db.transaction(async (trx) => {
  // Update customer name
  await trx.update(schema.Customer).set({ name: "John Doe Updated" }).where(eq(schema.Customer.id, 1));

  // Update address
  await trx.update(schema.Address).set({ street: "456 New St" }).where(eq(schema.Address.customerId, 1));
})`,

  "drizzle-upsert": `
db.insert(schema.Customer).values({
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  isActive: false,
}).onConflictDoUpdate({
  target: schema.Customer.id,
  set: { name: "John Doe Upserted" },
})`,

  "drizzle-nested-upsert": `
db.transaction(async (trx) => {
  // Update customer name
  const customer = await trx.insert(schema.Customer).values({
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    isActive: false,
  }).onConflictDoUpdate({
    target: schema.Customer.id,
    set: { name: "John Doe Upserted" },
  }).returning();
  
  const customerId = customer[0].id;

  // Update address
  await trx.insert(schema.Address).values({
    street: "456 New St",
    city: "Anytown",
    postalCode: "12345",
    country: "Country",
    customerId: customerId,
  }).onConflictDoUpdate({
    target: schema.Address.customerId,
    set: { street: "456 New St" },
  });
})`,

  "drizzle-delete": `
db.delete(schema.Customer).where(eq(schema.Customer.id, 1))`,
};
