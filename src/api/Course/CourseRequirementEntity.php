<?php

namespace Competencies\Course;

use Spot\Entity;

class CourseRequirementEntity extends Entity
{
    protected static $table = 'coursesRequirements';

    public static function fields() {
        return [
            'id'            => ['type' => 'integer', 'primary' => true, 'autoincrement' => true],
            'courseId'      => ['type' => 'integer', 'required' => true],
            'atomicSkillId' => ['type' => 'integer', 'required' => true],
            'level'         => ['type' => 'string'],
        ];
    }
}