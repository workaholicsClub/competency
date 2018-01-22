<?php

namespace Competencies\Mail;

use Competencies\MailerInterface;
use Mailgun\Mailgun;

class MailgunMailer implements MailerInterface
{
    private $client;
    private $domain;

    public function __construct($key, $domain) {
        $this->client = Mailgun::create($key);
        $this->domain = $domain;
    }

    public function sendMessage($subject, $text, $emailTo) {
        $message = $this->client->messages();

        $sendResponse = $message->send($this->domain, [
            'from'    => "Самооценка <postmaster@{$this->domain}>",
            'to'      => $emailTo,
            'subject' => $subject,
            'text'    => $text
        ]);

        $responseSuccessful = !empty( $sendResponse->getId() );
        return $responseSuccessful;
    }

}