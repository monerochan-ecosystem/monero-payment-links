CREATE TABLE `payment_links` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`productTitle` text,
	`productDescription` text,
	`invoiceTitle` text,
	`invoiceDescription` text,
	`amount` text,
	`walletId` integer,
	`dueDate` text,
	`maxUses` integer,
	`currentUses` integer,
	`successUrl` text,
	`status` text DEFAULT 'active',
	`timestamp` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`walletId`) REFERENCES `wallets`(`id`) ON UPDATE no action ON DELETE no action
);
