<?php

function makeWhereClauseSQL($field, $values) {
    $places = str_repeat('?, ', count($values) - 1) . '?';
    $whereSQL = "${field} IN (${places})";
    return $whereSQL;
}

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
$searchMode = $_REQUEST['searchMode'];
$doSearch = $professionCode || $searchMode;

$skillsQuery = $pdo->prepare('SELECT s.name, lsc.skillLevel FROM links_skills_courses lsc
	LEFT JOIN skills s ON lsc.skillId = s.id
WHERE lsc.courseId = ?');

$requirementsQuery = $pdo->prepare('SELECT s.name, lrc.skillLevel FROM links_requirements_courses lrc
	LEFT JOIN skills s ON lrc.skillId = s.id
WHERE lrc.courseId = ?');

if ($doSearch) {

    if ($professionCode) {
        $coursesQuery = $pdo->prepare('SELECT 
        *,
        SUM(isProfession) AS profSkills,
        COUNT(*)-SUM(isProfession) AS nonProfSkills,
        SUM(isProfession) > COUNT(*)-SUM(isProfession) AS hasMoreProfSkills,
        SUM(isProfession)/COUNT(*) AS profSkillsRate
    FROM (
        SELECT c.*, MAX(p.`code` = ?) AS isProfession FROM courses c
                LEFT JOIN links_skills_courses lsc ON c.id = lsc.courseId
                LEFT JOIN links_skills_professions lsp ON lsc.skillId = lsp.skillId
                LEFT JOIN professions p ON lsp.professionId = p.id
        WHERE c.inArchive != 1
        GROUP BY c.id, lsc.skillId
    ) sq
    GROUP BY id
    HAVING profSkillsRate >= 0.5');

        $coursesQuery->execute([$professionCode]);
    }

    if ($searchMode) {
        $courseQuerySQL = "SELECT DISTINCT c.* FROM courses c
                LEFT JOIN links_skills_courses lsc ON c.id = lsc.courseId
                LEFT JOIN skills s ON lsc.skillId = s.id
            WHERE ";
        $whereClauses = [];
        $dataArray = [];
        $fields = [
            "skills"      => "s.name",
            "format"      => "c.format",
            "certificate" => "c.certificate",
            "hasPractice" => "c.hasPractice",
            "hasTeacher"  => "c.hasTeacher",
        ];

        foreach ($fields as $requestField => $sqlField) {
            if ($_REQUEST[$requestField]) {
                $values = array_values($_REQUEST[$requestField]);
                if ($requestField === "skills") {
                    $values = array_keys($_REQUEST[$requestField]);
                }

                $dataArray = array_merge($dataArray, $values);
                $whereClauses[] = makeWhereClauseSQL($sqlField, $values);
            }
        }

        $courseQuerySQL .= implode(' AND ', $whereClauses);
        $coursesQuery = $pdo->prepare($courseQuerySQL);
        $coursesQuery->execute($dataArray);
    }

    $jsonOutput = [];
    $searchedSkills = $_REQUEST['skills']
        ? array_keys($_REQUEST['skills'])
        : [];

    while ($course = $coursesQuery->fetch()) {
        $skills = [];
        $searchedCourseSkills = [];
        $additionalCourseSkills = [];
        $skillsQuery->execute([$course['id']]);
        while ($skill = $skillsQuery->fetch()) {
            $isSearched = array_search($skill['name'], $searchedSkills) !== false;
            $skills[$skill['name']] = $skill['skillLevel'];

            if ($isSearched) {
                $searchedCourseSkills[$skill['name']] = $skill['skillLevel'];
            }
            else {
                $additionalCourseSkills[$skill['name']] = $skill['skillLevel'];
            }
        }

        $requirements = [];
        $requirementsQuery->execute([$course['id']]);
        while ($requirement = $requirementsQuery->fetch()) {
            $requirements[$requirement['name']] = $requirement['skillLevel'];
        }

        $jsonOutput[] = [
            "id"               => intval($course['id']),
            "platform"         => $course['platform'],
            "title"            => $course['name'],
            "url"              => '/api/go.php?courseId=' . $course['id'],
            "hasPartnerUrl"    => !empty($course['partnerUrl']),
            "format"           => $course['format'],
            "hasTeacher"       => boolval($course['hasTeacher']),
            "hasPractice"      => boolval($course['hasPractice']),
            "jobPlacement"     => boolval($course['jobPlacement']),
            "forKids"          => boolval($course['forKids']),
            "certificate"      => $course['certificate'],
            "city"             => $course['city'],
            "duration"         => intval($course['duration']),
            "durationUnits"    => $course['durationUnits'],
            "price"            => floatval($course['price']),
            "coupon"           => $course['coupon'] ? $course['coupon'] : false,
            "couponDiscount"   => $course['couponDiscount'] ? floatval($course['couponDiscount']) : false,
            "description"      => $course['description'],
            "skills"           => $skills,
            "searchedSkills"   => $searchedCourseSkills,
            "additionalSkills" => $additionalCourseSkills,
            "requirements"     => $requirements,
        ];
    };

    usort($jsonOutput, function ($courseA, $courseB) {
        $skillsA = count($courseA['searchedSkills']);
        $skillsB = count($courseB['searchedSkills']);
        if ( $skillsA === $skillsB) {
            return 0;
        }

        return $skillsA > $skillsB ? -1 : 1;
    });
}

if ($jsonOutput === false) {
    $jsonOutput = [];
}

if ($_REQUEST['responseFormat'] === 'json') {
    header("Content-type: application/json; charset=utf-8");
    echo json_encode($jsonOutput);
}
else {
    echo "function getCoursesList() {
        return " . json_encode($jsonOutput) . ";
    }";
}