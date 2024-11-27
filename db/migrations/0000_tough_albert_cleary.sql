CREATE TABLE `session_cookies` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`cookie` text,
	`accountType` text DEFAULT 'user',
	`timestamp` text DEFAULT (CURRENT_TIMESTAMP)
);
