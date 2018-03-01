<?php

use Competencies\Competency\CompetencyModel;
use Competencies\Gateway\Stepik;
use Competencies\Mocks\Database;
use Http\Adapter\Guzzle6\Client;
use PHPUnit\Framework\TestCase;

class StepikTest extends TestCase
{
    private function makeStepikGateway() {
        $httpClient = new Client();
        $gateway = new Stepik($httpClient);

        return $gateway;
    }

    private function makePythonCompetency() {
        $locator = Database::getTest();
        $instance = CompetencyModel::make($locator);

        $entity = $instance->load('python');
        return $entity;
    }

    public function testQueryBuild() {
        $gateway = $this->makeStepikGateway();

        $query = $gateway->nonRecursiveQueryBuild([
            'a' => [1, 2, 4],
            'b' => 'abc',
            'c' => false
        ]);

        $this->assertEquals('a[]=1&a[]=2&a[]=4&b=abc&c=0', $query);
    }

    public function testGetCourseDetails() {
        $testCourseIds = [67];

        $stepik = $this->makeStepikGateway();
        $courseDetails = $stepik->getCourseDetails($testCourseIds);

        $this->assertEquals(67, $courseDetails[0]['id']);
        $this->assertEquals([141, 148, 149], $courseDetails[0]['sections']);
        $this->assertEquals('Программирование на Python', $courseDetails[0]['title']);
        $this->assertArrayHasKey('summary', $courseDetails[0]);
    }

    public function testGetCourseSections() {
        $courseDetails = require('data/courseDetails.php');
        $stepik = $this->makeStepikGateway();
        $sections = $stepik->getCourseSections($courseDetails);

        $this->assertCount(3, $sections);
        $this->assertEquals(141, $sections[0]['id']);
        $this->assertEquals(67, $sections[0]['course']);
        $this->assertEquals([1240, 943, 944, 1263, 926, 927, 928, 929, 930, 931, 945, 1086], $sections[0]['units']);
    }

    public function testGetSectionUnits() {
        $sectionDetails = require('data/sectionDetails.php');
        $stepik = $this->makeStepikGateway();
        $units = $stepik->getSectionUnits($sectionDetails);

        $this->assertCount(12, $units);
        $this->assertEquals(1240, $units[0]['id']);
        $this->assertEquals(141, $units[0]['section']);
        $this->assertEquals(6433, $units[0]['lesson']);
    }

    public function testGetCourseLessons() {
        $courseDetails = require('data/courseDetails.php');
        $stepik = $this->makeStepikGateway();
        $lessons = $stepik->getCourseLessons($courseDetails);

        $this->assertCount(28, $lessons);
        $this->assertEquals(2228, $lessons[0]['id']);
        $this->assertEquals('Операции с целыми числами', $lessons[0]['title']);
    }

    public function testGetLessonTitles() {
        $courseDetails = require('data/courseDetails.php');
        $stepik = $this->makeStepikGateway();
        $lessonTitles = $stepik->getLessonTitles($courseDetails);

        $this->assertCount(28, $lessonTitles);
        $this->assertEquals('Операции с целыми числами', $lessonTitles[0]);
    }

    public function testFindCourses() {
        $gateway = $this->makeStepikGateway();

        $courses = $gateway->findCourses('Python');
        $defaultStepikResponseLimit = 20;

        $this->assertCount($defaultStepikResponseLimit, $courses);
    }
}