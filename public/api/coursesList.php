<?php

function getSkillWeights($professionCode) {
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

        $skillsQuerySQL = "SELECT
            s.*,
            COUNT(*) as vacancyCount
        FROM skills s
            LEFT JOIN links_skills_vacancies lsv ON s.id = lsv.skillId
            LEFT JOIN vacancies v ON lsv.vacancyId = v.id
            LEFT JOIN professions p ON v.professionId = p.id
        WHERE p.code = '${professionCode}'
        GROUP BY s.id
        ORDER BY vacancyCount DESC";

        $skillsQuery = $pdo->prepare($skillsQuerySQL);
        $skillsQuery->execute();

        while ($skill = $skillsQuery->fetch()) {
            $skills[$skill['name']] = intval($skill['vacancyCount']);
        }
    }
    catch (\PDOException $exception) {
        $skills = false;
    }

    return $skills;
}
function getCourseSkillWeight($course, $skillWeights) {
    $weightsSum = array_reduce($course['skills'], function ($aggr, $skillName) use ($skillWeights) {
        $skillWeight = $skillWeights[$skillName] ? $skillWeights[$skillName] : 0;
        return $aggr+$skillWeight;
    }, 0);

    $maxWeight = array_reduce($course['skills'], function ($aggr, $skillName) use ($skillWeights) {
        $maxWeight = max($aggr, $skillWeights[$skillName]);
        return $maxWeight;
    }, 0);

    $skillsCount = count($course['skills']);

    return $maxWeight + $weightsSum/$skillsCount;
}
function sortByCourseSkills($items, $professionCode) {
    $skillWeights = getSkillWeights($professionCode);

    if (!$skillWeights) {
        return $items;
    }

    $sortedItems = $items;
    usort($sortedItems, function ($courseA, $courseB) use ($skillWeights) {
        $sortIndexA = getCourseSkillWeight($courseA, $skillWeights); //чем больше, тем лучше
        $sortIndexB = getCourseSkillWeight($courseB, $skillWeights);

        if ($sortIndexA == $sortIndexB) {
            return 0;
        }

        $aGoesLast = 1;
        $aGoesFirst = -1;
        return ($sortIndexA > $sortIndexB) ? $aGoesFirst : $aGoesLast;
    });

    return $sortedItems;
}
function sortByRelevance($items, $professionCode) {
    if (!$professionCode) {
        return $items;
    }

    return sortByCourseSkills($items, $professionCode);
}

$mongoHost = getenv('MONGO_HOST');
$mongoDatabaseName = getenv('MONGO_DB');
$mongoDSN = "mongodb://${mongoHost}/";

$jsonOutput = false;

try {
    $manager = new MongoDB\Driver\Manager($mongoDSN);
    $bulk = new MongoDB\Driver\BulkWrite;
    $eduItemsCollection = "${mongoDatabaseName}.eduItems";

    $filter = [];
    $requestQuery = $_REQUEST['filter'];
    $doQuery = !empty($requestQuery['skills']);
    $booleanFields = ['hasPractice', 'hasTeacher', 'jobPlacement', 'forKids'];

    foreach ($requestQuery as $field => $value) {
        if (is_array($value)) {
            $isBooleanField = array_search($field, $booleanFields) !== false;

            if ($isBooleanField) {
                $rawValue = $value;
                $value = [];
                foreach ($rawValue as $singleValue) {
                    $value[] = boolval($singleValue);
                }
            }

            if ($field === 'requirements') {
                //Фильтр по требованиям как-то не очень работает, когда требования сами заполняются
                /*$filter['$or'] = [
                    ['requirements' => null],
                    ['requirements' => ['$in' => $value]],
                ];*/
            }
            elseif ($field === 'price') {
                $maxPrice = max($value);
                $filter['price'] = ['$lte' => intval($maxPrice)];
            }
            else {
                $filter[$field] = ['$in' => $value];
            }
        }
        else {
            $filter[$field] = $value;
        }
    }

    if ($doQuery) {
        $mongoQuery = new MongoDB\Driver\Query($filter);
        $cursor = $manager->executeQuery($eduItemsCollection, $mongoQuery);

        foreach ($cursor as $course) {
            $preparedCourse = (array) $course;
            $preparedCourse['_id'] = (string) $preparedCourse['_id'];

            $jsonOutput[] = $preparedCourse;
        }

        $jsonOutput = sortByRelevance($jsonOutput, $_REQUEST['professionCode']);
    }
    else {
        $jsonOutput = [];
    }
}
catch (MongoDB\Driver\Exception\Exception $e) {
    $jsonOutput['error'] = $e->getMessage();
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