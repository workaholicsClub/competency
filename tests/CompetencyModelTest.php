<?php

use Competencies\Competency\CompetencyEntity;
use Competencies\Competency\CompetencyModel;
use Competencies\Course\CourseModel;
use Competencies\Mocks\Database;
use PHPUnit\Framework\TestCase;
use Spot\Entity\Collection;

class CompetencyModelTest extends TestCase
{
    public function testMake() {
        $instance = CompetencyModel::make();
        $this->assertInstanceOf(CompetencyModel::class, $instance);
    }

    public function testLoad() {
        $testCode = 'codeQuality';
        $locator = Database::getTest();
        $instance = CompetencyModel::make($locator);

        $entity = $instance->load($testCode);
        $this->assertInstanceOf(CompetencyEntity::class, $entity);
        $this->assertEquals($testCode, $entity->get('code'));
    }

    public function testLoadMultiple() {
        $testCodes = ['codeQuality', 'javascript'];
        $locator = Database::getTest();
        $instance = CompetencyModel::make($locator);

        $entities = $instance->loadMultiple($testCodes);
        $resultCodes = $entities->map(function ($entity) {
            return $entity->get('code');
        });

        $this->assertInstanceOf(Collection::class, $entities);
        $this->assertEquals($testCodes, $resultCodes);
    }

    public function testLoadProfessions() {
        $locator = Database::getTest();

        $courseModel = CourseModel::make($locator);
        $model = CompetencyModel::make($locator, $courseModel);
        $result = $model->loadProfessions();

        $this->assertArrayHasKey('0', $result);
        $this->assertArrayHasKey('code', $result[0]);
        $this->assertArrayHasKey('courseCount', $result[0]);
        $this->assertArrayHasKey('competencyCount', $result[0]);
        $this->assertEquals('webDeveloper', $result[0]['code']);
        $this->assertEquals(9, $result[0]['courseCount']);
        $this->assertEquals(24, $result[0]['competencyCount']);
        $this->assertArrayHasKey('groups', $result[0]);
        $this->assertArrayHasKey('1', $result[0]['groups']);
        $this->assertArrayHasKey('code', $result[0]['groups'][1]);
        $this->assertEquals('programmingPractice', $result[0]['groups'][1]['code']);
        $this->assertArrayHasKey('competencies', $result[0]['groups'][1]);

        $this->assertArrayHasKey('1', $result);
        $this->assertArrayHasKey('code', $result[1]);
        $this->assertArrayHasKey('courseCount', $result[1]);
        $this->assertArrayHasKey('competencyCount', $result[1]);
        $this->assertEquals('tester', $result[1]['code']);
        $this->assertEquals(9, $result[1]['courseCount']);
        $this->assertEquals(7, $result[1]['competencyCount']);
        $this->assertArrayHasKey('groups', $result[1]);
        $this->assertArrayHasKey('0', $result[0]['groups']);
        $this->assertArrayHasKey('code', $result[0]['groups'][0]);
        $this->assertEquals('programmingPractice', $result[1]['groups'][0]['code']);
        $this->assertArrayHasKey('competencies', $result[1]['groups'][0]);

        $sampleCompetency = $result[0]['groups'][1]['competencies'][0];
        $this->assertArrayHasKey('skills', $sampleCompetency);
        $this->assertCount(19, $sampleCompetency['skills']);
    }

}