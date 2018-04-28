<?php

use Competencies\Mocks\Database;
use Competencies\Skill\SkillEntity;
use Competencies\Skill\SkillMapper;

class SkillMapperTest extends \PHPUnit\Framework\TestCase
{
    public function testMakeSkillArrayFromHash() {
        $skillHash = [
            '208' => 'skill',
            '209' => 'knowledge',
            '210' => 'ability',
        ];

        $locator = Database::getTest();

        /**
         * @var SkillMapper $mapper
         */
        $mapper = $locator->mapper(SkillEntity::class);
        $skills = $mapper->makeSkillArrayFromHash($skillHash);

        $receivedSkillHash = [];
        foreach ($skills as $skill) {
            $receivedSkillHash[$skill->getId()] = $skill->getLevel();
        }

        $this->assertEquals($skillHash, $receivedSkillHash);
    }
}