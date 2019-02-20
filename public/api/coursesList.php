<?php

require '../../vendor/autoload.php';
use Elasticsearch\ClientBuilder;
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
$search = $_REQUEST['search'];
$noTextCoursesQuery = $pdo->prepare('SELECT 
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

$skillsQuery = $pdo->prepare('SELECT s.name, lsc.skillLevel FROM links_skills_courses lsc
	LEFT JOIN skills s ON lsc.skillId = s.id
WHERE lsc.courseId = ?');

$requirementsQuery = $pdo->prepare('SELECT s.name, lrc.skillLevel FROM links_requirements_courses lrc
	LEFT JOIN skills s ON lrc.skillId = s.id
WHERE lrc.courseId = ?');

function get_id($course)
{
    return ($course['_source']['id']);
}

if ($professionCode) {
    if ($search) {
        $esClient = ClientBuilder::create()
            ->setHosts([ 'elasticsearch' ])
            ->build();
        $params = [
            'index' => 'courses',
            'type' => '_doc',
            'body' => [
                'query' => [
                    'match' => [
                        'availableText' => [
                            'query' => $search,
                            'fuzziness' => 'AUTO',
                            'operator' => 'and'
                        ]
                    ]
                ]
            ]
        ];

        $searchResults = $esClient->search($params);
        $courseIds = array_map(get_id, $searchResults['hits']['hits']);
        $placeholders = '?';
        if (count($courseIds) > 0) {
            $placeholders = str_repeat ('?, ',  count ($courseIds) - 1) . '?';
        } else {
            $courseIds = [ -1 ];
        }
        $matchedTextCoursesQuery = $pdo->prepare("SELECT 
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
                    AND c.id IN ($placeholders)
            GROUP BY c.id, lsc.skillId
        ) sq
        GROUP BY id
        HAVING profSkillsRate >= 0.5");
        $matchedTextCoursesQuery->execute(array_merge([$professionCode], $courseIds));
        $coursesQuery = $matchedTextCoursesQuery;
    } else {
        $noTextCoursesQuery->execute([$professionCode]);
        $coursesQuery = $noTextCoursesQuery;
    }
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
    };
}

if ($jsonOutput === false) {
    $jsonOutput = [];
}

header('Content-type: application/json');
echo json_encode($jsonOutput);