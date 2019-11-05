<?php

$token = $_ENV['GLOT_TOKEN'];
$glotLangCode = $_REQUEST['lang'];
$code = $_REQUEST['code'];
$endpointUrl = "https://run.glot.io/languages/${glotLangCode}/latest";

$extensions = [
    "python" => "py",
    "javascript" => "js",
    "java" => "java",
    "php" => "php",
    "go" => "go",
    "swift" => "swift",
    "kotlin" => "kt",
    "cpp" => "cpp",
];

$fileName = "Main.".$extensions[$glotLangCode];

$codeData = [
    "files" => [
        [
            "name" => $fileName,
            "content" => $code,
        ]
    ]
];
$requestPayload = json_encode($codeData);

$request = curl_init($endpointUrl);
curl_setopt($request, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($request, CURLOPT_POSTFIELDS, $requestPayload);
curl_setopt($request, CURLOPT_RETURNTRANSFER, true);
curl_setopt($request, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Authorization: Token ${token}",
]);

$response = curl_exec($request);
curl_close($request);

header("Content-type: application/json; charset=utf-8");
echo $response;