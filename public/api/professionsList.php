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
} catch (\PDOException $exception) {
    $jsonOutput = false;
}

$professionsAndSkillsQuery = $pdo->prepare('SELECT p.id AS professionId, p.code AS professionCode, p.name AS professionName, s.*, count(*) AS vacancyCount  FROM professions p
	LEFT JOIN vacancies v ON v.professionId = p.id
    LEFT JOIN links_skills_vacancies lsv ON v.id = lsv.vacancyId
    LEFT JOIN skills s ON lsv.skillId = s.id
GROUP BY p.id, s.id
ORDER BY p.id ASC, count(*) DESC');

$professionsAndSkillsQuery->execute();
$jsonOutput = [];
$currentProfession = false;

$totalVacanciesCount = 15; //TODO: вытаскивать из базы

while ($professionSkill = $professionsAndSkillsQuery->fetch()) {
    if ($currentProfession && $currentProfession['id'] !== $professionSkill['professionId']) {
        $jsonOutput[] = $currentProfession;
        $currentProfession = false;
    }

    if (!$currentProfession) {
        $currentProfession = [
            'id'         => $professionSkill['professionId'],
            'code'       => $professionSkill['professionCode'],
            'name'       => $professionSkill['professionName'],
            'top5Skills' => [],
        ];
    }

    if (count($currentProfession['top5Skills']) < 5) {
        $currentProfession['top5Skills'][] = [
            'id'      => $professionSkill['id'],
            'name'    => $professionSkill['name'],
            'count'   => $professionSkill['vacancyCount'],
            'percent' => round($professionSkill['vacancyCount'] / $totalVacanciesCount * 100, 2),
        ];
    }
};

if ($jsonOutput === false) {
    $jsonOutput = [];
}

echo json_encode($jsonOutput);