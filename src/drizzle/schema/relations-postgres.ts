import { relations } from "drizzle-orm/relations";
import { Customer, Address, Order, Product, _OrderProducts } from "./schema-postgres";

export const AddressRelations = relations(Address, ({one}) => ({
	customer: one(Customer, {
		fields: [Address.customerId],
		references: [Customer.id]
	}),
}));

export const CustomerRelations = relations(Customer, ({many}) => ({
	addresses: many(Address),
	orders: many(Order),
}));

export const OrderRelations = relations(Order, ({one, many}) => ({
	customer: one(Customer, {
		fields: [Order.customerId],
		references: [Customer.id]
	}),
	_orderProducts: many(_OrderProducts),
}));

export const _OrderProductsRelations = relations(_OrderProducts, ({one}) => ({
 product: one(Product, {
		fields: [_OrderProducts.B],
		references: [Product.id]
	}),
	order: one(Order, {
		fields: [_OrderProducts.A],
		references: [Order.id]
	}),
}));

export const ProductRelations = relations(Product, ({many}) => ({
	_OrderProducts: many(_OrderProducts),
}));