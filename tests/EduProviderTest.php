<?php

use Competencies\EduProvider\EduProvider;
use Competencies\EduProvider\EduProviderEntity;
use Competencies\Mocks\Database;
use PHPUnit\Framework\TestCase;

class EduProviderTest extends TestCase {

    public function testFromArray() {
        $expectedProps = [
            'code' => 'stepik',
            'name' => 'Stepik',
            'url' => 'http://welcome.stepik.org/ru'
        ];

        $eduProvider = EduProvider::fromArray($expectedProps);

        $this->assertEquals($expectedProps['code'], $eduProvider->getCode());
        $this->assertEquals($expectedProps['name'], $eduProvider->getName());
        $this->assertEquals($expectedProps['url'], $eduProvider->getUrl());
    }

    public function testFromEntity() {
        $expectedProps = [
            'code' => 'stepik',
            'name' => 'Stepik',
            'url' => 'http://welcome.stepik.org/ru'
        ];
        $locator = Database::getTest();
        /**
         * @var EduProviderEntity $providerEntity
         */
        $providerEntity = $locator->mapper(EduProviderEntity::class)->loadByCode('stepik');
        $eduProvider = EduProvider::fromEntity($providerEntity);

        $this->assertInstanceOf(EduProvider::class, $eduProvider);
        $this->assertEquals($expectedProps['code'], $eduProvider->getCode());
        $this->assertEquals($expectedProps['name'], $eduProvider->getName());
        $this->assertEquals($expectedProps['url'], $eduProvider->getUrl());
    }

    public function testSetState() {
        $expectedProps = [
            'code' => 'stepik',
            'name' => 'Stepik',
            'url' => 'http://welcome.stepik.org/ru'
        ];

        $eduProvider = EduProvider::__set_state($expectedProps);

        $this->assertEquals($expectedProps['code'], $eduProvider->getCode());
        $this->assertEquals($expectedProps['name'], $eduProvider->getName());
        $this->assertEquals($expectedProps['url'], $eduProvider->getUrl());
    }

    public function testToArray() {
        $expectedProps = [
            'code' => 'stepik',
            'name' => 'Stepik',
            'url' => 'http://welcome.stepik.org/ru'
        ];

        $eduProvider = EduProvider::fromArray($expectedProps);
        $providerData = $eduProvider->toArray();
        $this->assertEquals($expectedProps, $providerData);
    }

}