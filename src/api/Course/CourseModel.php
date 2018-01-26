<?php

namespace Competencies\Course;

use Competencies\Competency\CompetencyEntity;
use Spot\Locator;

class CourseModel
{
    /**
     * @var Locator|null $locator
     */
    private $locator;

    /**
     * @param Locator|null $locator
     * @return CourseModel
     * @internal param null|string $email
     */
    public static function make($locator = null) {
        $instance = new self();
        $instance->setLocator($locator);

        return $instance;
    }

    /**
     * @return mixed
     */
    public function getLocator() {
        return $this->locator;
    }

    /**
     * @param mixed $locator
     */
    public function setLocator($locator) {
        $this->locator = $locator;
    }

    /**
     * @param string $entityClass
     * @return \Spot\Mapper
     */
    public function getMapper($entityClass = CourseEntity::class) {
        return $this->locator->mapper($entityClass);
    }

    /**
     * @param string $code
     * @return CourseEntity|false
     */
    public function load($code) {
        $mapper = $this->getMapper();

        return $mapper->first(['code' => $code]);
    }

    public function getRecommendations($competencyRatings) {
        $mapper = $this->getMapper();
        $competencyCodes = array_keys($competencyRatings);

        /**
         * @var CourseEntity[] $courseEntities
         */
        $courseEntities = $mapper->query(
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
                'increment'  => floatval($courseEntity->get('increment'))
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
                $course['totalIncrement'] += $competencyIncrement;
            }

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
}