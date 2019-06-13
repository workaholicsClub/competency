<?php

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

$courseId = $_REQUEST['id'];
$courseQuery = $pdo->prepare('SELECT * FROM courses WHERE id = ?');

$skillsQuery = $pdo->prepare('SELECT s.name, lsc.skillLevel FROM links_skills_courses lsc
	LEFT JOIN skills s ON lsc.skillId = s.id
WHERE lsc.courseId = ?');

$requirementsQuery = $pdo->prepare('SELECT s.name, lrc.skillLevel FROM links_requirements_courses lrc
	LEFT JOIN skills s ON lrc.skillId = s.id
WHERE lrc.courseId = ?');


if ($courseId) {
    $courseQuery->execute([$courseId]);
    $jsonOutput = [];
    $course = $courseQuery->fetch();

    $skills = [];
    $skillsQuery->execute([$course['id']]);
    while ($skill = $skillsQuery->fetch()) {
        $skills[$skill['name']] = $skill['skillLevel'];
    }

    $requirements = [];
    $requirementsQuery->execute([$course['id']]);
    while ($requirement = $requirementsQuery->fetch()) {
        $requirements[$requirement['name']] = $requirement['skillLevel'];
    }

    $jsonOutput = [
        "id"            => intval($course['id']),
        "platform"      => $course['platform'],
        "title"         => $course['name'],
        "url"           => '/api/go.php?courseId='.$course['id'],
        "rawUrl"        => $course['url'],
        "hasPartnerUrl" => !empty($course['partnerUrl']),
        "format"        => $course['format'],
        "hasTeacher"    => boolval($course['hasTeacher']),
        "hasPractice"   => boolval($course['hasPractice']),
        "jobPlacement"  => boolval($course['jobPlacement']),
        "forKids"       => boolval($course['forKids']),
        "certificate"   => $course['certificate'],
        "city"          => $course['city'],
        "duration"      => intval($course['duration']),
        "durationUnits" => $course['durationUnits'],
        "price"         => floatval($course['price']),
        "coupon"        => $course['coupon'] ? $course['coupon'] : false,
        "couponDiscount" => $course['couponDiscount'] ? floatval($course['couponDiscount']) : false,
        "description"   => $course['description'],
        "skills"        => $skills,
        "requirements"  => $requirements,
    ];
}

if ($jsonOutput === false) {
    $jsonOutput = [];
}

header("Content-type: application/json; charset=utf-8");
echo json_encode($jsonOutput);