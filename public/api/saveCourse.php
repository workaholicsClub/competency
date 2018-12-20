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

$courseData = [];
$courseFields = ['platform', 'name', 'url', 'format', 'hasTeacher', 'hasPractice', 'jobPlacement', 'forKids', 'certificate', 'city', 'duration', 'durationUnits', 'description', 'price'];
foreach ($_POST as $key => $value) {
    if (in_array($key, $courseFields)) {
        $courseData[":" . $key] = $value;
    }
}

$skills = isset($_POST['skills']) ? $_POST['skills'] : [];
$requirements = isset($_POST['requirements']) ? $_POST['requirements'] : [];

if (!isset($courseData[':hasTeacher'])) {
    $courseData[':hasTeacher'] = 0;
}

if (!isset($courseData[':hasPractice'])) {
    $courseData[':hasPractice'] = 0;
}

if (!isset($courseData[':jobPlacement'])) {
    $courseData[':jobPlacement'] = 0;
}

if (!isset($courseData[':forKids'])) {
    $courseData[':forKids'] = 0;
}


$insertSQL = "INSERT INTO courses
  (platform, name, url, format, hasTeacher, hasPractice, jobPlacement, forKids, certificate, city, duration, durationUnits, description, price)
  VALUES
  (:platform, :name, :url, :format, :hasTeacher, :hasPractice, :jobPlacement, :forKids, :certificate, :city, :duration, :durationUnits, :description, :price)";
$insertQuery = $pdo->prepare($insertSQL);

$skillsQuery = $pdo->prepare("INSERT INTO links_skills_courses (courseId, skillId, skillLevel) VALUES (:courseId, :skillId, :skillLevel)");
$requirementsQuery = $pdo->prepare("INSERT INTO links_requirements_courses (courseId, skillId, skillLevel) VALUES (:courseId, :skillId, :skillLevel)");

try {
    $pdo->beginTransaction();
    $insertQuery->execute($courseData);

    $courseId = $pdo->lastInsertId();
    foreach ($skills as $skillId => $skillLevel) {
        $skillsQuery->execute([
            ":courseId"   => $courseId,
            ":skillId"    => $skillId,
            ":skillLevel" => $skillLevel,
        ]);
    }

    foreach ($requirements as $skillId => $skillLevel) {
        $requirementsQuery->execute([
            ":courseId"   => $courseId,
            ":skillId"    => $skillId,
            ":skillLevel" => $skillLevel,
        ]);
    }

    $pdo->commit();
    $jsonOutput = ['id' => $courseId];
}
catch (\PDOException $exception) {
    $jsonOutput = false;
    $pdo->rollback();
}

if ($jsonOutput === false) {
    $jsonOutput = [];
}

echo json_encode($jsonOutput);