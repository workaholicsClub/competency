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

$skillsQuery = $pdo->prepare('SELECT 
	p.name AS profName,
    s.id AS id,
    s.name AS name,
    MAX(lrc.id) IS NOT NULL AS isBase,
    MAX(t10.isTop10) AS isTop10,
    t10.vacancyCount

FROM professions p
    LEFT JOIN links_skills_professions lsp ON p.id = lsp.professionId
    LEFT JOIN skills s ON lsp.skillId = s.id
    LEFT JOIN links_requirements_courses lrc ON s.id = lrc.skillId
    LEFT JOIN (
		SELECT professionId, skillId, vacancyCount, rowNum <= 10 AS isTop10 FROM (
			SELECT IF(@prefProv = s.professionId, @ctr := @ctr + 1, @ctr := 1) AS rowNum, @prefProv := s.professionId, s.*
				FROM (
					SELECT p.id AS professionId, lsp.skillId, COUNT(*) AS vacancyCount FROM professions p
						LEFT JOIN links_skills_professions lsp ON p.id = lsp.professionId
						LEFT JOIN links_skills_vacancies lsv ON lsp.skillId = lsv.skillId
						LEFT JOIN vacancies v ON lsv.vacancyId = v.id
					WHERE p.id = v.professionId
					GROUP BY p.id, lsp.skillId
					ORDER BY p.id, COUNT(*) DESC
				) s
				JOIN (SELECT @ctr := 0, @prevPof = 0) AS var
		) sv
    ) t10 ON s.id = t10.skillId
GROUP BY p.id, s.id
ORDER BY p.id, s.name');

$skillsQuery->execute();
$jsonOutput = [];
$listOutput = [];

while ($skill = $skillsQuery->fetch()) {
    $jsonSkill = [
        'id'           => $skill['id'],
        'name'         => $skill['name'],
        'isBase'       => boolval($skill['isBase']),
        'isPopular'    => boolval($skill['isTop10']),
        'vacancyCount' => intval($skill['vacancyCount']),
    ];

    $jsonOutput[ $skill['profName'] ][] = $jsonSkill;
    $listOutput[ $skill['id'] ] = $jsonSkill;
}

if ($jsonOutput === false) {
    $jsonOutput = [];
}


if ($_GET['format'] == 'script') {
    echo "function getSkillsList() {
        return " . json_encode($jsonOutput) . ";
    }";
}
else if ($_GET['format'] === 'jsonList') {
    echo json_encode(array_values($listOutput));
}
else {
    echo json_encode($jsonOutput);
}
