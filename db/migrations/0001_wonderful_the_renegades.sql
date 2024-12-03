CREATE TABLE `wallets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`walletName` text,
	`primaryAddress` text,
	`daemonURL` text,
	`start_height` integer,
	`timestamp` text DEFAULT (CURRENT_TIMESTAMP)
);
