<?php
require_once('statFunctions.php');

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

$maxSalary = 1000000;
$professionCode = $_REQUEST['professionCode'];
$salaryFrom = isset($_REQUEST['salaryFrom']) ? $_REQUEST['salaryFrom'] : 0;
$salaryTo = isset($_REQUEST['salaryTo']) ? $_REQUEST['salaryTo'] : $maxSalary;
$filterRate = isset($_REQUEST['filterRate']) ? $_REQUEST['filterRate'] : 10;
$skills = [];
$jsonOutput = [
    "vacanciesCount" => 0,
    "skillsCount" => 0,
    "skills" => []
];

$vacanciesQuery = $pdo->prepare('SELECT DISTINCT v.* FROM vacancies v
                           LEFT JOIN professions p ON v.professionId = p.id
WHERE p.code = ?
  AND ( (salaryFrom >= ? AND salaryFrom <= ?) OR salaryFrom IS NULL)
  AND ( (salaryTo >= ? AND salaryTo <= ?) OR salaryTo IS NULL)
  AND NOT (salaryFrom IS NULL AND salaryTo IS NULL)');

$skillsQuery = $pdo->prepare('SELECT s.name, lsv.skillLevel, lsv.isPreferred FROM links_skills_vacancies lsv
	LEFT JOIN skills s ON lsv.skillId = s.id
WHERE lsv.vacancyId = ?');

if ($professionCode) {
    $vacanciesQuery->execute([$professionCode, $salaryFrom, $salaryTo, $salaryFrom, $salaryTo]);

    while ($vacancy = $vacanciesQuery->fetch()) {
        $jsonOutput['vacanciesCount']++;
        $skillsQuery->execute([$vacancy['id']]);

        while ($skill = $skillsQuery->fetch()) {
            $isPreferred = boolval($skill['isPreferred']);
            if ($isPreferred) {
                continue;
            }

            $skillName = $skill['name'];
            $skillLevel = $skill['skillLevel'];

            if (!$skills[$skillName]) {
                $skills[$skillName] = [
                    "title" => $skillName,
                    "levels" => [$skillLevel]
                ];
            }
            else {
                $skills[$skillName]['levels'][] = $skillLevel;
            }
        }
    }

    foreach ($skills as $skillName => $skillData) {
        $skillData['count'] = count($skillData['levels']);
        $skillData['rate'] = $skillData['count'] / $jsonOutput['vacanciesCount'] * 100;

        $skillData['meanLevel'] = mean($skillData['levels']);
        $skillData['medianLevel'] = median($skillData['levels']);
        $skillData['modeLevel'] = mode($skillData['levels']);

        $skills[$skillName] = $skillData;
    }

    usort($skills, function ($skillA, $skillB) {
        if ($skillA['rate'] === $skillB['rate']) {
            return 0;
        }

        return $skillA['rate'] < $skillB['rate'] ? 1 : -1;
    });

    $filteredSkills = array_filter($skills, function ($skill) use ($filterRate) {
        $skillMatches = $skill['rate'] >= $filterRate;

        return $skillMatches;
    });

    $jsonOutput['skillsCount'] = count($filteredSkills);
    $jsonOutput['skills'] = $filteredSkills;
}

header("Content-type: application/json; charset=utf-8");
echo json_encode($jsonOutput);