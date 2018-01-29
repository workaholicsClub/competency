<?php
namespace Competencies\Poll;

use Spot\Entity;

class PollResultEntity extends Entity
{
    protected static $table = 'pollResults';

    public static function fields() {
        return [
            'id'           => ['type' => 'integer', 'primary' => true, 'autoincrement' => true],
            'grade'        => ['type' => 'float'],
            'pollId'       => ['type' => 'integer', 'required' => true],
            'competencyId' => ['type' => 'integer', 'required' => true],
        ];
    }
}