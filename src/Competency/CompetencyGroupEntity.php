<?php

namespace Competencies\Competency;

use Spot\Entity;

class CompetencyGroupEntity extends Entity
{
    protected static $table = 'compentencyGroups';

    public static function fields() {
        return [
            'id'                => ['type' => 'integer', 'primary' => true, 'autoincrement' => true],
            'code'              => ['type' => 'string', 'required' => true],
            'name'              => ['type' => 'string', 'required' => true],
        ];
    }
}