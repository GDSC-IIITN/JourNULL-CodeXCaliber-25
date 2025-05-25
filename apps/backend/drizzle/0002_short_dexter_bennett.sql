CREATE TABLE `emotions` (
	`id` text PRIMARY KEY NOT NULL,
	`journal_id` text NOT NULL,
	`emotion` text NOT NULL,
	`score` integer NOT NULL,
	FOREIGN KEY (`journal_id`) REFERENCES `journals`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `journals` ADD `created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE `journals` ADD `updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE `journals` ADD `is_deleted` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `journals` ADD `is_archived` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `journals` ADD `is_starred` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `journals` ADD `is_draft` integer DEFAULT 0 NOT NULL;