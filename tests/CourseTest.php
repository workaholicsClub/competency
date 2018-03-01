<?php

use Competencies\Course\Course;

class CourseTest extends \PHPUnit\Framework\TestCase
{
    public function testFromArray() {
        $expectedProps = [
            'externalId'            => '35',
            'name'                  => 'Course Name',
            'description'           => 'Course Description',
            'url'                   => 'https://stepik.org/course/1780/',
            'skills'                => [
                ['code' => 'a'],
            ],
            'externalRequirements'  => 'Для прохождения курса нужно знать А',
            'externalSkills'        => 'В результате прохождения курса слушатели получат Б',
        ];

        $course = Course::fromArray($expectedProps);

        $this->assertEquals($expectedProps['externalId'], $course->getExternalId());
        $this->assertEquals($expectedProps['name'], $course->getName());
        $this->assertEquals($expectedProps['description'], $course->getDescription());
        $this->assertEquals($expectedProps['url'], $course->getUrl());
        $this->assertEquals($expectedProps['skills'], $course->getSkills());
        $this->assertEquals($expectedProps['externalRequirements'], $course->getExternalRequirements());
        $this->assertEquals($expectedProps['externalSkills'], $course->getExternalSkills());

        $particialProps = [
            'externalId' => '35',
            'url'        => 'https://stepik.org/course/1780/',
        ];

        $course = Course::fromArray($particialProps);

        $this->assertEquals($particialProps['externalId'], $course->getExternalId());
        $this->assertEquals($particialProps['url'], $course->getUrl());
        $this->assertNull($course->getName());
        $this->assertNull($course->getDescription());
        $this->assertNull($course->getSkills());

        $course->addSkill('a');
        $course->addSkill('b');
        $this->assertEquals(['a', 'b'], $course->getSkills());
    }

    public function testSetState() {
        $expectedProps = [
            'externalId'            => '35',
            'name'                  => 'Course Name',
            'description'           => 'Course Description',
            'url'                   => 'https://stepik.org/course/1780/',
            'skills'                => [
                ['code' => 'a'],
            ],
            'externalRequirements'  => 'Для прохождения курса нужно знать А',
            'externalSkills'        => 'В результате прохождения курса слушатели получат Б',
        ];

        $course = Course::__set_state($expectedProps);

        $this->assertEquals($expectedProps['externalId'], $course->getExternalId());
        $this->assertEquals($expectedProps['name'], $course->getName());
        $this->assertEquals($expectedProps['description'], $course->getDescription());
        $this->assertEquals($expectedProps['url'], $course->getUrl());
        $this->assertEquals($expectedProps['skills'], $course->getSkills());
        $this->assertEquals($expectedProps['externalRequirements'], $course->getExternalRequirements());
        $this->assertEquals($expectedProps['externalSkills'], $course->getExternalSkills());
    }

    public function testIsEqualTo() {
        $courseA = Course::fromArray([
            'externalId' => '1',
            'name'       => 'Курс А',
        ]);
        $courseB = Course::fromArray([
            'externalId' => '2',
            'name'       => 'Курс Б',
        ]);
        $courseC = Course::fromArray([
            'externalId' => '1',
            'name'       => 'Курс А',
        ]);

        $this->assertTrue($courseA->isEqualTo($courseC));
        $this->assertTrue($courseC->isEqualTo($courseA));
        $this->assertFalse($courseA->isEqualTo($courseB));
        $this->assertFalse($courseB->isEqualTo($courseC));
    }
}