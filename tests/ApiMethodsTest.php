<?php

use Competencies\Mocks\Http;
use Competencies\User\UserModel;
use GuzzleHttp\Psr7\Response;
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

    public function makeRequestRaw(string $uri, array $queryParams, string $type = 'GET'): Response {
        $urlBase = 'http://127.0.0.1:8080/api';

        $request = Http::makeRequest($urlBase.'/'.$uri, $queryParams, $type);
        $client = new Client();
        $response = $client->sendRequest($request);

        return $response;
    }

    public function makeRequest(string $uri, array $queryParams, string $type = 'GET'): array {
        $response = $this->makeRequestRaw($uri, $queryParams, $type);

        $decodeAssoc = true;
        $responseBody = (string) $response->getBody();
        $json = json_decode($responseBody, $decodeAssoc);

        return $json ? $json : [];
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
            'uuid'           => null
        ];

        $response = $this->makeTestRequest('user', [
            'token' => self::TEST_TOKEN
        ]);

        $this->assertEquals(200, $response['status']);
        $this->assertEquals($expectedUserParams, $response['user']);
    }

    public function testProfession() {
        //Запрос не тестовый, т.к. используются фукнции, специфичные для MySql
        $response = $this->makeRequest('profession', []);
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
        $response = $this->makeTestRequest('courses/recommend', [
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
        $expectedCourseFields = [
            'externalId',
            'code',
            'name',
            'description',
            'url',
            'modeOfStudy',
            'courseForm',
            'schedule',
            'certificate',
            'tasksType',
            'lengthDays',
            'price',
            'skills',
            'requirements',
            'eduProvider'
        ];

        $response = $this->makeTestRequest('courses/search', [
            "modeOfStudy"  => "selfStudy",
            "courseForm"   => "video",
            "certificate"  => "1",
            "skills"       => [
                "354" => "knowledge",
                "380" => "skill",
            ],
            "requirements" => [
                "361" => "knowledge",
            ],
        ]);

        $this->assertEquals(200, $response['status']);
        $this->assertCount(2, $response['course']);
        $this->assertEquals($expectedCourseFields, array_keys($response['course'][0]));

        $response = $this->makeTestRequest('courses/search', [
            "modeOfStudy" => "selfStudy",
            "courseForm"  => "video",
            "certificate" => "1",
            "userSkills"  => [
                "354" => "knowledge",
                "380" => "skill",
            ],
        ]);

        $this->assertEquals(200, $response['status']);
        $this->assertCount(2, $response['course']);
        $this->assertEquals($expectedCourseFields, array_keys($response['course'][0]));
    }

    public function testLargeSearchRequest() {
        $query = "userSkills[71]=none&userSkills[72]=none&userSkills[73]=none&userSkills[74]=none&userSkills[75]=none&userSkills[76]=none&userSkills[77]=none&userSkills[78]=none&userSkills[79]=none&userSkills[80]=none&userSkills[81]=none&userSkills[82]=none&userSkills[83]=none&userSkills[84]=none&userSkills[85]=none&userSkills[86]=none&userSkills[87]=none&userSkills[88]=none&userSkills[89]=none&userSkills[90]=none&userSkills[91]=none&userSkills[92]=none&userSkills[93]=none&userSkills[94]=none&userSkills[95]=none&userSkills[96]=none&userSkills[97]=none&userSkills[98]=none&userSkills[99]=none&userSkills[100]=none&userSkills[101]=none&userSkills[102]=none&userSkills[103]=none&userSkills[104]=none&userSkills[105]=none&userSkills[106]=none&userSkills[107]=none&userSkills[108]=none&userSkills[109]=none&userSkills[110]=none&userSkills[111]=none&userSkills[112]=none&userSkills[113]=none&userSkills[114]=none&userSkills[115]=none&userSkills[116]=none&userSkills[351]=none&userSkills[352]=none&userSkills[353]=none&userSkills[354]=none&userSkills[355]=none&userSkills[356]=none&userSkills[357]=none&userSkills[358]=none&userSkills[359]=none&userSkills[360]=none&userSkills[361]=none&userSkills[362]=none&userSkills[363]=none&userSkills[364]=none&userSkills[365]=none&userSkills[366]=none&userSkills[367]=none&userSkills[368]=none&userSkills[369]=none&userSkills[370]=none&userSkills[371]=none&userSkills[372]=none&userSkills[373]=none&userSkills[374]=none&userSkills[375]=none&userSkills[376]=none&userSkills[377]=none&userSkills[378]=none&userSkills[379]=none&userSkills[380]=none&userSkills[381]=none&userSkills[382]=none&userSkills[383]=none&userSkills[384]=none&userSkills[385]=none&userSkills[386]=none&userSkills[387]=none&userSkills[388]=none&userSkills[389]=none&userSkills[207]=none&userSkills[208]=none&userSkills[209]=none&userSkills[210]=none&userSkills[211]=none&userSkills[212]=none&userSkills[213]=none&userSkills[214]=none&userSkills[215]=none&userSkills[216]=none&userSkills[217]=none&userSkills[218]=none&userSkills[219]=none&userSkills[220]=none&userSkills[221]=none&userSkills[222]=none&userSkills[223]=none&userSkills[224]=none&userSkills[225]=none&userSkills[226]=none&userSkills[227]=none&userSkills[228]=none&userSkills[511]=none&userSkills[307]=none&userSkills[308]=none&userSkills[309]=none&userSkills[310]=none&userSkills[311]=none&userSkills[312]=none&userSkills[313]=none&userSkills[314]=none&userSkills[315]=none&userSkills[316]=none&userSkills[317]=none&userSkills[318]=none&userSkills[319]=none&userSkills[320]=none&userSkills[321]=none&userSkills[322]=none&userSkills[323]=none&userSkills[324]=none&userSkills[325]=none&userSkills[326]=none&userSkills[327]=none&userSkills[328]=none&userSkills[329]=none&userSkills[330]=none&userSkills[331]=none&userSkills[332]=none&userSkills[333]=none&userSkills[334]=none&userSkills[335]=none&userSkills[336]=none&userSkills[337]=none&userSkills[338]=none&userSkills[339]=none&userSkills[340]=none&userSkills[341]=none&userSkills[342]=none&userSkills[343]=none&userSkills[344]=none&userSkills[345]=none&userSkills[346]=none&userSkills[347]=none&userSkills[348]=none&userSkills[349]=none&userSkills[350]=none";
        parse_str($query, $queryParams);

        $response = $this->makeTestRequest('courses/search', $queryParams);

        $this->assertEquals(200, $response['status']);
        $this->assertCount(4, $response['course']);
    }

    /**
     * @see RoutesTest::testResultsSave()
     */
    public function testResultsSave() {
        $saveResponse = $this->makeTestRequest('results/save', [
            'email'        => 'ap@mailinator.com',
            'subscribe'    => UserModel::SUBSCRIBE_COURSES,
            'remindMonths' => 6,
            'competency'   => [
                'probabiltyBasics' => 0.5,
            ],
        ], 'POST');

        $this->assertEquals(200, $saveResponse['status']);
        $this->assertEquals(true, $saveResponse['success']);
    }

    /**
     * @see RoutesTest::testResultsSaveSession()
     */
    public function testResultsSaveSession() {
        $saveResponse = $this->makeTestRequest('results/saveSession', [
            'userId'    => 'acb8f472-9f77-4bab-a43a-25201978e86b',
            'sessionId' => '05313d2c-fcfc-4374-966c-59fe59ddbe02',
            'skills'    => [
                '207' => 'knowledge',
                '208' => 'skill',
                '209' => 'ability',
                '221' => 'skill',
            ],
        ], 'POST');

        $this->assertEquals(200, $saveResponse['status']);
        $this->assertEquals(true, $saveResponse['success']);
    }

    /**
     * @see RoutesTest::testCoursesGo()
     */
    public function testCoursesGo() {
        $redirectResponse = $this->makeRequestRaw('courses/go/vvedenie-v-bazy-dannyh', [
            'userId'    => 'acb8f472-9f77-4bab-a43a-25201978e86b',
            'sessionId' => '05313d2c-fcfc-4374-966c-59fe59ddbe02',
            '_test'     => 'true'
        ], 'GET');

        $redirectUrl = $redirectResponse->getHeader('Location')[0];
        $this->assertEquals(302, $redirectResponse->getStatusCode());
        $this->assertEquals($redirectUrl, 'https://stepik.org/course/551');
    }
}