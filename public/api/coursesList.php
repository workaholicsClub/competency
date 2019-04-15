<?php

function makeWhereClauseSQL($field, $values) {
    if (is_array($values)) {
        $places = str_repeat('?, ', count($values) - 1) . '?';
        $whereSQL = "${field} IN (${places})";
    }
    else {
        $whereSQL = $field === 'c.price' ? "{$field} <= ?" : "${field} = ?";
    }
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

    if ($professionCode && !$searchMode) {
        $coursesQuery = $pdo->prepare('SELECT c.*, MAX(skillRate) AS maxSkillRate FROM courses c
	LEFT JOIN links_skills_courses lsc ON c.id = lsc.courseId
	LEFT JOIN (
		SELECT skillId, COUNT(*) AS skillCount, vcount AS vacanciesCount, COUNT(*)/vcount AS skillRate FROM vacancies v
			LEFT JOIN links_skills_vacancies lsv ON v.id = lsv.vacancyId
			LEFT JOIN professions p ON v.professionId = p.id
			LEFT JOIN (SELECT professionId, COUNT(*) AS vcount FROM vacancies GROUP BY professionId) pcnt ON v.professionId = pcnt.professionId
		WHERE p.code = ?
		GROUP BY skillId
    ) s ON s.skillId = lsc.skillId
WHERE c.inArchive = 0
GROUP BY c.id
ORDER BY MAX(skillRate) DESC, price ASC');

        $coursesQuery->execute([$professionCode]);
    }

    if ($searchMode) {
        $courseQuerySQL = "SELECT c.*,
                   MAX(skillRate) AS maxSkillRate,
                   SUM(isSearched) AS countSearchedSkills
            FROM courses c
                LEFT JOIN links_skills_courses lsc ON c.id = lsc.courseId
                LEFT JOIN (
                    SELECT skillId,
                           sk.name,
                           ".(!empty($_REQUEST['skills']) ? 'sk.name IN ("'.implode('", "', array_keys($_REQUEST['skills'])).'")' : '0' )." AS isSearched,
                           COUNT(*) AS skillCount,
                           vcount AS vacanciesCount,
                           COUNT(*)/vcount AS skillRate
                    FROM vacancies v
                        LEFT JOIN links_skills_vacancies lsv ON v.id = lsv.vacancyId
                        LEFT JOIN professions p ON v.professionId = p.id
                        LEFT JOIN skills sk ON lsv.skillId = sk.id
                        LEFT JOIN (SELECT professionId, COUNT(*) AS vcount FROM vacancies GROUP BY professionId) pcnt ON v.professionId = pcnt.professionId
                    WHERE p.code = '${professionCode}'
                    GROUP BY skillId
                ) s ON s.skillId = lsc.skillId
            WHERE c.inArchive = 0 ";
        $whereClauses = [];
        $dataArray = [];
        $fields = [
            "skills"      => "s.name",
            "format"      => "c.format",
            "certificate" => "c.certificate",
            "hasPractice" => "c.hasPractice",
            "hasTeacher"  => "c.hasTeacher",
            "price"       => "c.price",
        ];

        foreach ($fields as $requestField => $sqlField) {
            if (isset($_REQUEST[$requestField])) {
                if (is_array($_REQUEST[$requestField])) {
                    $valueOrValues = array_values($_REQUEST[$requestField]);
                }
                else {
                    $valueOrValues = $_REQUEST[$requestField];
                }
                if ($requestField === "skills") {
                    $valueOrValues = array_keys($_REQUEST[$requestField]);
                }

                if (is_array($valueOrValues)) {
                    $dataArray = array_merge($dataArray, $valueOrValues);
                }
                else {
                    $dataArray[] = $valueOrValues;
                }
                $whereClauses[] = makeWhereClauseSQL($sqlField, $valueOrValues);
            }
        }

        if (!empty($whereClauses)) {
            $courseQuerySQL .= 'AND '.implode(' AND ', $whereClauses);
        }
        $courseQuerySQL .= "\nGROUP BY c.id ORDER BY maxSkillRate DESC, countSearchedSkills DESC, price ASC";
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