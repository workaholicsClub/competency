<?php

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
}