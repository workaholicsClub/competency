<?php
require '../../vendor/autoload.php';

use Competencies\Mail\MailgunMailer;
use Competencies\Routes;
use Slim\App;
use Spot\Config;
use Spot\Locator;

$settings = [
    'mysql_dsn'      => getenv('MYSQL_DSN'),
    'mailgun_key'    => getenv('MAILGUN_KEY'),
    'mailgun_domain' => getenv('MAILGUN_DOMAIN'),
    'apiBase'        => getenv('API_URL'),

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

$app->get('/user/token/{email}', Routes::class.':userToken');
$app->get('/user', Routes::class.':user');
$app->get('/profession', Routes::class.':profession');
$app->get('/courses/recommend', Routes::class.':coursesRecommend');
$app->get('/courses/search', Routes::class.':coursesSearch');
$app->get('/courses/go/{code}', Routes::class.':coursesGo');
$app->post('/results/save', Routes::class.':resultsSave');
$app->post('/results/saveSession', Routes::class.':resultsSaveSession');

$app->run();