<?php

use Competencies\Course\Course;
use Competencies\Skill\Skill;
use PHPUnit\Framework\TestCase;

class CourseTest extends TestCase
{
    public function testFromArray() {
        $expectedProps = [
            'externalId'           => '35',
            'name'                 => 'Название курса',
            'description'          => 'Course Description',
            'url'                  => 'https://stepik.org/course/1780/',
            'skills'               => [
                Skill::fromArray(['id' => 'a']),
            ],
            'requirements'         => [
                Skill::fromArray(['id' => 'b']),
            ],
            'externalRequirements' => 'Для прохождения курса нужно знать А',
            'externalSkills'       => 'В результате прохождения курса слушатели получат Б',
            'modeOfStudy'          => Course::MODE_OF_STUDY_ONLINE,
            'courseForm'           => Course::COURSE_FORM_INTERACTIVE,
            'schedule'             => Course::SCHEDULE_EVENING,
            'certificate'          => true,
            'tasksType'            => Course::TASKS_SELF_CHECK,
            'lengthDays'           => 36,
        ];

        $expectedCode = 'nazvanie-kursa';
        $course = Course::fromArray($expectedProps);

        $this->assertEquals($expectedProps['externalId'], $course->getExternalId());
        $this->assertEquals($expectedCode, $course->getCode());
        $this->assertEquals($expectedProps['name'], $course->getName());
        $this->assertEquals($expectedProps['description'], $course->getDescription());
        $this->assertEquals($expectedProps['url'], $course->getUrl());
        $this->assertEquals($expectedProps['skills'], $course->getSkills());
        $this->assertEquals($expectedProps['externalSkills'], $course->getExternalSkills());
        $this->assertEquals($expectedProps['requirements'], $course->getRequirements());
        $this->assertEquals($expectedProps['externalRequirements'], $course->getExternalRequirements());
        $this->assertEquals($expectedProps['modeOfStudy'], $course->getModeOfStudy());
        $this->assertEquals($expectedProps['courseForm'], $course->getCourseForm());
        $this->assertEquals($expectedProps['schedule'], $course->getSchedule());
        $this->assertEquals($expectedProps['certificate'], $course->hasCertificate());
        $this->assertEquals($expectedProps['tasksType'], $course->getTasksType());
        $this->assertEquals($expectedProps['lengthDays'], $course->getLengthDays());

        $particialProps = [
            'externalId' => '35',
            'url'        => 'https://stepik.org/course/1780/',
        ];

        $course = Course::fromArray($particialProps);

        $this->assertEquals($particialProps['externalId'], $course->getExternalId());
        $this->assertEquals($particialProps['url'], $course->getUrl());
        $this->assertEmpty($course->getName());
        $this->assertEmpty($course->getDescription());
        $this->assertEmpty($course->getSkills());
        $this->assertEmpty($course->getExternalSkills());
        $this->assertEmpty($course->getRequirements());
        $this->assertEmpty($course->getExternalRequirements());
        $this->assertEmpty($course->getModeOfStudy());
        $this->assertEmpty($course->getCourseForm());
        $this->assertEmpty($course->getSchedule());
        $this->assertEmpty($course->hasCertificate());
        $this->assertEmpty($course->getTasksType());
        $this->assertEmpty($course->getLengthDays());

        $course = Course::makeEmpty();

        $this->assertEmpty($course->getExternalId());
        $this->assertEmpty($course->getUrl());
        $this->assertEmpty($course->getName());
        $this->assertEmpty($course->getDescription());
        $this->assertEmpty($course->getSkills());
        $this->assertEmpty($course->getExternalSkills());
        $this->assertEmpty($course->getRequirements());
        $this->assertEmpty($course->getExternalRequirements());
        $this->assertEmpty($course->getModeOfStudy());
        $this->assertEmpty($course->getCourseForm());
        $this->assertEmpty($course->getSchedule());
        $this->assertEmpty($course->hasCertificate());
        $this->assertEmpty($course->getTasksType());
        $this->assertEmpty($course->getLengthDays());
    }

    public function testGettersSetters() {
        $course = Course::fromArray([]);
        $skillA = Skill::fromArray(['id' => 'a']);
        $skillB = Skill::fromArray(['id' => 'b']);
        $skillC = Skill::fromArray(['id' => 'c']);
        $skillD = Skill::fromArray(['id' => 'd']);


        $course->addSkill($skillA);
        $course->addSkill($skillB);
        $this->assertEquals([$skillA, $skillB], $course->getSkills());

        $course->addRequirement($skillC);
        $course->addRequirement($skillD);
        $this->assertEquals([$skillC, $skillD], $course->getRequirements());

    }

    public function testSetState() {
        $expectedProps = [
            'externalId'            => '35',
            'name'                  => 'Course Name',
            'description'           => 'Course Description',
            'url'                   => 'https://stepik.org/course/1780/',
            'skills'               => [
                Skill::fromArray(['id' => 'a']),
            ],
            'requirements'         => [
                Skill::fromArray(['id' => 'b']),
            ],
            'externalRequirements' => 'Для прохождения курса нужно знать А',
            'externalSkills'       => 'В результате прохождения курса слушатели получат Б',
            'modeOfStudy'          => Course::MODE_OF_STUDY_ONLINE,
            'courseForm'           => Course::COURSE_FORM_INTERACTIVE,
            'schedule'             => Course::SCHEDULE_EVENING,
            'certificate'          => true,
            'tasksType'            => Course::TASKS_SELF_CHECK,
            'lengthDays'           => 36,
        ];

        $course = Course::__set_state($expectedProps);

        $this->assertEquals($expectedProps['externalId'], $course->getExternalId());
        $this->assertEquals($expectedProps['name'], $course->getName());
        $this->assertEquals($expectedProps['description'], $course->getDescription());
        $this->assertEquals($expectedProps['url'], $course->getUrl());
        $this->assertEquals($expectedProps['skills'], $course->getSkills());
        $this->assertEquals($expectedProps['externalSkills'], $course->getExternalSkills());
        $this->assertEquals($expectedProps['requirements'], $course->getRequirements());
        $this->assertEquals($expectedProps['externalRequirements'], $course->getExternalRequirements());
        $this->assertEquals($expectedProps['modeOfStudy'], $course->getModeOfStudy());
        $this->assertEquals($expectedProps['courseForm'], $course->getCourseForm());
        $this->assertEquals($expectedProps['schedule'], $course->getSchedule());
        $this->assertEquals($expectedProps['certificate'], $course->hasCertificate());
        $this->assertEquals($expectedProps['tasksType'], $course->getTasksType());
        $this->assertEquals($expectedProps['lengthDays'], $course->getLengthDays());
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

        $this->assertTrue($courseA->isSame($courseC));
        $this->assertTrue($courseC->isSame($courseA));
        $this->assertFalse($courseA->isSame($courseB));
        $this->assertFalse($courseB->isSame($courseC));
    }
}