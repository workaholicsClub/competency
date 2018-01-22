<?php

namespace Competencies\User;

use Spot\Entity;

class UserEntity extends Entity
{
    protected static $table = 'users';

    public static function fields() {
        return [
            'id'             => ['type' => 'integer', 'primary' => true, 'autoincrement' => true],
            'dateRegistered' => ['type' => 'datetime', 'value' => new \DateTime()],
            'name'           => ['type' => 'string'],
            'email'          => ['type' => 'string', 'required' => true],
        ];
    }
}