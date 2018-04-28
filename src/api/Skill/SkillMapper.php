<?php

namespace Competencies\Skill;

use Spot\Mapper;

class SkillMapper extends Mapper
{
    /**
     * @param $skillHash
     * @return Skill[]
     */
    public function makeSkillArrayFromHash($skillHash) {
        $skills = [];
        foreach ($skillHash as $skillId => $skillLevel) {
            /**
             * @var SkillEntity $skillEntity
             */
            $skillEntity = $this->first(['id' => $skillId]);
            $skill = Skill::fromEntity($skillEntity);
            $skill->setLevel($skillLevel);
            $skills[] = $skill;
        }

        return $skills;
    }
}