<?php

$mongoHost = getenv('MONGO_HOST');
$mongoDatabaseName = getenv('MONGO_DB');
$mongoDSN = "mongodb://${mongoHost}/";

$jsonOutput = false;

try {
    $manager = new MongoDB\Driver\Manager($mongoDSN);
    $eduItemsCollection = "${mongoDatabaseName}.eduItems";

    $itemId = $_REQUEST['id'];
    $doQuery = !empty($itemId);

    if ($doQuery) {
        $filter = ['_id' => new MongoDB\BSON\ObjectID($itemId)];
        $mongoQuery = new MongoDB\Driver\Query($filter);
        $cursor = $manager->executeQuery($eduItemsCollection, $mongoQuery);

        foreach ($cursor as $item) {
            $preparedCourse = (array) $item;
        }
        $preparedCourse['_id'] = (string) $preparedCourse['_id'];
        $jsonOutput = $preparedCourse;
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

header("Content-type: application/json; charset=utf-8");
echo json_encode($jsonOutput);