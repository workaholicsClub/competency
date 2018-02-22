<?php

namespace Competencies\Skill;

use Competencies\Competency\CompetencyEntity;
use Spot\Entity;
use Spot\EntityInterface;
use Spot\MapperInterface;

class SkillEntity extends Entity
{
    protected static $table = 'atomicSkills';

    public static function fields() {
        return [
            'id'                    => ['type' => 'integer', 'primary' => true, 'autoincrement' => true],
            'text'                  => ['type' => 'string'],
            'additionalDescription' => ['type' => 'string'],
            'competencyId'          => ['type' => 'integer'],
        ];
    }

    public static function relations(MapperInterface $mapper, EntityInterface $entity) {
        return [
            'competency' => $mapper->belongsTo($entity, CompetencyEntity::class, 'competencyId'),
        ];
    }
}