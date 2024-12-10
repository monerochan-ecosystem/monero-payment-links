CREATE TABLE `session_cookies` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`cookie` text,
	`accountType` text DEFAULT 'user',
	`timestamp` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE TABLE `wallets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`walletName` text,
	`primaryAddress` text,
	`secretViewKey` text,
	`daemonURL` text,
	`start_height` integer,
	`timestamp` text DEFAULT (CURRENT_TIMESTAMP)
);
