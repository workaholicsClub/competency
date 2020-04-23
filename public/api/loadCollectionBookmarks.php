<?php

$mongoHost = getenv('MONGO_HOST');
$mongoDatabaseName = getenv('MONGO_DB');
$mongoDSN = "mongodb://${mongoHost}/";

$result = [];

try {
    $userId = $_REQUEST['userId'];
    $metadataCollection = "${mongoDatabaseName}.metadata";
    $linksCollection = "${mongoDatabaseName}.collections";

    $manager = new MongoDB\Driver\Manager($mongoDSN);

    $bookmarksQuery = [
        'userId' => $userId,
        'items' => ['$elemMatch' => ['bookmark' => true]]
    ];

    $query = new MongoDB\Driver\Query($bookmarksQuery);
    $cursor = $manager->executeQuery($metadataCollection, $query);

    $linkIds = array_reduce($cursor->toArray(), function ($collected, $metadata) {
        $bookmarkItems = array_filter($metadata->items, function ($metadataItem) {
            return $metadataItem->bookmark;
        });

        $bookmarkIds = array_map(function ($bookmarkItem) {
            return $bookmarkItem->itemId;
        }, $bookmarkItems);

        $collected = array_merge($collected, $bookmarkIds);
        return $collected;
    }, []);


    $linksQuery = [
        'items' => ['$elemMatch' => ['id' => ['$in' => $linkIds]]]
    ];

    $query = new MongoDB\Driver\Query($linksQuery);
    $linksCursor = $manager->executeQuery($linksCollection, $query);

    $links = array_reduce($linksCursor->toArray(), function ($collected, $collection) use ($linkIds) {
        $foundLinks = array_reduce($collection->items, function ($collected, $collectionItem) use ($linkIds) {

            if ($collectionItem->type === 'link') {
                if (in_array($collectionItem->id, $linkIds)) {
                    $collected[] = $collectionItem;
                }
            }

            if ($collectionItem->type === 'manyLinks') {
                foreach ($collectionItem->items as $collectionSubItem) {
                    if (in_array($collectionSubItem->id, $linkIds)) {
                        $collected[] = $collectionSubItem;
                    }
                }
            }

            return $collected;
        }, []);

        $foundLinks = array_map(function ($foundLink) use ($collection) {
            $foundLink->collectionId = $collection->id;
            $foundLink->collectionTitle = $collection->title;
            return $foundLink;
        }, $foundLinks);

        $collected = array_merge($collected, $foundLinks);
        return $collected;
    }, []);

    $result['items'] = $links;
}
catch (MongoDB\Driver\Exception\Exception $e) {
    $result['error'] = $e->getMessage();
}

header("Content-type: application/json; charset=utf-8");
echo json_encode($result);