ALTER TABLE `users`
  ADD COLUMN `uuid` VARCHAR(36) NULL AFTER `id`,
  ADD UNIQUE INDEX `uuid` (`uuid` ASC);

CREATE TABLE `sessions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `uuid` VARCHAR(36) NULL,
  `dateCreated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `userId` INT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uuid` (`uuid` ASC),
  INDEX `userId` (`userId` ASC));

CREATE TABLE `sessionsSkills` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `sessionId` INT NULL,
  `atomicSkillId` INT NULL,
  `level` VARCHAR(20) NULL,
  PRIMARY KEY (`id`),
  INDEX `sessionId` (`sessionId` ASC),
  INDEX `atomicSkillId` (`atomicSkillId` ASC));
