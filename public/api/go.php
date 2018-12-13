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

$coursesQuery = $pdo->prepare('SELECT url FROM courses WHERE id = ?');
$coursesQuery->execute([$_REQUEST['courseId']]);
$course = $coursesQuery->fetch();

if ($userEmail) {
    $userFind = $pdo->prepare('SELECT * FROM users WHERE email = ?');
    $userFind->execute([$userEmail]);
    $userId = false;
    if ($user = $userFind->fetch()) {
        $userId = $user['id'];
    }

    if ($userId && $course) {
        $linkQuery = $pdo->prepare('INSERT INTO courses_visits (userId, courseId) VALUES (?, ?)');
        $linkQuery->execute([$userId, $_REQUEST['courseId']]);
    }
}

header('Location: '.$course['url']);
