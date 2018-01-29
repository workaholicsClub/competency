<?php

use Competencies\Competency\CompetencyModel;
use Competencies\Mocks\Database;
use Competencies\Poll\PollModel;
use Competencies\User\UserModel;
use PHPUnit\Framework\TestCase;

class PollModelTest extends TestCase
{
    public function testMake() {
        $instance = PollModel::make();

        $this->assertInstanceOf(PollModel::class, $instance);
    }

    public function testSave() {
        $pollResults = [
            'javascript'         => 0.5,
            'frontendTech'       => 0.75,
            'baseWebDevelopment' => 0.5
        ];

        $testEmail = 'ap@mailinator.com';

        $locator = Database::getTest();
        $pollModel = PollModel::make($locator);
        $userModel = UserModel::make($testEmail, $locator);
        $userEntity = $userModel->load();
        $competencyModel = CompetencyModel::make($locator);

        $saveResult = $pollModel->save($pollResults, $userEntity, $competencyModel);

        $this->assertTrue($saveResult);
    }
}