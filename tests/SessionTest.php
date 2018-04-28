<?php

use Competencies\Mocks\Database;
use Competencies\Session\Session;
use Competencies\Session\SessionEntity;
use Competencies\Skill\Skill;
use Competencies\User\UserModel;
use PHPUnit\Framework\TestCase;

class SessionTest extends TestCase
{
    public function testFromArray() {
        $testEmail = 'ap2@mailinator.com';

        $expectedProps = [
            'uuid'   => '05313d2c-fcfc-4374-966c-59fe59ddbe02',
            'skills' => [
                Skill::fromArray(['id' => 1]),
            ],
            'user'   => UserModel::make($testEmail),
        ];

        $session = Session::fromArray($expectedProps);

        $this->assertEquals($expectedProps['uuid'], $session->getUuid());
        $this->assertEquals($expectedProps['skills'], $session->getSkills());
        $this->assertEquals($testEmail, $session->getUser()->getEmail());
    }

    public function testSetState() {
        $testEmail = 'ap2@mailinator.com';

        $expectedProps = [
            'uuid'   => '05313d2c-fcfc-4374-966c-59fe59ddbe02',
            'skills' => [
                Skill::fromArray(['id' => 1]),
            ],
            'user'   => UserModel::make($testEmail),
        ];

        $session = Session::__set_state($expectedProps);

        $this->assertEquals($expectedProps['uuid'], $session->getUuid());
        $this->assertEquals($expectedProps['skills'], $session->getSkills());
        $this->assertEquals($testEmail, $session->getUser()->getEmail());
    }

    public function testGetSkillsAsHash() {
        $expectedHash = [
            '1' => 'none',
            '2' => 'knowledge',
            '3' => 'ability',
        ];

        $session = Session::fromArray([
            'skills' => [
                Skill::fromArray(['id' => 1]),
                Skill::fromArray(['id' => 2, 'level' => Skill::LEVEL_KNOWLEDGE]),
                Skill::fromArray(['id' => 3, 'level' => Skill::LEVEL_ABILITY]),
            ]
        ]);

        $this->assertEquals($expectedHash, $session->getSkillsAsHash());
    }

    public function testFromEntity() {
        $sessionId = 1;
        $expectedProps = [
            'uuid'   => '05313d2c-fcfc-4374-966c-59fe59ddbe02',
            'skills' => [
                '207' => 'knowledge',
                '208' => 'skill',
                '209' => 'ability',
                '221' => 'skill',
            ],
            'user'   => 'ap@mailinator.com',
        ];

        $locator = Database::getTest();
        /**
         * @var SessionEntity $sessionEntity
         */
        $sessionEntity = $locator->mapper(SessionEntity::class)->first(['id' => $sessionId]);
        $session = Session::fromEntity($sessionEntity);

        $this->assertEquals($expectedProps['uuid'], $session->getUuid());
        $this->assertEquals($expectedProps['skills'], $session->getSkillsAsHash());
        $this->assertEquals($expectedProps['user'], $session->getUser()->getEmail());
    }
}