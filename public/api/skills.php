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

$skillsQuery = $pdo->prepare('SELECT p.name AS profName, s.id AS id, s.name AS name FROM professions p
	LEFT JOIN links_skills_professions lsp ON p.id = lsp.professionId
    LEFT JOIN skills s ON lsp.skillId = s.id
ORDER BY p.id, s.name');

$skillsQuery->execute();
$jsonOutput = [];

while ($skill = $skillsQuery->fetch()) {
    $jsonOutput[ $skill['profName'] ][] = [
        'id' => $skill['id'],
        'name' => $skill['name']
    ];
}

if ($jsonOutput === false) {
    $jsonOutput = [];
}

echo json_encode($jsonOutput);