<?php

use Competencies\Competency\CompetencyEntity;
use Competencies\Competency\CompetencyModel;
use Competencies\Mocks\Database;
use PHPUnit\Framework\TestCase;

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

    public function testLoadProfessions() {
        $locator = Database::getTest();

        $model = CompetencyModel::make($locator);
        $result = $model->loadProfessions();
        $this->assertArrayHasKey('webDeveloper', $result);
        $this->assertArrayHasKey('groups', $result['webDeveloper']);
        $this->assertArrayHasKey('programmingPractice', $result['webDeveloper']['groups']);
        $this->assertArrayHasKey('competencies', $result['webDeveloper']['groups']['programmingPractice']);
        $this->assertArrayHasKey('tester', $result);
        $this->assertArrayHasKey('groups', $result['tester']);
        $this->assertArrayHasKey('programmingPractice', $result['tester']['groups']);
        $this->assertArrayHasKey('competencies', $result['tester']['groups']['programmingPractice']);
    }

}