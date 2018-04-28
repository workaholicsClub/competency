<?php

namespace Competencies\Session;

use Competencies\Skill\Skill;
use Competencies\User\UserEntity;
use Exception;
use Spot\Entity;
use Spot\Mapper;
use Spot\MapperInterface;

class SessionMapper extends Mapper
{
    /**
     * @param string $uuid
     * @return SessionEntity|bool
     */
    public function loadByUuid(string $uuid) {
        return $this->first(['uuid' => $uuid]);
    }

    /**
     * @param string $uuid
     * @return bool
     */
    public function sessionExist(string $uuid): bool {
        $sessionEntity = $this->loadByUuid($uuid);
        return $sessionEntity instanceof SessionEntity ? true : false;
    }

    /**
     * @return Mapper
     */
    public function getSessionSkillMapper() {
        return $this->getMapper(SessionSkillEntity::class);
    }

    /**
     * @param Skill $skill
     * @param Entity $sessionSkillLink
     * @return bool
     */
    protected function updateSkillInDatabase(Skill $skill, Entity $sessionSkillLink): bool {
        $mapper = $this->getSessionSkillMapper();
        if ($skill->getLevel() != $sessionSkillLink->get('level')) {
            $sessionSkillLink->set('level', $skill->getLevel());

            try {
                $mapper->update($sessionSkillLink);
            }
            catch (Exception $e) {
                return false;
            }
        }

        return true;
    }

    /**
     * @param Skill $skill
     * @param string $sessionId
     * @return bool
     */
    protected function createSkillInDatabase(Skill $skill, string $sessionId): bool {
        $mapper = $this->getSessionSkillMapper();
        $courseSkillLink = new SessionSkillEntity([
            'sessionId'     => $sessionId,
            'atomicSkillId' => $skill->getId(),
            'level'         => $skill->getLevel(),
        ]);

        $saveResult = $mapper->save($courseSkillLink);
        if (!$saveResult) {
            return false;
        }

        return true;
    }

    /**
     * @param Skill[] $currentSkills
     * @param string $sessionId
     * @return bool
     */
    protected function removeOldSkillsFromDatabase(array $currentSkills, string $sessionId): bool {
        $mapper = $this->getSessionSkillMapper();
        $currentSkillIds = array_reduce($currentSkills, function ($accumulator, $skill) {
            /**
             * @var Skill $skill
             */
            $accumulator[] = $skill->getId();
            return $accumulator;
        }, []);

        $deleteResult = $mapper->delete(['sessionId' => $sessionId, 'atomicSkillId NOT IN' => $currentSkillIds]);

        return $deleteResult;
    }

    /**
     * @param SessionEntity $sessionEntity
     * @param Skill[] $skills
     * @return bool
     */
    public function syncSessionSkills(SessionEntity $sessionEntity, array $skills) {
        $mapper = $this->getSessionSkillMapper();
        $sessionId = $sessionEntity->get('id');

        foreach ($skills as $skill) {
            $sessionSkillLink = $mapper->where([
                'sessionId'     => $sessionId,
                'atomicSkillId' => $skill->getId(),
            ])->first();

            if ($sessionSkillLink) {
                $this->updateSkillInDatabase($skill, $sessionSkillLink);
            }
            else {
                $this->createSkillInDatabase($skill, $sessionId);
            }
        }

        $this->removeOldSkillsFromDatabase($skills, $sessionId);

        return true;
    }

    /**
     * @param Session $session
     * @return UserEntity|bool
     */
    public function getOrCreateSessionUserEntity(Session $session) {
        $user = $session->getUser();
        $user->setMapper( $this->getMapper(UserEntity::class) );
        $userEntity = $user->load();

        if (!$userEntity) {
            try {
                $saveResult = $user->save();
            }
            catch (\Exception $e) {
                return false;
            }

            if (!$saveResult) {
                return false;
            }

            $userEntity = $user->load();
        }

        return $userEntity;
    }

    /**
     * @param Session $session
     * @return bool
     */
    public function createSession(Session $session): bool {
        $userEntity = $this->getOrCreateSessionUserEntity($session);

        $sessionEntity = new SessionEntity([
            'uuid'   => $session->getUuid(),
            'userId' => $userEntity->get('id'),
        ]);

        $saveResult = $this->save($sessionEntity);
        if (!$saveResult) {
            return false;
        }

        $skillResult = $this->syncSessionSkills($sessionEntity, $session->getSkills());
        $createResult = $skillResult;

        return $createResult;
    }

    public function updateSession(Session $session) {
        $userEntity = $this->getOrCreateSessionUserEntity($session);
        $sessionEntity = $this->loadByUuid($session->getUuid());
        $sessionEntity->set('userId', $userEntity->get('id'));

        $saveResult = $this->save($sessionEntity);
        if ($saveResult === false) {
            return false;
        }

        $skillResult = $this->syncSessionSkills($sessionEntity, $session->getSkills());
        $updateResult = $skillResult;

        return $updateResult;
    }

    public function saveSession(Session $session) {
        if ( $this->sessionExist($session->getUuid()) ) {
            return $this->updateSession($session);
        }
        else {
            return $this->createSession($session);
        }
    }
}