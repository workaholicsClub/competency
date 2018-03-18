<?php

namespace Competencies\Mocks;

use Spot\Config;
use Spot\Entity;
use Spot\Exception;
use Spot\Locator;
use Spot\Mapper;

class Database
{
    const TEST_DSN = 'sqlite::memory:';

    /**
     * @return Locator
     * @throws Exception
     */
    public static function getReal() {
        $testDatabaseDsn = 'mysql://toor:queiKu5a@tcp(127.0.0.1:33060)/self_competency?charset=UTF8';
        $ormConfig = new Config();
        $ormConfig->addConnection('mysql', $testDatabaseDsn);
        return new Locator($ormConfig);
    }

    public static function loadDatabaseDump(string $filename): array {
        $queries = explode(";", file_get_contents($filename));
        return $queries;
    }

    public static function populateDatabase(Mapper $mapper, array $queries) {
        foreach ($queries as $query) {
            $query = trim($query);
            $isComment = strpos($query, '--') === 0 || strpos($query, '/*') === 0;
            $isExecutable = !$isComment && !empty($query);

            if ($isExecutable) {
                $mapper->query($query);
            }
        }
    }

    public static function setupTest() {
        putenv('MYSQL_DSN='.self::TEST_DSN);
        self::getTest();
    }

    /**
     * @return bool|Locator
     */
    public static function getTest() {
        $testDatabaseDsn = self::TEST_DSN;
        $ormConfig = new Config();
        try {
            $ormConfig->addConnection('mysql', $testDatabaseDsn);
        } catch (Exception $exception) {
            return false;
        }

        $orm = new Locator($ormConfig);
        $mapper = $orm->mapper(Entity::class);

        $dumpFilename = __DIR__.'/../../etc/database/dump.sqlite';
        $populateQueries = self::loadDatabaseDump($dumpFilename);
        self::populateDatabase($mapper, $populateQueries);

        return $orm;
    }
}