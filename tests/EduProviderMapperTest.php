<?php

use Competencies\EduProvider\EduProviderEntity;
use Competencies\EduProvider\EduProviderMapper;
use Competencies\Mocks\Database;
use PHPUnit\Framework\TestCase;

class EduProviderMapperTest extends TestCase {

    public function testMake() {
        $locator = Database::getTest();
        $mapper = $locator->mapper(EduProviderEntity::class);

        $this->assertInstanceOf(EduProviderMapper::class, $mapper);
    }

    public function testLoadByCode() {
        $testCode = 'stepik';
        $locator = Database::getTest();
        /**
         * @var EduProviderMapper $instance
         */
        $instance = $locator->mapper(EduProviderEntity::class);
        $entity = $instance->loadByCode($testCode);

        $this->assertInstanceOf(EduProviderEntity::class, $entity);
        $this->assertEquals($testCode, $entity->get('code'));
    }
}