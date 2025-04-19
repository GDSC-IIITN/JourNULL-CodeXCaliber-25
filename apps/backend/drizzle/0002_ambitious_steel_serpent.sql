DROP INDEX "users_table_email_unique";--> statement-breakpoint
ALTER TABLE `users_table` ALTER COLUMN "createdAt" TO "createdAt" integer NOT NULL DEFAULT 1744910040293;--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_email_unique` ON `users_table` (`email`);--> statement-breakpoint
ALTER TABLE `users_table` ADD `bio` text NOT NULL;