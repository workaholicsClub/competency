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

$professionCode = $_REQUEST['professionCode'];
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
HAVING profSkillsRate >= 0.6');

$skillsQuery = $pdo->prepare('SELECT s.name, lsc.skillLevel FROM links_skills_courses lsc
	LEFT JOIN skills s ON lsc.skillId = s.id
WHERE lsc.courseId = ?');

$requirementsQuery = $pdo->prepare('SELECT s.name, lrc.skillLevel FROM links_requirements_courses lrc
	LEFT JOIN skills s ON lrc.skillId = s.id
WHERE lrc.courseId = ?');


if ($professionCode) {
    $coursesQuery->execute([$professionCode]);
    $jsonOutput = [];
    while ($course = $coursesQuery->fetch()) {
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

        $jsonOutput[] = [
            "id"            => intval($course['id']),
            "platform"      => $course['platform'],
            "title"         => $course['name'],
            "url"           => '/api/go.php?courseId='.$course['id'],
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
            "description"   => $course['description'],
            "skills"        => $skills,
            "requirements"  => $requirements,
        ];
    };
}

if ($jsonOutput === false) {
    $jsonOutput = [];
}

echo "function getCoursesList() {
    return " . json_encode($jsonOutput) . ";
}";