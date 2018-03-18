CREATE TABLE `coursesSkills` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `courseId` INT NOT NULL,
  `atomicSkillId` INT NOT NULL,
  `level` VARCHAR(20) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `courseId` (`courseId` ASC),
  INDEX `atomicSkillId` (`atomicSkillId` ASC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `coursesRequirements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `courseId` INT NOT NULL,
  `atomicSkillId` INT NOT NULL,
  `level` VARCHAR(20) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `courseId` (`courseId` ASC),
  INDEX `atomicSkillId` (`atomicSkillId` ASC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
