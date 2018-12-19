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

$professionCode = $_REQUEST['professionCode'];
$vacanciesQuery = $pdo->prepare('SELECT DISTINCT v.* FROM vacancies v
        LEFT JOIN professions p ON v.professionId = p.id
    WHERE p.code = ?');

$skillsQuery = $pdo->prepare('SELECT s.name, lsv.skillLevel, lsv.isPreferred FROM links_skills_vacancies lsv
	LEFT JOIN skills s ON lsv.skillId = s.id
WHERE lsv.vacancyId = ?');

$candidatesPerPlace = [
    'php-developer'          => 2.8,
    'hr-manager'             => 5.7,
    'pr-specialist'          => 3.5,
    'python-developer'       => 2.8,
    'golang-developer'       => 2.8,
    'javascript-developer'   => 2.8,
    'ui-ux-designer'         => 9.2,
    'ios-developer'          => 2.8,
    'android-developer'      => 2.8,
    'internet-marketologist' => 3.5,
    'qa-tester'              => 2.8,
    'devops'                 => 2.8,
    'data-scientist'         => 2.8,
    'game-designer'          => 9.2,
    'project-manager'        => 5.7,
    'game-artist-2d'         => 9.2,
    'game-artist-3d'         => 9.2,
];

if ($professionCode) {

    $vacanciesQuery->execute([$professionCode]);
    $jsonOutput = [];
    while ($vacancy = $vacanciesQuery->fetch()) {
        $skills = [];
        $skillsQuery->execute([$vacancy['id']]);
        while ($skill = $skillsQuery->fetch()) {
            $skills[] = [
                "title"     => $skill['name'],
                "level"     => $skill['skillLevel'],
                "mandatory" => !boolval($skill['isPreferred']),
            ];
        }

        $jsonOutput[] = [
            "id"                         => intval($vacancy['id']),
            "title"                      => $vacancy['title'],
            "company"                    => $vacancy['companyName'],
            "description"                => $vacancy['text'],
            "city"                       => $vacancy['city'],
            "url"                        => $vacancy['url'],
            "salary"                     => [
                "from" => floatval($vacancy['salaryFrom']),
                "to"   => floatval($vacancy['salaryTo']),
            ],
            "dateCreate"                 => $vacancy['dateCreate'],
            "dateLastCheck"              => $vacancy['dateLastCheck'],
            "candidatesPerPlace"         => isset($candidatesPerPlace[$professionCode]) ? $candidatesPerPlace[$professionCode] : false,
            "inArchive"                  => boolval($vacancy['inArchive']),
            "fullTime"                   => boolval($vacancy['fullTime']),
            "flexibleSchedule"           => boolval($vacancy['flexibleSchedule']),
            "probation"                  => boolval($vacancy['probation']),
            "officialEmployment"         => boolval($vacancy['officialEmployment']),
            "canBeRemote"                => boolval($vacancy['canBeRemote']),
            "training"                   => boolval($vacancy['training']),
            "food"                       => boolval($vacancy['food']),
            "insurance"                  => boolval($vacancy['insurance']),
            "sportAndFitness"            => boolval($vacancy['sportAndFitness']),
            "communicationsCompensation" => boolval($vacancy['communicationsCompensation']),
            "sickLeaveCompensation"      => boolval($vacancy['sickLeaveCompensation']),
            "vacationCompensation"       => boolval($vacancy['vacationCompensation']),
            "dressCode"                  => boolval($vacancy['dressCode']),
            "relocationHelp"             => boolval($vacancy['relocationHelp']),
            "skills"                     => $skills,
        ];
    };
}

if ($jsonOutput === false) {
    $jsonOutput = [];
}

echo "function getVacanciesList() {
    return " . json_encode($jsonOutput) . ";
}";