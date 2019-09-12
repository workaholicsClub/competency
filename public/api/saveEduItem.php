<?php

$mongoHost = getenv('MONGO_HOST');
$mongoDatabaseName = getenv('MONGO_DB');
$mongoDSN = "mongodb://${mongoHost}/";

$result = [];

try {
    $manager = new MongoDB\Driver\Manager($mongoDSN);
    $bulk = new MongoDB\Driver\BulkWrite;
    $eduItemsCollection = "${mongoDatabaseName}.eduItems";

    $postBody = file_get_contents('php://input');
    $eduItem = json_decode($postBody, true);
    $newItemId = new MongoDB\BSON\ObjectID;
    $eduItem['_id'] = $newItemId;

    $bulk->insert($eduItem);

    $insertResult = $manager->executeBulkWrite($eduItemsCollection, $bulk);

    $filter = ['_id' => $newItemId];
    $query = new MongoDB\Driver\Query($filter);
    $cursor = $manager->executeQuery($eduItemsCollection, $query);

    $loadedEduItem = (array) $cursor->toArray()[0];
    $loadedEduItem['_id'] = (string) $loadedEduItem['_id'];

    $result['eduItem'] = $loadedEduItem;
}
catch (MongoDB\Driver\Exception\Exception $e) {
    $result['error'] = $e->getMessage();
}

header("Content-type: application/json; charset=utf-8");
echo json_encode($result);