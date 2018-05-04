INSERT INTO `competencyProfession` (`competencyId`, `professionId`) VALUES ('53', '3');
INSERT INTO `competencyProfession` (`competencyId`, `professionId`) VALUES ('54', '3');
INSERT INTO `competencyProfession` (`competencyId`, `professionId`) VALUES ('55', '3');

UPDATE `competencies` SET `name`='Методы принятия решений' WHERE `id`='37';

DELETE FROM `competencyProfession` WHERE `id`='50';
DELETE FROM `competencyProfession` WHERE `id`='51';
DELETE FROM `competencyProfession` WHERE `id`='52';
DELETE FROM `competencyProfession` WHERE `id`='53';
DELETE FROM `competencyProfession` WHERE `id`='55';

