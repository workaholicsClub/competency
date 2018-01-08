<?php

namespace Competencies\Competency;

use Spot\Entity;

class ProfessionEntity extends Entity
{
    protected static $table = 'professions';

    public static function fields() {
        return [
            'id'                => ['type' => 'integer', 'primary' => true, 'autoincrement' => true],
            'code'              => ['type' => 'string', 'required' => true],
            'name'              => ['type' => 'string', 'required' => true],
        ];
    }
}