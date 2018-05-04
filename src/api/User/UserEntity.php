<?php

namespace Competencies\User;

use Spot\Entity;

class UserEntity extends Entity
{
    protected static $table = 'users';
    protected static $mapper = UserMapper::class;

    public static function fields() {
        return [
            'id'             => ['type' => 'integer', 'primary' => true, 'autoincrement' => true],
            'uuid'           => ['type' => 'string'],
            'dateRegistered' => ['type' => 'datetime', 'value' => new \DateTime()],
            'name'           => ['type' => 'string'],
            'email'          => ['type' => 'string'],
            'remindMonths'   => ['type' => 'integer'],
            'subscribe'      => ['type' => 'string'],
        ];
    }
}