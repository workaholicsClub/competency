<?php
namespace Competencies\Course;

use Competencies\Competency\CompetencyEntity;
use Competencies\Skill\SkillEntity;
use Spot\Entity;
use Spot\EntityInterface;
use Spot\MapperInterface;

class CourseEntity extends Entity
{
    protected static $table = 'courses';
    protected static $mapper = CourseMapper::class;

    public static function fields() {
        return [
            'id'            => ['type' => 'integer', 'primary' => true, 'autoincrement' => true],
            'externalId'    => ['type' => 'string'],
            'eduProviderId' => ['type' => 'integer'],
            'code'          => ['type' => 'string', 'required' => true],
            'name'          => ['type' => 'string', 'required' => true],
            'description'   => ['type' => 'string'],
            'url'           => ['type' => 'string'],
            'price'         => ['type' => 'float'],
            'weeks'         => ['type' => 'integer'],
            'lessons'       => ['type' => 'integer'],
            'modeOfStudy'   => ['type' => 'string'],
            'courseForm'    => ['type' => 'string'],
            'schedule'      => ['type' => 'string'],
            'certificate'   => ['type' => 'integer'],
            'tasksType'     => ['type' => 'string'],
            'lengthDays'    => ['type' => 'integer'],
        ];
    }

    public static function relations(MapperInterface $mapper, EntityInterface $entity) {
        return [
            'competencies' => $mapper->hasManyThrough($entity, CompetencyEntity::class,
                CourseCompetencyEntity::class, 'competencyId', 'courseId'),
            'skillLinks' => $mapper->hasMany($entity, CourseSkillEntity::class, 'courseId'),
            'skills' => $mapper->hasManyThrough($entity, SkillEntity::class,
                CourseSkillEntity::class, 'atomicSkillId', 'courseId'),
            'requirementLinks' => $mapper->hasMany($entity, CourseRequirementEntity::class, 'courseId'),
            'requirements' => $mapper->hasManyThrough($entity, SkillEntity::class,
                CourseRequirementEntity::class, 'atomicSkillId', 'courseId'),
        ];
    }
}