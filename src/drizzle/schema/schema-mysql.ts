import { mysqlTable, boolean, text, int, serial, uniqueIndex, double, index, date } from "drizzle-orm/mysql-core"

import { sql } from "drizzle-orm"

export const Customer = mysqlTable("Customer", {
	id: serial("id").primaryKey().notNull(),
	createdAt: date("createdAt").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
	name: text("name"),
	email: text("email").notNull(),
	isActive: boolean("isActive").notNull(),
});

export const Address = mysqlTable("Address", {
	id: serial("id").primaryKey().notNull(),
	street: text("street"),
	city: text("city"),
	postalCode: text("postalCode"),
	country: text("country"),
	customerId: serial("customerId").notNull().references(() => Customer.id, { onDelete: "cascade", onUpdate: "cascade" } ),
},
(table) => {
	return {
		customerId_key: uniqueIndex("Address_customerId_key").on(table.customerId),
	}
});

export const Order = mysqlTable("Order", {
	id: serial("id").primaryKey().notNull(),
	date: date("date").notNull(),
	totalAmount: double("totalAmount").notNull(),
	customerId: serial("customerId").notNull().references(() => Customer.id, { onDelete: "cascade", onUpdate: "cascade" } ),
});

export const Product = mysqlTable("Product", {
	id: serial("id").primaryKey().notNull(),
	name: text("name").notNull(),
	price: double("price").notNull(),
	quantity: int("quantity").notNull(),
	description: text("description"),
});

export const _OrderProducts = mysqlTable("_OrderProducts", {
	A: serial("A").notNull().references(() => Order.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	B: serial("B").notNull().references(() => Product.id, { onDelete: "cascade", onUpdate: "cascade" } ),
},
(table) => {
	return {
		B_idx: index('_OrderProducts_B').on(table.B),
		AB_unique: uniqueIndex("_OrderProducts_AB_unique").on(table.A, table.B),
	}
});