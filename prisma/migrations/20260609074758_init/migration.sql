-- CreateTable
CREATE TABLE `Role` (
    `role_id` INTEGER NOT NULL AUTO_INCREMENT,
    `role_name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Role_role_name_key`(`role_name`),
    PRIMARY KEY (`role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Class` (
    `class_id` INTEGER NOT NULL AUTO_INCREMENT,
    `class_name` VARCHAR(191) NOT NULL,
    `battling` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Class_class_name_key`(`class_name`),
    PRIMARY KEY (`class_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Animation` (
    `animation_id` INTEGER NOT NULL AUTO_INCREMENT,
    `animation_name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Animation_animation_name_key`(`animation_name`),
    PRIMARY KEY (`animation_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Account` (
    `account_id` INTEGER NOT NULL AUTO_INCREMENT,
    `account_name` VARCHAR(191) NOT NULL,
    `mail` VARCHAR(191) NOT NULL,
    `power` INTEGER NOT NULL DEFAULT 0,
    `level` INTEGER NOT NULL DEFAULT 1,
    `avatar` VARCHAR(191) NULL,
    `experience` INTEGER NOT NULL DEFAULT 0,
    `xp_max` INTEGER NOT NULL DEFAULT 100,
    `role_id` INTEGER NOT NULL,
    `class_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Account_account_name_key`(`account_name`),
    UNIQUE INDEX `Account_mail_key`(`mail`),
    INDEX `Account_role_id_idx`(`role_id`),
    INDEX `Account_class_id_idx`(`class_id`),
    PRIMARY KEY (`account_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Faction` (
    `faction_id` INTEGER NOT NULL AUTO_INCREMENT,
    `faction_name` VARCHAR(191) NOT NULL,
    `image_placeholder` VARCHAR(191) NULL,

    UNIQUE INDEX `Faction_faction_name_key`(`faction_name`),
    PRIMARY KEY (`faction_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Card` (
    `card_id` INTEGER NOT NULL AUTO_INCREMENT,
    `card_name` VARCHAR(191) NOT NULL,
    `card_place` VARCHAR(191) NULL,
    `power` INTEGER NOT NULL,
    `attack` INTEGER NOT NULL,
    `card_img` VARCHAR(191) NULL,
    `faction_id` INTEGER NOT NULL,

    UNIQUE INDEX `Card_card_name_key`(`card_name`),
    INDEX `Card_faction_id_idx`(`faction_id`),
    PRIMARY KEY (`card_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Collection` (
    `collection_id` INTEGER NOT NULL AUTO_INCREMENT,
    `account_id` INTEGER NOT NULL,

    INDEX `Collection_account_id_idx`(`account_id`),
    PRIMARY KEY (`collection_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CollectionEntry` (
    `collection_id` INTEGER NOT NULL,
    `card_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,

    INDEX `CollectionEntry_card_id_idx`(`card_id`),
    PRIMARY KEY (`collection_id`, `card_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomDeck` (
    `category_id` INTEGER NOT NULL AUTO_INCREMENT,
    `category` VARCHAR(191) NULL,

    PRIMARY KEY (`category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Deck` (
    `deck_id` INTEGER NOT NULL AUTO_INCREMENT,
    `deck_name` VARCHAR(191) NOT NULL,
    `attack` INTEGER NOT NULL DEFAULT 0,
    `power` INTEGER NOT NULL DEFAULT 0,
    `card_img` VARCHAR(191) NULL,
    `account_id` INTEGER NOT NULL,
    `category_id` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Deck_account_id_idx`(`account_id`),
    INDEX `Deck_category_id_idx`(`category_id`),
    PRIMARY KEY (`deck_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DeckCard` (
    `deck_id` INTEGER NOT NULL,
    `card_id` INTEGER NOT NULL,
    `position` INTEGER NOT NULL DEFAULT 0,

    INDEX `DeckCard_card_id_idx`(`card_id`),
    PRIMARY KEY (`deck_id`, `card_id`, `position`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Building` (
    `building_id` INTEGER NOT NULL AUTO_INCREMENT,
    `building_name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,

    UNIQUE INDEX `Building_building_name_key`(`building_name`),
    PRIMARY KEY (`building_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Battling` (
    `battling_id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`battling_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Related` (
    `related_id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`related_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Role`(`role_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `Class`(`class_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Card` ADD CONSTRAINT `Card_faction_id_fkey` FOREIGN KEY (`faction_id`) REFERENCES `Faction`(`faction_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Collection` ADD CONSTRAINT `Collection_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `Account`(`account_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CollectionEntry` ADD CONSTRAINT `CollectionEntry_collection_id_fkey` FOREIGN KEY (`collection_id`) REFERENCES `Collection`(`collection_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CollectionEntry` ADD CONSTRAINT `CollectionEntry_card_id_fkey` FOREIGN KEY (`card_id`) REFERENCES `Card`(`card_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Deck` ADD CONSTRAINT `Deck_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `Account`(`account_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Deck` ADD CONSTRAINT `Deck_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `CustomDeck`(`category_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DeckCard` ADD CONSTRAINT `DeckCard_deck_id_fkey` FOREIGN KEY (`deck_id`) REFERENCES `Deck`(`deck_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DeckCard` ADD CONSTRAINT `DeckCard_card_id_fkey` FOREIGN KEY (`card_id`) REFERENCES `Card`(`card_id`) ON DELETE CASCADE ON UPDATE CASCADE;
