-- Make sure each account owns only one collection
ALTER TABLE `Collection`
ADD UNIQUE INDEX `Collection_account_id_key`(`account_id`);