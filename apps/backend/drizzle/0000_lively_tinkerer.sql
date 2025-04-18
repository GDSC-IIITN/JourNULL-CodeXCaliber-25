CREATE TABLE `guilts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`dump_time` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`user_id` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `guilt_user_id_idx` ON `guilts` (`user_id`);--> statement-breakpoint
CREATE TABLE `journals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text,
	`content` text,
	`category` text NOT NULL,
	`user_id` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `journal_user_id_idx` ON `journals` (`user_id`);--> statement-breakpoint
CREATE TABLE `journal_tags` (
	`journal_id` integer NOT NULL,
	`tag_name` text NOT NULL,
	PRIMARY KEY(`journal_id`, `tag_name`),
	FOREIGN KEY (`journal_id`) REFERENCES `journals`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_name`) REFERENCES `tags`(`name`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`name` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE INDEX `tags_name_idx` ON `tags` (`name`);--> statement-breakpoint
CREATE TABLE `time_capsules` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`unlock_time` integer NOT NULL,
	`user_id` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `time_capsule_user_id_idx` ON `time_capsules` (`user_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`username` text NOT NULL,
	`profile_photo` text,
	`password` text NOT NULL,
	`first_name` text,
	`last_name` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE INDEX `user_email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `user_username_idx` ON `users` (`username`);