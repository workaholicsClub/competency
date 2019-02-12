<?php
$jsonOutput = false;

$user = getenv('MYSQL_USER');
$password = getenv('MYSQL_PASSWORD');
$dsn = getenv('MYSQL_DSN');

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $password, $options);
}
catch (\PDOException $exception) {
    $jsonOutput = false;
}

$userEmail = $_REQUEST['from'];

$coursesQuery = $pdo->prepare('SELECT url, partnerUrl FROM courses WHERE id = ?');
$coursesQuery->execute([$_REQUEST['courseId']]);
$course = $coursesQuery->fetch();
$userId = null;

if ($userEmail) {
    $userFind = $pdo->prepare('SELECT * FROM users WHERE email = ?');
    $userFind->execute([$userEmail]);
    if ($user = $userFind->fetch()) {
        $userId = $user['id'];
    }
}

if ($course) {
    $linkQuery = $pdo->prepare('INSERT INTO courses_visits (userId, courseId) VALUES (?, ?)');
    $linkQuery->execute([$userId, $_REQUEST['courseId']]);
}

$targetUrl = $course['partnerUrl'] ? $course['partnerUrl'] : $course['url'];

header('Location: '.$targetUrl);
