<?php

namespace Competencies\Session;

use Competencies\Skill\Skill;
use Competencies\User\UserModel;

class Session
{
    /**
     * @var string
     */
    private $uuid;

    /**
     * @var Skill[]
     */
    private $skills = [];

    /**
     * @var UserModel
     */
    private $user;

    public static function fromArray($sessionProps): Session {
        $instance = new Session();

        $fieldSetters = [
            'uuid'   => 'setUuid',
            'skills' => 'setSkills',
            'user'   => 'setUser',
        ];

        foreach ($fieldSetters as $fieldName => $setterName) {
            if ( isset($sessionProps[$fieldName]) ) {
                $instance->$setterName($sessionProps[$fieldName]);
            }
        }

        return $instance;
    }

    public static function __set_state(array $sessionProps): Session {
        return self::fromArray($sessionProps);
    }

    public static function fromEntity(SessionEntity $entity) {
        $skillLinks = $entity->relation('skillLinks')->execute();

        $skills = [];
        foreach ($skillLinks as $skillLink) {
            $skills[] = Skill::fromLinkEntity($skillLink);
        }

        $props = $entity->toArray();
        $props['skills'] = $skills;

        $userEntity = $entity->relation('user')->execute();
        $user = UserModel::makeFromEntity($userEntity);
        $props['user'] = $user;

        $instance = self::fromArray($props);
        return $instance;
    }

    /**
     * @return string
     */
    public function getUuid(): string {
        return $this->uuid;
    }

    /**
     * @param string $uuid
     */
    public function setUuid(string $uuid) {
        $this->uuid = $uuid;
    }

    /**
     * @return Skill[]
     */
    public function getSkills(): array {
        return $this->skills;
    }

    /**
     * @return array
     */
    public function getSkillsAsHash(): array {
        $skillsHash = [];
        foreach ($this->getSkills() as $skill) {
            $skillsHash[$skill->getId()] = $skill->getLevel();
        }

        return $skillsHash;
    }

    /**
     * @param Skill[] $skills
     */
    public function setSkills(array $skills) {
        $this->skills = $skills;
    }

    public function addSkill(Skill $skill) {
        $this->skills[] = $skill;
    }

    /**
     * @return UserModel
     */
    public function getUser(): UserModel {
        return $this->user;
    }

    /**
     * @param UserModel $user
     */
    public function setUser(UserModel $user) {
        $this->user = $user;
    }
}