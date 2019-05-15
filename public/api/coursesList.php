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
        $coursesQuery = $pdo->prepare('
SELECT c.*,
       MAX(skillRate) AS maxSkillRate,
       MAX(isPrimary) AS hasPrimary
FROM courses c
	LEFT JOIN links_skills_courses lsc ON c.id = lsc.courseId
	LEFT JOIN (
		SELECT lsv.skillId, COUNT(*) AS skillCount, vcount AS vacanciesCount, COUNT(*)/vcount AS skillRate, lsp.isPrimary
        FROM vacancies v
			LEFT JOIN links_skills_vacancies lsv ON v.id = lsv.vacancyId
			LEFT JOIN professions p ON v.professionId = p.id
		    LEFT JOIN links_skills_professions lsp ON lsv.skillId = lsp.skillId AND v.professionId = lsp.professionId
			LEFT JOIN (SELECT professionId, COUNT(*) AS vcount FROM vacancies GROUP BY professionId) pcnt ON v.professionId = pcnt.professionId
		WHERE p.code = ?
		GROUP BY skillId
    ) s ON s.skillId = lsc.skillId
WHERE c.inArchive = 0
GROUP BY c.id
ORDER BY maxSkillRate DESC, hasPrimary DESC, price ASC');

        $coursesQuery->execute([$professionCode]);
    }

    if ($searchMode) {
        $courseQuerySQL = "SELECT c.*,
                   MAX(skillRate) AS maxSkillRate,
                   MAX(isPrimary) AS hasPrimary,
                   SUM(countPrimary)-SUM(isPrimary) AS hasOtherPrimary,
                   SUM(isSearched) AS countSearchedSkills,
                   price/SUM(isSearched) AS pricePerSearchedSkill
            FROM courses c
                LEFT JOIN links_skills_courses lsc ON c.id = lsc.courseId
                LEFT JOIN (
                    SELECT cs.id, SUM(isPrimary) AS countPrimary
                    FROM courses cs
                        LEFT JOIN links_skills_courses lscs ON cs.id = lscs.courseId
                        LEFT JOIN links_skills_professions lsps ON lscs.skillId = lsps.skillId
                    GROUP BY cs.id
                ) lspall ON c.id = lspall.id
                LEFT JOIN (
                    SELECT sk.id AS skillId,
                           sk.name,
                           " . (!empty($_REQUEST['skills']) ? 'sk.name IN ("' . implode('", "', array_keys($_REQUEST['skills'])) . '")' : '0') . " AS isSearched,
                           COUNT(v.id) AS skillCount,
                           vcount AS vacanciesCount,
                           COUNT(v.id)/vcount AS skillRate,
                           lsp.isPrimary
                        FROM skills sk
                        LEFT JOIN links_skills_vacancies lsv ON sk.id = lsv.skillId
                        LEFT JOIN vacancies v ON lsv.vacancyId = v.id
                        LEFT JOIN links_skills_professions lsp ON sk.id = lsp.skillId AND v.professionId = lsp.professionId
                        LEFT JOIN professions p ON v.professionId = p.id
                        LEFT JOIN (SELECT professionId, COUNT(*) AS vcount FROM vacancies GROUP BY professionId) pcnt ON lsp.professionId = pcnt.professionId
                    WHERE p.code = '${professionCode}'
                    GROUP BY sk.id
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
        $courseQuerySQL .= "\nGROUP BY c.id ORDER BY maxSkillRate DESC, hasPrimary DESC, hasOtherPrimary ASC, countSearchedSkills DESC, pricePerSearchedSkill ASC";
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
            "pricePerSkill"    => count($searchedCourseSkills) > 0 ? floatval($course['price']/count($searchedCourseSkills)) : 0,
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