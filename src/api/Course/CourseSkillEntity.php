<?php

namespace Competencies\Course;

use Competencies\Skill\SkillEntity;
use Spot\Entity;
use Spot\EntityInterface;
use Spot\MapperInterface;

class CourseSkillEntity extends Entity
{
    protected static $table = 'coursesSkills';

    public static function fields() {
        return [
            'id'            => ['type' => 'integer', 'primary' => true, 'autoincrement' => true],
            'courseId'      => ['type' => 'integer', 'required' => true],
            'atomicSkillId' => ['type' => 'integer', 'required' => true],
            'level'         => ['type' => 'string'],
        ];
    }

    public static function relations(MapperInterface $mapper, EntityInterface $entity) {
        return [
            'skill' => $mapper->belongsTo($entity, SkillEntity::class, 'atomicSkillId'),
        ];
    }
}