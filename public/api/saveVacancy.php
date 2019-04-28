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

$vacancyData = [];
$vacancyFields = ['title', 'companyName', 'city', 'salaryFrom', 'salaryTo', 'fullTime','officialEmployment', 'flexibleSchedule', 'probation','canBeRemote',
    'training', 'food', 'sportAndFitness', 'communicationsCompensation', 'sickLeaveCompensation',
    'vacationCompensation', 'dressCode', 'relocationHelp', 'text'];

$vacancyParametres = ['fullTime','officialEmployment', 'flexibleSchedule', 'probation','canBeRemote',
    'training', 'food', 'sportAndFitness', 'communicationsCompensation', 'sickLeaveCompensation',
    'vacationCompensation', 'dressCode', 'relocationHelp'];

foreach ($_POST as $key => $value) {
    if (in_array($key, $vacancyFields)) {
        $vacancyData[":" . $key] = $value;
    }
}

foreach ($vacancyParametres as $key => $value){
    if (!isset($vacancyData[':'.$value])) {
        $vacancyData[':'.$value] = 0;
    }
}

$skills = isset($_POST['skills']) ? $_POST['skills'] : [];

$professionQuery = $pdo->prepare("SELECT * FROM professions WHERE name=:profession");

$insertSQL = "INSERT INTO vacancies
  (professionId, title, companyName, city, salaryFrom, salaryTo, text, fullTime, officialEmployment, flexibleSchedule, probation, canBeRemote, training, food, sportAndFitness, communicationsCompensation, sickLeaveCompensation, vacationCompensation, dressCode, relocationHelp)
  VALUES
  (:professionId, :title, :companyName, :city, :salaryFrom, :salaryTo, :text, :fullTime, :officialEmployment, :flexibleSchedule, :probation, :canBeRemote, :training, :food, :sportAndFitness, :communicationsCompensation, :sickLeaveCompensation, :vacationCompensation, :dressCode, :relocationHelp)";
$insertQuery = $pdo->prepare($insertSQL);

$skillsQuery = $pdo->prepare("INSERT INTO links_skills_vacancies (vacancyId, skillId, skillLevel) VALUES (:vacancyId, :skillId, :skillLevel)");


try {
    $pdo->beginTransaction();

    $professionQuery->execute([$_POST['profession']]);
    $profession = $professionQuery->fetch(PDO::FETCH_OBJ);

    $vacancyData[":professionId"] = $profession->id;
    $insertQuery->execute($vacancyData);

    $vacancyId = $pdo->lastInsertId();

    if(!empty($skills)){
        foreach ($skills as $skillId => $skillLevel) {
            $skillsQuery->execute([
                ":vacancyId" => $vacancyId,
                ":skillId" => $skillId,
                ":skillLevel" => $skillLevel,
            ]);
        }
    }

    $pdo->commit();

    $jsonOutput = ['id' => $vacancyId];
}
catch (\PDOException $exception) {
    $jsonOutput = false;
    $pdo->rollback();
}

if ($jsonOutput === false) {
    $jsonOutput = [];
}

echo json_encode($jsonOutput);