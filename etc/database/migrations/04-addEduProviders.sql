CREATE TABLE `eduProviders` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(25) NULL,
  `name` VARCHAR(150) NULL,
  `url` VARCHAR(150) NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `eduProviders` (`code`, `name`, `url`) VALUES ('stepik', 'Stepik', 'http://welcome.stepik.org/ru');
INSERT INTO `eduProviders` (`code`, `name`, `url`) VALUES ('netology', 'Нетология', 'https://netology.ru/');
INSERT INTO `eduProviders` (`code`, `name`, `url`) VALUES ('otus', 'Otus', 'https://otus.ru/');
INSERT INTO `eduProviders` (`code`, `name`, `url`) VALUES ('hexlet', 'Hexlet', 'https://ru.hexlet.io/');
INSERT INTO `eduProviders` (`code`, `name`, `url`) VALUES ('coursera', 'Coursera', 'https://www.coursera.org/');
INSERT INTO `eduProviders` (`code`, `name`, `url`) VALUES ('udemy', 'Udemy', 'https://www.udemy.com/');
INSERT INTO `eduProviders` (`code`, `name`, `url`) VALUES ('geekbrains', 'GeekBrains', 'https://geekbrains.ru/');
INSERT INTO `eduProviders` (`code`, `name`, `url`) VALUES ('moscoding', 'Moscow Coding School', 'https://moscoding.ru/');
INSERT INTO `eduProviders` (`code`, `name`, `url`) VALUES ('intuit', 'Intuit', 'http://www.intuit.ru/');
INSERT INTO `eduProviders` (`code`, `name`, `url`) VALUES ('htmlacademy', 'HtmlAcademy', 'https://htmlacademy.ru/');
INSERT INTO `eduProviders` (`code`, `name`, `url`) VALUES ('lektorium', 'Лекториум', 'https://www.lektorium.tv/');
INSERT INTO `eduProviders` (`code`, `name`, `url`) VALUES ('openedu', 'Открытое образование', 'https://openedu.ru/');
INSERT INTO `eduProviders` (`code`, `name`, `url`) VALUES ('javarush', 'JavaRush', 'https://javarush.ru/');
INSERT INTO `eduProviders` (`code`, `name`, `url`) VALUES ('newprolab', 'New Professions Lab', 'http://newprolab.com/ru/');
INSERT INTO `eduProviders` (`code`, `name`, `url`) VALUES ('tceh', '#tceh', 'http://tceh.com/edu/');
INSERT INTO `eduProviders` (`code`, `name`, `url`) VALUES ('skillfactory', 'SkillFactory', 'http://skillfactory.ru/');
