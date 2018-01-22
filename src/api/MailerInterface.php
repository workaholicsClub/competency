<?php

namespace Competencies;

interface MailerInterface
{
    /**
     * @param $subject
     * @param $text
     * @param $emailTo
     * @return mixed
     */
    public function sendMessage($subject, $text, $emailTo);
}