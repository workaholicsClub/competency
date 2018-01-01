<?php
require '../vendor/autoload.php';

use Competencies\Mail\MailgunMailer;
use Competencies\User\UserController;
use Competencies\User\UserModel;
use Slim\App;
use Slim\Http\Request;
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

    $userModel = UserModel::make($email, $this->get('db'));
    $userModel->saveToDatabase();

    $userController = new UserController($userModel, $this->get('mailer'));

    $result = $userController->sendLoginEmail();

    return $response->withJson([
        "status"  => 200,
        "success" => $result ? "true" : "false",
    ]);
});

$app->get('/user', function (Request $request, Response $response) {
    $token = $request->getQueryParam('token');
    if (!$token) {
        $token = $request->getCookieParam('token');
    }

    $userData = false;

    $userModel = UserModel::makeFromToken($token, $this->get('db'));
    if ($userModel) {
        $entity = $userModel->loadFromDatabase();
        $userData = $entity->toArray();
    }

    return $response->withJson([
        "status"  => 200,
        "user" => $userData,
    ]);

});

$app->get('/', function (Request $request, Response $response) {

});

$app->run();