<?php

namespace Competencies\Poll;

use Competencies\Competency\CompetencyModel;
use Competencies\Poll\PollEntity;
use Competencies\User\UserEntity;
use Competencies\User\UserModel;
use function FastRoute\TestFixtures\empty_options_cached;
use Spot\Locator;

class PollModel
{
    /**
     * @var Locator|null $locator
     */
    private $locator;

    /**
     * @param Locator|null $locator
     * @return PollModel
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
    public function getMapper($entityClass = PollEntity::class) {
        return $this->locator->mapper($entityClass);
    }

    /**
     * @param array           $results
     * @param UserEntity      $userEntity
     * @param CompetencyModel $competencyMapper
     * @return bool
     */
    public function save($results = [], $userEntity, $competencyMapper): bool {
        $competencyCodes = array_keys($results);

        if (empty($competencyCodes)) {
            return false;
        }

        $pollMapper = $this->getMapper(PollEntity::class);
        $pollEntity = $pollMapper->build([
            'date'         => new \DateTime(),
            'userId'       => $userEntity->get('id'),
        ]);
        $pollId = $pollMapper->save($pollEntity);

        if ($pollId === false) {
            return false;
        }

        $competencies = $competencyMapper->loadMultiple($competencyCodes);
        $allResultsSuccess = true;
        $resultsMapper = $this->getMapper(PollResultEntity::class);

        foreach ($competencies as $competencyEntity) {
            $grade = $results[$competencyEntity->get('code')];

            $pollResultEntity = $resultsMapper->build([
                'grade'        => $grade,
                'pollId'       => $pollId,
                'competencyId' => $competencyEntity->get('id'),
            ]);
            $pollResultId = $resultsMapper->save($pollResultEntity);

            $allResultsSuccess = $allResultsSuccess && $pollResultId !== false;
        }

        return $allResultsSuccess;
    }
}