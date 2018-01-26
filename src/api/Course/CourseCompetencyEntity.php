<?php

namespace Competencies\Course;

use Spot\Entity;

class CourseCompetencyEntity extends Entity
{
    protected static $table = 'competencyProfession';

    public static function fields() {
        return [
            'id'           => ['type' => 'integer', 'primary' => true, 'autoincrement' => true],
            'courseId'     => ['type' => 'integer', 'required' => true],
            'competencyId' => ['type' => 'integer', 'required' => true],
            'startLevel'   => ['type' => 'float'],
            'increment'    => ['type' => 'float'],
        ];
    }
}