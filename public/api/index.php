<?php
require '../../vendor/autoload.php';

use Competencies\Competency\CompetencyModel;
use Competencies\Course\CourseModel;
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

$connectionConfig = new Config();
$connectionConfig->addConnection('mysql', $settings['mysql_dsn']);
$locator = new Locator($connectionConfig);

$mailer = new MailgunMailer($settings['mailgun_key'], $settings['mailgun_domain']);

$app = new App([
    'settings'  => $settings,
    'dbLocator' => $locator,
    'mailer'    => $mailer,
]);

$app->get('/user/token/{email}', function (Request $request, Response $response) {
    $email = $request->getAttribute('email');

    $userModel = UserModel::make($email, $this->get('dbLocator'));
    $userModel->save();

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

    $userModel = UserModel::makeFromToken($token, $this->get('dbLocator'));
    if ($userModel) {
        $entity = $userModel->load();
        $userData = $entity->toArray();
    }

    return $response->withJson([
        "status"  => 200,
        "user" => $userData,
    ]);

});

$app->get('/profession', function (Request $request, Response $response) {
    $locator = $this->get('dbLocator');
    $courseModel = CourseModel::make($locator);
    $competencyModel = CompetencyModel::make($locator, $courseModel);
    $professionTree = $competencyModel->loadProfessions();

    return $response->withJson([
        "status" => 200,
        "profession" => $professionTree,
    ]);
});

$app->get('/courses/recommend', function (Request $request, Response $response) {
    $competencyRatings = $request->getQueryParam('competency');
    $courseModel = CourseModel::make($this->get('dbLocator'));

    $recommendedCourses = $courseModel->getRecommendations($competencyRatings);

    return $response->withJson([
        'status' => 200,
        "course" => $recommendedCourses
    ]);
});

$app->run();