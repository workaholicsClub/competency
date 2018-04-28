<?php
namespace Competencies\Session;

use Competencies\Skill\SkillEntity;
use Competencies\User\UserEntity;
use Spot\Entity;
use Spot\EntityInterface;
use Spot\MapperInterface;

class SessionEntity extends Entity
{
    protected static $table = 'sessions';
    protected static $mapper = SessionMapper::class;

    public static function fields() {
        return [
            'id'          => ['type' => 'integer', 'primary' => true, 'autoincrement' => true],
            'uuid'        => ['type' => 'string'],
            'dateCreated' => ['type' => 'datetime', 'value' => new \DateTime()],
            'userId'      => ['type' => 'integer'],
        ];
    }

    public static function relations(MapperInterface $mapper, EntityInterface $entity) {
        return [
            'user'       => $mapper->BelongsTo($entity, UserEntity::class, 'userId'),
            'skillLinks' => $mapper->hasMany($entity, SessionSkillEntity::class, 'sessionId'),
            'skills'     => $mapper->hasManyThrough($entity, SkillEntity::class,
                SessionSkillEntity::class, 'atomicSkillId', 'sessionId'),
        ];
    }
}