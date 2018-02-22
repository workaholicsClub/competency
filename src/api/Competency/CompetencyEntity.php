<?php

namespace Competencies\Competency;

use Competencies\Skill\SkillEntity;
use Spot\Entity;
use Spot\EntityInterface;
use Spot\MapperInterface;

class CompetencyEntity extends Entity
{
    protected static $table = 'competencies';

    public static function fields() {
        return [
            'id'                => ['type' => 'integer', 'primary' => true, 'autoincrement' => true],
            'code'              => ['type' => 'string', 'required' => true],
            'name'              => ['type' => 'string', 'required' => true],
            'level1'            => ['type' => 'string'],
            'level2'            => ['type' => 'string'],
            'level3'            => ['type' => 'string'],
            'level4'            => ['type' => 'string'],
            'competencyGroupId' => ['type' => 'integer'],
        ];
    }

    public static function relations(MapperInterface $mapper, EntityInterface $entity) {
        return [
            'group'       => $mapper->belongsTo($entity, CompetencyGroupEntity::class, 'competencyGroupId'),
            'skills'      => $mapper->hasMany($entity, SkillEntity::class, 'competencyId'),
            'professions' => $mapper->hasManyThrough($entity, ProfessionEntity::class,
                CompetencyProfessionEntity::class, 'professionId', 'competencyId'),
        ];
    }
}