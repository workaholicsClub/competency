<?php

namespace Competencies\User;

use Competencies\MailerInterface;
use Competencies\UserModelInterface;

class Controller
{
    private $user;
    private $mailer;

    /**
     * Controller constructor.
     * @param UserModelInterface $user
     * @param MailerInterface    $mailer
     * @internal param $db
     */
    public function __construct(UserModelInterface $user, MailerInterface $mailer) {
        $this->user = $user;
        $this->mailer = $mailer;
    }

    public function sendLoginEmail() {
        $token = $this->user->getToken();
        $emailTo = $this->user->getEmail();

        $message = "Ваша ссылка для входа: <a href=\"http://competencies.local/?token={$token}\">войти</a>";
        $subject = "Ссылка для входа";

        $responseSuccessful = $this->mailer->sendMessage($subject, $message, $emailTo);
        return $responseSuccessful;
    }

}