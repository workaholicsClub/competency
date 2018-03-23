<?php

use Competencies\Mocks\Http;
use Competencies\User\UserModel;
use Http\Adapter\Guzzle6\Client;
use PHPUnit\Framework\TestCase;

/**
 * Class ApiMethodsTest
 * Этот класс служит для проверки запросов к API через HTTP-интерфейс.
 * В каждом запросе передается параметр _test=test, что позволяет использовать тестовую базу. Тест позволяет проверить
 * запрос-ответ полностью, но, поскольку от запроса к запросу база данных сбрасывается, он не позволяет делать
 * комплексных проверок.
 */
class ApiMethodsTest extends TestCase
{
    const TEST_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJtYXRyaXgiLCJpYXQiOjE1MTM3MDAwMDAsImV4cCI6MTUxMzcxMDgwMCwiZW1haWwiOiJhcEBtYWlsaW5hdG9yLmNvbSJ9.oW5Ym4MT-HmKQlXIPd1u7bJBdJRyWU6B6wzJN7pNh90';

    public function makeRequest(string $uri, array $queryParams, string $type = 'GET'): array {
        $urlBase = 'http://127.0.0.1:8080/api';

        $request = Http::makeRequest($urlBase.'/'.$uri, $queryParams, $type);
        $client = new Client();
        $response = $client->sendRequest($request);

        $decodeAssoc = true;
        $json = json_decode($response->getBody(), $decodeAssoc);

        return $json;
    }

    public function makeTestRequest(string $uri, array $queryParams, string $type = 'GET'): array {
        $queryParams['_test'] = 'true';
        return $this->makeRequest($uri, $queryParams, $type);
    }

    public function testUserToken() {
        $response = $this->makeTestRequest('user/token/ap@mailinator.com', []);

        $this->assertEquals(200, $response['status']);
        $this->assertEquals("true", $response['success']);
    }

    public function testUser() {
        $expectedUserParams = [
            "id"             => 1,
            "dateRegistered" => [
                "date"          => "2017-12-18 11:45:36.000000",
                "timezone_type" => 3,
                "timezone"      => "UTC",
            ],
            "name"           => null,
            "email"          => "ap@mailinator.com",
            "remindMonths"   => null,
            "subscribe"      => null,
        ];

        $response = $this->makeTestRequest('user', [
            'token' => self::TEST_TOKEN
        ]);

        $this->assertEquals(200, $response['status']);
        $this->assertEquals($expectedUserParams, $response['user']);
    }

    public function testProfession() {
        $response = $this->makeTestRequest('profession', []);
        $webDeveloperParams = $response['profession'][0];

        $this->assertEquals(200, $response['status']);
        $this->assertEquals(3, count($response['profession']));
        $this->assertEquals(1, $webDeveloperParams['id']);
        $this->assertEquals('webDeveloper', $webDeveloperParams['code']);
        $this->assertArrayHasKey('name', $webDeveloperParams);
        $this->assertArrayHasKey('groups', $webDeveloperParams);
        $this->assertArrayHasKey('competencies', $webDeveloperParams['groups'][0]);
        $this->assertArrayHasKey('skills', $webDeveloperParams['groups'][0]['competencies'][0]);
        $this->assertArrayHasKey('text', $webDeveloperParams['groups'][0]['competencies'][0]['skills'][0]);
        $this->assertArrayHasKey('additionalDescription', $webDeveloperParams['groups'][0]['competencies'][0]['skills'][0]);
    }

    public function testCoursesRecommend() {
        $response = $this->makeTestRequest('/courses/recommend', [
            'competency' => [
                'probabiltyBasics' => 0.5
            ]
        ]);
        $courseParams = $response['course'][0];

        $this->assertEquals(200, $response['status']);
        $this->assertEquals(1, count($response['course']));
        $this->assertEquals(19, $courseParams['id']);
        $this->assertEquals('osnovy-statistiki', $courseParams['code']);
        $this->assertArrayHasKey('competencies', $courseParams);
        $this->assertEquals(1, count($courseParams['competencies']));
        $this->assertEquals('probabiltyBasics', $courseParams['competencies'][0]['code']);
    }

    public function testCoursesSearch() {
        $response = $this->makeTestRequest('/courses/search', []);
        $this->assertEquals(200, $response['status']);
    }

    /**
     * @see RoutesTest::testResultsSave()
     */
    public function testResultsSave() {
        $saveResponse = $this->makeTestRequest('results/save', [
            'email' => 'ap@mailinator.com',
            'subscribe' => UserModel::SUBSCRIBE_COURSES,
            'remindMonths' => 6,
            'competency' => [
                'probabiltyBasics' => 0.5
            ]
        ], 'POST');

        $this->assertEquals(200, $saveResponse['status']);
        $this->assertEquals(true, $saveResponse['success']);
    }

}