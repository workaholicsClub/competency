<?php
namespace Competencies\EduProvider;

use Competencies\Course\CourseEntity;
use Spot\Entity;
use Spot\EntityInterface;
use Spot\MapperInterface;

class EduProviderEntity extends Entity
{
    protected static $table = 'eduProviders';
    protected static $mapper = EduProviderMapper::class;

    public static function fields() {
        return [
            'id'   => ['type' => 'integer', 'primary' => true, 'autoincrement' => true],
            'code' => ['type' => 'string', 'required' => true],
            'name' => ['type' => 'string', 'required' => true],
            'url'  => ['type' => 'string'],
        ];
    }

    public static function relations(MapperInterface $mapper, EntityInterface $entity) {
        return [
            'courses' => $mapper->hasMany($entity, CourseEntity::class, 'eduProviderId'),
        ];
    }
}