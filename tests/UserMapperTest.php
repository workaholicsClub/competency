<?php

use Competencies\Mocks\Database;
use Competencies\User\UserEntity;
use Competencies\User\UserMapper;
use Competencies\User\UserModel;
use PHPUnit\Framework\TestCase;

class UserMapperTest extends TestCase
{
    public function testLoadByEmail() {
        $testEmail = 'ap@mailinator.com';
        $locator = Database::getTest();

        /**
         * @var UserMapper $mapper
         */
        $mapper = $locator->mapper(UserEntity::class);
        $userEntity = $mapper->loadByEmail($testEmail);
        $this->assertInstanceOf(UserEntity::class, $userEntity);
        $this->assertEquals($testEmail, $userEntity->get('email'));
    }

    public function testLoadByUuid() {
        $testUuid = 'da8c4a60-f28d-49fc-a6c2-1a6924bbf0bf';
        $locator = Database::getTest();

        /**
         * @var UserMapper $mapper
         */
        $mapper = $locator->mapper(UserEntity::class);
        $userEntity = $mapper->loadByUuid($testUuid);
        $this->assertInstanceOf(UserEntity::class, $userEntity);
        $this->assertEquals($testUuid, $userEntity->get('uuid'));
    }

    public function testGetByUuid() {
        $testUuid = 'da8c4a60-f28d-49fc-a6c2-1a6924bbf0bf';
        $nonExistentUuid = '13e8084b-5ba2-490e-897c-0aa333027c6f';
        $locator = Database::getTest();

        /**
         * @var UserMapper $mapper
         */
        $mapper = $locator->mapper(UserEntity::class);
        $user = $mapper->getByUuid($testUuid);
        $this->assertInstanceOf(UserModel::class, $user);
        $this->assertEquals($testUuid, $user->getUuid());
        $this->assertEquals('app@mailinator.com', $user->getEmail());

        $nonExistentUser = $mapper->getByUuid($nonExistentUuid);
        $this->assertEquals($nonExistentUuid, $nonExistentUser->getUuid());
        $this->assertNull($nonExistentUser->getEmail());
    }
}