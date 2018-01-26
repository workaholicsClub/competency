<?php
namespace Competencies\Course;

use Competencies\Competency\CompetencyEntity;
use Spot\Entity;
use Spot\EntityInterface;
use Spot\MapperInterface;

class CourseEntity extends Entity
{
    protected static $table = 'courses';

    public static function fields() {
        return [
            'id'                => ['type' => 'integer', 'primary' => true, 'autoincrement' => true],
            'code'              => ['type' => 'string', 'required' => true],
            'name'              => ['type' => 'string', 'required' => true],
            'url'               => ['type' => 'string'],
            'price'             => ['type' => 'float'],
            'weeks'             => ['type' => 'integer'],
            'lessons'           => ['type' => 'integer'],
        ];
    }

    public static function relations(MapperInterface $mapper, EntityInterface $entity) {
        return [
            'competencies' => $mapper->hasManyThrough($entity, CompetencyEntity::class,
                CourseCompetencyEntity::class, 'competencyId', 'courseId'),
        ];
    }
}