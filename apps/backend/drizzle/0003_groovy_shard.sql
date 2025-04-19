DROP INDEX "users_table_email_unique";--> statement-breakpoint
ALTER TABLE `users_table` ALTER COLUMN "createdAt" TO "createdAt" integer NOT NULL DEFAULT 1744916083341;--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_email_unique` ON `users_table` (`email`);