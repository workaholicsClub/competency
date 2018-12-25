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

$selectQuery = $pdo->prepare("SELECT id FROM skills WHERE name = ?");
$insertQuery = $pdo->prepare("INSERT INTO skills (`name`) VALUES (?)");
$linkQuery = $pdo->prepare("INSERT INTO links_skills_professions (skillId, professionId) VALUES (?, ?)");

try {
    $pdo->beginTransaction();

    $skillId = false;
    $selectQuery->execute([$_REQUEST['skillName']]);
    if ($skill = $selectQuery->fetch()) {
        $skillId = $skill['id'] ? $skill['id'] : false;
    }

    if (!$skillId) {
        $insertQuery->execute([$_REQUEST['skillName']]);
        $skillId = $pdo->lastInsertId();
    }

    $linkQuery->execute([$skillId, intval($_REQUEST['professionId'])]);

    $pdo->commit();
    $jsonOutput = ['id' => $skillId];
}
catch (\PDOException $exception) {
    $jsonOutput = false;
    $pdo->rollback();
}

if ($jsonOutput === false) {
    $jsonOutput = [];
}

echo json_encode($jsonOutput);