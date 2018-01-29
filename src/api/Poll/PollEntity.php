<?php
namespace Competencies\Poll;

use Spot\Entity;

class PollEntity extends Entity
{
    protected static $table = 'polls';

    public static function fields() {
        return [
            'id'           => ['type' => 'integer', 'primary' => true, 'autoincrement' => true],
            'date'         => ['type' => 'datetime', 'value' => new \DateTime()],
            'professionId' => ['type' => 'integer'],
            'userId'       => ['type' => 'integer', 'required' => true],
        ];
    }
}