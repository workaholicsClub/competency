<?php

use Competencies\Course\CourseEntity;
use Competencies\Course\CourseModel;
use Competencies\Mocks\Database;
use PHPUnit\Framework\TestCase;

class CourseModelTest extends TestCase
{
    public function testMake() {
        $instance = CourseModel::make();

        $this->assertInstanceOf(CourseModel::class, $instance);
    }

    public function testLoad() {
        $testCode = 'stepic-probability';
        $locator = Database::getTest();
        $instance = CourseModel::make($locator);
        $entity = $instance->load($testCode);

        $this->assertInstanceOf(CourseEntity::class, $entity);
        $this->assertEquals($testCode, $entity->get('code'));
    }

    public function testCountCoursesForProfession() {
        $locator = Database::getTest();
        $instance = CourseModel::make($locator);

        $this->assertEquals($instance->countCoursesForProfession('webDeveloper'), 8);
        $this->assertEquals($instance->countCoursesForProfession('tester'), 7);
    }

    public function testGetRecommendations() {
        $locator = Database::getTest();
        $instance = CourseModel::make($locator);

        $recommendations = $instance->getRecommendations([
            'probabiltyBasics' => '0.5'
        ]);

        $this->assertCount(1, $recommendations);
        $this->assertArrayHasKey('totalIncrement', $recommendations[0]);
        $this->assertEquals($recommendations[0]['totalIncrement'], 3);

        $this->assertArrayHasKey('competencies', $recommendations[0]);
        $this->assertCount(1, $recommendations[0]['competencies']);
        $this->assertArrayHasKey('realIncrement', $recommendations[0]['competencies'][0]);
        $this->assertEquals($recommendations[0]['competencies'][0]['realIncrement'], 3);

        $noRecommendations = $instance->getRecommendations([
            'probabiltyBasics' => 5
        ]);
        $this->assertEmpty($noRecommendations);

        $noRecommendations = $instance->getRecommendations([]);
        $this->assertEmpty($noRecommendations);

        $recommendations = $instance->getRecommendations([
            'javascript'         => 0.5,
            'frontendTech'       => 0.75,
            'baseWebDevelopment' => 0.5
        ]);
        $this->assertCount(3, $recommendations);
        $this->assertArrayHasKey('code', $recommendations[0]);
        $this->assertArrayHasKey('code', $recommendations[1]);
        $this->assertArrayHasKey('code', $recommendations[2]);

        $this->assertEquals('netology-html-javascript', $recommendations[0]['code']);
        $this->assertEquals(4.5, $recommendations[0]['totalIncrement']);
        $this->assertEquals('netology-node', $recommendations[1]['code']);
        $this->assertEquals(0.5, $recommendations[1]['totalIncrement']);
        $this->assertEquals('netology-html-verstka', $recommendations[2]['code']);
        $this->assertEquals(0.25, $recommendations[2]['totalIncrement']);
    }
}