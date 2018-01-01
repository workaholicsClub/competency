<?php

use Competencies\Entity\UserEntity;
use Competencies\User\UserModel;
use PHPUnit\Framework\TestCase;
use Spot\Mapper;

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

    public function testSaveNew() {
        $testEmail = 'ap@mailinator.com';
        $instance = UserModel::make($testEmail);

        $entity = new UserEntity();

        $mapper = $this->createMock(Mapper::class);

        $mapper
            ->expects($this->once())
            ->method('first')
            ->with([
                'email' => $testEmail
            ])
            ->willReturn(false);

        $mapper
            ->expects($this->once())
            ->method('build')
            ->with([
                'name'  => null,
                'email' => $testEmail
            ])
            ->willReturn($entity);

        $mapper
            ->expects($this->once())
            ->method('save')
            ->with($entity)
            ->willReturn("1");

        $instance->setMapper($mapper);

        $saveResult = $instance->saveToDatabase();

        $this->assertTrue($saveResult);
    }

    public function testSaveExistant() {
        $testEmail = 'ap@mailinator.com';
        $instance = UserModel::make($testEmail);

        $entity = new UserEntity();

        $mapper = $this->createMock(Mapper::class);

        $mapper
            ->expects($this->once())
            ->method('first')
            ->with([
                'email' => $testEmail
            ])
            ->willReturn($entity);

        $mapper
            ->expects($this->once())
            ->method('save')
            ->with($entity)
            ->willReturn(0);

        $instance->setMapper($mapper);

        $saveResult = $instance->saveToDatabase();

        $this->assertTrue($saveResult);
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
        $instance->saveToDatabase();
    }
}