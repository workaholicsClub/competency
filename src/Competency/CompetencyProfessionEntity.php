<?php

namespace Competencies\Competency;

use Spot\Entity;

class CompetencyProfessionEntity extends Entity
{
    protected static $table = 'competencyProfession';

    public static function fields() {
        return [
            'id'           => ['type' => 'integer', 'primary' => true, 'autoincrement' => true],
            'competencyId' => ['type' => 'integer', 'required' => true],
            'professionId' => ['type' => 'integer', 'required' => true],
        ];
    }
}