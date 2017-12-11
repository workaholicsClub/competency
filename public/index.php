<?php
require '../vendor/autoload.php';

use Competencies\Mail\MailgunMailer;
use Competencies\User\Controller;
use Competencies\User\Model;
use \Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;
use Slim\Http\Response;
use Spot\Config;
use Spot\Locator;

$settings = [
    'mysql_dsn'      => getenv('MYSQL_DSN'),
    'mailgun_key'    => getenv('MAILGUN_KEY'),
    'mailgun_domain' => getenv('MAILGUN_DOMAIN'),

    'debug'               => true,
    'displayErrorDetails' => true,
];

$ormConfig = new Config();
$ormConfig->addConnection('mysql', $settings['mysql_dsn']);
$orm = new Locator($ormConfig);

$mailer = new MailgunMailer($settings['mailgun_key'], $settings['mailgun_domain']);

$app = new App([
    'settings' => $settings,
    'db'       => $orm,
    'mailer'   => $mailer,
]);

$app->get('/user/token/{email}', function (Request $request, Response $response) {
    $email = $request->getAttribute('email');

    $userModel = Model::make($email, $this->get('db'));
    $userModel->saveToDatabase();

    $userController = new Controller($userModel, $this->get('mailer'));

    $result = $userController->sendLoginEmail();

    return $response->withJson([
        "status"  => 200,
        "success" => $result ? "true" : "false",
    ]);
});

$app->run();