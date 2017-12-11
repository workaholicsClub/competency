<?php

namespace Competencies\Entity;

class UserEntity extends \Spot\Entity
{
    protected static $table = 'users';

    public static function fields()
    {
        return [
            'id'             => ['type' => 'integer', 'primary' => true, 'autoincrement' => true],
            'dateRegistered' => ['type' => 'datetime', 'value' => new \DateTime()],
            'name'           => ['type' => 'string'],
            'email'          => ['type' => 'string', 'required' => true],
        ];
    }
}