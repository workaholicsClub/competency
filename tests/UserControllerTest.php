<?php

use Competencies\MailerInterface;
use Competencies\User\UserController;
use Competencies\UserModelInterface;
use Mailgun\Model\Message\SendResponse;
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

    private function getUserControllerInstance($user = null, $mailer = null) {
        if (is_null($user)) {
            $user = $this->getUser();
        }

        if (is_null($mailer)) {
            $mailer = $this->getMailer();
        }

        $controller = new UserController($user, $mailer);

        return $controller;
    }

    public function testSendLoginEmail() {
        $testEmail = 'test@mailinator.com';

        $user = $this->getUser();
        $user
            ->expects($this->once())
            ->method('getEmail')
            ->willReturn($testEmail);

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

        $controller = $this->getUserControllerInstance($user, $mailer);
        $isSuccess = $controller->sendLoginEmail();
        $this->assertTrue($isSuccess);
    }
}