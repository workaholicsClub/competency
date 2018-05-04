<?php

namespace Competencies\Course;

use Spot\Entity;

class CourseVisitEntity extends Entity
{
    protected static $table = 'courseVisits';

    public static function fields() {
        return [
            'id'          => ['type' => 'integer', 'primary' => true, 'autoincrement' => true],
            'dateVisited' => ['type' => 'datetime', 'value' => new \DateTime()],
            'courseId'    => ['type' => 'integer', 'required' => true],
            'userId'      => ['type' => 'integer', 'required' => true],
            'sessionId'   => ['type' => 'integer', 'required' => true],
        ];
    }
}