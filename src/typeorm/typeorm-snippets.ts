export const typeormSnippets = {
  "typeorm-findMany": `
AppDataSource.getRepository(Customer).find()`,

  "typeorm-findMany-filter-paginate-order": `
AppDataSource.getRepository(Customer).find({
  where: { isActive: true },
  order: { createdAt: "DESC" },
  skip: 0,
  take: 10,
})`,

  "typeorm-findMany-1-level-nesting": `
AppDataSource.getRepository(Customer).find({ relations: ["orders"] })`,

  "typeorm-findFirst": `
AppDataSource.getRepository(Customer).find({
  take: 1
})`,

  "typeorm-findFirst-1-level-nesting": `
AppDataSource.getRepository(Customer).find({
  take: 1,
  relations: ["orders"],
})`,

  "typeorm-findUnique": `
AppDataSource.getRepository(Customer).findOne({ where: { id: 1 } })`,

  "typeorm-findUnique-1-level-nesting": `
AppDataSource.getRepository(Customer).findOne({
  where: { id: 1 },
  relations: ["orders"],
})`,

  "typeorm-create": `
AppDataSource.getRepository(Customer).save({
  name: "John Doe",
  email: "john.doe@example.com",
  isActive: false,
})`,

  "typeorm-nested-create": `
AppDataSource.transaction(async (transactionalEntityManager) => {
  // Insert customer
  const customer = await transactionalEntityManager.save(Customer, {
    name: "John Doe",
    email: "john.doe@example.com",
    isActive: false,
  });

  // Insert order with the associated customerId
  const order = await transactionalEntityManager.save(Order, {
    customer: customer,
    date: new Date(),
    totalAmount: 100.5,
  });

  // Insert products with the associated orderId
  await transactionalEntityManager
    .createQueryBuilder()
    .insert()
    .into("_OrderProducts")
    .values([
      { A: order.id, B: 1 },
      { A: order.id, B: 2 },
    ])
    .execute();
})`,

  "typeorm-update": `
AppDataSource.getRepository(Customer).update(
  { id: 1 },
  { name: "John Doe Updated" }
)`,

  "typeorm-nested-update": `
AppDataSource.transaction(async (transactionalEntityManager) => {
  // Update customer name
  await transactionalEntityManager.update(Customer, { id: 1 }, { name: "John Doe Updated" });

  // Update address
  await transactionalEntityManager.update(Address, { customer: { id: 1 } }, { street: "456 New St" });
})`,

  "typeorm-upsert": `
AppDataSource.getRepository(Customer).save({
  id: 1,
  name: "John Doe Upserted",
  email: "john.doe@example.com",
  isActive: false,
})`,

  "typeorm-nested-upsert": `
AppDataSource.transaction(async (transactionalEntityManager) => {
  // Upsert Customer
  const customer = await transactionalEntityManager.save(Customer, {
    id: 1, // Set the ID if you want to update an existing record
    name: "John Doe Upserted",
    email: "john.doe@example.com",
    isActive: false,
  });

  // Upsert Address
  await transactionalEntityManager.save(Address, {
    id: 1, // Set the ID if you want to update an existing record
    customer: customer,
    street: "456 New St",
    city: "Anytown",
    postalCode: "12345",
    country: "Country",
  });
})`,

  "typeorm-delete": `
AppDataSource.getRepository(Customer).delete({ id: 1 })`,
};
