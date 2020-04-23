<?php

use MongoDB\BSON\ObjectId;

function mongoToArray($mongoCursor) {
    $arrayResult = (array) $mongoCursor->toArray()[0];
    $arrayResult['_id'] = (string) $arrayResult['_id'];
    return $arrayResult;
}

function loadMongoItem($loadItemId, $mongoCollection, $manager) {
    $filter = ['_id' => new ObjectId($loadItemId)];
    $query = new MongoDB\Driver\Query($filter);
    $cursor = $manager->executeQuery($mongoCollection, $query);

    return mongoToArray($cursor);
}

function updateMongoObject($postBody) {
    $mongoHost = getenv('MONGO_HOST');
    $mongoDatabaseName = getenv('MONGO_DB');
    $mongoDSN = "mongodb://${mongoHost}/";

    $result = [];

    try {
        $postData = json_decode($postBody, true);
        $collectionName = $postData['collectionName'];
        $item = $postData['item'];

        $manager = new MongoDB\Driver\Manager($mongoDSN);
        $bulk = new MongoDB\Driver\BulkWrite;
        $mongoCollection = "${mongoDatabaseName}.${collectionName}";

        $updateExisting = isset($item['_id']);

        if ($updateExisting) {
            $existingItemId = $item['_id'];
            unset($item['_id']);
            $filter = ['_id' => new ObjectId($existingItemId)];

            $bulk->update($filter, $item);
            $manager->executeBulkWrite($mongoCollection, $bulk);
            $resultItem = loadMongoItem($existingItemId, $mongoCollection, $manager);
        }
        else {
            $newItemId = new MongoDB\BSON\ObjectID;
            $item['_id'] = $newItemId;

            $bulk->insert($item);

            $manager->executeBulkWrite($mongoCollection, $bulk);
            $resultItem = loadMongoItem($newItemId, $mongoCollection, $manager);
        }

        $result['data'] = $resultItem;
    }
    catch (MongoDB\Driver\Exception\Exception $e) {
        $result['error'] = $e->getMessage();
    }

    return $result;
}

$postBody = file_get_contents('php://input');
$result = updateMongoObject($postBody);

header("Content-type: application/json; charset=utf-8");
echo json_encode($result);