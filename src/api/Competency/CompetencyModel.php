<?php

namespace Competencies\Competency;

use Competencies\Course\CourseEntity;
use Competencies\Course\CourseModel;
use Spot\Locator;

class CompetencyModel
{
    /**
     * @var Locator|null $locator
     */
    private $locator;
    private $courseModel;

    /**
     * @param Locator|null $locator
     * @param null         $courseModel
     * @return CompetencyModel
     * @internal param null|string $email
     */
    public static function make($locator = null, $courseModel = null) {
        $instance = new self();
        $instance->setLocator($locator);
        $instance->setCourseModel($courseModel);

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
    public function getMapper($entityClass = CompetencyEntity::class) {
        return $this->locator->mapper($entityClass);
    }

    /**
     * @return CourseModel|null
     */
    public function getCourseModel() {
        return $this->courseModel;
    }

    /**
     * @param CourseModel $courseModel
     */
    public function setCourseModel($courseModel) {
        $this->courseModel = $courseModel;
    }

    /**
     * @param string $code
     * @return CompetencyEntity|false
     */
    public function load($code) {
        $mapper = $this->getMapper();

        return $mapper->first(['code' => $code]);
    }

    public function loadProfessions() {
        $groupIndexes = [];
        $professionIndexes = [];

        $mapper = $this->getMapper(CompetencyEntity::class);

        $professions = [];

        $competencies = $mapper->all()->with(['professions', 'group']);

        /**
         * @var CompetencyEntity $competencyEntity
         */
        foreach ($competencies as $competencyEntity) {
            /** @var CompetencyGroupEntity $groupEntity */
            $groupEntity = $competencyEntity->relation('group');
            $groupCode = $groupEntity->get('code');

            /**
             * @var ProfessionEntity $professionEntity
             */
            foreach ($competencyEntity->relation('professions') as $professionEntity) {
                $professionCode = $professionEntity->get('code');

                if (!isset($professionIndexes[$professionCode])) {
                    $professionIndex = count($professionIndexes);
                    $professionIndexes[$professionCode] = $professionIndex;

                    $professions[$professionIndex] = $professionEntity->toArray();
                    $professions[$professionIndex]['competencyCount'] = 0;
                    $professions[$professionIndex]['courseCount'] = $this->getCourseModel()
                                                        ->countCoursesForProfession($professionCode);
                }
                else {
                    $professionIndex = $professionIndexes[$professionCode];
                }

                if (!isset($groupIndexes[$professionIndex])) {
                    $groupIndexes[$professionIndex] = [];
                }

                if (!isset($groupIndexes[$professionIndex][$groupCode])) {
                    $groupIndex = count($groupIndexes[$professionIndex]);
                    $groupIndexes[$professionIndex][$groupCode] = $groupIndex;
                }
                else {
                    $groupIndex = $groupIndexes[$professionIndex][$groupCode];
                }

                if ( !isset($professions[$professionIndex]['groups'][$groupIndex]) ) {
                    $professions[$professionIndex]['groups'][$groupIndex] = $groupEntity->toArray();
                }

                $professions[$professionIndex]['groups'][$groupIndex]['competencies'][] =
                    $competencyEntity->toArray();
                $professions[$professionIndex]['competencyCount']++;
            }

        }

        return $professions;
    }
}