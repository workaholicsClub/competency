<?php

namespace Competencies;

use Competencies\Competency\CompetencyModel;
use Competencies\Course\CourseEntity;
use Competencies\Course\CourseMapper;
use Competencies\Mail\MailgunMailer;
use Competencies\Mocks\Database;
use Competencies\Poll\PollModel;
use Psr\Container\ContainerInterface;
use Slim\Http\Request;
use Slim\Http\Response;
use Competencies\User\UserModel;
use Competencies\User\UserController;
use Spot\Locator;

class Routes
{
    /**
     * @var ContainerInterface
     */
    protected $container;

    public function __construct(ContainerInterface $container) {
        $this->container = $container;
    }

    public function getLocator(Request $request): Locator {
        $isPost = $request->getMethod() === 'POST';
        $testParam = $isPost
            ? $request->getParsedBodyParam('_test')
            : $request->getQueryParam('_test');
        $isTest = $testParam === "true";

        return $isTest
            ? Database::getTest()
            : $this->container->get('dbLocator');
    }

    public function getMailer(): MailgunMailer {
        return $this->container->get('mailer');
    }

    public function userToken(Request $request, Response $response) {
        $email = $request->getAttribute('email');

        $userModel = UserModel::make($email, $this->getLocator($request));
        try {
            $userModel->save();
            $userController = new UserController($userModel);
            $result = $userController->sendLoginEmail($this->getMailer());
        } catch (\Exception $e) {
            $result = false;
        }

        return $response->withJson([
            "status"  => 200,
            "success" => $result ? "true" : "false",
        ]);
    }

    public function user(Request $request, Response $response) {
        $token = $request->getQueryParam('token');
        if (!$token) {
            $token = $request->getCookieParam('token');
        }

        $userData = false;

        $userModel = UserModel::makeFromToken($token, $this->getLocator($request));
        if ($userModel) {
            $entity = $userModel->load();
            $userData = $entity->toArray();
        }

        return $response->withJson([
            "status"  => 200,
            "user" => $userData,
        ]);

    }

    public function profession(Request $request, Response $response) {
        $locator = $this->getLocator($request);
        $courseMapper = $locator->mapper(CourseEntity::class);
        $competencyModel = CompetencyModel::make($locator, $courseMapper);
        $professionTree = $competencyModel->loadProfessions();

        return $response->withJson([
            "status" => 200,
            "profession" => $professionTree,
        ]);
    }

    public function coursesRecommend(Request $request, Response $response) {
        $competencyRatings = $request->getQueryParam('competency');
        /**
         * @var CourseMapper $courseMapper
         */
        $courseMapper = $this->getLocator($request)->mapper(CourseEntity::class);

        $recommendedCourses = $courseMapper->getRecommendations($competencyRatings);

        return $response->withJson([
            'status' => 200,
            "course" => $recommendedCourses
        ]);
    }

    public function coursesSearch(Request $request, Response $response) {
        $filter = $request->getQueryParams();
        /**
         * @var CourseMapper $courseMapper
         */
        $courseMapper = $this->getLocator($request)->mapper(CourseEntity::class);
        $foundCourses = [];

        return $response->withJson([
            'status' => 200,
            "course" => $foundCourses
        ]);
    }

    public function resultsSave(Request $request, Response $response) {
        $email = $request->getParsedBodyParam('email');
        $pollResults = $request->getParsedBodyParam('competency');
        $subscribe = $request->getParsedBodyParam('subscribe');
        $remindMonths = $request->getParsedBodyParam('remindMonths');
        $success = false;

        if ($email) {
            $locator = $this->getLocator($request);
            $userModel = UserModel::make($email, $locator);
            $userModel->setSubscribe($subscribe);
            $userModel->setRemindMonths($remindMonths);
            $userModel->save();

            $pollModel = PollModel::make($locator);
            $competencyModel = CompetencyModel::make($locator);

            $userController = new UserController($userModel);
            $success = $userController->savePollResults($pollResults, $competencyModel, $pollModel);
        }

        return $response->withJson([
            'status'  => 200,
            'success' => $success
        ]);
    }
}