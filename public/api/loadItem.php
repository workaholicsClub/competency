<?php

function mongoToArray($mongoCursor) {
    $arrayResult = (array) $mongoCursor->toArray()[0];
    if (isset($arrayResult['_id'])) {
        $arrayResult['_id'] = (string)$arrayResult['_id'];
    }
    return $arrayResult;
}

function loadMongoItem($postBody) {
    $mongoHost = getenv('MONGO_HOST');
    $mongoDatabaseName = getenv('MONGO_DB');
    $mongoDSN = "mongodb://${mongoHost}/";

    $result = [];

    try {
        $postData = json_decode($postBody, true);
        $collectionName = $postData['collectionName'];
        $filter = $postData['filter'];
        $mongoCollection = "${mongoDatabaseName}.${collectionName}";

        $manager = new MongoDB\Driver\Manager($mongoDSN);
        $query = new MongoDB\Driver\Query($filter);
        $cursor = $manager->executeQuery($mongoCollection, $query);

        $result['data'] = mongoToArray($cursor);
    }
    catch (MongoDB\Driver\Exception\Exception $e) {
        $result['error'] = $e->getMessage();
    }

    return $result;
}

$postBody = file_get_contents('php://input');
$result = loadMongoItem($postBody);

header("Content-type: application/json; charset=utf-8");
echo json_encode($result);