<?php
function getCertificate($course) {
    $map = [
        'Нет'                      => false,
        'Собственный'              => 'self',
        'Государственного образца' => 'state',
        'Международный'            => 'international',
    ];

    return isset($map[$course['certificate']]) ? [ $map[$course['certificate']] ] : false;
}

function getForm($course) {
    $forms = [
        'online' => ['Вебинар','Видео','Онлайн','Текстовый', 'Электронный учебник', 'Интерактивный'],
        'offline' => ['Очный','Вечерний','Выходные','Интенсив']
    ];

    $result = false;
    foreach ($forms as $form => $values) {
        $formatFound = array_search($course['format'], $values) !== false;

        if ($formatFound) {
            $result = [$form];
        }
    }

    return $result;
}

function getFormat($course) {
    $map = [
        'Видео'               => 'video',
        'Вебинар'             => 'webinar',
        'Чат'                 => 'chat',
        'Интенсив'            => 'intensive',
        'Интерактивный'       => 'interactive',
        'Электронный учебник' => 'textbook',
        'Текстовый'           => 'textbook',
    ];

    if ( isset($map[$course['format']]) ) {
        $value = $map[$course['format']];
        return [$value];
    }

    if ($course['format'] === 'Онлайн') {
        return ['interactive'];
    }

    return false;
}

function getTime($course) {
    $map = [
        'Очный' => 'day',
        'Вечерний' => 'evening',
        'Выходные' => 'dayoffs',
        'Интенсив' => 'day'
    ];

    if ( isset($map[$course['format']]) ) {
        $value = $map[$course['format']];
        return [$value];
    }

    return false;
}

function getAudience($course) {
    if ($course['platform'] === 'Otus') {
        return ['middle', 'senior'];
    }

    if ($course['platform'] === 'Software-Testing.Ru') {
        return ['middle'];
    }

    return ['junior'];
}

function getDurationUnits($course) {
    $map = [
        'минута'  => 'minute',
        'час'     => 'hour',
        'ак. час' => 'academic-hour',
        'день'    => 'day',
        'неделя'  => 'week',
        'месяц'   => 'month',
        'урок'    => 'lesson',
        'модуль'  => 'module',
    ];

    return $map[ $course['durationUnits'] ];
}

$mysqlUser = getenv('MYSQL_USER');
$mysqlPassword = getenv('MYSQL_PASSWORD');
$mysqlDsn = getenv('MYSQL_DSN');

$mongoHost = getenv('MONGO_HOST');
$mongoDatabaseName = getenv('MONGO_DB');
$mongoDSN = "mongodb://${mongoHost}/";
$eduItemsCollection = "${mongoDatabaseName}.eduItems";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

$output = false;

try {
    $pdo = new PDO($mysqlDsn, $mysqlUser, $mysqlPassword, $options);
}
catch (\PDOException $exception) {
    die( (string) $exception );
}

try {
    $manager = new MongoDB\Driver\Manager($mongoDSN);
    $bulk = new MongoDB\Driver\BulkWrite;
}
catch (MongoDB\Driver\Exception\Exception $e) {
    die($e->getMessage());
}

$courseQuery = $pdo->prepare("SELECT c.*,
               GROUP_CONCAT(DISTINCT ss.name SEPARATOR ';') AS skills,
               GROUP_CONCAT(DISTINCT rs.name SEPARATOR ';') AS requirements
        FROM courses c
            LEFT JOIN links_skills_courses lsc ON c.id = lsc.courseId
            LEFT JOIN links_requirements_courses lrc ON c.id = lrc.courseId
            LEFT JOIN skills ss ON lsc.skillId = ss.id
            LEFT JOIN skills rs ON lrc.skillId = rs.id
        WHERE c.inArchive = 0
        GROUP BY c.id");

$courseQuery->execute();
while( $sqlCourse = $courseQuery->fetch() ) {

    $mongoCourse = [
        "_id"           => new MongoDB\BSON\ObjectID,
        "type"          => "course",
        "price"         => $sqlCourse['price'],
        "priceType"     => "total",
        "duration"      => $sqlCourse['duration'],
        "durationUnits" => getDurationUnits($sqlCourse),
        //"city"          => "",
        //"load"          => "",
        //"loadUnits"     => "hour-per-day",
        "title"         => $sqlCourse['name'],
        "url"           => $sqlCourse['url'],
        "partnerUrl"    => $sqlCourse['partnerUrl'],
        "platform"      => $sqlCourse['platform'],
        //"form"          => ["online",],
        //"format"        => ["webinar", "chat",],
        //"audience"      => ["junior",],
        //"certificate"   => ["state",],
        //"time"          => ["evening",],
        "hasPractice"   => boolval($sqlCourse['hasPractice']),
        "hasTeacher"    => boolval($sqlCourse['hasTeacher']),
        "jobPlacement"  => boolval($sqlCourse['jobPlacement']),
        "forKids"       => boolval($sqlCourse['forKids']),
        "description"   => $sqlCourse['description'],
        "skills"        => explode(';', $sqlCourse['skills']),
        "requirements"  => explode(';', $sqlCourse['requirements']),
    ];

    if ($sqlCourse['city']) {
        $mongoCourse['city'] = $sqlCourse['city'];
    }

    if ($form = getForm($sqlCourse)) {
        $mongoCourse['form'] = $form;
    }

    if ($format = getFormat($sqlCourse)) {
        $mongoCourse['format'] = $format;
    }

    if ($time = getTime($sqlCourse)) {
        $mongoCourse['time'] = $time;
    }

    if ($certificate = getCertificate($sqlCourse)) {
        $mongoCourse['certificate'] = $certificate;
    }

    if ($audience = getAudience($sqlCourse)) {
        $mongoCourse['audience'] = $audience;
    }

    $bulk->insert($mongoCourse);
}

try {
    $insertResult = $manager->executeBulkWrite($eduItemsCollection, $bulk);
}
catch (MongoDB\Driver\Exception\Exception $e) {
    die($e->getMessage());
}

echo "Все в порядке";