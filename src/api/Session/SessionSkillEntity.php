<?php

namespace Competencies\Session;

use Competencies\Skill\SkillEntity;
use Spot\Entity;
use Spot\EntityInterface;
use Spot\MapperInterface;

class SessionSkillEntity extends Entity
{
    protected static $table = 'sessionsSkills';

    public static function fields() {
        return [
            'id'            => ['type' => 'integer', 'primary' => true, 'autoincrement' => true],
            'sessionId'     => ['type' => 'integer', 'required' => true],
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