<?php

use Competencies\Course\Course;
use Competencies\Course\CourseEntity;
use Competencies\Mocks\Database;
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
                Skill::fromArray(['id' => 1]),
            ],
            'requirements'         => [
                Skill::fromArray(['id' => 2]),
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

    public function testFromEntity() {
        $testCourseId = 17;
        $expectedProps = [
            'externalId'           => '512',
            'name'                 => 'Python: основы и применение',
            'description'          => 'Курс посвящен базовым принципам языка Python и программирования в целом. Он хорошо подойдет тем, кто уже может писать простейшие программы на Python или тем, кто до этого программировал на других языках.',
            'url'                  => 'https://stepik.org/course/512',
            'skillsCount'          => 15,
            'requirementsCount'    => 4,
            'externalRequirements' => null,
            'externalSkills'       => null,
            'modeOfStudy'          => 'selfStudy',
            'courseForm'           => 'video',
            'schedule'             => 'free',
            'certificate'          => true,
            'tasksType'            => 'autoCheck',
            'lengthDays'           => 1,
        ];

        $locator = Database::getTest();
        /**
         * @var CourseEntity $courseEntity
         */
        $courseEntity = $locator->mapper(CourseEntity::class)->first(['id' => $testCourseId]);
        $course = Course::fromEntity($courseEntity);

        $this->assertInstanceOf(Course::class, $course);
        $this->assertEquals($expectedProps['externalId'], $course->getExternalId());
        $this->assertEquals($expectedProps['name'], $course->getName());
        $this->assertEquals($expectedProps['description'], $course->getDescription());
        $this->assertEquals($expectedProps['url'], $course->getUrl());
        $this->assertEquals($expectedProps['skillsCount'], count( $course->getSkills() ));
        $this->assertEquals($expectedProps['requirementsCount'], count( $course->getRequirements() ));
        $this->assertEquals($expectedProps['externalRequirements'], $course->getExternalRequirements());
        $this->assertEquals($expectedProps['externalSkills'], $course->getExternalSkills());
        $this->assertEquals($expectedProps['modeOfStudy'], $course->getModeOfStudy());
        $this->assertEquals($expectedProps['courseForm'], $course->getCourseForm());
        $this->assertEquals($expectedProps['schedule'], $course->getSchedule());
        $this->assertEquals($expectedProps['certificate'], $course->hasCertificate());
        $this->assertEquals($expectedProps['tasksType'], $course->getTasksType());
        $this->assertEquals($expectedProps['lengthDays'], $course->getLengthDays());
    }

    public function testGettersSetters() {
        $course = Course::fromArray([]);
        $skillA = Skill::fromArray(['id' => 1]);
        $skillB = Skill::fromArray(['id' => 2]);
        $skillC = Skill::fromArray(['id' => 3]);
        $skillD = Skill::fromArray(['id' => 4]);


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
                Skill::fromArray(['id' => 1]),
            ],
            'requirements'         => [
                Skill::fromArray(['id' => 2]),
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

    public function testHasSkillRequirement() {
        $courseProps = [
            'skills'       => [
                Skill::fromArray(['id' => 1]),
            ],
            'requirements' => [
                Skill::fromArray(['id' => 2]),
            ],
        ];

        $course = Course::fromArray($courseProps);

        $this->assertInstanceOf(Skill::class, $course->getSkillById(1));
        $this->assertInstanceOf(Skill::class, $course->getRequirementById(2));
        $this->assertFalse($course->getSkillById(2));
        $this->assertFalse($course->getRequirementById(1));

        $this->assertTrue($course->hasSkillId(1));
        $this->assertFalse($course->hasSkillId(2));

        $this->assertFalse($course->hasRequirementId(1));
        $this->assertTrue($course->hasRequirementId(2));
    }

    public function testSatisfiesSkillRequirement() {
        $courseProps = [
            'skills'       => [
                Skill::fromArray(['id' => 1, 'level' => Skill::LEVEL_SKILL]),
            ],
            'requirements' => [
                Skill::fromArray(['id' => 2, 'level' => Skill::LEVEL_SKILL]),
            ],
        ];

        $course = Course::fromArray($courseProps);

        $this->assertTrue( $course->givesSkillHigherThan(1, Skill::LEVEL_KNOWLEDGE) );
        $this->assertFalse( $course->givesSkillHigherThan(1, Skill::LEVEL_ABILITY) );
        $this->assertFalse( $course->givesSkillHigherThan(2, Skill::LEVEL_KNOWLEDGE) );

        $this->assertTrue( $course->requiresSkillLessThan(2, Skill::LEVEL_ABILITY) );
        $this->assertFalse( $course->requiresSkillLessThan(2, Skill::LEVEL_KNOWLEDGE) );
        $this->assertTrue( $course->requiresSkillLessThan(1, Skill::LEVEL_KNOWLEDGE) );
    }

    public function testToArray() {
        $expectedProps = [
            'externalId'           => '35',
            'name'                 => 'Название курса',
            'description'          => 'Course Description',
            'url'                  => 'https://stepik.org/course/1780/',
            'skills'               => [
                [
                    'id'          => 1,
                    'level'       => Skill::LEVEL_SKILL,
                    'text'        => '',
                    'description' => '',
                ],
            ],
            'requirements'         => [
                [
                    'id'          => 2,
                    'level'       => Skill::LEVEL_KNOWLEDGE,
                    'text'        => '',
                    'description' => '',
                ],
            ],
            'modeOfStudy'          => Course::MODE_OF_STUDY_ONLINE,
            'courseForm'           => Course::COURSE_FORM_INTERACTIVE,
            'schedule'             => Course::SCHEDULE_EVENING,
            'certificate'          => true,
            'tasksType'            => Course::TASKS_SELF_CHECK,
            'lengthDays'           => 36,
        ];

        $constructProps = $expectedProps;
        $constructProps['skills'][0] = Skill::fromArray($constructProps['skills'][0]);
        $constructProps['requirements'][0] = Skill::fromArray($constructProps['requirements'][0]);
        $course = Course::fromArray($constructProps);

        $this->assertEquals($expectedProps, $course->toArray());
    }
}