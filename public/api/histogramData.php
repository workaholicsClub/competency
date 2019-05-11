<?php
require_once('statFunctions.php');

function detectStepCount($min, $max, $preferredCount) {
    $detectionSize = 1000;
    $detectLimit = $max / $detectionSize;
    $range = $max - $min;

    $detected = 1;
    for ($stepCount = 1; $stepCount < $detectLimit; $stepCount++) {
        $isDistanceSmaller = abs($preferredCount - $stepCount) < abs($preferredCount - $detected);
        $isRound = ($range / $stepCount) % $detectionSize === 0;

        if ($isRound && $isDistanceSmaller) {
            $detected = $stepCount;
        }
    }

    return $detected;
}

function toBinLabel($value) {
    return ($value / 1000) . "K";
}


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

$salaryQuery = $pdo->prepare('SELECT IF(ISNULL(salaryFrom), salaryTo, salaryFrom) AS salaryFrom,
       IF(ISNULL(salaryTo), salaryFrom, salaryTo) AS salaryTo
	FROM vacancies v
        LEFT JOIN professions p ON v.professionId = p.id
    WHERE p.code = ?
    AND (salaryFrom IS NOT NULL OR salaryTo IS NOT NULL)');

if ($professionCode) {
    $jsonOutput = [];
    $salaryFrom = [];
    $salaryTo = [];
    $avgSalary = [];

    $salaryQuery->execute([$professionCode]);

    while ($salary = $salaryQuery->fetch()) {
        $salaryFrom[] = $salary['salaryFrom'];
        $salaryTo[] = $salary['salaryTo'];
        $avgSalary[] = ($salary['salaryTo'] + $salary['salaryFrom'])/2;
    }

    $min = min($salaryFrom);
    $max = max($salaryTo);
    $stepCount = detectStepCount($min, $max, 10);
    $step = ($max - $min) / $stepCount;

    $bins = [];
    $binsCount = [];
    $binLabels = [];

    for ($binFrom = $min; $binFrom < $max; $binFrom+=$step) {
        $binTo = $binFrom + $step;
        $bins[] = "{$binFrom} - {$binTo}";
        $binIndex = count($bins)-1;
        $binsCount[$binIndex] = 0;
        $binLabels[$binIndex] = toBinLabel($binFrom);

        foreach ($salaryFrom as $index => $currentSalaryFrom) {
            $currentSalaryTo = $salaryTo[$index];

            $salaryFromFitsBin = $currentSalaryFrom >= $binFrom && $currentSalaryFrom <= $binTo;
            $salaryToFitsBin = $currentSalaryTo >= $binFrom && $currentSalaryTo <= $binTo;
            $fitsBin = $salaryFromFitsBin || $salaryToFitsBin;

            if ($fitsBin) {
                $binsCount[$binIndex]++;
            }
        }
    }

    $binLabels[] = toBinLabel($max);

    $jsonOutput = [
        'step' => $step,
        'bins' => $bins,
        'binValues' => $binsCount,
        'binLabels' => $binLabels,
        'salary' => [],
    ];

    $jsonOutput['salary'] = [
        'min' => $min,
        'max' => $max,
        'avg' => [
            'mean' => mean($avgSalary),
            'median' => median($avgSalary),
            'q25' => quartile($avgSalary, 0.25),
            'q50' => quartile($avgSalary, 0.50),
            'q75' => quartile($avgSalary, 0.75),
        ],
        'from' => [
            'mean' => mean($salaryFrom),
            'median' => median($salaryFrom),
            'q25' => quartile($salaryFrom, 0.25),
            'q50' => quartile($salaryFrom, 0.50),
            'q75' => quartile($salaryFrom, 0.75),
        ],
        'to' => [
            'mean' => mean($salaryTo),
            'median' => median($salaryTo),
            'q25' => quartile($salaryTo, 0.25),
            'q50' => quartile($salaryTo, 0.50),
            'q75' => quartile($salaryTo, 0.75),
        ],
    ];
}

header("Content-type: application/json; charset=utf-8");
echo json_encode($jsonOutput);