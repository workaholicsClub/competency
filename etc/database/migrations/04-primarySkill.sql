ALTER TABLE `links_skills_professions`
    ADD COLUMN `isPrimary` INT(1) UNSIGNED NOT NULL DEFAULT 0 AFTER `professionId`;

UPDATE `links_skills_professions` SET `isPrimary`='1' WHERE `id`='876';
UPDATE `links_skills_professions` SET `isPrimary`='1' WHERE `id`='917';
UPDATE `links_skills_professions` SET `isPrimary`='1' WHERE `id`='644';
UPDATE `links_skills_professions` SET `isPrimary`='1' WHERE `id`='727';
UPDATE `links_skills_professions` SET `isPrimary`='1' WHERE `id`='1028';
UPDATE `links_skills_professions` SET `isPrimary`='1' WHERE `id`='852';
UPDATE `links_skills_professions` SET `isPrimary`='1' WHERE `id`='720';
UPDATE `links_skills_professions` SET `isPrimary`='1' WHERE `id`='762';
UPDATE `links_skills_professions` SET `isPrimary`='1' WHERE `id`='426';
UPDATE `links_skills_professions` SET `isPrimary`='1' WHERE `id`='9';

