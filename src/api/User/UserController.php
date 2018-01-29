<?php

namespace Competencies\User;

use Competencies\Competency\CompetencyModel;
use Competencies\MailerInterface;
use Competencies\Poll\PollModel;
use Competencies\UserModelInterface;

class UserController
{
    /**
     * @var UserModelInterface $user
     */
    private $user;

    /**
     * @param UserModelInterface $user
     */
    public function __construct(UserModelInterface $user) {
        $this->user = $user;
    }

    public function sendLoginEmail(MailerInterface $mailer) {
        $token = $this->user->getToken();
        $emailTo = $this->user->getEmail();

        $message = "Ваша ссылка для входа: <a href=\"http://competencies.local/?token={$token}\">войти</a>";
        $subject = "Ссылка для входа";

        $responseSuccessful = $mailer->sendMessage($subject, $message, $emailTo);
        return $responseSuccessful;
    }


    /**
     * @param array           $pollResults
     * @param CompetencyModel $competencyModel
     * @param PollModel       $pollModel
     * @return bool
     */
    public function savePollResults($pollResults, $competencyModel, $pollModel) {
        $userEntity = $this->user->load();
        $saveResult = $pollModel->save($pollResults, $userEntity, $competencyModel);
        return $saveResult;
    }
}