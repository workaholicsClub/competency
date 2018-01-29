<?php

use Competencies\Mocks\Database;
use Competencies\User\UserEntity;
use Competencies\User\UserModel;
use PHPUnit\Framework\TestCase;

class UserModelTest extends TestCase
{
    public function testMake() {
        $testEmail = 'ap@mailinator.com';
        $instance = UserModel::make($testEmail);

        $this->assertEquals($instance->getEmail(), $testEmail);
        $this->assertNull($instance->getName());
    }

    public function testMakeFromToken() {
        $testEmail = 'ap@mailinator.com';
        $testToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJtYXRyaXgiLCJpYXQiOjE1MTM3MDAwMDAsImV4cCI6MTUxMzcxMDgwMCwiZW1haWwiOiJhcEBtYWlsaW5hdG9yLmNvbSJ9.oW5Ym4MT-HmKQlXIPd1u7bJBdJRyWU6B6wzJN7pNh90';

        $instance = UserModel::makeFromToken($testToken);
        $this->assertEquals($testEmail, $instance->getEmail());
    }

    public function testLoad() {
        $testEmail = 'ap@mailinator.com';
        $locator = Database::getTest();
        $instance = UserModel::make($testEmail, $locator);

        $entity = $instance->load();

        $this->assertInstanceOf(UserEntity::class, $entity);
        $this->assertEquals($testEmail, $entity->get('email'));
    }

    public function testSaveNew() {
        $testEmail = 'ap2@mailinator.com';
        $locator = Database::getTest();
        $instance = UserModel::make($testEmail, $locator);

        $saveResult = $instance->save();

        $this->assertTrue($saveResult);
    }

    public function testSaveExistant() {
        $testEmail = 'ap@mailinator.com';
        $locator = Database::getTest();
        $instance = UserModel::make($testEmail, $locator);
        $instance->setSubscribe( UserModel::SUBSCRIBE_COURSES );
        $instance->setRemindMonths(6);

        $saveResult = $instance->save();

        $this->assertTrue($saveResult);
        $userEntity = $instance->load();

        $this->assertEquals($userEntity->get('remindMonths'), 6);
        $this->assertEquals($userEntity->get('subscribe'), UserModel::SUBSCRIBE_COURSES);
    }

    public function testToken() {
        $testEmail = 'ap@mailinator.com';
        $instance = UserModel::make($testEmail);

        $issuedAt = 1513700000;
        $generatedToken = $instance->getToken($issuedAt);

        $expectedToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJtYXRyaXgiLCJpYXQiOjE1MTM3MDAwMDAsImV4cCI6MTUxMzcxMDgwMCwiZW1haWwiOiJhcEBtYWlsaW5hdG9yLmNvbSJ9.oW5Ym4MT-HmKQlXIPd1u7bJBdJRyWU6B6wzJN7pNh90';
        $this->assertEquals($expectedToken, $generatedToken);
    }

    /**
     * @expectedException Exception
     */
    public function testSaveException() {
        $instance = UserModel::make();
        $instance->save();
    }
}