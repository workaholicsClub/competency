-- MySQL dump 10.13  Distrib 5.7.21, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: self_competency
-- ------------------------------------------------------
-- Server version	5.5.5-10.2.11-MariaDB-10.2.11+maria~jessie

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `atomicSkills`
--

DROP TABLE IF EXISTS `atomicSkills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `atomicSkills` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `text` text DEFAULT NULL,
  `additionalDescription` text DEFAULT NULL,
  `competencyId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=390 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `atomicSkills`
--

LOCK TABLES `atomicSkills` WRITE;
/*!40000 ALTER TABLE `atomicSkills` DISABLE KEYS */;
INSERT INTO `atomicSkills` VALUES (1,'Базовые алгоритмы','Линейный поиск, сортировка и бинарный поиск, обход многомерного массива',1);
INSERT INTO `atomicSkills` VALUES (2,'Векторные и матричные операции','',1);
INSERT INTO `atomicSkills` VALUES (3,'Сложные типы данных','',1);
INSERT INTO `atomicSkills` VALUES (4,'Рекурсия','',1);
INSERT INTO `atomicSkills` VALUES (5,'Лямбда функции','',1);
INSERT INTO `atomicSkills` VALUES (6,'Карринг','',1);
INSERT INTO `atomicSkills` VALUES (7,'Функции высшего порядка','',1);
INSERT INTO `atomicSkills` VALUES (8,'Чистота функций','',1);
INSERT INTO `atomicSkills` VALUES (9,'Побочные эффекты функций','',1);
INSERT INTO `atomicSkills` VALUES (10,'Замыкания','',1);
INSERT INTO `atomicSkills` VALUES (11,'Понятие вычислимости','',1);
INSERT INTO `atomicSkills` VALUES (12,'Машина Тьюринга','',1);
INSERT INTO `atomicSkills` VALUES (13,'Конечные автоматы','',1);
INSERT INTO `atomicSkills` VALUES (14,'Классы вычислительной сложности','O(N), O(N*log(N)), O(N!), ..., P, FP, NP',1);
INSERT INTO `atomicSkills` VALUES (15,'NP-полнота','',1);
INSERT INTO `atomicSkills` VALUES (16,'Алгоритм NP-перебора','',1);
INSERT INTO `atomicSkills` VALUES (17,'Параллельные алгоритмы','Очередь, конвейер',1);
INSERT INTO `atomicSkills` VALUES (18,'Транзакции','',1);
INSERT INTO `atomicSkills` VALUES (19,'Мертвая блокировка','',1);
INSERT INTO `atomicSkills` VALUES (20,'Состояние гонки','',1);
INSERT INTO `atomicSkills` VALUES (21,'Семафоры','',1);
INSERT INTO `atomicSkills` VALUES (22,'Мьютексы','',1);
INSERT INTO `atomicSkills` VALUES (23,'Базовые понятия ООП','Абстракция, инкапсуляция, наследование, полиморфизм',2);
INSERT INTO `atomicSkills` VALUES (24,'Инкапсуляция данных','Приватные методы',2);
INSERT INTO `atomicSkills` VALUES (25,'Интерфейс','',2);
INSERT INTO `atomicSkills` VALUES (26,'Абстрактный класс','',2);
INSERT INTO `atomicSkills` VALUES (27,'Простые шаблоны проектирования','Одиночка (singleton), фабрика (factory), фасад (fascade), адаптер (adapter)',2);
INSERT INTO `atomicSkills` VALUES (28,'Расширение без наследования','Композиция, полиморфные классы, шаблонные методы',2);
INSERT INTO `atomicSkills` VALUES (29,'Сериализация объектов','И десериализация',2);
INSERT INTO `atomicSkills` VALUES (30,'Дополнительные шаблоны проектирования','Наблюдатель (observer), посетитель (visitor), стратегия (strategy), реестр (registry)',2);
INSERT INTO `atomicSkills` VALUES (31,'DI-фрейморки','',2);
INSERT INTO `atomicSkills` VALUES (32,'Архитектурные принципы ООП','SRP, OCP, LSP, ISP, DIP (SOLID), DRY, KISS, YAGNI',2);
INSERT INTO `atomicSkills` VALUES (33,'Архитектурные шаблоны','MVC, MVP, MVVM, DDD',2);
INSERT INTO `atomicSkills` VALUES (34,'Организация и оформление кода','По файлам, папкам, PSR-0, PSR-1, PSR-2, PSR-4',2);
INSERT INTO `atomicSkills` VALUES (35,'Понятное именование','Переменных, объектов, классов, функций, таблиц',3);
INSERT INTO `atomicSkills` VALUES (36,'Основные запахи кода','Дублирование кода, мертвый код, операторы switch, стрельба дробью, завистливые функции и пр.',3);
INSERT INTO `atomicSkills` VALUES (37,'Базовые техники рефакторинга','Извлечение/перемещение метода, класса, удаление посредника, инкапсуляция поля, замена параметров объектом, свертывание иерархии и пр.',3);
INSERT INTO `atomicSkills` VALUES (38,'Правило бойскаута','Оставь поляну лучше, чем она была до тебя',3);
INSERT INTO `atomicSkills` VALUES (39,'Переиспользуемый код','',3);
INSERT INTO `atomicSkills` VALUES (40,'Практики экстремального программирования','Парное программирование, заказчик всегда рядом, непрерывная интеграция, частые релизы и пр.',3);
INSERT INTO `atomicSkills` VALUES (41,'Комментирование и документирование','',3);
INSERT INTO `atomicSkills` VALUES (42,'Модульные тесты','',3);
INSERT INTO `atomicSkills` VALUES (43,'TDD/BDD','',3);
INSERT INTO `atomicSkills` VALUES (44,'Скорость через улучшение качества','',3);
INSERT INTO `atomicSkills` VALUES (45,'Ревизия кода','',3);
INSERT INTO `atomicSkills` VALUES (46,'Гибкость кода','',3);
INSERT INTO `atomicSkills` VALUES (47,'Частые запуски автотестов','',4);
INSERT INTO `atomicSkills` VALUES (48,'Разработка модульных тестов','',4);
INSERT INTO `atomicSkills` VALUES (49,'Cредства и фреймоврки тестирования PHP','PHPUnit, Atoum, Simpletest, Behat, Mink, Codeception, Mockery',4);
INSERT INTO `atomicSkills` VALUES (50,'Средства и фреймворки тестирования JavaScript','Jasmine, qunit, nightwatch, jest, chai, mocha, assert',4);
INSERT INTO `atomicSkills` VALUES (51,'Основные понятия тестирования','Тест-план, тест-дизайн, тест-анализ. Методы чёрного ящика, белого и серого ящика',4);
INSERT INTO `atomicSkills` VALUES (52,'Написание баг-репортов','',4);
INSERT INTO `atomicSkills` VALUES (53,'Классы эквивалентности','',4);
INSERT INTO `atomicSkills` VALUES (54,'Прочие виды тестирования','Интеграционное, системное, функциональное, регрессионное, приемочное и пр.',4);
INSERT INTO `atomicSkills` VALUES (55,'Средства автоматизации тестирования UI','Selenium, appium',4);
INSERT INTO `atomicSkills` VALUES (56,'Data-driven тестирование','',4);
INSERT INTO `atomicSkills` VALUES (57,'Методики автоматизированного тестирования','Keyword-driven, Behavior-driven, Model-based',4);
INSERT INTO `atomicSkills` VALUES (58,'Работа с менеджментом','',5);
INSERT INTO `atomicSkills` VALUES (59,'Инициативность в получении информации','',5);
INSERT INTO `atomicSkills` VALUES (60,'Анализ возможных вариантов решения','',5);
INSERT INTO `atomicSkills` VALUES (61,'Декомпозиция сложных задач','',5);
INSERT INTO `atomicSkills` VALUES (62,'Планирование последовательности задач и шагов','',5);
INSERT INTO `atomicSkills` VALUES (63,'Синтез общих решений','',5);
INSERT INTO `atomicSkills` VALUES (64,'Анализ технических факторов','',5);
INSERT INTO `atomicSkills` VALUES (65,'Анализ бизнес-факторов','',5);
INSERT INTO `atomicSkills` VALUES (66,'Анализ затрат','',5);
INSERT INTO `atomicSkills` VALUES (67,'Анализ рисков','',5);
INSERT INTO `atomicSkills` VALUES (68,'Выявление сути задачи','',5);
INSERT INTO `atomicSkills` VALUES (69,'Работа с экспертами предметной области','',5);
INSERT INTO `atomicSkills` VALUES (70,'Предложение альтернативных вариантов','',5);
INSERT INTO `atomicSkills` VALUES (71,'Клиент-серверная архитектура','',6);
INSERT INTO `atomicSkills` VALUES (72,'Основные понятия веб','HTML, CSS, DOM, Ajax',6);
INSERT INTO `atomicSkills` VALUES (73,'Основы JavaScript','',6);
INSERT INTO `atomicSkills` VALUES (74,'Способы хранения и передачи состояния','Cookie, сессия',6);
INSERT INTO `atomicSkills` VALUES (75,'Основы HTML5','',6);
INSERT INTO `atomicSkills` VALUES (76,'Основы CSS3','',6);
INSERT INTO `atomicSkills` VALUES (77,'Основы SQL','',6);
INSERT INTO `atomicSkills` VALUES (78,'API браузера','Window, Document, LocalStorage, History и др.',6);
INSERT INTO `atomicSkills` VALUES (79,'Архитектурный стиль REST','',6);
INSERT INTO `atomicSkills` VALUES (80,'Протокол HTTP','',6);
INSERT INTO `atomicSkills` VALUES (81,'Протокол SOAP','',6);
INSERT INTO `atomicSkills` VALUES (82,'RESTful веб-службы','',6);
INSERT INTO `atomicSkills` VALUES (83,'Формат передачи данных JSON','',6);
INSERT INTO `atomicSkills` VALUES (84,'Формат передачи данных XML','',6);
INSERT INTO `atomicSkills` VALUES (85,'CRUD','',6);
INSERT INTO `atomicSkills` VALUES (86,'Принципы работы кэширования и сжатия','Gzip-сжатие, заголовки Last-Modified, Etag, Expires, Cache-control',6);
INSERT INTO `atomicSkills` VALUES (87,'Основные заголовки HTTP','Content-Encoding, Content-Type, Referer, User-Agent',6);
INSERT INTO `atomicSkills` VALUES (88,'CORS','',6);
INSERT INTO `atomicSkills` VALUES (89,'HTTP-статусы','200, 300, 400, 500',6);
INSERT INTO `atomicSkills` VALUES (90,'Работа с клиентами базы данных','',7);
INSERT INTO `atomicSkills` VALUES (91,'Базовые SQL-запросы (DML)','SELECT, INSERT, UPDATE, DELETE',7);
INSERT INTO `atomicSkills` VALUES (92,'Расширенные SQL-запросы (DML)','JOIN, ORDER BY, GROUP BY, HAVING, подзапросы',7);
INSERT INTO `atomicSkills` VALUES (93,'Запросы на изменение схемы (DDL)','',7);
INSERT INTO `atomicSkills` VALUES (94,'Использование функций SQL','',7);
INSERT INTO `atomicSkills` VALUES (95,'Аггрегатные функции SQL','MAX, MIN, SUM, AVG, GROUP_CONCAT',7);
INSERT INTO `atomicSkills` VALUES (96,'Виды','',7);
INSERT INTO `atomicSkills` VALUES (97,'Индексы','',7);
INSERT INTO `atomicSkills` VALUES (98,'Транзакции','',7);
INSERT INTO `atomicSkills` VALUES (99,'Атомарные операции','',7);
INSERT INTO `atomicSkills` VALUES (100,'Переменные SQL','',7);
INSERT INTO `atomicSkills` VALUES (101,'Хранимые процедуры SQL','',7);
INSERT INTO `atomicSkills` VALUES (102,'Разработка собственных функций SQL','',7);
INSERT INTO `atomicSkills` VALUES (103,'Курсор','',7);
INSERT INTO `atomicSkills` VALUES (104,'Триггер','',7);
INSERT INTO `atomicSkills` VALUES (105,'NoSQL','',7);
INSERT INTO `atomicSkills` VALUES (106,'Хранилища ключ-значение','MemcacheDB, Beanstalk, Redis',7);
INSERT INTO `atomicSkills` VALUES (107,'Нормальные формы','6 штук + доменно-ключевая + Бойса-Кодда',7);
INSERT INTO `atomicSkills` VALUES (108,'Целенаправленная денормализация','',7);
INSERT INTO `atomicSkills` VALUES (109,'ACID','',7);
INSERT INTO `atomicSkills` VALUES (110,'Теорема CAP','',7);
INSERT INTO `atomicSkills` VALUES (111,'Реализации SQL','MySQL, PostgreSQL, MSSQL, Oracle',7);
INSERT INTO `atomicSkills` VALUES (112,'Оптимизирование настроект серверов','',7);
INSERT INTO `atomicSkills` VALUES (113,'Кластеризация и репликация данных','',7);
INSERT INTO `atomicSkills` VALUES (114,'Колоночные базы данных','Hbase, Cassandra',7);
INSERT INTO `atomicSkills` VALUES (115,'Документ-ориентированные базы данных','CouchDB, MongoDB',7);
INSERT INTO `atomicSkills` VALUES (116,'Графовые базы данных','InfiniteGraph, FlockDB',7);
INSERT INTO `atomicSkills` VALUES (117,'Недостатки интуитивного подхода к анализу','',8);
INSERT INTO `atomicSkills` VALUES (118,'Консультации с коллегами','',8);
INSERT INTO `atomicSkills` VALUES (119,'Визуальный анализ','',8);
INSERT INTO `atomicSkills` VALUES (120,'A/B тестирование','',8);
INSERT INTO `atomicSkills` VALUES (121,'Техники многомерного анализа','Факторный анализ, кластерный анализ',8);
INSERT INTO `atomicSkills` VALUES (122,'Использование ПО для анализа данных','Microsoft Analysis Services, Pentaho Mondrian',8);
INSERT INTO `atomicSkills` VALUES (123,'MDX','',8);
INSERT INTO `atomicSkills` VALUES (124,'Data Warehouse','',8);
INSERT INTO `atomicSkills` VALUES (125,'Основы статистического анализа','Размер и принципы формирования выборки, дисперсия, среднее, медиана, доверительный интервал, значимость, дисперсия, p-значение, стандартное отклонение',8);
INSERT INTO `atomicSkills` VALUES (126,'Основные распределения','Нормальное, Стьюдента',8);
INSERT INTO `atomicSkills` VALUES (127,'Специализированное ПО для статистического анализа','Statistica, Matlab, R, SPSS',8);
INSERT INTO `atomicSkills` VALUES (128,'Математическое моделирование','',8);
INSERT INTO `atomicSkills` VALUES (129,'Подключение библиотек при помощи тэга script','',9);
INSERT INTO `atomicSkills` VALUES (130,'jQuery, jQuery-UI','',9);
INSERT INTO `atomicSkills` VALUES (131,'Backbone.js','',9);
INSERT INTO `atomicSkills` VALUES (132,'Underscore.js/Lodash','',9);
INSERT INTO `atomicSkills` VALUES (133,'Универсальные фреймворки для верстки','Bootstrap, Foundation, Skeleton и пр.',9);
INSERT INTO `atomicSkills` VALUES (134,'SPA-фреймворки','Angular.js, Vue.js, Ember.js, Meteor.js, React.js/Redux, i-bem.js',9);
INSERT INTO `atomicSkills` VALUES (135,'Модули JavaScript','AMD, CommonJS, ES6',9);
INSERT INTO `atomicSkills` VALUES (136,'Модульный CSS','',9);
INSERT INTO `atomicSkills` VALUES (137,'Системы сборки','Browserify, Webpack, Parcel',9);
INSERT INTO `atomicSkills` VALUES (138,'Менеджеры пакетов','bower, npm, yarn',9);
INSERT INTO `atomicSkills` VALUES (139,'Системы запуска задач','Gulp.js, Grunt',9);
INSERT INTO `atomicSkills` VALUES (140,'Препроцессоры CSS','SASS/SCSS, LESS, PostCSS',9);
INSERT INTO `atomicSkills` VALUES (141,'Препроцессоры JS','Babel',9);
INSERT INTO `atomicSkills` VALUES (142,'Линтеры','JSLint, JSHint, ESLint',9);
INSERT INTO `atomicSkills` VALUES (143,'Минификаторы/обфускаторы кода','Uglify.js, Google Closure Compiler, JSMin',9);
INSERT INTO `atomicSkills` VALUES (144,'Оптимизаторы кода','Prepack',9);
INSERT INTO `atomicSkills` VALUES (145,'Архитектуры SPA','',9);
INSERT INTO `atomicSkills` VALUES (146,'Отладка JavaScipt кода','',9);
INSERT INTO `atomicSkills` VALUES (147,'TypeScript','',9);
INSERT INTO `atomicSkills` VALUES (148,'CoffeeScript','',9);
INSERT INTO `atomicSkills` VALUES (149,'Базовый синтаксис языка','Переменные, циклы, условия, функции, классы',10);
INSERT INTO `atomicSkills` VALUES (150,'Способы организации наследования','Модель конструктора, функциональная, прототипная, OLOO, ES6',10);
INSERT INTO `atomicSkills` VALUES (151,'Области видимости','Динамические, лексические',10);
INSERT INTO `atomicSkills` VALUES (152,'Контекст this','',10);
INSERT INTO `atomicSkills` VALUES (153,'Типизация в JavaScript','',10);
INSERT INTO `atomicSkills` VALUES (154,'Приведение к общему типу (coercion)','',10);
INSERT INTO `atomicSkills` VALUES (155,'Реализация асинхронности в JavaScript','',10);
INSERT INTO `atomicSkills` VALUES (156,'Promise','',10);
INSERT INTO `atomicSkills` VALUES (157,'Разработка на ванильном JS','',10);
INSERT INTO `atomicSkills` VALUES (158,'Оптимизация производительности','',10);
INSERT INTO `atomicSkills` VALUES (159,'Стандарт ES2015/ES6','',10);
INSERT INTO `atomicSkills` VALUES (160,'Стандарты ES6+','',10);
INSERT INTO `atomicSkills` VALUES (161,'Async/await','',10);
INSERT INTO `atomicSkills` VALUES (162,'Генераторы','',10);
INSERT INTO `atomicSkills` VALUES (163,'Реактивное программирование','rx, bacon, kefir',10);
INSERT INTO `atomicSkills` VALUES (164,'Перекрытие (shadowing) переменных','',10);
INSERT INTO `atomicSkills` VALUES (165,'Поднятие (hoisting) переменных','',10);
INSERT INTO `atomicSkills` VALUES (166,'Немедленно вызываемые функции (IIFE)','',10);
INSERT INTO `atomicSkills` VALUES (167,'Паттерны оптимизации','',10);
INSERT INTO `atomicSkills` VALUES (168,'Режим полного соответствия стандарту','',10);
INSERT INTO `atomicSkills` VALUES (169,'Глобальный объект','',10);
INSERT INTO `atomicSkills` VALUES (170,'Цепь областей видимости','',10);
INSERT INTO `atomicSkills` VALUES (171,'Цепь прототипов','',10);
INSERT INTO `atomicSkills` VALUES (172,'Стандартная библиотека (SPL)','',11);
INSERT INTO `atomicSkills` VALUES (173,'Основные расширения','mcrypt, xml, mbstring, gd, imagick, mysqli и пр.',11);
INSERT INTO `atomicSkills` VALUES (174,'Автозагрузка','',11);
INSERT INTO `atomicSkills` VALUES (175,'Composer','',11);
INSERT INTO `atomicSkills` VALUES (176,'Pear','',11);
INSERT INTO `atomicSkills` VALUES (177,'PSR-0','',11);
INSERT INTO `atomicSkills` VALUES (178,'PSR-4','',11);
INSERT INTO `atomicSkills` VALUES (179,'Разработка на фреймворках','Symfony 2/3, Laravel 4/5, Yii 1/2, Zend Framework 1/2 и пр.',11);
INSERT INTO `atomicSkills` VALUES (180,'Использование PDO','',11);
INSERT INTO `atomicSkills` VALUES (181,'Использование ORM','Propel, Eloquent, Doctrine',11);
INSERT INTO `atomicSkills` VALUES (182,'Работа с популярными библиотеками','Carbon, ImageWorkshop, Twig, Guzzle, Goutte, SwiftMailer, Mockery, библиотеки The PHP League',11);
INSERT INTO `atomicSkills` VALUES (183,'Отладка кода','IDE, Xdebug',11);
INSERT INTO `atomicSkills` VALUES (184,'Системы очередей','ZMQ, RabbitMQ, ActiveMQ, Amazon SQS',11);
INSERT INTO `atomicSkills` VALUES (185,'Поисковые системы','Apache Lucene, Apache Solr, Elasticsearch, Sphinx',11);
INSERT INTO `atomicSkills` VALUES (186,'Разработка монолитных приложений','',11);
INSERT INTO `atomicSkills` VALUES (187,'Разработка микросервисных приложений','',11);
INSERT INTO `atomicSkills` VALUES (188,'Авторизация и аутентификация','Протоколы OAuth 1/2, OpenID, JWT. Системы с ACL',11);
INSERT INTO `atomicSkills` VALUES (189,'Бэкенд разработка на других языках','JavaScript/NodeJS, Ruby',11);
INSERT INTO `atomicSkills` VALUES (190,'Фреймворки прочих языков','Express, Koa, Rails',11);
INSERT INTO `atomicSkills` VALUES (191,'Работа с высоконагруженными системами','',11);
INSERT INTO `atomicSkills` VALUES (192,'Работа с большими объемами данных','',11);
INSERT INTO `atomicSkills` VALUES (193,'Исправление багов в библиотеках, платформах','',11);
INSERT INTO `atomicSkills` VALUES (194,'Резервное копирование кода','',12);
INSERT INTO `atomicSkills` VALUES (195,'Основы систем контроля версий','Фиксация изменений, ветвления, отправка и получение данных',12);
INSERT INTO `atomicSkills` VALUES (196,'Прочие операции','Перемещение и слияние кода, изменение и удаление коммитов, работа с несколькими репозиториями',12);
INSERT INTO `atomicSkills` VALUES (197,'Способы совместной работы','Централизованная работа, feature branch, gitflow, forking workflow',12);
INSERT INTO `atomicSkills` VALUES (198,'Работа с разными системами контроля версий','CVS, SVN, Git, Mercurial, Fossil',12);
INSERT INTO `atomicSkills` VALUES (199,'Хуки','',12);
INSERT INTO `atomicSkills` VALUES (200,'Интеграция с внешними скриптами','',12);
INSERT INTO `atomicSkills` VALUES (201,'Ручная минификация и оптимизация файлов','',13);
INSERT INTO `atomicSkills` VALUES (202,'Конфигурирование системам сборки','Gulp, Grunt, Webpack',13);
INSERT INTO `atomicSkills` VALUES (203,'Многовходовая сборка','',13);
INSERT INTO `atomicSkills` VALUES (204,'Нестандартные кофигурации','',13);
INSERT INTO `atomicSkills` VALUES (205,'Сборка legacy-кода','',13);
INSERT INTO `atomicSkills` VALUES (206,'Объединение систем на нескольких фреймворках','',13);
INSERT INTO `atomicSkills` VALUES (207,'Работа с ОС на уровне пользователя','',14);
INSERT INTO `atomicSkills` VALUES (208,'Установка и удаление программ','',14);
INSERT INTO `atomicSkills` VALUES (209,'Подключение к сетям','',14);
INSERT INTO `atomicSkills` VALUES (210,'Консоль','',14);
INSERT INTO `atomicSkills` VALUES (211,'Консольные команды','',14);
INSERT INTO `atomicSkills` VALUES (212,'Скрипты','',14);
INSERT INTO `atomicSkills` VALUES (213,'Конфигурационные файлы/реестр','',14);
INSERT INTO `atomicSkills` VALUES (214,'Работа с драйверами и оборудованием','',14);
INSERT INTO `atomicSkills` VALUES (215,'Виртуализация','',14);
INSERT INTO `atomicSkills` VALUES (216,'Установка ОС','',14);
INSERT INTO `atomicSkills` VALUES (217,'Работа с ОС на уровне системного администрирования','',14);
INSERT INTO `atomicSkills` VALUES (218,'Установка и настройка серверных программ','',14);
INSERT INTO `atomicSkills` VALUES (219,'Организация сетевого взаимодействия','',14);
INSERT INTO `atomicSkills` VALUES (220,'Архитектура компьютера','',14);
INSERT INTO `atomicSkills` VALUES (221,'Сетевые коммуникационные протоколы','IPv4, IPv6, TCP, UDP, POP, IMAP, SMTP, HTTP, SMB',14);
INSERT INTO `atomicSkills` VALUES (222,'Веб-сервер','Apache, Nginx, lighthttpd',14);
INSERT INTO `atomicSkills` VALUES (223,'СУБД','MySQL, PostgreSQL',14);
INSERT INTO `atomicSkills` VALUES (224,'Системы управления конфигурациями','Puppet, Chef, Ansible, Salt',14);
INSERT INTO `atomicSkills` VALUES (225,'Контейнеризация','Vagrant, docker, docker-compose, kubernetes',14);
INSERT INTO `atomicSkills` VALUES (226,'SSH','',14);
INSERT INTO `atomicSkills` VALUES (227,'VPN','OpenVPN, pptpd',14);
INSERT INTO `atomicSkills` VALUES (228,'SSL','OpenSSL, Let“s Encrypt',14);
INSERT INTO `atomicSkills` VALUES (229,'Хостинг','',15);
INSERT INTO `atomicSkills` VALUES (230,'Amazon','',15);
INSERT INTO `atomicSkills` VALUES (231,'Digital Ocean','',15);
INSERT INTO `atomicSkills` VALUES (232,'Выгрузка при помощи FTP/SFTP','',15);
INSERT INTO `atomicSkills` VALUES (233,'Git','',15);
INSERT INTO `atomicSkills` VALUES (234,'Миграции БД','',15);
INSERT INTO `atomicSkills` VALUES (235,'Системы CI','Jenkins, TeamCity, Travis-CI, GitlabCI',15);
INSERT INTO `atomicSkills` VALUES (236,'Практики DevOps','ChatOps, IaS, Docker, пайплайны',15);
INSERT INTO `atomicSkills` VALUES (237,'Системы мониторинга','Prometheus, Zabbix',15);
INSERT INTO `atomicSkills` VALUES (238,'Kubernetes','',15);
INSERT INTO `atomicSkills` VALUES (239,'Инфраструктурная организация рефакторинга БД','',15);
INSERT INTO `atomicSkills` VALUES (240,'Использование для написания кода','',16);
INSERT INTO `atomicSkills` VALUES (241,'Установка и настройка расширений','',16);
INSERT INTO `atomicSkills` VALUES (242,'Настройка автокоррекции синтаксиса','',16);
INSERT INTO `atomicSkills` VALUES (243,'Функции рефакторинга кода','Переименование переменных, функций, классов',16);
INSERT INTO `atomicSkills` VALUES (244,'Работа с системой контроля версий','',16);
INSERT INTO `atomicSkills` VALUES (245,'Работа с базой данных','',16);
INSERT INTO `atomicSkills` VALUES (246,'Использование профилировщика','',16);
INSERT INTO `atomicSkills` VALUES (247,'Управляющие комбинации клавиш','',16);
INSERT INTO `atomicSkills` VALUES (248,'Разные IDE','IntelliJ IDEA, VS Code, Eclipse',16);
INSERT INTO `atomicSkills` VALUES (249,'Работа в одиночку','',17);
INSERT INTO `atomicSkills` VALUES (250,'Работа в кроссфункциональной команде','',17);
INSERT INTO `atomicSkills` VALUES (251,'Устранение конфликтов в коде при помощи VCS','',17);
INSERT INTO `atomicSkills` VALUES (252,'Поддержание общего домена знаний','Документирование, рассказ о наработках, ответы на вопросы',17);
INSERT INTO `atomicSkills` VALUES (253,'Парное программирование','',17);
INSERT INTO `atomicSkills` VALUES (254,'Разработка по каскадной методологии','',17);
INSERT INTO `atomicSkills` VALUES (255,'Гибкие методологии разработки','Scrum, kanban',17);
INSERT INTO `atomicSkills` VALUES (256,'Организация процесса разработки','',17);
INSERT INTO `atomicSkills` VALUES (257,'Работа без менеджеров','',17);
INSERT INTO `atomicSkills` VALUES (258,'Принятие решений по собственным ощущениям','',18);
INSERT INTO `atomicSkills` VALUES (259,'Использование данных и фактов для формирования решения','',18);
INSERT INTO `atomicSkills` VALUES (260,'Консультации с коллегами для принятия решения','',18);
INSERT INTO `atomicSkills` VALUES (261,'Навыки безопасной коммуникации','',18);
INSERT INTO `atomicSkills` VALUES (262,'Навыки активного слушания','',18);
INSERT INTO `atomicSkills` VALUES (263,'Использование поисковой системы для поиска решений','',19);
INSERT INTO `atomicSkills` VALUES (264,'Чтение технической литературы','',19);
INSERT INTO `atomicSkills` VALUES (265,'Понимание своих сильных и слабых сторон','',19);
INSERT INTO `atomicSkills` VALUES (266,'Обучение коллег','',19);
INSERT INTO `atomicSkills` VALUES (267,'Подготовка образовательных материалов','',19);
INSERT INTO `atomicSkills` VALUES (268,'Регулярное дистанционное обучение','',19);
INSERT INTO `atomicSkills` VALUES (269,'Регулярное очное обучение','',19);
INSERT INTO `atomicSkills` VALUES (270,'Написание технических статей или записей в блоге','',19);
INSERT INTO `atomicSkills` VALUES (271,'Участие в конференциях в качестве слушателя','',19);
INSERT INTO `atomicSkills` VALUES (272,'Участие в конференциях в качестве докладчика','',19);
INSERT INTO `atomicSkills` VALUES (273,'Поверхностная ревизия','По формальным критериям вроде именования, стилистики, местоположения файлов',20);
INSERT INTO `atomicSkills` VALUES (274,'Глубокая ревизия кода','По всем критериям, включая смысл кода, используемые алгоритмы, соответствие задаче, оптимальность алгоритма и архитектурную корректность',20);
INSERT INTO `atomicSkills` VALUES (275,'Позитивная обратная связь по коду','',20);
INSERT INTO `atomicSkills` VALUES (276,'Формирование предложений и идей','Чем больше идей, тем лучше',20);
INSERT INTO `atomicSkills` VALUES (277,'Ревизия кода в больших задачах','Когда кода много',20);
INSERT INTO `atomicSkills` VALUES (278,'Использование автоматизированных средств для ревизии','',20);
INSERT INTO `atomicSkills` VALUES (279,'Оценка по собственным ощущениям','',21);
INSERT INTO `atomicSkills` VALUES (280,'Оценка с поправочным коэффициентом','',21);
INSERT INTO `atomicSkills` VALUES (281,'Оценка сроков через сложность задачи','',21);
INSERT INTO `atomicSkills` VALUES (282,'Круговая/коллективная оценка','Покер планирования',21);
INSERT INTO `atomicSkills` VALUES (283,'Оценка вилкой по двум точкам','Минимум, максимум',21);
INSERT INTO `atomicSkills` VALUES (284,'Оценка вилкой с тремя точками','Минимум, максимум, наиболее вероятный срок',21);
INSERT INTO `atomicSkills` VALUES (285,'Скорость команды и диаграмма сгорания','',21);
INSERT INTO `atomicSkills` VALUES (286,'Работа с проектами с небольшим сроком жизни','',22);
INSERT INTO `atomicSkills` VALUES (287,'Переписывание проектов «с нуля»','',22);
INSERT INTO `atomicSkills` VALUES (288,'Предел технической сложности проекта','',22);
INSERT INTO `atomicSkills` VALUES (289,'Работа с техническим долгом','',22);
INSERT INTO `atomicSkills` VALUES (290,'Рефакторинг','',22);
INSERT INTO `atomicSkills` VALUES (291,'Работа с «хрупкими комками грязи»','Сложными проектами с хрупким кодом и большим legacy',22);
INSERT INTO `atomicSkills` VALUES (292,'Стабилизация скорости разработки проектов','',22);
INSERT INTO `atomicSkills` VALUES (293,'Изучение исходных текстов продуктов','',23);
INSERT INTO `atomicSkills` VALUES (294,'Изучение багтреккеров продуктов','',23);
INSERT INTO `atomicSkills` VALUES (295,'Оформление PRов к продуктам с открытым кодом','',23);
INSERT INTO `atomicSkills` VALUES (296,'Решение PRов, подготовка пулл-запросов','',23);
INSERT INTO `atomicSkills` VALUES (297,'Постоянная поддержка проекта с открытым кодом','',23);
INSERT INTO `atomicSkills` VALUES (298,'Участие в Open Source сообществах','',23);
INSERT INTO `atomicSkills` VALUES (299,'Знание иностранного языка на уровне чтения документации','Beginner, Elementary, Pre-Intermediate',24);
INSERT INTO `atomicSkills` VALUES (300,'Знание на уровне полноценного письменного общения','Intermediate, Upper-Intermediate',24);
INSERT INTO `atomicSkills` VALUES (301,'Понимание устной речи','',24);
INSERT INTO `atomicSkills` VALUES (302,'Поддержка разговоров на технические темы','',24);
INSERT INTO `atomicSkills` VALUES (303,'Поддержка разговоров на бытовые темы','',24);
INSERT INTO `atomicSkills` VALUES (304,'Деловая и техническая переписка','',24);
INSERT INTO `atomicSkills` VALUES (305,'Знание на уровне свободного владения языка','Advanced, Proficiency',24);
INSERT INTO `atomicSkills` VALUES (306,'Сертификация знаний иностранного языка','TOEFL, IELTS',24);
INSERT INTO `atomicSkills` VALUES (307,'Размещения, перестановки, сочетания','',27);
INSERT INTO `atomicSkills` VALUES (308,'Биномиальные коэффициенты','',27);
INSERT INTO `atomicSkills` VALUES (309,'Математическое ожидание','',27);
INSERT INTO `atomicSkills` VALUES (310,'Дисперсия','',27);
INSERT INTO `atomicSkills` VALUES (311,'Условная вероятность','',27);
INSERT INTO `atomicSkills` VALUES (312,'Основные распределения','Нормальное, биномиальное, Стьюдента, Пуассона, Трейси-Видома',27);
INSERT INTO `atomicSkills` VALUES (313,'Основные понятия','Тест-план, Тест-кейс, баг',28);
INSERT INTO `atomicSkills` VALUES (314,'Эффект пестицида','',28);
INSERT INTO `atomicSkills` VALUES (315,'Работа с багтреккером','',28);
INSERT INTO `atomicSkills` VALUES (316,'Работа с функциональными требованиями','',28);
INSERT INTO `atomicSkills` VALUES (317,'Классы эквивалентности','',28);
INSERT INTO `atomicSkills` VALUES (318,'Формирование разбиения области тестирования','',28);
INSERT INTO `atomicSkills` VALUES (319,'Анализ границ области тестирования','',28);
INSERT INTO `atomicSkills` VALUES (320,'Методики тестирования','Черный, белый и серый ящики',28);
INSERT INTO `atomicSkills` VALUES (321,'Виды тестирования','Компонентное, системное, интеграционное. Регрессионное, стресс, приёмочное',28);
INSERT INTO `atomicSkills` VALUES (322,'Построение тест-плана','',28);
INSERT INTO `atomicSkills` VALUES (323,'Построение тест-кейсов','',28);
INSERT INTO `atomicSkills` VALUES (324,'Причинно-следственные диаграммы','',28);
INSERT INTO `atomicSkills` VALUES (325,'Анализ модели состояния','',28);
INSERT INTO `atomicSkills` VALUES (326,'Оценка покрытия кода и требований тестами','Покрытие функций, условий, решений',28);
INSERT INTO `atomicSkills` VALUES (327,'Основные понятия веб-разработки','Веб-сервер, веб-клиент, POST-запросы, GET-запросы',28);
INSERT INTO `atomicSkills` VALUES (328,'Использование средств перехвата запросов','Fiddler',28);
INSERT INTO `atomicSkills` VALUES (329,'Протоколы веб','HTTP, JSON, FTP, telnet, SMTP, POP',28);
INSERT INTO `atomicSkills` VALUES (330,'Тестирование защищенности веб-приложений','',28);
INSERT INTO `atomicSkills` VALUES (331,'SQL-инъекции','',28);
INSERT INTO `atomicSkills` VALUES (332,'XSS','',28);
INSERT INTO `atomicSkills` VALUES (333,'Нагрузочное тестирование','JMeter, HP Load Runner, ab, siege',28);
INSERT INTO `atomicSkills` VALUES (334,'Сборка динамического покрытия кода тестами','',28);
INSERT INTO `atomicSkills` VALUES (335,'Знание языка программирования','Python, java, javascript, C#',29);
INSERT INTO `atomicSkills` VALUES (336,'Использование IDE','',29);
INSERT INTO `atomicSkills` VALUES (337,'Инструменты записи сценариев','',29);
INSERT INTO `atomicSkills` VALUES (338,'Инспекция кода','',29);
INSERT INTO `atomicSkills` VALUES (339,'Тест-дизайн','',29);
INSERT INTO `atomicSkills` VALUES (340,'Средства отладки в CLI и IDE','',29);
INSERT INTO `atomicSkills` VALUES (341,'Использование Selenium','или надстроек Appium, Winium, Windows Application Driver',29);
INSERT INTO `atomicSkills` VALUES (342,'Data Driven Testing','',29);
INSERT INTO `atomicSkills` VALUES (343,'Behaviour Driven Testing','',29);
INSERT INTO `atomicSkills` VALUES (344,'Model Driven Testing','',29);
INSERT INTO `atomicSkills` VALUES (345,'Keyword Driven Testing','',29);
INSERT INTO `atomicSkills` VALUES (346,'Шаблоны проектирования тестов','Functional, PageObjects',29);
INSERT INTO `atomicSkills` VALUES (347,'Распределенное тестирование','',29);
INSERT INTO `atomicSkills` VALUES (348,'Selenium Server','',29);
INSERT INTO `atomicSkills` VALUES (349,'Selenium Grid','',29);
INSERT INTO `atomicSkills` VALUES (350,'Облачные сервисы тестирования','',29);
INSERT INTO `atomicSkills` VALUES (351,'Встроенные типы переменных','',26);
INSERT INTO `atomicSkills` VALUES (352,'Mutable/immutable типы','',26);
INSERT INTO `atomicSkills` VALUES (353,'Динамическая типизация','',26);
INSERT INTO `atomicSkills` VALUES (354,'Базовый синтаксис языка','И инструкции управления потоком выполнения',26);
INSERT INTO `atomicSkills` VALUES (355,'Синтаксис функций','',26);
INSERT INTO `atomicSkills` VALUES (356,'Области видимости переменных','Правило LEGB',26);
INSERT INTO `atomicSkills` VALUES (357,'Итераторы','',26);
INSERT INTO `atomicSkills` VALUES (358,'Генераторы','',26);
INSERT INTO `atomicSkills` VALUES (359,'Документирование кода','В соответствии с PEP8',26);
INSERT INTO `atomicSkills` VALUES (360,'Средства функционального программирования','map, filter, reduce',26);
INSERT INTO `atomicSkills` VALUES (361,'Анонимные функции (lambda)','',26);
INSERT INTO `atomicSkills` VALUES (362,'Использование инструкции yield','',26);
INSERT INTO `atomicSkills` VALUES (363,'Проектирование модулей','',26);
INSERT INTO `atomicSkills` VALUES (364,'Работа с модулями','Повторная загрузка, относительный импорт, сокрытие данных',26);
INSERT INTO `atomicSkills` VALUES (365,'Классы, создание и использование','',26);
INSERT INTO `atomicSkills` VALUES (366,'Наследование и переопределение методов','',26);
INSERT INTO `atomicSkills` VALUES (367,'Композиция и делегирование для классов','',26);
INSERT INTO `atomicSkills` VALUES (368,'Перегрузка операторов','',26);
INSERT INTO `atomicSkills` VALUES (369,'Фабрики объектов','',26);
INSERT INTO `atomicSkills` VALUES (370,'Классы \"старого\" и \"нового\" стилей','',26);
INSERT INTO `atomicSkills` VALUES (371,'Создание и использование исключений','',26);
INSERT INTO `atomicSkills` VALUES (372,'Создание и использование контекстных менеджеров','',26);
INSERT INTO `atomicSkills` VALUES (373,'Объекты unicode, bytes, bytearray','',26);
INSERT INTO `atomicSkills` VALUES (374,'Env-сборки','При помощи утилиты pip',26);
INSERT INTO `atomicSkills` VALUES (375,'Консольный отладчик python','',26);
INSERT INTO `atomicSkills` VALUES (376,'Декораторы функций','',26);
INSERT INTO `atomicSkills` VALUES (377,'Декораторы классов','',26);
INSERT INTO `atomicSkills` VALUES (378,'Дескрипторы','',26);
INSERT INTO `atomicSkills` VALUES (379,'Множественное наследование','',26);
INSERT INTO `atomicSkills` VALUES (380,'Различные варианты python','cpython, ironpython, jpython, Stackless Python',26);
INSERT INTO `atomicSkills` VALUES (381,'Разработка с веб-фреймворками','Django, Flask, Pyramid',26);
INSERT INTO `atomicSkills` VALUES (382,'Разработка с GUI-фреймворками','PyQt, Tkinter, WxPython',26);
INSERT INTO `atomicSkills` VALUES (383,'Метапрограммирование','',26);
INSERT INTO `atomicSkills` VALUES (384,'Сетевое программирование','',26);
INSERT INTO `atomicSkills` VALUES (385,'Асинхронное программирование','',26);
INSERT INTO `atomicSkills` VALUES (386,'Мультипроцессное программирование','',26);
INSERT INTO `atomicSkills` VALUES (387,'Мультипоточное программирование','',26);
INSERT INTO `atomicSkills` VALUES (388,'Специализированные библиотеки','NumPy, SciPy, SQLAlchemy',26);
INSERT INTO `atomicSkills` VALUES (389,'«Великодушный пожизненный диктатор»','',26);
/*!40000 ALTER TABLE `atomicSkills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `compentencyGroups`
--

DROP TABLE IF EXISTS `compentencyGroups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `compentencyGroups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(45) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code_UNIQUE` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `compentencyGroups`
--

LOCK TABLES `compentencyGroups` WRITE;
/*!40000 ALTER TABLE `compentencyGroups` DISABLE KEYS */;
INSERT INTO `compentencyGroups` VALUES (1,'programmingTheory','Теория программирования');
INSERT INTO `compentencyGroups` VALUES (2,'programmingPractice','Практика программирования');
INSERT INTO `compentencyGroups` VALUES (3,'environment','Окружение и сопроводительное ПО');
INSERT INTO `compentencyGroups` VALUES (4,'common','Общие навыки');
INSERT INTO `compentencyGroups` VALUES (5,'experience','Опыт');
INSERT INTO `compentencyGroups` VALUES (6,'other','Прочее');
INSERT INTO `compentencyGroups` VALUES (7,'testingPractice','Практика тестирования');
INSERT INTO `compentencyGroups` VALUES (8,'testingTheory','Теория тестирования');
INSERT INTO `compentencyGroups` VALUES (9,'pmApplied','Вспомогательные');
INSERT INTO `compentencyGroups` VALUES (10,'pmPersonal','Личностные качества');
INSERT INTO `compentencyGroups` VALUES (11,'pmProfessional','Компетенции');
INSERT INTO `compentencyGroups` VALUES (12,'pmStartPlanning','Старт и планирование проекта');
INSERT INTO `compentencyGroups` VALUES (13,'pmProgress','Выполнение проекта');
INSERT INTO `compentencyGroups` VALUES (14,'pmStop','Закрытие проекта');
/*!40000 ALTER TABLE `compentencyGroups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `competencies`
--

DROP TABLE IF EXISTS `competencies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `competencies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(45) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `level1` text DEFAULT NULL,
  `level2` text DEFAULT NULL,
  `level3` text DEFAULT NULL,
  `level4` text DEFAULT NULL,
  `competencyGroupId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code_UNIQUE` (`code`),
  KEY `competencyGroupId` (`competencyGroupId`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `competencies`
--

LOCK TABLES `competencies` WRITE;
/*!40000 ALTER TABLE `competencies` DISABLE KEYS */;
INSERT INTO `competencies` VALUES (1,'functionalProgramming','Функциональное программирование','Владею понятиями алгоритма, именованных переменных и функций. Хорошо знаю базовые алгоритмы: линейный поиск, сортировка и бинарный поиск, обход многомерного массива, векторные и матричные операции','Знаю что такое сложные типы данных, рекурсия, лямбда функции, карринг, функции высшего порядка. Знаю о чистоте функций и побочных эффектах. Имею опыт использования замыканий','Понятие вычислимости. Знаю о машине Тьюринга, конечных автоматах. Хорошо ориентируюсь в классах вычислительной сложности задач. Знаю, что такое NP-полные задачи, могу привести пример одной из формулировок. Алгоритм NP-перебора','Прекрасно понимаю, что такое параллельные алгоритмы (очередь, конвейер), транзакции, мертвая блокировка, состояние гонки. Знаю, что такое семафоры, мьютексы',1);
INSERT INTO `competencies` VALUES (2,'oopProgramming','ОО программирование и проектирование','Имею представление о базовых принципах ООП: абстракция, инкапсуляция, наследование, полиморфизм. Знаю об инкапсуляции данных и приватных методов. Знаю о понятиях интерфейса, абстрактного класса. Владею простейшими шаблонами проектирования: одиночка (singleton), фабрика (factory), фасад (fascade), адаптер (adapter)','Владею расширением без наследования (композиция, полиморфные классы, шаблонные методы). Владею сериализацией и десериализацией объектов','Уверенно владею другими шаблонами проектирования: наблюдатель (observer), посетитель (visitor), стратегия (strategy), реестр (registry). Имею опыт работы с DI-фрейморками. Владею основными принципами объектно-ориентированного программирования и проектирования: SOLID','Уверенно знаю, могу применять и подбирать под нужды проекта архитектурные шаблоны: MVC, MVP, MVVM, DDD. Знаю как лучше организовать код по файлам, каталогам, пространствам имен',1);
INSERT INTO `competencies` VALUES (3,'codeQuality','Качество кода','Знаю о необходимости уделять внимание качеству кода. Знаю, что заниматься ad hoc разработкой плохо. Понимаю, что необходимо возвращаться к написанным фрагментам кода для их улучшения. Знаю, что нужно уделять больше внимания именованию переменных, функций, объектов, таблиц. Представляю, что нужно переписывать код, чтобы сделать его более понятным и простым','Имею представление об основных запахах кода: дублирование кода, мертвый код, операторы switch, стрельба дробью, завистливые функции и пр. Владею некоторыми техниками рефакторинга: извлечение/перемещение метода, класса, удаление посредника, инкапсуляция поля, замена параметров объектом, свертывание иерархии и пр. Периодически применяю эти техники для улучшения кода. Стараюсь придерживаться определенных стилей при написании кода: именование переменных, классов, форматирование','Постоянно занимаюсь рефакторингом, имею 7-е чувство на запахи кода. Придерживаюсь правила бойскаута: \\\"Оставь поляну лучше, чем она была до тебя\\\". Пишу код, который можно повторно использовать. Не по наслышке знаком с практиками экстремального программирования, применяю их на практике','Постоянно применяю TDD/BDD подход к разработке. Стараюсь добится высокой степени покрытия кода тестами. Достигаю продуктивности за счет улучшения качества, а не за счет его ухудшения. Консультируюсь и консультирую других разработчиков по способам улучшить код, сделать его более гибким. Считаю программирование и способность писать понятный, легко поддерживаемый и качественный код искусством',1);
INSERT INTO `competencies` VALUES (4,'devTesting','Тестирование с точки зрения web-разработчика','Знаю, что нужно запускать автотесты как можно чаще. Понимаю, что нужно делать автотесты самостоятельно, а не только полагаться на автотесты, сделанные коллегами. Знаю о том, что тестировать - задача не только тестировщика, но и разработчика','Иногда разрабатываю модульные (unit) тесты. Имею опыт использования xUnit фреймфворка тестирования backend\'а (phpunit) или frontend\'а (jasmine, qunit, nightwatch, jest). Владею понятиями: тест-план, тест-дизайн, тест-анализ, умею писать хорошие баг-репорты для себя и других разработчиков. Понимаю отличия, преимущества и недостатки тестирования методами чёрного ящика, белого ящика, серого ящика','Имею представление о классах эквивалентности. Имею представление и практический опыт написания других видов тестов: интеграционное, системное, функциональное, регрессионное, приемочное и пр. Имею опыт разработки некоторых из указанных видов тестов. Имею представление о средствах автоматизации тестирования браузера и UI (selenium, appium). Имею представление о Data-driven Testing','Отлично владею методиками автоматизированного тестирования. Знаком с каким-либо фреймворком тестирования (py.test, xUnit frameworks). Имею представление о методиках и фреймворках Keyword-driven testing, Behavior-driven testing (behat), Model-based testing',1);
INSERT INTO `competencies` VALUES (5,'taskAnalysis','Анализ задач','Поручаю анализ проблемы другим людям (для этого есть системные и бизнес-аналитики). Выполняю задачу в том виде, в котором она описана. Ожидаю полное и подробное описание задачи, подробное техническое задание прежде, чем приступать к работе. Считаю, что ТЗ должно быть таким, чтобы при выполнении задачи не возникало вопросов','Вплотную работаю с менеджером. Задаю вопросы, когда возникают. Запрашиваю информацию, когда не хватает. Стараюсь выполнить задачу как можно лучше с технической точки зрения. Бывает, не понимаю, кому и зачем нужна задача. Приступаю к разработке сразу, как только есть минимум необходимой информации','Перед тем, как приступать к выполнению задачи, анализирую возможные варианты решения. Выбираю и делаю лучший вариант в пределах своих профессиональных компетенций.  Провожу декомпозицию задач, могу составить план и выстроить последовательность задач, которые необходимо выполнить, чтобы достичь требуемого результата. Занимаюсь синтезом общих решений из частных. Предпочитаю работать с хозяином задачи напрямую. К менеджеру обращаюсь за решением организационных вопросов','Анализирую каждую задачу и учитываю не только технические факторы, но и бизнес-факторы, необходимости хозяина задачи. Анализирую затраты и риски. Стараюсь подходить к задаче со всех сторон. Подробно изучаю и пытаюсь выявить суть задачи, разобраться в домене знаний, привлечь экспертов и добраться до необходимых данных, в том случае, если имеющихся данных недостаточно. Могу предложить альтернативные варианты действий, в том случае, если в ходе анализа выяснилась невозможность или нецелесообразность выполнения задачи',1);
INSERT INTO `competencies` VALUES (6,'baseWebDevelopment','Основы веб-программирования','Имею базовые понятия о клиент-серверной архитектуре, понимаю чем различается клиентская и серверная часть. Знаю HTML, CSS. Могу делать несложные статичые страницы. Знаю, что такое DOM, AJAX. Знаю основы JavaScript','Неплохо знаю JavaScript и какой-либо серверный язык (в т.ч. JavaScript). Знаю основные способы хранения и передачи состояния на сервер. Знаю, что такое cookie, сессия, могу использовать их на сервере','Знаю HTML5, CSS3. Знаю SQL, могу работать с базой данных. Знаю и могу работать с API браузера: Window, Document, LocalStorage, History и др. Понимаю архитектурный стиль REST, знаю протоколы HTTP, SOAP. Знаю как организованы и могу разрабатывать RESTful веб-службы. Хорошо знаю и понимаю форматы передачи данных XML, JSON. Знаю, что такое CRUD','Знаю, как работает кэширование, gzip-сжатие. Знаю, как и для чего используются заголовки Last-Modified, ETag, Content-Encoding, Content-Type, Referer, User-Agent. Знаю, что такое CORS и для чего он нужен. Знаю, как и для чего используется заголовок Access-Control-Allow-Origin. Хорошо ориентируюсь в HTTP-статусах ответов: 200, 300, 400, 500',2);
INSERT INTO `competencies` VALUES (7,'databases','Базы данных','Могу подключаться к базе данных при помощи клиента, делать несложные SQL-запросы: SELECT, INSERT, UPDATE, DELETE','Могу выполнять сложные запросы, использовать JOIN, ORDER BY, GROUP BY, HAVING, подзапросы.  Могу составить запросы на изменение схемы. Знаю как использовать функции SQL, в том числе аггрегатные. Знаю, что такое виды и как их создавать. Знаю как создавать и использовать индексы. Знаю и могу использовать транзакции, понимаю, что такое атомарные операции','Знаю, как использовать переменные SQL. Могу разрабатывать собственные функции и хранимые процедуры,  в т.ч. со сложной логикой. Знаю, что такое курсор. Имею опыт работы с NoSQL базами данных, могу делать запросы. Знаком с хранилищами ключ-значение (MemcacheDB, Beanstalk, Redis), могу подключаться и делать запросы','Хорошо знаю теорию баз данных. Знаю нормальные формы (6 штук + доменно-ключевая + Бойса-Кодда), для чего они нужны. Знаю когда и почему нужна денормализация. Знаю про ACID и теорему CAP. Хорошо знаю несколько различных реализаций SQL (MySQL, PostgreSQL, MSSQL, Oracle). Могу оптимизировать настройки серверов, организовать кластеризацию и репликацию данных. Знаком с какими-либо другими типами баз данных: колоночными БД (Hbase, Cassandra), документ-ориентированными БД (CouchDB, MongoDB), графовыми БД (InfiniteGraph, FlockDB). Могу работать с ними на уровне запросов',2);
INSERT INTO `competencies` VALUES (8,'dataScience','Анализ данных','Знаю о необходимости анализа данных. Понимаю, что принятие интуитивных решений, исходя только из собственного опыта работы, может привести к серьезным ошибкам','Перед принятием решения стараюсь проконсультироваться с коллегами, проанализировать имеющиеся данные. Анализ данных делаю, в основном визуально, использую простые выборки из баз данных. Знаком с A/B тестированием, иногда приходилось принимать в нем участие. Умею анализировать данные сплит-тестирования','Владею техниками многомерного анализа. Знаком с OLAP, могу построить OLAP-куб при помощи специализированного ПО (Microsoft Analysis Services, Pentaho Mondrian). Знаю MDX, могу составлять запросы и анализировать результаты. Приходилось работать с Data Warehouse','Владею основами статистического анализа. Знаю что такое выборка и какой она должна быть. Владею понятиями распределение (нормальное, Стьюдента), доверительный интервал, значимость, дисперсия, p-значение, стандартное отклонение. Знаю, как правильно получить и обработать данные из базы данных, чтобы принять решение, обоснованное статистически достоверными данными. Доводилось работать со специализированными программными пакетами для статистического анализа (Statistica, Matlab, R, SPSS). Знаком с кластерным анализом, математическим моделированием',2);
INSERT INTO `competencies` VALUES (9,'frontendTech','Технологии фронта','Знаю как подключать нужные библиотеки при помощи тэга &lt;script&gt; в теле страниц. Каждую страницу рассматриваю отдельно, либо использую CMS с шаблонами страниц. Использую jQuery, jQuery-UI или аналогичную универсальную библиотеку при написании кода. Приходилось использовать Backbone.js, Underscore.js/Lodash. Могу верстать несложные страницы, знаю какие-либо универсальные ферймворки: Bootstrap, Foundation, Skeleton','Имею опыт разработки SPA на каком-либо фремворке: Angular.js, Vue.js, Ember.js, Meteor.js, React.js/Redux, i-bem.js. Знаком с модулями и их различной реализацией. Знаком с модульным CSS','Имею опыт работы с системой сборки (Browserify, Webpack), менеджером пакетов (bower, npm, yarn), системой запуска задач (Gulp.js, Grunt). Прекрасно разбираюсь в препроцессорах CSS (SASS/SCSS, LESS, PostCSS), JS (Babel), линтерах (JSLint, JSHint, ESLint), минификаторах/обфускаторах (Uglify.js, Google Closure Compiler, JSMin), оптимизаторах (Prepack). Знаю несколько различных архитектур SPA. Могу отлаживать JS-код при помощи IDE','Имею опыт разработки на разных фреймворках, с разными системами сборки, менеджерами пакетов и системами запуска задач. Знаю сильные и слабые стороны разных стэков и решений. Имею опыт разработки на TypeScript/CoffeeScript и пр. Прекрасно знаком с SPA различной архитектуры, могу начать с нуля',2);
INSERT INTO `competencies` VALUES (10,'javascript','JavaScript','Знаю базовый синтаксис языка, могу писать несложные приложения. Имею представление о паттернах подключения модулей common и amd. Знаю по крайней мере один способ организации наследования в JS. Понимаю нюансы использования this в контексте некоторых вариантов наследования. Имею представление о типизации в js и понимаю почему использование строгих типов важно для безопастности приложения. Имею представление о приведении к общему типу (coercion) при использовании \'==\' и понимаю, почему это не всегда безопасно. Понимаю как работает асинхронный код. Знаю, что такое callback hell и знаю как его избежать','Имею неплохое представление об области видимости, контексте. Имею представление о динамических областях видимости, о функциях, их создающих, и понимаю чем они отличаются от лексических. Понимаю, какое влияние на производительность оказывает динамическая область видимости. Имею опыт использования и предаставление о работе Promise, знаю чем отличается использование Promise и callback-функций. Имею опыт написания кода на ванильном JS. Понимаю необходимость оптимизации производительности кода и знаю, как ее проводить на практике','Прекрасно знаю ES2015 и более поздние стандарты. Использую ES2015+ элементы кода на интуитивном уровне. Понимаю плюсы и минусы использования различных элементов ES2015+ (const, fat arrow и тд). Имею представление о построении ассихронного кода в сихронном виде. Понимаю принципы работы генераторов и для решения каких проблем их можно использовать. Знаю когда рекурсия может быть опасной для стабильности приложения. Имею опыт реактивного программирования (rx, bacon, kefir). Знаю как внедрить, а также плюсы и минусы этих библиотек','Понимаю и могу использовать специальные термины такие как shadowing, hoisting, IIFE и тд. Имею представление о патернах оптимизации скорости работы кода и загрузки скриптов. Понимаю как работает режим полного соответствия современному стандарту. Понимаю почему важно использование этого режима с разных сторон в том числе с точки зрения производительности кода. Имею представление о глобальном объекте и его назначении. Понимаю как он работает в обыном режиме и режиме полного соответствия стандарту. Имею представление о способах оптимизации производительности кода (в т.ч. с использованием setTimeout, Duff\'s Device). Имею представление о цепи областей видимости (scope chain) и о цепи прототипов (prototype chain)',2);
INSERT INTO `competencies` VALUES (11,'php','Технологии бэкенда (PHP)','Неплохо знаю PHP, его основные возможности, стандартную библиотеку PHP и расширения. Знаю принципы работы автозагрузки и способы организации PHP-кода и библиотек. Знаю, как можно подключать и использовать сторонние библиотеки','Использую composer. Знаю стандарты PSR-0, PSR-4 и применяю их на практике. Имею опыт разработки на каком-либо фреймворке (Symfony 2/3, Laravel 4/5, Yii 1/2, Zend Framework 1/2 или другом). Имею опыт использования как ORM (Propel, Eloquent, Doctrine), так и PDO. Имею опыт работы с популярными библиотеками: Carbon, ImageWorkshop, Twig, Guzzle, Goutte, SwiftMailer, Mockery, библиотеки The PHP League. Имею опыт разботы с хранилищами ключ-значение (Redis, Memcached, Beanstalkd). Могу отлаживать код при помощи IDE','Имею опыт разработки на нескольких крупных фреймворках. Имею опыт работы с системами очередей (ZMQ, RabbitMQ, ActiveMQ, Amazon SQS). Имею опыт работы с поисковыми системами (Apache Lucene, Apache Solr, Elasticsearch, Sphinx). Имею как опыт разработки монолитных приложений, так и опыт построения микросервисной архитектуры. Имею опыт разработки систем авторизации и аутентификации на базе протоколов OAuth 1/2, OpenID, JWT, расличных систем с ACL. Имею опыт backend-разработки на других языках (JavaScript/NodeJS, Ruby), а также использования фреймворков для этого (Express, Koa, Rails)','Имею опыт разработки систем, работающих с высокой нагрузкой или огромным объемом данных. Знаком с ситуациями, когда разница между O(n^2) и O(nlogn) становится значимой, когда проблемы нагрузки нельзя решить железом. Приходилось исправлять баги в библиотеках, платформах, компиляторах',2);
INSERT INTO `competencies` VALUES (12,'vcs','Система контроля версий','Знаю о том, что периодических резервных копий кода не достаточно. Знаю о том, что в работе над кодом лучше использовать систему контроля версий, даже если я работаю в одиночку. Понимаю почему','Знаю основы одной из системы контроля версий. Могу создать ветку, коммит. Могу отправить данные в удаленный репозиторий','Хорошо знаю одну из систем контроля версий. Могу делать rebase, переносить, изменять и удалять коммиты. Могу подключать и управлять несколькими удаленными репозиториями. Могу делать пулл-запросы и подключать ветки других разработчиков. Знаю несколько способов организовать совместную работу при помощи VCS (workflows)','Прекрасно знаю несколько систем контроля версий (CVS, SVN, Git, Mercurial, Fossil), их преимущества и недостатки. Могу выбрать нужную в зависимости от проекта и потребностей. Могу использовать дополнительные возможности VCS (хуки, интеграция со внешними скриптами). Знаю как работают VCS изнутри',3);
INSERT INTO `competencies` VALUES (13,'buildAutomation','Автоматизация сборки','Имею теоретическое представление о том, что такое автоматизация сборки. Знаю как минифицировать или оптимизировать файлы вручную','Знаком с одной из систем автоматизации сборки (Gulp, Grunt, Webpack) на базовом уровне: понимаю что это и зачем нужно, могу использовать готовый процесс сборки, вносить в него изменения. Знаком с одним из менеджеров пакетов (npm, bower, yarn)','Отлично знаком с одной из систем автоматизации сборки. Могу настроить сборку с нуля: написать конфигурации, выбрать плагины, отладить процесс до получения нужного результата. Есть опыт работы со сложными и многоэтапными сборками. Отлично знаю основные плагины и особенности их применения','Отлично знаком с несколькми системами автоматизации сборки и с несколькими менеджерами пакетов, знаю их сильные и слабые стороны, могу выбрать подходящий для проекта. Имею большой опыт автоматизации и поддержки сложных сборок с нуля. Знаю, что такое многовходовая сборка. Имею опыт разработки нестандартных и сложных конфигураций. Имею опыт сборки legacy-кода. Приходилось объединять системы на нескольких фреймворках',3);
INSERT INTO `competencies` VALUES (14,'operatingSystems','Операционная система','Умею работать с операционной системой на уровне пользователя. Умею устанавливать и удалять программы, подключаться к сетям','Неплохо знаю консоль, консольные команды и скрипты. Знаю операционную систему на достаточно глубоком уровне: конфигурационные файлы/реестр, программные компоненты ОС. Могу разобраться с драйверами и оборудованием, если возникнет потребность. Могу установить и настроить операционную систему. Имею опыт работы с виртуализацией: могу создавать и настраивать виртуальные машины, устанавливать и использовать ОС в виртуалках','Разбираюсь в операционной системе на уровне системного администрирования. Могу устанавливать и настраивать серверные компоненты, могу организовать сетевое взаимодействие. Имею неплохие представления об архитектуре компьютера, о сетевых коммуникациях, протоколах','Разбираюсь в нескольких операционных системах на уровне системного администрирования. Знаю несколько консолей и несколько наборов системных комманд. Могу решить любую задачу средствами любой операционной системы, но так же выбираю ОС рационально, в зависимости от удобства в решении моих задач. Неоднократно приходилось разворачивать и настраивать серверное ПО в разных средах, под разные задачи и проекты (Apache, Nginx, MySQL, PostgreSQL и пр.)',3);
INSERT INTO `competencies` VALUES (15,'continuousIntegration','Непрерывная интеграция','Имею теоретическое представление о работе систем непрерывной интеграции. Знаю как пользоваться услугами хостинговых компаний или настраивать все на своих серверах вручную. Имею опыт выгрузки кода через FTP/SFTP, приходилось вносить исправления в код непосредственно на боевых серверах','Использую систему контроля версий для выгрузки кода на боевые сервера. В случае возникновения проблем использую откат к предыдущему коммиту. Знаю о том, для чего нужны миграции баз данных и использую их для обновления боевой базы. Могу автоматизировать несложный процесс выгрузки','Знаком с непрерывной интеграцией (continuous integration). Понимаю, каким образом должна быть организована работа для этого процесса. Знаю, какие инструменты для этого необходимы и имею опыт работы с ними (Jenkins, TeamCity, Bamboo). Постоянно пополняю коллекцию модульных тестов и постоянно использую их в работе. Имею опыт работы по этой практике, знаю как разбивать задачи на небольшие блоки','Знаком с практиками DevOps. Знаю, чем отличается CI и CD. Имею опыт работы по непрерывной поставке, знаю, какие ограничения это накладывает на процесс разработки и что нужно делать, чтобы избежать возможных проблем. Знаком и пременяю на практике особые подходы к рефакторингу базы данных с учетом CD',3);
INSERT INTO `competencies` VALUES (16,'ide','IDE','Понимаю, какие преимущества дает использование IDE для работы. Приходилось писать код в текстовом редакторе (с подсветкой синтаксиса)','Использую IDE для написания кода, навигации по файлам, поиска фрагментов кода по проекту. Использую подсказки по функциям и аргументам. Могу установить и настроить необходимые плагины','Использую IDE для навигации по классам и функциям, для рефакторинга и отладки кода (xdebug, node.js debug). Дорабатываю код, чтобы сделать подсказки по классам и методам верными. Использую персонализированные настройки по форматированию кода, поддерживаю единый стиль форматирования кода с их помощью','Использую IDE для проведения сложного рефакторинга, для работы с системой контроля версий, базой данных, профилировщиком. Стараюсь минимально использовать мышь, отлично знаю и использую управляющие комбинации клавиш. Использую средства быстрой генерации кода. Имею обширный опыт работы с несколькими IDE, отлично знаю их преимущества и недостатки. Текущую IDE выбирал для себя рационально по множеству критериев',3);
INSERT INTO `competencies` VALUES (17,'groupDevelopment','Коллективная разработка','Имею опыт работы в одиночку, либо в команде, в которой каждый программист работает над своим направлением самостоятельно. Как правило, конфликтов при слиянии изменений не происходит, так как направления не пересекаются друг с другом. Все задачи доступны из трекера','Имею опыт работы в кроссфункциональной команде. Часто приходилось пересекаться с задачами других, делать rebase и устранять конфликты. Понимаю важность общего домена знаний в разработке. Стараюсь рассказывать о своих наработках команде, задавать свои вопросы и отвечать на вопросы других. Приходилось совместно работать над одной задачей вместе с другим разработчиком. Знаю про парное программирование','Имею большой опыт работы по какой-либо гибкой методологии: scrum, kanban, lean. Понимаю необходимость каждого этапа и каждого ритуала в этих процессах. Знаю основные положения манифеста Agile и понимаю их суть. Имею опыт работы по каскадной модели. Глубоко понимаю преимущества и недостатки как каскадной методологии, так и гибких подходов','Имею опыт организации работы команды по гибким методологиям. Имею опыт построения процессов коллективной разработки. Имею опыт работы без менеджеров',4);
INSERT INTO `competencies` VALUES (18,'decisionMaking','Принятие решений','Приходилось работать в процессах, где обсуждения, на которых вырабатываются какие-то решения, проходят за закрытыми дверями','Обычно являюсь самым опытным разработчиком в коллективе и часто имею собственное мнение по разным вопросам. Считаю правильным его отстаивать даже когда у других коллег альтернативные взгляды','Обсуждая решения стараюсь приводить факты, на которых основываю свои рассуждения. Трачу достаточно большое количество усилий на поиск фактического материала. Часто бывает так, что в ходе подбора фактических данных моя точка зрения не подтверждается и я меняю ее в этом случае','Активно интересуюсь позицией других коллег, помогаю им выработать собственные решения предоставляя нужные данные и помощь в разных вопросах. Обычно высказываю свою точку зрения в случаях, когда ко мне обращаются непосредственно за ней. Могу менять свою точку зрения в ходе общения с другими людьми. Могу обозначить сильные и слабые стороны решений не вызвав стрессовую защитную реакцию',4);
INSERT INTO `competencies` VALUES (19,'learning','Обучение','Использую Google для поиска информации по конкретным вопросам, связанным с выполнением задач. Часто применяю решения, найденные в интернете подстраивая их под текущий код на проекте. Иногда читаю статьи по разработке','Знаю свои слабые стороны, что надо подтянуть. Читаю книги или обучаюсь на курсах, стараюсь всесторонне закрывать пробелы в знаниях. Читаю специализированную литературу по разработке','Делюсь с другими знаниями по тем областям, в которых чувствую себя уверено. Объясняю, показываю, даю информацию и ссылки. Пишу обучающие статьи или видео. Участвую в конференциях как слушатель','Пишу объемные статьи или доклады по сложным темам. Веду блог по разработке. Участвую в конференциях как докладчик. Уделяю много времени передаче знаний',4);
INSERT INTO `competencies` VALUES (20,'codeReview','Ревизия кода','Знаю, что некоторые считают ревизию кода важной. Бывает так, что при проведении ревизии не вчитываюсь в код и замечаний не имею','Стараюсь внимательно просматривать пулл-запросы. Критикую плохой код и указываю на явные и скрытые ошибки разработки. Критикую несоответствие стандартам','Уделяю значительное время ревизии кода. Стараюсь выражать замечания в продуктивной форме, чтобы не вызвать сопротивление или негативную реакцию автора. Предлагаю альтернативные способы реализации или способы устранить обнаруженные проблемы','Могу провести ревизию кода в больших задачах. Внимательно изучаю код не только по формальным признакам, но пытаюсь понять архитектурные задумки автора. Задаю вежливые уточняющие вопросы в ходе анализа. Могу предложить несколько альтернативных решений по обнаруженным проблемам',4);
INSERT INTO `competencies` VALUES (21,'deadlineAssessment','Оценка сроков','Стараюсь избегать оценок длительности задачи, так как оценить их очень сложно. Вопросы о сроках считаю некорректными','Могу назвать ориентировочный срок выполнения задачи, но часто не получается его выполнить. Даю оценку быстро, ориентируюсь на внутреннее чувство времени','Имею поправочный коэффициент (3.14159265359 или какой-то другой), на который умножаю свою оценку, чтобы получить более-менее точные данные. Поправочный коэффициент оценил из практики наблюдений за собственными оценками и реальными сроками исполнения задач','Различаю оценку времени выполнения и оценку сложности задачи. Даю оценку времени в зависимости от класса сложности задач. Применял на практике коллективные методы оценки сложности или времени выполнения задач (покер планирования, круговая оценка). Обычно даю оценку вилкой (минимальное и максимальное время) или по трем точкам (минимальное, максимальное и наиболее вероятное)',4);
INSERT INTO `competencies` VALUES (22,'projectSupport','Поддержка проектов','В основном работал с проектами с небольшим сроком жизни. Не приходилось поддерживать проекты дольше 1 года','Приходилось переписывать проекты с нуля и вводить их в боевую эксплуатацию. Знаком на практике с положительными и отрицательными сторонами подобного подхода','Знаю о пределе технической сложности проекта, за которым его уже нельзя переписать. Приходилось работать с подобными проектами. Имею большой опыт работы с техническим долгом и знаю как сделать так, чтобы он уменьшался, а не увеличивался. Умею не жалуясь заниматься рефакторингом плохого кода','Приходилось \"принимать\" в поддержку хрупкие комки грязи проекты с большим техническим долгом и стабилизировать процесс их разработки и развития. Из опыта знаю, что нужно сделать для того, чтобы принять систему и что делать, чтобы она не развалилась при доработках в дальнейшем. Умею сдержать процесс интенсивных доработок, чтобы стабилизировать проект',5);
INSERT INTO `competencies` VALUES (23,'openSource','Участие в проектах с открытым исходным кодом','Использую проекты с открытым кодом в своей работе. Иногда заглядываю в исходные тексты или в багтреккер. Исходный код не трогаю, доверяю профессионалам, написавшим его','Приходилось сталкиваться с багами различных проектов с открытым кодом и оформлять PRы и дожидаться их решения. Имею опыт переписки с мейтейнерами проектов по найденным багам: предоставлял сведения, способ воспроизведения и пр. Делал форки проектов для доработки функционала или исправления проблем','Участвовал в проекте с открытым кодом в качестве комиттера: решал обнаруженные баги или добавлял новый функционал. Делал пулл-запросы, проходил ревизию кода. Мои изменения вливались в master-ветку проекта. Сталкивался с плохим кодом в открытых проектах, исправлял его','У меня есть свои используемые проекты с открытым кодом. Я являюсь регулярным комиттером крупного проекта, иногда исправляю баги, обнаруженные другими людьми. Имею продолжительный опыт работы над большим open-source проектом',5);
INSERT INTO `competencies` VALUES (24,'foreignLanguages','Знание иностранных языков','Знаю родной язык. Ищу информацию на родном языке. Пользуюсь автоматическим переводчиком для чтения ресурсов на иностранном языке','Знаю английский язык на уровне, достаточном для чтения профессиональной литературы (Beginner, Elementary, Pre-Intermediate). Изучал иностранный язык в школе (возможно не английский)','Знаю английский на достаточном для полноценного письменного общения уровне (Intermediate, Upper-Intermediate). Могу понимать английскую речь в обычном темпе. Могу поддерживать (несколько скованно) разговор на бытовые и профессиональные темы. Имею опыт деловой и технической переписки на английском. Возможно, знаю дополнительные языки на базовом уровне понимания/чтения','Знаю английский язык на уровне свободного владения (Advanced, Proficiency). Могу без препятствий общаться как устно, так и письменно. Имею сертификаты TOEFL или IELTS',6);
INSERT INTO `competencies` VALUES (25,'insurance','Предметная область страхования','Знаком с областью страхования на бытовом уровне. Приходилось покупать страховые полисы. Знаю чем страхователь отличается от страховщика и застрахованного','Знаю базу страхования: риск, опции, страховая сумма, страховое покрытие, страховой случай, франшиза, страховая премия, ассистанс','Имею опыт работы в страховании. Знаю что такое бордеро, страховой тариф и чем условная франшиза отличается от безусловной. Изучал страхование целенаправлено','Долго работал в страховании, имею большой опыт в этой области. Знаю что такое суборгация, регресс, перестрахование, сострахование, нетто-ставка и брутто-ставка. Знаю чем занимаются андеррайтеры и актуарии. Иногда читаю специализированную литературу',6);
INSERT INTO `competencies` VALUES (26,'python','Технологии бэкенда (Python)','Ориентируюсь во встроенных типах python, знаю различия mutable-immutable типов. Понимаю динамическую типизацию. Знаю базовый синтаксис языка и инструкции управления потоком выполнения. Знаю синтаксис функций, понимаю видимость переменных (правило LEGB). Имею представление об итераторах и генераторах. Умею документировать код в соответствии с PEP8','Умею применять средства функционального программирования (map, filter, reduce). Умею применять анонимные (lambda) функции. Умею пользоваться инструкцией yield для генераторов. Понимаю и умею проектировать модули и включать их в проект. Понимаю повторную загрузку модуля, относительный импорт, сокрытие данных в модулях. Умею создавать и использовать классы. Знаю принципы простого наследования и переопределения методов. Умею делать наследование, композицию, делегирование для классов. Умею перегружать операторы. Имею представление о фабриках объектов. Знаю различия между классами «старого» и «нового» стиля. Умею создавать и использовать исключения. Умею создавать и использовать контекстные менеджеры. Умею использовать объекты unicode, bytes, bytearray. Умею формировать env-сборки утилитой pip. Умею пользоваться CLI отладчиком python','Умею создавать и пользоваться декораторами по отношению к функциям и классам. Умею пользоваться дескрипторами. Умею пользоваться множественным наследованием. Знаю разницу между разными вариантами python (cpython, ironpython, jpython, Stackless Python). Умею работать с веб-фреймворками (Django, Flask, Pyramid и т. п.). Умею работать с фреймворками GUI (PyQt, Tkinter, WxPython и т. п.)','Знаю о приёмах метапрограммирования. Имею навыки сетевого и асинхронного программирования. Имею навыки мультипроцессного и мультипоточного программирования. Умею работать со специализированными библиотеками (NumPy, SciPy, SQLAlchemy). Знаю, кто такой «Великодушный пожизненный диктатор»',2);
INSERT INTO `competencies` VALUES (27,'probabiltyBasics','Основы теории вероятности','Знаю, что такое размещения, перестановки и сочетания','Знаю, что такое биномиальные коэффициенты, математическое ожидание, дисперсия','Знаю, что такое условная вероятность, теорема Байеса','Знаю, что такое основные распределения (нормальное, биномиальное, Стьюдента, Пуассона, Трейси-Видома)',6);
INSERT INTO `competencies` VALUES (28,'handTesting','Ручное тестирование','Владею понятиями Тест-план, Тест-кейз, баг, эффект пестицида. Умею работать с багтрекером. Умею работать с функциональными требованиями. Знаю, что такое классы эквивалентности. Умею анализировать границы и формировать разбиения области тестирования','Знаю особенности и преимущества методики тестирования чёрным/белым/серым ящиком и их различия. Владею понятиями компонентного, системного, интеграционного тестирования. Знаю типы и виды тестирования (регрессионное, стресс, приёмочное). Умею строить тест-план, тест-кейзы. Умею тестировать юзабилити. Умею работать с причинно-следственными диаграммами и выполнять анализ модели состояния или переходов. Умею оценивать покрытие кода и требований тестами (покрытие функций, условий, решений)','Владею понятиями веб-сервер, веб-клиент. Знаю о типах запросов (POST, GET и другие) и умею строить такие запросы. Умею пользоваться средствами перехвата запросов (Fiddler). Знаю о различных протоколах, используемых в веб (HTTP, JSON, FTP, telnet, SMTP, POP)','Умею тестировать защищённость приложений на уровне веб. Владею понятиями SQL-инъекций, XSS (Cross Site Scripting). Умею выполнять нагрузочное тестирование (JMeter, HP Load Runner). Умею собирать динамическое покрытие кода тестами',7);
INSERT INTO `competencies` VALUES (29,'testAutomation','Автоматизация тестирования','Знаю какой-либо из языков программирования, применяемых при автоматизации (python, java, javascript, C#), умею пользоваться соответствующими IDE. Умею пользоваться рекордерами сценариев. Умею выполнять инспекцию кода. Имею понятие о тест-дизайне','Умею пользоваться средствами отладки в CLI и IDE. Умею использовать Selenium и/или надстройки (Appium, Winium, Windows Application Driver). Владею понятиями Data Driven Testing, Behaviour Driven Testing, Model Driven Testing, Keyword Driven Testing. Знаю какие-нибудь шаблоны проектирования тестов (functional, PageObjects)','Знаю фреймворк, используемый при автоматизации (TestNG, jUnit, proboscis, pytest). Умею пользоваться надстройками для автоматизации тестирования производительности (Locust). Знаю альтернативные API (Watir, Selenide, FluentSelenium)','Владею знаниями о распределённом тестировании, знаю о Selenium Server, Selenium Grid, облачных сервисах тестирования.',7);
INSERT INTO `competencies` VALUES (30,'pmDesign','Дизайн','Не умею рисовать, но умею дать совет дизайнеру, как лучше сделать тот или иной проект','Не умею рисовать и не лезу с советами, так как дизайнер лучше знает, как ему рисовать','Могу нарисовать самостоятельно','Могу нарисовать самостоятельно или рассказать, как нарисовать то, что мне нужно. Уровень дизайнера для меня не имеет значения, мы все равно получим высококлассную работу на выходе',9);
INSERT INTO `competencies` VALUES (31,'pmProgramming','Программирование','В школе или институте изучали программирование. Помню, что такое цикл и ветвление','Знаю, что такое HTML и CSS, могу собрать простую страничку','Могу писать самостоятельно на нескольких языках программирования','Могу написать код самостоятельно или объяснить другим, как это сделать. Могу продумать архитектуру проекта и выбрать стек технологий. Могу делать ревью кода',9);
INSERT INTO `competencies` VALUES (32,'pmTesting','Тестирование','Тестировать код должен программист, ему платят за код без багов','Всегда проверяю задачу самостоятельно перед тем как пометить ее выполненной','У нас есть тестировщик в команде, но за ним обязательно нужно перепроверять задачи','Умею организовать процесс тестирования таким образом, чтобы баги не попадали в продакшн. В процессе тестирования выявляются новые требования, которые существенно улучшают качество продукта',9);
INSERT INTO `competencies` VALUES (33,'pmJuridical','Юриспруденция','Знаю, что на любой проект должен быть договор, но его содержание мне не интересно, так как работа с договорами - задача другого отдела','Иногда читаю договоры, но ничего не понимаю. Любой договор сразу пересылаю начальнику','Считаю, что умею работать с договорами, но не люблю. Знаю, что договор должен закрываться актом, а оригинал храниться в бухгалтерии','Умею читать договоры и всегда их читаю. Считаю, что на своем проекте мне следует быть в курсе таких важных вещей. Обязательно консультируюсь с юристом по непонятным вопросам. Дружу с юристами компании',9);
INSERT INTO `competencies` VALUES (34,'pmAccounting','Бухгалтерия','Терпеть не могу бухгалтеров, они не дают мне работать','Считаю, что умею работать с договорами, но не люблю. Знаю, что договор должен закрываться актом и оригинал храниться в бухгалтерии','По всем вопросам консультируюсь с бухгалтером, он подскажет','Знаю, что такое акты, когда какие документы необходимо предоставить в бухгалтерию и сколько они должны храниться. Всегда имею копию сданных в бухгалтерию документов с датой, фамилией и подписью принявшего. Дружу с бухгалтерами компании',9);
INSERT INTO `competencies` VALUES (35,'pmSelfDiscipline','Личная дисциплина','Мои личные опоздания никак не влияют на проект','Могу заставить других не опаздывать, но не могу справиться с собой','Не опаздываю, но не могу повлиять на других людей','Делаю все вовремя и умею организовать других людей, чтобы они укладывались в срок',10);
INSERT INTO `competencies` VALUES (36,'pmResponsibility','Ответственность','Все по ТЗ','Отвечаю только за то, чтобы сделать в срок оговоренный продукт и уложиться в бюджет. Я не продуктолог, не маркетолог и не фиолетовый слоник','Считаю, что несу полную ответственность за весь проект. Умею делегировать задачи и следить за их выполнением. Пытаюсь улучшать качество продукта, но у меня не всегда это получается','Обладаю необходимыми навыками и использую их для того, чтобы сделать проект как можно более востребованным и качественным',10);
INSERT INTO `competencies` VALUES (37,'pmDecisions','Умение принимать решения','У меня мало опыта, поэтому следую методологии компании, а с решениями в сложных случаях помогает старший коллега','Мое дело предложить варианты и предупредить о последствиях, а решать должен клиент. В случае моей правоты обязательно напомнитю о сделанных предупреждениях :)','Вижу варианты решений и их последствия, могу аргументированно отстаивать свою точку зрения. Могу самостоятельно принимать решения','Вижу варианты решений и их последствия, могу аргументированно отстаивать свою точку зрения. Могу самостоятельно принимать решения.  Умею слушать других людей и могу изменить точку зрения, если вижу, что коллега предлагает что-то лучше',10);
INSERT INTO `competencies` VALUES (38,'pmNegotiation','Ведение переговоров','Это не моя работа, а отдела продаж','Пока только учусь и присутствую на встречах старших коллег','Провожу часть встреч самостоятельно, но на ключевые все же зову подкрепление','Могу продать снег зимой. Дорого',11);
INSERT INTO `competencies` VALUES (39,'pmMeetings','Ведение встреч','Слежу за тем, чтобы все вопросы были обсуждены','Слежу за состоянием участников встречи, модерирую дискуссию, при необходимости вношу предложения и аргументирую их. Слежу за тем, чтобы все вопросы были обсуждены и встреча не затянулась сверх возможного','Заранее договариваюсь о встрече. Высылаю всем участникам приглашение в календаре. Прихожу заранее и проверяю, что переговорная свободна, на столе нет грязных чашек, а ручки, листы и другие необходимые материалы есть в наличии. Заранее распечатываю необходимые материалы','Веду протокол встречи. После встречи составляю итоговое письмо и фиксирую все договоренности. ',11);
INSERT INTO `competencies` VALUES (40,'pmProcesses','Процессы','Самое сложное - это начало проекта и его конец','Знаю процессы разработки дизайна, программирования, тестирования и введения в эксплуатацию','Знаю, что есть группы процессов инициации, планирования, исполнения, контроля и закрытия проекта. Знаю, как эти процессы взаимодействуют. Знаю про жизненный цикл и фазы проекта. Работаю по PMBOK','Знаю, когда какие процессы необходимы, а какими можно пренебречь без большого риска или ущерба для качества',11);
INSERT INTO `competencies` VALUES (41,'pmContractors','Работа с подрядчиками','Имею негативный опыт работы с подрядчиками. Работаю только со штатной командой, которая формировалась мной самостоятельно','Умею выбирать подрядчиков, знаю все про обязанности и вознаграждение. Умею апеллировать к договору. Если подрядчик не сможет выполнить работу, то он не получит денег','Умею выбирать подрядчиков. Всегда добиваюсь результата','Не делаю большой разницы между внутренней командой и внешним подрядчиком, так как умею делегировать задачи и тем и другим. Умею слушать подрядчика, а не только требовать от него выполнения ТЗ. Поскольку имею опыт работы в роли подрядчика, то понимаю все страхи, риски и проблемы подрядчика. Умею находить компромисс. Сохраняю хорошие отношения со всеми, с кем работаю',11);
INSERT INTO `competencies` VALUES (42,'pmCommercialProposal','Формирование коммерческих предложений','Коммерческие предложения формирует отдел продаж без участия менеджера и команды','Коммерческий отдел консультируется со мной до того, как отдать предложение клиенту, но итоговую сумму и срок они формируют сами','Могу предсказать скорость работы команды и с командой оценить проект. Умею оформлять коммерческие предложения','Чувствую, сколько клиент готов заплатить за продукт',12);
INSERT INTO `competencies` VALUES (43,'pmPlanning','Планирование и управление','Составляю только дорожную карту на старте проекта для инвестора или клиента, чтобы продать проект. В дальнейшем не использую, изменений не вношу. Пишу приблизительное ТЗ, которое отдаю в работу','Умею составлять планы по управлению содержанием, расписанием, стоимостью. В дальнейшей работе придерживаюсь плана','Умею не только составлять планы, но и в дальнейшем их придерживаться или вносить изменения','Умею составлять планы по управлению содержанием, расписанием, стоимостью, качеством, человеческими ресурсами, коммуникациями, рисками, закупками, заинтересованными сторонами. Знаю, когда каждый план необходим, а когда без него можно обойтись',12);
INSERT INTO `competencies` VALUES (44,'pmTeamWork','Работа с командой','Работаю в фирме, где менеджер не решает с какой командой будет работать или самостоятельно собираю команду. Члены команды меняются раз в 1-3 месяца','Работаю в фирме, где менеджер не решает с какой командой будет работать. Замена членов команды происходит не чаще чем 0,5-1 год','Собираю свою команду. Замена членов команды происходит не чаще чем 0,5-1 год','Самостоятельно собираю команду. Более года работаю с одной и той же командой. За время моей работы никто из команды не ушел (нет текучки)',12);
INSERT INTO `competencies` VALUES (45,'pmProduct','Работа с продуктом','Считаю, что продукт - это ответственность продакт-менеджера','Вношу свои предложения на обсуждениях, но не принимаю решений','Принимаю активное участие в обсуждении продукта, умею аргументировать свое мнение. Принимаю решения по продукту','Принимаю активное участие в обсуждении продукта, умею аргументировать свое мнение. Принимаю решения по продукту. Любой свой проект не стесняюсь занести в резюме',12);
INSERT INTO `competencies` VALUES (46,'pmRisks','Управление рисками','Знаю, что для больших проектов составляется реестр рисков и проводятся дополнительные работы, но для моих небольших проектов этого не требуется','Умею составлять реестр рисков, умею оценивать риски, выбирать стратегию. Провожу все необходимые мероприятия на старте проекта, а затем забываю про риски, так как они все уже учтены и необходимо только следовать плану мероприятий по ослаблению рисков','Знаю все риски в своей области, уже автоматически принимаю меры по ослаблению большинства из них','Знаю, какие риски необходимо просто отслеживать, а для каких необходимы меры по ослаблению. Имею план мероприятий по снижению рисков и следую ему. Отслеживаю динамику и своевременно вношу изменения.  ',12);
INSERT INTO `competencies` VALUES (47,'pmIterations','Планирование итераций','Умею планировать итерации: оптимально набирать задачи на итерацию, оценивать их с командой','К первому дню итерации всегда готовы: дизайн, описание задач, все задачи оценены, все задачи просмотрены командой и все замечания команды учтены. Команда не простаивает между итерациями','Всегда учитываю риски и закладываю запас по времени. Умею управлять изменениями, вносить их в следующие итерации, а не в текущую. Провожу предварительную оценку проекта с командой в начале проекта','Уточняю предварительные оценки с командой после каждой итерации. Оцениваю с командой внесенные изменения после каждой итерации, если это не было сделано в течение итерации. Провожу ретро после каждой итерации. Провожу рефайнмент митинги в течение итерации. ',13);
INSERT INTO `competencies` VALUES (48,'pmTaskManager','Ведение задач в таск менеджере','Задачи устаревают быстрее, чем мы успеваем их вносить в ТМ','Когда мы начинаем делать задачу, то вносим ее в ТМ','У нас есть план по задачам на пару недель вперед','Для каждой задачи у нас есть:\n- проблема, которую хотим решить\n- описание, как мы планируем решить проблему\n- набор тестов для приемки задачи\n- оценка задачи\n- ответственный\n- затраченое время \nДля проекта в целом:\n- scope на весь проект\n- оценка всех задач проекта, которая может пересматриваться и уточняться после каждого спринта\n- предваритеное распределение задач по спринтам\n- статистика закрытых/добавленых задач в течение спринта',13);
INSERT INTO `competencies` VALUES (49,'pmTeamRelations','Отношения с командой','Ставлю задачи ребятам - они выполняют. Это самое важное','Знаю, кому какую задачу лучше поручить, сильные и слабые стороны каждого сотрудника','Знаю, кому какую задачу лучше поручить, сильные и слабые стороны каждого сотрудника, зачем ребята работают, что для каждого из них важно','Знаю все о своей команде: \n- зачем ребята работают, что для каждого из них важно\n- кто чем интересуется и в какую сторону хотел бы развиваться\n- кому какую задачу лучше поручить\n- сильные и слабые стороны каждого (свои в том числе)\nКаждый член команды мне доверяет и рассказывает о своих планах или проблемах. Я доверяю своей команде',13);
INSERT INTO `competencies` VALUES (50,'pmChanges','Внесение утвержденных изменений','Все изменения находятся у меня в голове','Все утвержденные изменения я фиксирую в письме после встречи, но не всегда заношу их в документы','После утверждения изменений я сразу их вношу в документы (задачи) и фиксирую это в общем письме (или сообщении в системе)','При необходимости организую юридическое оформление изменений (в виде дополнительных соглашений). Толерантно отношусь к изменениям и даже приветствую их',13);
INSERT INTO `competencies` VALUES (51,'pmAgileRituals','Итерации и ритуалы гибких методологий','Мы не проводим регулярных митингов, все общаются тогда, когда им удобно','Мы проводим: \n- ежедневные стендапы','Мы проводим: \n- ежедневные стендапы, \n- презентацию задач на старте спринта и оценку задач','Мы проводим: \n- ежедневные стендапы,\n- ретро после окончания спринта,\n- презентацию задач на старте спринта и оценку задач,\n- обсуждения дизайна в течение спринта,\n- фидбек митинги со стейкхолдерами',13);
INSERT INTO `competencies` VALUES (52,'pmProjectFinish','Закрытие проекта','Наша задача сделать проект, а закрывает его уже отдел продаж','При закрытии проекта необходимо: \n- сдать продукт заказчику (подписать акт, получить оплату)','При закрытии проекта необходимо: \n- сдать продукт заказчику (подписать акт, получить оплату),\n- получить обратную связь от заказчика и стейкхолдеров, \n- передать всю документацию заказчику, \n- провести финальный ретро митинг','При закрытии проекта необходимо:\n- сдать продукт заказчику (подписать акт, получить оплату),\n- получить обратную связь от заказчика и стейкхолдеров, \n- передать всю документацию заказчику, \n- провести финальный ретро митинг,\n- зафиксировать извлеченные уроки,\n- заархивировать документацию по проекту',14);
INSERT INTO `competencies` VALUES (53,'pmQuality','Управление качеством',NULL,NULL,NULL,NULL,13);
INSERT INTO `competencies` VALUES (54,'pmOrgManagement','Управление организацией',NULL,NULL,NULL,NULL,13);
INSERT INTO `competencies` VALUES (55,'pmProjectMethods','Методологии ведения проектов',NULL,NULL,NULL,NULL,13);
/*!40000 ALTER TABLE `competencies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `competencyProfession`
--

DROP TABLE IF EXISTS `competencyProfession`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `competencyProfession` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `competencyId` int(11) DEFAULT NULL,
  `professionId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `link` (`competencyId`,`professionId`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `competencyProfession`
--

LOCK TABLES `competencyProfession` WRITE;
/*!40000 ALTER TABLE `competencyProfession` DISABLE KEYS */;
INSERT INTO `competencyProfession` VALUES (1,1,1);
INSERT INTO `competencyProfession` VALUES (2,2,1);
INSERT INTO `competencyProfession` VALUES (3,3,1);
INSERT INTO `competencyProfession` VALUES (4,4,1);
INSERT INTO `competencyProfession` VALUES (5,5,1);
INSERT INTO `competencyProfession` VALUES (6,6,1);
INSERT INTO `competencyProfession` VALUES (29,6,2);
INSERT INTO `competencyProfession` VALUES (7,7,1);
INSERT INTO `competencyProfession` VALUES (30,7,2);
INSERT INTO `competencyProfession` VALUES (8,8,1);
INSERT INTO `competencyProfession` VALUES (9,9,1);
INSERT INTO `competencyProfession` VALUES (10,10,1);
INSERT INTO `competencyProfession` VALUES (11,11,1);
INSERT INTO `competencyProfession` VALUES (12,12,1);
INSERT INTO `competencyProfession` VALUES (13,13,1);
INSERT INTO `competencyProfession` VALUES (14,14,1);
INSERT INTO `competencyProfession` VALUES (31,14,2);
INSERT INTO `competencyProfession` VALUES (15,15,1);
INSERT INTO `competencyProfession` VALUES (16,16,1);
INSERT INTO `competencyProfession` VALUES (17,17,1);
INSERT INTO `competencyProfession` VALUES (18,18,1);
INSERT INTO `competencyProfession` VALUES (19,19,1);
INSERT INTO `competencyProfession` VALUES (20,20,1);
INSERT INTO `competencyProfession` VALUES (21,21,1);
INSERT INTO `competencyProfession` VALUES (22,22,1);
INSERT INTO `competencyProfession` VALUES (23,23,1);
INSERT INTO `competencyProfession` VALUES (24,24,1);
INSERT INTO `competencyProfession` VALUES (37,24,3);
INSERT INTO `competencyProfession` VALUES (56,26,2);
INSERT INTO `competencyProfession` VALUES (25,27,2);
INSERT INTO `competencyProfession` VALUES (26,28,2);
INSERT INTO `competencyProfession` VALUES (27,29,2);
INSERT INTO `competencyProfession` VALUES (32,30,3);
INSERT INTO `competencyProfession` VALUES (33,31,3);
INSERT INTO `competencyProfession` VALUES (34,32,3);
INSERT INTO `competencyProfession` VALUES (35,33,3);
INSERT INTO `competencyProfession` VALUES (36,34,3);
INSERT INTO `competencyProfession` VALUES (38,35,3);
INSERT INTO `competencyProfession` VALUES (39,36,3);
INSERT INTO `competencyProfession` VALUES (40,37,3);
INSERT INTO `competencyProfession` VALUES (41,38,3);
INSERT INTO `competencyProfession` VALUES (42,39,3);
INSERT INTO `competencyProfession` VALUES (43,40,3);
INSERT INTO `competencyProfession` VALUES (44,41,3);
INSERT INTO `competencyProfession` VALUES (45,42,3);
INSERT INTO `competencyProfession` VALUES (46,43,3);
INSERT INTO `competencyProfession` VALUES (47,44,3);
INSERT INTO `competencyProfession` VALUES (48,45,3);
INSERT INTO `competencyProfession` VALUES (49,46,3);
INSERT INTO `competencyProfession` VALUES (50,47,3);
INSERT INTO `competencyProfession` VALUES (51,48,3);
INSERT INTO `competencyProfession` VALUES (52,49,3);
INSERT INTO `competencyProfession` VALUES (53,50,3);
INSERT INTO `competencyProfession` VALUES (54,51,3);
INSERT INTO `competencyProfession` VALUES (55,52,3);
/*!40000 ALTER TABLE `competencyProfession` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courseCompetency`
--

DROP TABLE IF EXISTS `courseCompetency`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `courseCompetency` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `courseId` int(11) DEFAULT NULL,
  `competencyId` int(11) DEFAULT NULL,
  `startLevel` float(3,2) DEFAULT NULL,
  `increment` float(3,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `course` (`courseId`),
  KEY `competency` (`competencyId`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courseCompetency`
--

LOCK TABLES `courseCompetency` WRITE;
/*!40000 ALTER TABLE `courseCompetency` DISABLE KEYS */;
INSERT INTO `courseCompetency` VALUES (1,1,6,0.00,0.75);
INSERT INTO `courseCompetency` VALUES (2,2,6,0.50,2.50);
INSERT INTO `courseCompetency` VALUES (3,2,9,0.00,1.00);
INSERT INTO `courseCompetency` VALUES (4,2,10,0.00,2.25);
INSERT INTO `courseCompetency` VALUES (5,4,6,0.00,0.50);
INSERT INTO `courseCompetency` VALUES (6,5,6,1.00,2.75);
INSERT INTO `courseCompetency` VALUES (7,5,9,0.25,1.00);
INSERT INTO `courseCompetency` VALUES (8,5,10,0.50,2.75);
INSERT INTO `courseCompetency` VALUES (9,8,10,2.50,3.75);
INSERT INTO `courseCompetency` VALUES (10,6,11,0.00,1.50);
INSERT INTO `courseCompetency` VALUES (11,6,2,0.00,1.00);
INSERT INTO `courseCompetency` VALUES (12,6,7,0.00,2.25);
INSERT INTO `courseCompetency` VALUES (13,7,26,0.00,1.75);
INSERT INTO `courseCompetency` VALUES (14,7,8,0.00,1.50);
INSERT INTO `courseCompetency` VALUES (15,9,7,1.75,0.50);
INSERT INTO `courseCompetency` VALUES (16,9,11,1.75,0.50);
INSERT INTO `courseCompetency` VALUES (17,9,9,0.75,0.50);
INSERT INTO `courseCompetency` VALUES (18,9,4,0.00,1.75);
INSERT INTO `courseCompetency` VALUES (19,10,27,0.00,3.50);
INSERT INTO `courseCompetency` VALUES (20,11,26,0.00,2.50);
INSERT INTO `courseCompetency` VALUES (21,12,35,0.00,3.00);
INSERT INTO `courseCompetency` VALUES (22,12,36,0.00,3.00);
INSERT INTO `courseCompetency` VALUES (23,12,37,1.00,3.00);
INSERT INTO `courseCompetency` VALUES (24,12,38,0.00,0.50);
INSERT INTO `courseCompetency` VALUES (25,12,39,0.00,0.50);
INSERT INTO `courseCompetency` VALUES (26,12,43,0.00,3.00);
INSERT INTO `courseCompetency` VALUES (27,12,44,0.00,3.00);
INSERT INTO `courseCompetency` VALUES (28,12,49,0.00,3.00);
INSERT INTO `courseCompetency` VALUES (29,13,24,0.50,1.00);
INSERT INTO `courseCompetency` VALUES (30,14,40,0.00,0.50);
/*!40000 ALTER TABLE `courseCompetency` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `courses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `externalId` varchar(36) DEFAULT NULL,
  `eduProviderId` int(11) DEFAULT NULL,
  `code` varchar(45) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `url` text DEFAULT NULL,
  `price` float(10,2) DEFAULT NULL,
  `weeks` int(11) DEFAULT NULL,
  `lessons` int(11) DEFAULT NULL,
  `modeOfStudy` varchar(20) DEFAULT NULL,
  `courseForm` varchar(20) DEFAULT NULL,
  `schedule` varchar(20) DEFAULT NULL,
  `certificate` int(1) NOT NULL DEFAULT 0,
  `tasksType` varchar(20) DEFAULT NULL,
  `lengthDays` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code_UNIQUE` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (1,NULL,NULL,'netology-html-verstka','HTML-верстка: с нуля до первого макета',NULL,'https://netology.ru/programs/html-verstka',23900.00,6,16,NULL,NULL,NULL,0,NULL,0);
INSERT INTO `courses` VALUES (2,NULL,NULL,'netology-html-javascript','JavaScript в браузере: создаем интерактивные веб-страницы',NULL,'https://netology.ru/programs/html-javascript',20900.00,8,18,NULL,NULL,NULL,0,NULL,0);
INSERT INTO `courses` VALUES (3,NULL,NULL,'netology-adaptive-mobile-layout','Адаптивная и мобильная верстка',NULL,'https://netology.ru/programs/adaptive-mobile-layout',20900.00,4,10,NULL,NULL,NULL,0,NULL,0);
INSERT INTO `courses` VALUES (4,NULL,NULL,'netology-html-css-base','HTML и CSS с нуля',NULL,'https://netology.ru/programs/html-css-base',0.00,6,7,NULL,NULL,NULL,0,NULL,0);
INSERT INTO `courses` VALUES (5,NULL,NULL,'netology-javascript','JavaScript: основы и современныe возможности языка',NULL,'https://netology.ru/programs/javascript',20900.00,9,18,NULL,NULL,NULL,0,NULL,0);
INSERT INTO `courses` VALUES (6,NULL,NULL,'netology-php-sql','PHP/SQL: back-end разработка и базы данных',NULL,'https://netology.ru/programs/php-sql',20900.00,9,19,NULL,NULL,NULL,0,NULL,0);
INSERT INTO `courses` VALUES (7,NULL,NULL,'netology-python-base','Python: программирование на каждый день и сверхбыстрое прототипирование',NULL,'https://netology.ru/programs/python-base',20900.00,13,26,NULL,NULL,NULL,0,NULL,0);
INSERT INTO `courses` VALUES (8,NULL,NULL,'netology-react','Библиотека React: построй свою любовь к интерактивным веб-интерфейсам',NULL,'https://netology.ru/programs/react',20900.00,6,13,NULL,NULL,NULL,0,NULL,0);
INSERT INTO `courses` VALUES (9,NULL,NULL,'netology-node','Node, AngularJS и MongoDB: разработка полноценных веб-приложений',NULL,'https://netology.ru/programs/node',20900.00,10,20,NULL,NULL,NULL,0,NULL,0);
INSERT INTO `courses` VALUES (10,NULL,NULL,'stepic-probability','Теория вероятностей - наука о случайности',NULL,'https://stepik.org/course/2911',0.00,3,3,NULL,NULL,NULL,0,NULL,0);
INSERT INTO `courses` VALUES (11,NULL,NULL,'stepic-python','Программирование на Python',NULL,'https://stepik.org/course/67',0.00,7,7,NULL,NULL,NULL,0,NULL,0);
INSERT INTO `courses` VALUES (12,NULL,NULL,'otus-head-of-development','Руководитель разработки',NULL,'https://otus.ru/lessons/rukovoditel-razrabotki/',26000.00,4,32,NULL,NULL,NULL,0,NULL,0);
INSERT INTO `courses` VALUES (13,NULL,NULL,'geekbrains-it-english','Английский для IT-специалистов',NULL,'https://geekbrains.ru/courses/98',1098.00,2,10,NULL,NULL,NULL,0,NULL,0);
INSERT INTO `courses` VALUES (14,NULL,NULL,'stepic-pm-basics','Основы управления проектами',NULL,'https://stepik.org/course/2376',0.00,1,1,NULL,NULL,NULL,0,NULL,0);
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coursesRequirements`
--

DROP TABLE IF EXISTS `coursesRequirements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `coursesRequirements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `courseId` int(11) NOT NULL,
  `atomicSkillId` int(11) NOT NULL,
  `level` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `courseId` (`courseId`),
  KEY `atomicSkillId` (`atomicSkillId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coursesRequirements`
--

LOCK TABLES `coursesRequirements` WRITE;
/*!40000 ALTER TABLE `coursesRequirements` DISABLE KEYS */;
/*!40000 ALTER TABLE `coursesRequirements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coursesSkills`
--

DROP TABLE IF EXISTS `coursesSkills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `coursesSkills` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `courseId` int(11) NOT NULL,
  `atomicSkillId` int(11) NOT NULL,
  `level` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `courseId` (`courseId`),
  KEY `atomicSkillId` (`atomicSkillId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coursesSkills`
--

LOCK TABLES `coursesSkills` WRITE;
/*!40000 ALTER TABLE `coursesSkills` DISABLE KEYS */;
/*!40000 ALTER TABLE `coursesSkills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eduProviders`
--

DROP TABLE IF EXISTS `eduProviders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `eduProviders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(25) DEFAULT NULL,
  `name` varchar(150) DEFAULT NULL,
  `url` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eduProviders`
--

LOCK TABLES `eduProviders` WRITE;
/*!40000 ALTER TABLE `eduProviders` DISABLE KEYS */;
INSERT INTO `eduProviders` VALUES (1,'stepik','Stepik','http://welcome.stepik.org/ru');
INSERT INTO `eduProviders` VALUES (2,'netology','Нетология','https://netology.ru/');
INSERT INTO `eduProviders` VALUES (3,'otus','Otus','https://otus.ru/');
INSERT INTO `eduProviders` VALUES (4,'hexlet','Hexlet','https://ru.hexlet.io/');
INSERT INTO `eduProviders` VALUES (5,'coursera','Coursera','https://www.coursera.org/');
INSERT INTO `eduProviders` VALUES (6,'udemy','Udemy','https://www.udemy.com/');
INSERT INTO `eduProviders` VALUES (7,'geekbrains','GeekBrains','https://geekbrains.ru/');
INSERT INTO `eduProviders` VALUES (8,'moscoding','Moscow Coding School','https://moscoding.ru/');
INSERT INTO `eduProviders` VALUES (9,'intuit','Intuit','http://www.intuit.ru/');
INSERT INTO `eduProviders` VALUES (10,'htmlacademy','HtmlAcademy','https://htmlacademy.ru/');
INSERT INTO `eduProviders` VALUES (11,'lektorium','Лекториум','https://www.lektorium.tv/');
INSERT INTO `eduProviders` VALUES (12,'openedu','Открытое образование','https://openedu.ru/');
INSERT INTO `eduProviders` VALUES (13,'javarush','JavaRush','https://javarush.ru/');
INSERT INTO `eduProviders` VALUES (14,'newprolab','New Professions Lab','http://newprolab.com/ru/');
INSERT INTO `eduProviders` VALUES (15,'tceh','#tceh','http://tceh.com/edu/');
INSERT INTO `eduProviders` VALUES (16,'skillfactory','SkillFactory','http://skillfactory.ru/');
/*!40000 ALTER TABLE `eduProviders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pollResults`
--

DROP TABLE IF EXISTS `pollResults`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pollResults` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pollId` int(11) DEFAULT NULL,
  `competencyId` int(11) DEFAULT NULL,
  `grade` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pollId` (`pollId`),
  KEY `competencyId` (`competencyId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pollResults`
--

LOCK TABLES `pollResults` WRITE;
/*!40000 ALTER TABLE `pollResults` DISABLE KEYS */;
/*!40000 ALTER TABLE `pollResults` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `polls`
--

DROP TABLE IF EXISTS `polls`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `polls` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` datetime DEFAULT NULL,
  `professionId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `sessionId` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `professionId` (`professionId`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `polls`
--

LOCK TABLES `polls` WRITE;
/*!40000 ALTER TABLE `polls` DISABLE KEYS */;
/*!40000 ALTER TABLE `polls` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `professions`
--

DROP TABLE IF EXISTS `professions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `professions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(45) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code_UNIQUE` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `professions`
--

LOCK TABLES `professions` WRITE;
/*!40000 ALTER TABLE `professions` DISABLE KEYS */;
INSERT INTO `professions` VALUES (1,'webDeveloper','Веб-разработчик (PHP)');
INSERT INTO `professions` VALUES (2,'tester','Тестировщик (Python)');
INSERT INTO `professions` VALUES (3,'webProjectManager','Менеджер web-проектов');
/*!40000 ALTER TABLE `professions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dateRegistered` timestamp NOT NULL DEFAULT current_timestamp(),
  `name` varchar(45) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `remindMonths` int(11) DEFAULT NULL,
  `subscribe` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'2017-12-18 11:45:36',NULL,'ap@mailinator.com',NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-03-15 20:10:22
