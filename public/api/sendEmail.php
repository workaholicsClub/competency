<?php
require '../../vendor/autoload.php';
use Mailgun\Mailgun;

$jsonOutput = false;

$user = getenv('MYSQL_USER');
$password = getenv('MYSQL_PASSWORD');
$dsn = getenv('MYSQL_DSN');
$mailgunKey = getenv('MAILGUN_KEY');
$domain = getenv('MAILGUN_DOMAIN');

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

$pdo = new PDO($dsn, $user, $password, $options);
$emailTo = $_REQUEST['email'];
$courseIds = $_REQUEST['courseId'];
$placeHolders = implode(',', array_fill(0, count($courseIds), '?'));

$userFind = $pdo->prepare('SELECT * FROM users WHERE email = ?');
$userFind->execute([$emailTo]);
$userId = false;
if ($user = $userFind->fetch()) {
    $userId = $user['id'];
}

if (!$userId) {
    $userInsert = $pdo->prepare('INSERT INTO users (email, remind, sendSimilar, courseFeedback, serviceFeedback) VALUES (?, ?, ?, ?, ?)');
    $userInsert->execute([ $emailTo, intval($_REQUEST['remind']), intval($_REQUEST['sendSimilar']), intval($_REQUEST['courseFeedback']), intval($_REQUEST['serviceFeedback']) ]);

    $userId = $pdo->lastInsertId();
}

$linkQuery = $pdo->prepare('INSERT INTO links_users_courses (userId, courseId) VALUES (?, ?)');
$coursesQuery = $pdo->prepare('SELECT * FROM courses WHERE id IN ('.$placeHolders.')');
$coursesQuery->execute($courseIds);

$messageText = "Здравствуйте!<br><br>С помощью сервиса <a href='https://self.academy/'>Сам себе академик</a> вы составили план обучения и выбрали следующие курсы:<br><br>";

while ($course = $coursesQuery->fetch()) {
    $messageText .= "<a href='https://self.academy/api/go.php?courseId=".$course['id']."&from=".$emailTo."'>".$course['name']."</a><br>";
    $linkQuery->execute([$userId, $course['id']]);
}

$messageText .= "<br>Желаем Вам приятного обучения!";

$mailer = new Mailgun($mailgunKey);
$sendResponse = $mailer->sendMessage($domain, [
    'from'    => "Сам себе академик <you@{$domain}>",
    'to'      => $emailTo,
    'subject' => "Выбранные курсы",
    'html'    => $messageText
]);

$responseSuccessful = !empty( $sendResponse->http_response_body->id );
if (!$responseSuccessful) {
    throw new Exception('Ошибка отправки письма');
}

echo '{success: true}';

