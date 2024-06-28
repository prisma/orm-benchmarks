-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `_prisma_migrations` (
	`id` text PRIMARY KEY NOT NULL,
	`checksum` text NOT NULL,
	`finished_at` numeric,
	`migration_name` text NOT NULL,
	`logs` text,
	`rolled_back_at` numeric,
	`started_at` numeric DEFAULT (current_timestamp) NOT NULL,
	`applied_steps_count` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Customer` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`createdAt` numeric DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`name` text,
	`email` text NOT NULL,
	`isActive` numeric DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Address` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`street` text,
	`city` text,
	`postalCode` text,
	`country` text,
	`customerId` integer NOT NULL,
	FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON UPDATE cascade ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `Order` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` numeric NOT NULL,
	`totalAmount` numeric NOT NULL,
	`customerId` integer NOT NULL,
	FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON UPDATE cascade ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `Product` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`price` real NOT NULL,
	`quantity` integer NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE TABLE `_OrderProducts` (
	`A` integer NOT NULL,
	`B` integer NOT NULL,
	FOREIGN KEY (`B`) REFERENCES `Product`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`A`) REFERENCES `Order`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Address_customerId_key` ON `Address` (`customerId`);--> statement-breakpoint
CREATE INDEX `_OrderProducts_B_index` ON `_OrderProducts` (`B`);--> statement-breakpoint
CREATE UNIQUE INDEX `_OrderProducts_AB_unique` ON `_OrderProducts` (`A`,`B`);
*/