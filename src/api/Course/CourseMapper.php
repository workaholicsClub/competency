<?php

namespace Competencies\Course;

use Competencies\Skill\Skill;
use Spot\Entity;
use Spot\Exception;
use Spot\Mapper;
use Spot\MapperInterface;

class CourseMapper extends Mapper
{
    /**
     * @param string $professionCode
     * @return int
     */
    public function countCoursesForProfession(string $professionCode): int {
        /**
         * @var CourseEntity[] $courseEntities
         */
        $courseEntities = $this->query('SELECT DISTINCT c.* FROM courses c
                        LEFT JOIN courseCompetency cc ON cc.courseId = c.id
                        LEFT JOIN competencyProfession cp ON cc.competencyId = cp.competencyId
                        LEFT JOIN professions p ON cp.professionId = p.id
                    WHERE p.code = ?', [$professionCode]);

        return count($courseEntities);
    }

    /**
     * @param string $code
     * @return CourseEntity
     */
    public function loadByCode(string $code): CourseEntity {
        return $this->first(['code' => $code]);
    }

    /**
     * @param string $externalId
     * @return bool|CourseEntity
     */
    public function loadByExternalId(string $externalId) {
        return $this->first( ['externalId' => $externalId] );
    }

    public function getRecommendations($competencyRatings) {
        $competencyCodes = array_keys($competencyRatings);
        $maxLevel = 4;

        /**
         * @var CourseEntity[] $courseEntities
         */
        $courseEntities = $this->query(
            'SELECT c.*, cc.*, cm.code AS competencyCode, cm.name AS competencyName FROM courses c
                    LEFT JOIN courseCompetency cc ON cc.courseId = c.id
                    LEFT JOIN competencies cm ON cc.competencyId = cm.id
                 WHERE cm.code IN ("'.implode('","', $competencyCodes).'")');

        $courses = [];

        foreach ($courseEntities as $courseEntity) {

            $competencyData = [
                'code'       => $courseEntity->get('competencyCode'),
                'name'       => $courseEntity->get('competencyName'),
                'startLevel' => floatval($courseEntity->get('startLevel')),
                'startLevelPercent' => floatval(round($courseEntity->get('startLevel')/$maxLevel*100)),
                'increment'  => floatval($courseEntity->get('increment')),
                'incrementPercent' => floatval(round($courseEntity->get('increment')/$maxLevel*100)),
            ];

            $courseCode = $courseEntity->get('code');
            if ( !isset($courses[$courseCode]) ) {
                $courses[$courseCode] = [
                    'id'           => $courseEntity->get('id'),
                    'code'         => $courseEntity->get('code'),
                    'name'         => $courseEntity->get('name'),
                    'url'          => $courseEntity->get('url'),
                    'price'        => $courseEntity->get('price'),
                    'weeks'        => $courseEntity->get('weeks'),
                    'lessons'      => $courseEntity->get('lessons'),
                    'competencies' => [$competencyData],
                ];
            }
            else {
                $courses[$courseCode]['competencies'][] = $competencyData;
            }
        }

        $recommendedCourses = [];

        foreach ($courses as $course) {
            $competenciesFit = true;

            $course['totalIncrement'] = 0;

            foreach ($course['competencies'] as $competencyIndex => $competency) {
                $currentRating = $competencyRatings[ $competency['code'] ];
                $lowerRating = $competency['startLevel'];
                $higherRating = $competency['startLevel'] + $competency['increment'];

                $currentCompetencyFit = $currentRating >= $lowerRating && $currentRating <= $higherRating;
                $competenciesFit = $competenciesFit && $currentCompetencyFit;

                $competencyIncrement = $currentCompetencyFit
                    ? $higherRating - $currentRating
                    : 0;

                $course['competencies'][$competencyIndex]['realIncrement'] = $competencyIncrement;
                $course['competencies'][$competencyIndex]['realIncrementPercent'] =
                    round($competencyIncrement/$maxLevel*100);
                $course['totalIncrement'] += $competencyIncrement;
            }

            $course['totalIncrementPercent'] = round($course['totalIncrement']/$maxLevel * 100);

            if ($competenciesFit && $course['totalIncrement'] > 0) {
                $recommendedCourses[] = $course;
            }
        }

        usort($recommendedCourses, function ($firstCourse, $secondCourse) {
            return $secondCourse['totalIncrement'] > $firstCourse['totalIncrement']
                ? 1
                : ($secondCourse['totalIncrement'] == $firstCourse['totalIncrement']
                    ? 0
                    : -1
                );
        });

        return $recommendedCourses;
    }

    private function setEntityFields(Course $course, CourseEntity $courseEntity): CourseEntity {
        $lengthInWeeks = round($course->getLengthDays() / 7);

        $courseProps = [
            'externalId'    => $course->getExternalId(),
            'eduProviderId' => null,
            'code'          => $course->getCode(),
            'name'          => $course->getName(),
            'description'   => $course->getDescription(),
            'url'           => $course->getUrl(),
            'price'         => null,
            'weeks'         => $lengthInWeeks,
            'lessons'       => null,
            'modeOfStudy'   => $course->getModeOfStudy(),
            'courseForm'    => $course->getCourseForm(),
            'schedule'      => $course->getSchedule(),
            'certificate'   => $course->hasCertificate() ? '1' : '0',
            'tasksType'     => $course->getTasksType(),
            'lengthDays'    => $course->getLengthDays(),
        ];

        foreach ($courseProps as $fieldName => $fieldValue) {
            $courseEntity->set($fieldName, $fieldValue);
        }

        return $courseEntity;
    }


    public function convertCourseToEntity(Course $course): CourseEntity {
        $courseEntity = false;

        if ($course->getExternalId()) {
            $courseEntity = $this->loadByExternalId($course->getExternalId());
        }

        if (!$courseEntity) {
            $courseEntity = new CourseEntity([]);
        }

        $courseEntity = $this->setEntityFields($course, $courseEntity);

        return $courseEntity;
    }

    protected function updateSkillInDatabase(Skill $skill, Entity $courseSkillLink, MapperInterface $mapper): bool {
        if ($skill->getLevel() != $courseSkillLink->get('level')) {
            $courseSkillLink->set('level', $skill->getLevel());

            try {
                $mapper->update($courseSkillLink);
            } catch (Exception $e) {
                return false;
            }
        }

        return true;
    }

    protected function createSkillInDatabase(Skill $skill, string $courseId, MapperInterface $mapper): bool {
        $entityName = $mapper->entity();
        $courseSkillLink = new $entityName([
            'courseId' => $courseId,
            'atomicSkillId' => $skill->getId(),
            'level' => $skill->getLevel(),
        ]);

        $saveResult = $mapper->save($courseSkillLink);
        if (!$saveResult) {
            return false;
        }

        return true;
    }

    /**
     * @param Skill[] $currentSkills
     * @param string $courseId
     * @param MapperInterface $mapper
     * @return bool
     */
    protected function removeOldSkillsFromDatabase(array $currentSkills, string $courseId, MapperInterface $mapper): bool {
        $currentSkillIds = array_reduce($currentSkills, function ($accumulator, $skill) {
            /**
             * @var Skill $skill
             */
            $accumulator[] = $skill->getId();
            return $accumulator;
        }, []);

        $deleteResult = $mapper->delete(['courseId' => $courseId, 'atomicSkillId NOT IN' => $currentSkillIds]);

        return $deleteResult;
    }

    public function syncCourseEntitySkillsOrRequirements(Course $course, string $courseId, array $skills, string $entityName) {
        $mapper = $this->locator->mapper($entityName);

        foreach ($skills as $skill) {
            $courseSkillLink = $mapper->where(['courseId' => $courseId, 'atomicSkillId' => $skill->getId()])->first();

            if ($courseSkillLink) {
                $this->updateSkillInDatabase($skill, $courseSkillLink, $mapper);
            }
            else {
                $this->createSkillInDatabase($skill, $courseId, $mapper);
            }
        }

        $this->removeOldSkillsFromDatabase($skills, $courseId, $mapper);

        return true;
    }

    public function syncCourseEntitySkills(Course $course, string $courseId) {
        $entityName = CourseSkillEntity::class;
        $skills = $course->getSkills();
        return $this->syncCourseEntitySkillsOrRequirements($course, $courseId, $skills, $entityName);
    }

    public function syncCourseEntityRequirements(Course $course, string $courseId) {
        $entityName = CourseRequirementEntity::class;
        $requirements = $course->getRequirements();
        return $this->syncCourseEntitySkillsOrRequirements($course, $courseId, $requirements, $entityName);
    }

    public function saveCourse(Course $course): bool {
        $entity = $this->convertCourseToEntity($course);
        $saveResult = $this->save($entity);

        if ($saveResult === false) {
            return false;
        }

        $courseId = $entity->get('id');
        $skillsResult = $this->syncCourseEntitySkills($course, $courseId);
        $requirementsResult = $this->syncCourseEntityRequirements($course, $courseId);
        $syncResult = $skillsResult && $requirementsResult;

        return $syncResult;
    }
}