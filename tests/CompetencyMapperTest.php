<?php

use Competencies\Competency\CompetencyEntity;
use Competencies\Competency\CompetencyMapper;
use Competencies\Mocks\Database;
use PHPUnit\Framework\TestCase;

class CompetencyMapperTest extends TestCase
{
    public function testGetCompetencyStats() {
        $testCompetencyId = 6;
        $testEmptyCompetencyId = 47;
        //База не тестовая, т.к. используются функции, специфичные для MySql
        $locator = Database::getReal();

        /**
         * @var CompetencyMapper $mapper
         */
        $mapper = $locator->mapper(CompetencyEntity::class);
        $stats = $mapper->getCompetencyStats();

        $statSample = $stats[$testCompetencyId];
        $this->assertArrayHasKey('lower', $statSample);
        $this->assertArrayHasKey('upper', $statSample);
        $this->assertArrayHasKey('average', $statSample);
        $this->assertGreaterThanOrEqual(0, $statSample['lower']);
        $this->assertGreaterThanOrEqual($statSample['lower'], $statSample['average']);
        $this->assertGreaterThanOrEqual($statSample['average'], $statSample['upper']);

        $emptySample = $stats[$testEmptyCompetencyId];
        $this->assertEquals(0, $emptySample['lower']);
        $this->assertEquals(0, $emptySample['upper']);
        $this->assertEquals(0, $emptySample['average']);
    }
}