// src/entity/Product.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity("Product")
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'real' })
    price: number;

    @Column()
    quantity: number;

    @Column({ nullable: true })
    description: string;
}
