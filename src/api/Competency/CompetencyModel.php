<?php

namespace Competencies\Competency;

use Competencies\CompetencyModelInterface;
use Spot\Locator;

class CompetencyModel implements CompetencyModelInterface
{
    private $mapper;

    /**
     * @param Locator|null $locator
     * @return CompetencyModel
     * @internal param null|string $email
     */
    public static function make($locator = null) {
        $instance = new self();
        $instance->setMapperFromLocator($locator);

        return $instance;
    }

    /**
     * @param Locator|null $locator
     */
    public function setMapperFromLocator($locator = null) {
        if ($locator instanceof Locator) {
            $mapper = $locator->mapper(CompetencyEntity::class);
            $this->setMapper($mapper);
        }
    }

    /**
     * @return \Spot\Mapper
     */
    public function getMapper() {
        return $this->mapper;
    }

    /**
     * @param \Spot\Mapper $mapper
     */
    public function setMapper($mapper) {
        $this->mapper = $mapper;
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

        $mapper = $this->getMapper();
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
            }

        }

        return $professions;
    }
}