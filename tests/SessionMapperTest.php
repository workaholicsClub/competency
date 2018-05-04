<?php

use Competencies\Mocks\Database;
use Competencies\Session\Session;
use Competencies\Session\SessionEntity;
use Competencies\Session\SessionMapper;
use Competencies\Skill\Skill;
use Competencies\Skill\SkillEntity;
use Competencies\Skill\SkillMapper;
use Competencies\User\UserModel;
use PHPUnit\Framework\TestCase;
use Spot\Locator;

class SessionMapperTest extends TestCase
{
    public function testLoadByUuid() {
        $testUuid = '05313d2c-fcfc-4374-966c-59fe59ddbe02';
        $locator = Database::getTest();

        /**
         * @var SessionMapper $mapper
         */
        $mapper = $locator->mapper(SessionEntity::class);
        $sessionEntity = $mapper->loadByUuid($testUuid);
        $this->assertInstanceOf(SessionEntity::class, $sessionEntity);
        $this->assertEquals($testUuid, $sessionEntity->get('uuid'));
    }

    public function testGetByUuid() {
        $testUuid = '05313d2c-fcfc-4374-966c-59fe59ddbe02';
        $nonExistentUuid = '13e8084b-5ba2-490e-897c-0aa333027c6f';
        $locator = Database::getTest();

        /**
         * @var SessionMapper $mapper
         */
        $mapper = $locator->mapper(SessionEntity::class);
        $session = $mapper->getByUuid($testUuid);
        $this->assertInstanceOf(Session::class, $session);
        $this->assertEquals($testUuid, $session->getUuid());

        $nonExistentSession = $mapper->getByUuid($nonExistentUuid);
        $this->assertFalse($nonExistentSession);
    }

    public function testSessionExists() {
        $existentUuid = '05313d2c-fcfc-4374-966c-59fe59ddbe02';
        $nonExistentUuid = '2a05c565-86f9-4825-b86e-4d0439d7390';
        $locator = Database::getTest();

        /**
         * @var SessionMapper $mapper
         */
        $mapper = $locator->mapper(SessionEntity::class);

        $this->assertTrue($mapper->sessionExist($existentUuid));
        $this->assertFalse($mapper->sessionExist($nonExistentUuid));
    }

    public function testCreateSession() {
        $existentEmail = 'ap@mailinator.com';
        $newEmail = 'ap2@mailinator.com';

        $expectedPropsOldUser = [
            'uuid'   => '38d424ef-0176-4cc2-8af3-3a839b444bb0',
            'skills' => [
                Skill::fromArray(['id' => 1]),
            ],
            'user'   => UserModel::make($existentEmail),
        ];

        $expectedPropsNewUser = [
            'uuid'   => '2a05c565-86f9-4825-b86e-4d0439d73903',
            'skills' => [
                Skill::fromArray(['id' => 1]),
                Skill::fromArray(['id' => 2]),
            ],
            'user'   => UserModel::make($newEmail),
        ];

        $sessionOldUser = Session::fromArray($expectedPropsOldUser);
        $sessionNewUser = Session::fromArray($expectedPropsNewUser);

        $locator = Database::getTest();

        /**
         * @var SessionMapper $mapper
         */
        $mapper = $locator->mapper(SessionEntity::class);
        $createOldUserResult = $mapper->createSession($sessionOldUser);
        $createNewUserResult = $mapper->createSession($sessionNewUser);

        $this->assertTrue($createOldUserResult);
        $this->assertTrue($createNewUserResult);

        $oldUserSessionEntity = $mapper->loadByUuid($expectedPropsOldUser['uuid']);
        $newUserSessionEntity = $mapper->loadByUuid($expectedPropsNewUser['uuid']);

        $this->assertGreaterThan(0, $oldUserSessionEntity->get('id'));
        $this->assertGreaterThan(0, $newUserSessionEntity->get('id'));
        $this->assertGreaterThan(0, $oldUserSessionEntity->get('userId'));
        $this->assertGreaterThan(0, $newUserSessionEntity->get('userId'));
        $this->assertEquals($expectedPropsOldUser['uuid'], $oldUserSessionEntity->get('uuid'));
        $this->assertEquals($expectedPropsNewUser['uuid'], $newUserSessionEntity->get('uuid'));

        $loadedOldSession = Session::fromEntity($oldUserSessionEntity);
        $loadedNewSession = Session::fromEntity($newUserSessionEntity);

        $this->assertCount(1, $loadedOldSession->getSkills());
        $this->assertEquals('1', $loadedOldSession->getSkills()[0]->getId());

        $this->assertCount(2, $loadedNewSession->getSkills());
        $this->assertEquals('1', $loadedNewSession->getSkills()[0]->getId());
        $this->assertEquals('2', $loadedNewSession->getSkills()[1]->getId());
    }

    public function testSyncSkills() {
        $testUuid = '05313d2c-fcfc-4374-966c-59fe59ddbe02';
        $skillsExpectedAfterSync = [
            '208' => 'skill',
            '209' => 'knowledge',
            '210' => 'ability',
        ];
        $locator = Database::getTest();

        /**
         * @var SessionMapper $mapper
         */
        $mapper = $locator->mapper(SessionEntity::class);
        $skillMapper = $locator->mapper(SkillEntity::class);
        $sessionEntity = $mapper->loadByUuid($testUuid);

        /**
         * @var SkillEntity $oldSkillEntity
         * @var SkillEntity $oldSkillNewLevelEntity
         * @var SkillEntity $newSkillEntity
         */
        $oldSkillEntity = $skillMapper->first(['id' => '208']);
        $oldSkillNewLevelEntity = $skillMapper->first(['id' => '209']);
        $newSkillEntity = $skillMapper->first(['id' => '210']);

        $oldSkill = Skill::fromEntity( $oldSkillEntity );
        $oldSkill->setLevel(Skill::LEVEL_SKILL);
        $oldSkillNewLevel = Skill::fromEntity($oldSkillNewLevelEntity);
        $oldSkillNewLevel->setLevel(Skill::LEVEL_KNOWLEDGE);
        $newSkill = Skill::fromEntity($newSkillEntity);
        $newSkill->setLevel(Skill::LEVEL_ABILITY);

        $syncResult = $mapper->syncSessionSkills($sessionEntity, [
            $oldSkill,
            $oldSkillNewLevel,
            $newSkill,
        ]);

        $this->assertTrue($syncResult);

        $sessionEntityAfterUpdate = $mapper->loadByUuid($testUuid);
        $sessionAfterUpdate = Session::fromEntity($sessionEntityAfterUpdate);

        $this->assertEquals($skillsExpectedAfterSync, $sessionAfterUpdate->getSkillsAsHash());
    }

    /**
     * @param array $skillHash
     * @param Locator $locator
     * @return array
     */
    public function makeSkillArrayFromHash(array $skillHash, Locator $locator) {
        /**
         * @var SkillMapper $skillMapper
         */
        $skillMapper = $locator->mapper(SkillEntity::class);
        return $skillMapper->makeSkillArrayFromHash($skillHash);
    }

    public function testUpdateSession() {
        $testUuid = '05313d2c-fcfc-4374-966c-59fe59ddbe02';
        $newEmail = 'ap2@mailinator.com';
        $locator = Database::getTest();
        $skillsExpectedAfterUpdate = [
            '211' => 'knowledge',
        ];

        /**
         * @var SessionMapper $mapper
         */
        $mapper = $locator->mapper(SessionEntity::class);

        $sessionEntity = $mapper->loadByUuid($testUuid);
        $session = Session::fromEntity($sessionEntity);

        $newUser = UserModel::make($newEmail);
        $newSkills = $this->makeSkillArrayFromHash($skillsExpectedAfterUpdate, $locator);

        $session->setSkills($newSkills);
        $session->setUser($newUser);

        $updateResult = $mapper->updateSession($session);
        $this->assertTrue($updateResult);

        $sessionAfterUpdateEntity = $mapper->loadByUuid($testUuid);
        $sessionAfterUpdate = Session::fromEntity($sessionAfterUpdateEntity);

        $this->assertEquals($testUuid, $sessionAfterUpdate->getUuid());
        $this->assertEquals($skillsExpectedAfterUpdate, $sessionAfterUpdate->getSkillsAsHash());
    }

    public function testSave() {
        $existentUuid = '05313d2c-fcfc-4374-966c-59fe59ddbe02';
        $nonExistentUuid = '2a05c565-86f9-4825-b86e-4d0439d7390';
        $expectedEmail = 'ap2@mailinator.com';
        $user = UserModel::make($expectedEmail);
        $newSkillsHash = [
            '209' => 'knowledge',
            '221' => 'ability',
            '210' => 'skill',
        ];

        $locator = Database::getTest();

        /**
         * @var SessionMapper $mapper
         */
        $mapper = $locator->mapper(SessionEntity::class);
        $newSkills = $this->makeSkillArrayFromHash($newSkillsHash, $locator);

        $existentSession = Session::fromArray([
            'uuid' => $existentUuid,
            'skills' => $newSkills,
            'user' => $user,
        ]);

        $nonExistentSession = Session::fromArray([
            'uuid' => $nonExistentUuid,
            'skills' => $newSkills,
            'user' => $user,
        ]);

        $existentSaveResult = $mapper->saveSession($existentSession);
        $nonExistentSaveResult = $mapper->saveSession($nonExistentSession);

        $this->assertTrue($existentSaveResult);
        $this->assertTrue($nonExistentSaveResult);

        $existentSession = Session::fromEntity($mapper->loadByUuid($existentUuid));
        $nonExistentSession = Session::fromEntity($mapper->loadByUuid($nonExistentUuid));

        $this->assertEquals($expectedEmail, $existentSession->getUser()->getEmail());
        $this->assertEquals($expectedEmail, $nonExistentSession->getUser()->getEmail());
        $this->assertEquals($newSkillsHash, $existentSession->getSkillsAsHash());
        $this->assertEquals($newSkillsHash, $nonExistentSession->getSkillsAsHash());
    }
}