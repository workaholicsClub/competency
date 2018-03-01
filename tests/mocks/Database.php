<?php

namespace Competencies\Mocks;

use Spot\Config;
use Spot\Locator;

class Database
{
    /**
     * @return Locator
     * @throws \Spot\Exception
     */
    public static function getReal() {
        $testDatabaseDsn = 'mysql://toor:queiKu5a@tcp(127.0.0.1:33060)/self_competency?charset=UTF8';
        $ormConfig = new Config();
        $ormConfig->addConnection('mysql', $testDatabaseDsn);
        return new Locator($ormConfig);
    }

    /**
     * @return bool|Locator
     */
    public static function getTest() {
        $testDatabaseDsn = 'sqlite::memory:';
        $ormConfig = new Config();
        try {
            $ormConfig->addConnection('mysql', $testDatabaseDsn);
        } catch (\Spot\Exception $exception) {
            return false;
        }

        $orm = new Locator($ormConfig);
        $mapper = $orm->mapper(\Spot\Entity::class);

        $dumpQueries = explode(";", file_get_contents(__DIR__.'/../../etc/database/dump.sqlite'));
        foreach ($dumpQueries as $query) {
            $query = trim($query);
            $isComment = strpos($query, '--') === 0 || strpos($query, '/*') === 0;
            $isExecutable = !$isComment && !empty($query);

            if ($isExecutable) {
                $mapper->query($query);
            }
        }

        return $orm;
    }
}