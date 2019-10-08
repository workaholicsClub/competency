<?php

const BASE_URL = 'https://skillit.ch/';

$mongoHost = getenv('MONGO_HOST');
$mongoDatabaseName = getenv('MONGO_DB');
$mongoDSN = "mongodb://${mongoHost}/";

$user = getenv('MYSQL_USER');
$password = getenv('MYSQL_PASSWORD');
$dsn = getenv('MYSQL_DSN');

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

$urls = [];
$urls[] = [
    'loc'      => BASE_URL,
    'lastmod'  => date(DateTime::RFC3339),
    'priority' => '0.8',
];

try {
    $manager = new MongoDB\Driver\Manager($mongoDSN);
    $eduItemsCollection = "${mongoDatabaseName}.eduItems";

    $filter = [];
    $mongoQuery = new MongoDB\Driver\Query($filter);
    $cursor = $manager->executeQuery($eduItemsCollection, $mongoQuery);

    foreach ($cursor as $course) {
        $preparedCourse = (array) $course;

        $urls[] = [
            'loc' => BASE_URL . 'catalog/' . $preparedCourse['type'] . '/' . (string) $preparedCourse['_id'],
            'lastmod' => date(DateTime::RFC3339),
            'priority' => '0.8',
        ];
    }

}
catch (MongoDB\Driver\Exception\Exception $e) {
}

try {
    $pdo = new PDO($dsn, $user, $password, $options);
    $professionsQuery = $pdo->prepare('SELECT * FROM professions p');
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

    $professionsQuery->execute();

    while ($profession = $professionsQuery->fetch()) {
        $urls[] = [
            'loc' => BASE_URL . $profession['code'] . '/catalog',
            'lastmod' => date(DateTime::RFC3339),
            'priority' => '1.0',
        ];
    }
}
catch (\PDOException $exception) {
    $jsonOutput = false;
}

header("Content-type: text/xml");
?>
<?php echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"; ?>
<urlset
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">


<?php
    foreach ($urls as $url) {
        echo "<url>
    <loc><![CDATA[ {$url['loc']} ]]></loc>
    <lastmod>{$url['lastmod']}</lastmod>
    <priority>{$url['priority']}</priority>
</url>\n";
    }
?>


</urlset>