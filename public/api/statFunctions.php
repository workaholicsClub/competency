<?php
function mean(array $values) {
    return array_sum($values) / count($values);
}

function median(array $values) {
    sort($values);
    $hasEvenElements = count($values) % 2 === 0;

    if ($hasEvenElements) {
        $leftIndex = floor(count($values)/2)-1;
        $rightIndex = $leftIndex + 1;
        $median = mean([ $values[$leftIndex], $values[$rightIndex] ]);
    }
    else {
        $middleIndex = floor(count($values)/2);
        $median = $values[$middleIndex];
    }

    return $median;
}

function mode(array $values) {
    $valuesCount = array_count_values($values);
    $mode = array_search(max($valuesCount), $valuesCount);

    return $mode;
}