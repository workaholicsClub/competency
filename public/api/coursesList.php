<?php

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

    foreach ($requestQuery as $field => $value) {
        if (is_array($value)) {
	    foreach($value as $singleValue) {
		$value[] = boolval($singleValue);
	    }

            if ($field === 'requirements') {
                $filter['$or'] = [
                    ['requirements' => null],
                    ['requirements' => ['$in' => $value]],
                ];
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
    }
    else {
	$jsonOutput = [];
    }
}
catch (MongoDB\Driver\Exception\Exception $e) {
    $result['error'] = $e->getMessage();
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