<?php

use Competencies\Course\Course;
use Competencies\Course\CourseEntity;
use Competencies\Course\CourseMapper;
use Competencies\Course\CourseSkillEntity;
use Competencies\Mocks\Database;
use Competencies\Skill\Skill;
use Competencies\Skill\SkillEntity;
use PHPUnit\Framework\TestCase;
use Spot\MapperInterface;

class CourseMapperTest extends TestCase
{
    private function getTestCourse() {
        $expectedProps = [
            'externalId'           => '35',
            'name'                 => 'Название Курса',
            'description'          => 'Course Description',
            'url'                  => 'https://stepik.org/course/1780/',
            'skills'               => [
                Skill::fromArray(['id' => '40', 'level' => Skill::LEVEL_ABILITY]),
                Skill::fromArray(['id' => '45', 'level' => Skill::LEVEL_KNOWLEDGE]),
            ],
            'requirements'         => [
                Skill::fromArray(['id' => '40', 'level' => Skill::LEVEL_KNOWLEDGE]),
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

        $course = Course::fromArray($expectedProps);

        return $course;
    }

    public function testMake() {
        $locator = Database::getTest();
        $mapper = $locator->mapper(CourseEntity::class);

        $this->assertInstanceOf(CourseMapper::class, $mapper);
    }

    public function testLoadByCode() {
        $testCode = 'stepic-probability';
        $locator = Database::getTest();
        /**
         * @var CourseMapper $instance
         */
        $instance = $locator->mapper(CourseEntity::class);
        $entity = $instance->loadByCode($testCode);

        $this->assertInstanceOf(CourseEntity::class, $entity);
        $this->assertEquals($testCode, $entity->get('code'));
    }

    public function testCountCoursesForProfession() {
        $locator = Database::getTest();
        /**
         * @var CourseMapper $instance
         */
        $instance = $locator->mapper(CourseEntity::class);

        $this->assertEquals($instance->countCoursesForProfession('webDeveloper'), 9);
        $this->assertEquals($instance->countCoursesForProfession('tester'), 9);
    }

    public function testGetRecommendations() {
        $locator = Database::getTest();
        /**
         * @var CourseMapper $instance
         */
        $instance = $locator->mapper(CourseEntity::class);

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

    public function testConvertCourseToEntity() {
        $locator = Database::getTest();

        $course = $this->getTestCourse();
        /**
         * @var CourseMapper $mapper
         */
        $mapper = $locator->mapper(CourseEntity::class);
        $entity = $mapper->convertCourseToEntity($course);

        $this->assertInstanceOf(CourseEntity::class, $entity);

        $this->assertEquals($course->getExternalId(), $entity->get('externalId'));
        $this->assertEquals($course->getName(), $entity->get('name'));
        $this->assertEquals($course->getCode(), $entity->get('code'));
        $this->assertEquals($course->getDescription(), $entity->get('description'));
        $this->assertEquals($course->getUrl(), $entity->get('url'));
        $this->assertEquals($course->getModeOfStudy(), $entity->get('modeOfStudy'));
        $this->assertEquals($course->getCourseForm(), $entity->get('courseForm'));
        $this->assertEquals($course->getSchedule(), $entity->get('schedule'));
        $this->assertEquals($course->hasCertificate(), boolval($entity->get('certificate')));
        $this->assertEquals($course->getTasksType(), $entity->get('tasksType'));
        $this->assertEquals($course->getLengthDays(), $entity->get('lengthDays'));

        $this->assertTrue($entity->isNew());
    }

    private function loadCourse(Course $course, MapperInterface $courseMapper) {
        return $courseMapper->where(['externalId' => $course->getExternalId()])->first();
    }

    private function checkCourseFields(Course $course, CourseEntity $entity) {
        $this->assertEquals($course->getExternalId(), $entity->get('externalId'));
        $this->assertEquals($course->getName(), $entity->get('name'));
        $this->assertEquals($course->getCode(), $entity->get('code'));
        $this->assertEquals($course->getDescription(), $entity->get('description'));
        $this->assertEquals($course->getUrl(), $entity->get('url'));
        $this->assertEquals($course->getModeOfStudy(), $entity->get('modeOfStudy'));
        $this->assertEquals($course->getCourseForm(), $entity->get('courseForm'));
        $this->assertEquals($course->getSchedule(), $entity->get('schedule'));
        $this->assertEquals($course->hasCertificate(), boolval($entity->get('certificate')));
        $this->assertEquals($course->getTasksType(), $entity->get('tasksType'));
        $this->assertEquals($course->getLengthDays(), $entity->get('lengthDays'));
    }

    public function testSaveNew() {
        $locator = Database::getTest();
        $course = $this->getTestCourse();

        /**
         * @var CourseMapper $courseMapper
         */
        $courseMapper = $locator->mapper(CourseEntity::class);
        $saveResult = $courseMapper->saveCourse($course);

        $this->assertTrue($saveResult);

        $entity = $this->loadCourse($course, $courseMapper);
        $this->checkCourseFields($course, $entity);

        $savedSkillLinks = $entity->relation('skillLinks');
        $this->assertEquals(count($course->getSkills()), count($savedSkillLinks));
        foreach ($course->getSkills() as $index => $skill) {
            /**
             * @var CourseSkillEntity $savedSkillLink
             */
            $savedSkillLink = $savedSkillLinks[$index];
            $this->assertEquals($skill->getId(), $savedSkillLink->get('atomicSkillId'));
            $this->assertEquals($skill->getLevel(), $savedSkillLink->get('level'));
        }
    }

    public function testUpdateFields() {
        $locator = Database::getTest();
        $course = $this->getTestCourse();

        $expectedName = 'Новое название';
        $expectedCode = 'novoe-nazvanie';
        $expectedLength = 77;

        /**
         * @var CourseMapper $courseMapper
         */
        $courseMapper = $locator->mapper(CourseEntity::class);
        $saveResult = $courseMapper->saveCourse($course);
        $this->assertTrue($saveResult);

        $course->setName($expectedName);
        $course->setLengthDays($expectedLength);
        $entity = $this->loadCourse($course, $courseMapper);
        $oldId = $entity->get('id');

        $updateResult = $courseMapper->saveCourse($course);
        $this->assertTrue($updateResult);

        $entity = $this->loadCourse($course, $courseMapper);
        $this->assertEquals($oldId, $entity->get('id'));
        $this->assertEquals($expectedCode, $entity->get('code'));
        $this->checkCourseFields($course, $entity);
    }

    public function testAddSkill() {
        $locator = Database::getTest();
        $course = $this->getTestCourse();
        $expectedSkillCount = 3;
        $expectedSkillIds = ['40', '45', '46'];

        /**
         * @var CourseMapper $courseMapper
         */
        $courseMapper = $locator->mapper(CourseEntity::class);
        $saveResult = $courseMapper->saveCourse($course);
        $this->assertTrue($saveResult);

        $course->addSkill(Skill::fromArray(['id' => '46', 'level' => Skill::LEVEL_ABILITY]));
        $updateResult = $courseMapper->saveCourse($course);
        $this->assertTrue($updateResult);

        $entity = $this->loadCourse($course, $courseMapper);
        /**
         * @var SkillEntity[] $savedSkillLinks
         */
        $savedSkillLinks = $entity->relation('skillLinks');
        $this->assertEquals($expectedSkillCount, count($savedSkillLinks));

        $savedSkillIds = [];
        foreach ($savedSkillLinks as $savedSkillLink) {
            $savedSkillIds[] = $savedSkillLink->get('atomicSkillId');
        }

        $this->assertEquals($expectedSkillIds, $savedSkillIds);
    }

    public function testRemoveSkill() {
        $locator = Database::getTest();
        $course = $this->getTestCourse();
        $expectedSkillCount = 1;
        $expectedSkillIds = ['46'];

        /**
         * @var CourseMapper $courseMapper
         */
        $courseMapper = $locator->mapper(CourseEntity::class);
        $saveResult = $courseMapper->saveCourse($course);
        $this->assertTrue($saveResult);

        $course->setSkills([
            Skill::fromArray(['id' => '46', 'level' => Skill::LEVEL_ABILITY])
        ]);
        $updateResult = $courseMapper->saveCourse($course);
        $this->assertTrue($updateResult);

        $entity = $this->loadCourse($course, $courseMapper);
        /**
         * @var SkillEntity[] $savedSkillLinks
         */
        $savedSkillLinks = $entity->relation('skillLinks');
        $this->assertEquals($expectedSkillCount, count($savedSkillLinks));

        $savedSkillIds = [];
        foreach ($savedSkillLinks as $savedSkillLink) {
            $savedSkillIds[] = $savedSkillLink->get('atomicSkillId');
        }

        $this->assertEquals($expectedSkillIds, $savedSkillIds);
    }

    public function testAddRequirement() {
        $locator = Database::getTest();
        $course = $this->getTestCourse();
        $expectedRequirementCount = 2;
        $expectedRequirementIds = ['40', '46'];

        /**
         * @var CourseMapper $courseMapper
         */
        $courseMapper = $locator->mapper(CourseEntity::class);
        $saveResult = $courseMapper->saveCourse($course);
        $this->assertTrue($saveResult);

        $course->addRequirement(Skill::fromArray(['id' => '46', 'level' => Skill::LEVEL_ABILITY]));
        $updateResult = $courseMapper->saveCourse($course);
        $this->assertTrue($updateResult);

        $entity = $this->loadCourse($course, $courseMapper);
        /**
         * @var SkillEntity[] $savedRequirementLinks
         */
        $savedRequirementLinks = $entity->relation('requirementLinks');
        $this->assertEquals($expectedRequirementCount, count($savedRequirementLinks));

        $savedRequirementIds = [];
        foreach ($savedRequirementLinks as $savedRequirementLink) {
            $savedRequirementIds[] = $savedRequirementLink->get('atomicSkillId');
        }

        $this->assertEquals($expectedRequirementIds, $savedRequirementIds);
    }

    public function testRemoveRequirement() {
        $locator = Database::getTest();
        $course = $this->getTestCourse();

        $expectedRequirementCount = 1;
        $expectedRequirementIds = ['46'];

        /**
         * @var CourseMapper $courseMapper
         */
        $courseMapper = $locator->mapper(CourseEntity::class);
        $saveResult = $courseMapper->saveCourse($course);
        $this->assertTrue($saveResult);

        $course->setRequirements([
            Skill::fromArray(['id' => '46', 'level' => Skill::LEVEL_ABILITY])
        ]);
        $updateResult = $courseMapper->saveCourse($course);
        $this->assertTrue($updateResult);

        $entity = $this->loadCourse($course, $courseMapper);
        /**
         * @var SkillEntity[] $savedRequirementLinks
         */
        $savedRequirementLinks = $entity->relation('requirementLinks');
        $this->assertEquals($expectedRequirementCount, count($savedRequirementLinks));

        $savedRequirementIds = [];
        foreach ($savedRequirementLinks as $savedRequirementLink) {
            $savedRequirementIds[] = $savedRequirementLink->get('atomicSkillId');
        }

        $this->assertEquals($expectedRequirementIds, $savedRequirementIds);
    }
}