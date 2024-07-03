// src/entity/Order.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { Customer } from "./Customer";
import { Product } from "./Product";

@Entity("Order")
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  // sqlite
  // @Column({ type: 'datetime' })
  // postgres
  @Column({ type: "timestamptz" })
  date: Date;

  @Column({ name: "totalAmount", type: "decimal" })
  totalAmount: number;

  @ManyToOne(() => Customer, (customer) => customer.orders, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  customer: Customer;

  @ManyToMany(() => Product)
  @JoinTable({
    name: "_OrderProducts",
    joinColumn: { name: "A", referencedColumnName: "id" },
    inverseJoinColumn: { name: "B", referencedColumnName: "id" },
  })
  products: Product[];
}
