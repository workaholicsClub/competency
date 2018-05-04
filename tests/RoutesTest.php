<?php

use Competencies\Course\CourseVisitEntity;
use Competencies\MailerInterface;
use Competencies\Mocks\Database;
use Competencies\Mocks\Http;
use Competencies\Routes;
use Competencies\User\UserModel;
use PHPUnit\Framework\TestCase;
use Slim\Container;
use Slim\Http\Response;
use Spot\Locator;

/**
 * Class RoutesTest
 * Этот тест служит для проверки запросов к API, вызывая обработчики маршрутов напрямую, а не через HTTP-интерфейс.
 * Это позволяет делать более комплексные проверки и отслеживать изменения во временной базе данных, но не проверяет
 * приложение целиком.
 */
class RoutesTest extends TestCase
{
    const TEST_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJtYXRyaXgiLCJpYXQiOjE1MTM3MDAwMDAsImV4cCI6MTUxMzcxMDgwMCwiZW1haWwiOiJhcEBtYWlsaW5hdG9yLmNvbSJ9.oW5Ym4MT-HmKQlXIPd1u7bJBdJRyWU6B6wzJN7pNh90';

    public function makeContainer(): Container {
        $mailer = $this
            ->getMockBuilder(MailerInterface::class)
            ->getMock();

        $container = new Container([
            'dbLocator' => Database::getTest(),
            'mailer' => $mailer,
        ]);

        return $container;
    }

    public function callRouteRaw(string $routeName, string $requestType, array $requestParams, Container $container, array $requestAttributes = []): Response {
        $request = Http::makeSlimRequest('', $requestParams, $requestType);
        if ( !empty($requestAttributes) ) {
            foreach ($requestAttributes as $key => $value) {
                $request = $request->withAttribute($key, $value);
            }
        }

        $response = Http::makeSlimResponse();

        $routes = new Routes($container);
        $response = $routes->$routeName($request, $response, $requestParams);

        return $response;
    }

    public function callRoute(string $routeName, string $requestType, array $requestParams, Container $container, array $requestAttributes = []): array {
        $response = $this->callRouteRaw($routeName, $requestType, $requestParams, $container, $requestAttributes);
        $responseBody = (string) $response->getBody();

        $decodeAssoc = true;
        $json = json_decode($responseBody, $decodeAssoc);

        return $json;
    }

    /**
     * @see ApiMethodsTest::testResultsSave()
     */
    public function testResultsSave() {
        $expectedSubscribe = UserModel::SUBSCRIBE_COURSES;
        $expectedRemindMonths = 6;
        $container = $this->makeContainer();

        $beforeSaveUser = $this->callRoute('user', 'GET', [
            'token' => self::TEST_TOKEN
        ], $container);

        $this->assertNull($beforeSaveUser['user']['remindMonths']);
        $this->assertNull($beforeSaveUser['user']['subscribe']);

        $saveResponse = $this->callRoute('resultsSave', 'POST', [
            'email' => 'ap@mailinator.com',
            'subscribe' => $expectedSubscribe,
            'remindMonths' => $expectedRemindMonths,
            'competency' => [
                'probabiltyBasics' => 0.5
            ]
        ], $container);

        $afterSaveUser = $this->callRoute('user', 'GET', [
            'token' => self::TEST_TOKEN
        ], $container);

        $this->assertNull($beforeSaveUser['user']['remindMonths']);
        $this->assertNull($beforeSaveUser['user']['subscribe']);

        $this->assertEquals(200, $saveResponse['status']);
        $this->assertEquals(true, $saveResponse['success']);

        $this->assertEquals($expectedSubscribe, $afterSaveUser['user']['subscribe']);
        $this->assertEquals($expectedRemindMonths, $afterSaveUser['user']['remindMonths']);
    }

    /**
     * @see ApiMethodsTest::testResultsSaveSession()
     */
    public function testResultsSaveSession() {
        $container = $this->makeContainer();
        $saveResponse = $this->callRoute('resultsSaveSession', 'POST', [
            'userId'    => 'acb8f472-9f77-4bab-a43a-25201978e86b',
            'sessionId' => '05313d2c-fcfc-4374-966c-59fe59ddbe02',
            'skills'    => [
                '207' => 'knowledge',
                '208' => 'skill',
                '209' => 'ability',
                '221' => 'skill',
            ],
        ], $container);

        $this->assertEquals(200, $saveResponse['status']);
        $this->assertEquals(true, $saveResponse['success']);
    }

    /**
     * @see ApiMethodsTest::testCoursesGo()
     */
    public function testCoursesGo() {
        $testCourseId = 26;
        $testCourseCode = 'vvedenie-v-bazy-dannyh';
        $expectedSessionId = 6;
        $expectedUserId = 2;

        $container = $this->makeContainer();
        /**
         * @var Locator $locator;
         */
        $locator = $container->get('dbLocator');
        $visitsMapper = $locator->mapper(CourseVisitEntity::class);
        $visitEntityBeforeVisit = $visitsMapper->first(['courseId' => $testCourseId]);
        $this->assertFalse($visitEntityBeforeVisit);

        $redirectResponse = $this->callRouteRaw('coursesGo', 'GET', [
            'userId'    => 'da8c4a60-f28d-49fc-a6c2-1a6924bbf0bf',
            'sessionId' => '57af3bc1-83ec-4a94-8b55-4a7aaee65891'
        ], $container, ['code' => $testCourseCode]);

        $redirectUrl = $redirectResponse->getHeader('Location')[0];
        $this->assertEquals(302, $redirectResponse->getStatusCode());
        $this->assertEquals($redirectUrl, 'https://stepik.org/course/551');

        /**
         * @var CourseVisitEntity $visitEntityAfterVisit
         */
        $visitEntityAfterVisit = $visitsMapper->first(['courseId' => $testCourseId]);
        $this->assertEquals($expectedSessionId, $visitEntityAfterVisit->get('sessionId'));
        $this->assertEquals($expectedUserId, $visitEntityAfterVisit->get('userId'));
    }
}