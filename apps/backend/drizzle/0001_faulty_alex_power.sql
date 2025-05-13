PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_guilts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`dump_time` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_guilts`("id", "title", "content", "dump_time", "user_id") SELECT "id", "title", "content", "dump_time", "user_id" FROM `guilts`;--> statement-breakpoint
DROP TABLE `guilts`;--> statement-breakpoint
ALTER TABLE `__new_guilts` RENAME TO `guilts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `guilt_user_id_idx` ON `guilts` (`user_id`);--> statement-breakpoint
CREATE TABLE `__new_journals` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`content` text,
	`category` text NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_journals`("id", "title", "content", "category", "user_id") SELECT "id", "title", "content", "category", "user_id" FROM `journals`;--> statement-breakpoint
DROP TABLE `journals`;--> statement-breakpoint
ALTER TABLE `__new_journals` RENAME TO `journals`;--> statement-breakpoint
CREATE INDEX `journal_user_id_idx` ON `journals` (`user_id`);--> statement-breakpoint
CREATE TABLE `__new_journal_tags` (
	`journal_id` text NOT NULL,
	`tag_name` text NOT NULL,
	PRIMARY KEY(`journal_id`, `tag_name`),
	FOREIGN KEY (`journal_id`) REFERENCES `journals`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_name`) REFERENCES `tags`(`name`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_journal_tags`("journal_id", "tag_name") SELECT "journal_id", "tag_name" FROM `journal_tags`;--> statement-breakpoint
DROP TABLE `journal_tags`;--> statement-breakpoint
ALTER TABLE `__new_journal_tags` RENAME TO `journal_tags`;--> statement-breakpoint
CREATE TABLE `__new_time_capsules` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`unlock_time` integer NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_time_capsules`("id", "title", "content", "unlock_time", "user_id") SELECT "id", "title", "content", "unlock_time", "user_id" FROM `time_capsules`;--> statement-breakpoint
DROP TABLE `time_capsules`;--> statement-breakpoint
ALTER TABLE `__new_time_capsules` RENAME TO `time_capsules`;--> statement-breakpoint
CREATE INDEX `time_capsule_user_id_idx` ON `time_capsules` (`user_id`);