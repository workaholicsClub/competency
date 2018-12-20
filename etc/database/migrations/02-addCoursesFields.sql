ALTER TABLE `self.academy`.`courses`
  ADD COLUMN `inArchive` INT(1) NOT NULL DEFAULT 0 AFTER `id`,
  ADD COLUMN `jobPlacement` INT(1) NOT NULL DEFAULT 0 AFTER `hasPractice`,
  ADD COLUMN `forKids` INT(1) NOT NULL DEFAULT 0 AFTER `jobPlacement`,
  ADD COLUMN `partnerUrl` VARCHAR(255) NULL DEFAULT NULL AFTER `url`;

UPDATE `self.academy`.`courses` SET `inArchive`='1' WHERE `id`='18';
