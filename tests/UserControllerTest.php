<?php

use Competencies\Competency\CompetencyModel;
use Competencies\MailerInterface;
use Competencies\Mocks\Database;
use Competencies\Poll\PollModel;
use Competencies\User\UserController;
use Competencies\User\UserModel;
use Competencies\UserModelInterface;
use PHPUnit\Framework\TestCase;

class UserControllerTest extends TestCase
{
    private function getMailer() {
        $mailer = $this
            ->getMockBuilder(MailerInterface::class)
            ->getMock();

        return $mailer;
    }

    private function getUser() {
        $user = $this
            ->getMockBuilder(UserModelInterface::class)
            ->getMock();

        return $user;
    }

    private function getUserControllerInstance($user = null) {
        if (is_null($user)) {
            $user = $this->getUser();
        }

        $controller = new UserController($user);

        return $controller;
    }

    public function testSendLoginEmail() {
        $testEmail = 'test@mailinator.com';

        $locator = Database::getTest();
        $userModel = UserModel::make($testEmail, $locator);

        $sendMailResponse = true;

        $mailer = $this->getMailer();
        $mailer
            ->expects($this->once())
            ->method('sendMessage')
            ->with(
                $this->anything(),
                $this->anything(),
                $testEmail
            )
            ->willReturn($sendMailResponse);

        $controller = $this->getUserControllerInstance($userModel);
        $isSuccess = $controller->sendLoginEmail($mailer);
        $this->assertTrue($isSuccess);
    }

    public function testSavePollResults() {
        $pollResults = [
            'javascript'         => 0.5,
            'frontendTech'       => 0.75,
            'baseWebDevelopment' => 0.5
        ];

        $testEmail = 'ap@mailinator.com';

        $locator = Database::getTest();
        $pollModel = PollModel::make($locator);
        $userModel = UserModel::make($testEmail, $locator);
        $competencyModel = CompetencyModel::make($locator);

        $controller = $this->getUserControllerInstance($userModel);
        $isSuccess = $controller->savePollResults($pollResults, $competencyModel, $pollModel);
        $this->assertTrue($isSuccess);
    }
}