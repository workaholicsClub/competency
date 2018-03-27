<?php

use Competencies\Course\CourseRequirementEntity;
use Competencies\Course\CourseSkillEntity;
use Competencies\Mocks\Database;
use Competencies\Skill\Skill;
use Competencies\Skill\SkillEntity;
use PHPUnit\Framework\TestCase;

class SkillTest extends TestCase
{
    public function testFromArray() {
        $expectedProps = [
            'id'          => '1',
            'text'        => 'Базовые алгоритмы',
            'description' => 'Линейный поиск, сортировка и бинарный поиск, обход многомерного массива',
            'level'       => Skill::LEVEL_KNOWLEDGE,
        ];

        $skill = Skill::fromArray($expectedProps);

        $this->assertEquals($expectedProps['id'], $skill->getId());
        $this->assertEquals($expectedProps['text'], $skill->getText());
        $this->assertEquals($expectedProps['description'], $skill->getDescription());
        $this->assertEquals($expectedProps['level'], $skill->getLevel());

        $particialProps = [
            'id'          => '1',
            'description' => 'Линейный поиск, сортировка и бинарный поиск, обход многомерного массива',
        ];

        $skill = Skill::fromArray($particialProps);

        $this->assertEquals($expectedProps['id'], $skill->getId());
        $this->assertEmpty($skill->getText());
        $this->assertEquals($expectedProps['description'], $skill->getDescription());
        $this->assertEquals(Skill::LEVEL_NONE, $skill->getLevel());

        $skill = Skill::makeEmpty();

        $this->assertEmpty($skill->getId());
        $this->assertEmpty($skill->getText());
        $this->assertEmpty($skill->getDescription());
        $this->assertEquals(Skill::LEVEL_NONE, $skill->getLevel());
    }

    public function testFromEntity() {
        $testSkillId = 354;

        $expectedProps = [
            'id'          => '354',
            'text'        => 'Базовый синтаксис языка',
            'description' => 'И инструкции управления потоком выполнения',
            'level'       => Skill::LEVEL_NONE,
        ];

        $locator = Database::getTest();
        $mapper = $locator->mapper(SkillEntity::class);
        /**
         * @var SkillEntity $skillEntity
         */
        $skillEntity = $mapper->first(['id' => $testSkillId]);
        $skill = Skill::fromEntity($skillEntity);

        $this->assertEquals($expectedProps['id'], $skill->getId());
        $this->assertEquals($expectedProps['text'], $skill->getText());
        $this->assertEquals($expectedProps['description'], $skill->getDescription());
        $this->assertEquals($expectedProps['level'], $skill->getLevel());
    }

    public function testFromLinkEntity() {
        $skillLinkId = 26;
        $requirementLinkId = 30;

        $expectedSkill = [
            'id'          => '82',
            'text'        => 'RESTful веб-службы',
            'description' => '',
            'level'       => 'knowledge',
        ];

        $expectedRequirement = [
            'id'          => '210',
            'text'        => 'Консоль',
            'description' => '',
            'level'       => 'skill',
        ];

        $locator = Database::getTest();
        /**
         * @var CourseSkillEntity $skillLinkEntity
         */
        $skillLinkEntity = $locator->mapper(CourseSkillEntity::class)->first(['id' => $skillLinkId]);
        /**
         * @var CourseRequirementEntity $requirementLinkEntity
         */
        $requirementLinkEntity = $locator->mapper(CourseRequirementEntity::class)->first(['id' => $requirementLinkId]);

        $skill = Skill::fromLinkEntity($skillLinkEntity);
        $requirement = Skill::fromLinkEntity($requirementLinkEntity);

        $this->assertEquals($expectedSkill['id'], $skill->getId());
        $this->assertEquals($expectedSkill['text'], $skill->getText());
        $this->assertEquals($expectedSkill['description'], $skill->getDescription());
        $this->assertEquals($expectedSkill['level'], $skill->getLevel());

        $this->assertEquals($expectedRequirement['id'], $requirement->getId());
        $this->assertEquals($expectedRequirement['text'], $requirement->getText());
        $this->assertEquals($expectedRequirement['description'], $requirement->getDescription());
        $this->assertEquals($expectedRequirement['level'], $requirement->getLevel());
    }

    public function testSetState() {
        $expectedProps = [
            'id'          => '1',
            'text'        => 'Базовые алгоритмы',
            'description' => 'Линейный поиск, сортировка и бинарный поиск, обход многомерного массива',
            'level'       => Skill::LEVEL_KNOWLEDGE,
        ];

        $skill = Skill::__set_state($expectedProps);

        $this->assertEquals($expectedProps['id'], $skill->getId());
        $this->assertEquals($expectedProps['text'], $skill->getText());
        $this->assertEquals($expectedProps['description'], $skill->getDescription());
        $this->assertEquals($expectedProps['level'], $skill->getLevel());
    }

    public function testGettersSetters() {
        $expectedProps = [
            'id'          => '1',
            'text'        => 'Базовые алгоритмы',
            'description' => 'Линейный поиск, сортировка и бинарный поиск, обход многомерного массива',
            'level'       => Skill::LEVEL_KNOWLEDGE,
        ];

        $skill = Skill::makeEmpty();

        $skill->setId($expectedProps['id']);
        $skill->setText($expectedProps['text']);
        $skill->setDescription($expectedProps['description']);
        $skill->setLevel($expectedProps['level']);

        $this->assertEquals($expectedProps['id'], $skill->getId());
        $this->assertEquals($expectedProps['text'], $skill->getText());
        $this->assertEquals($expectedProps['description'], $skill->getDescription());
        $this->assertEquals($expectedProps['level'], $skill->getLevel());
    }

    public function testGetLevelEnum() {
        $this->assertEquals(["none", "knowledge", "skill", "ability"], Skill::getLevelsEnum());
        $this->assertEquals(["none", "knowledge", "skill", "ability"], Skill::getLevelsEnum(Skill::LEVEL_NONE));
        $this->assertEquals(["knowledge", "skill", "ability"], Skill::getLevelsEnum(Skill::LEVEL_KNOWLEDGE));
        $this->assertEquals(["knowledge", "skill", "ability"], Skill::getLevelsEnum(Skill::LEVEL_KNOWLEDGE, Skill::LEVEL_ABILITY));
        $this->assertEquals(["knowledge", "skill"], Skill::getLevelsEnum(Skill::LEVEL_KNOWLEDGE, Skill::LEVEL_SKILL));
        $this->assertEquals(["skill"], Skill::getLevelsEnum(Skill::LEVEL_SKILL, Skill::LEVEL_SKILL));
        $this->assertEquals([], Skill::getLevelsEnum(Skill::LEVEL_ABILITY, Skill::LEVEL_NONE));
    }

    public function testSkillCompare() {
        $skill = Skill::fromArray([
            'level'       => Skill::LEVEL_SKILL,
        ]);

        $this->assertTrue( $skill->isLevelGreaterOrEquals(Skill::LEVEL_KNOWLEDGE) );
        $this->assertTrue( $skill->isLevelLessOrEquals(Skill::LEVEL_ABILITY) );
        $this->assertTrue( $skill->isLevelGreaterOrEquals(Skill::LEVEL_SKILL) );
        $this->assertTrue( $skill->isLevelLessOrEquals(Skill::LEVEL_SKILL) );

        $this->assertFalse( $skill->isLevelGreaterOrEquals(Skill::LEVEL_ABILITY) );
        $this->assertFalse( $skill->isLevelLessOrEquals(Skill::LEVEL_KNOWLEDGE) );
    }

    public function testToArray() {
        $expectedProps = [
            'id'          => '1',
            'text'        => 'Базовые алгоритмы',
            'description' => 'Линейный поиск, сортировка и бинарный поиск, обход многомерного массива',
            'level'       => Skill::LEVEL_KNOWLEDGE,
        ];

        $skill = Skill::fromArray($expectedProps);

        $this->assertEquals($expectedProps, $skill->toArray());
    }
}