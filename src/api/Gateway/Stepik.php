<?php

namespace Competencies\Gateway;

use Competencies\Course\Course;
use Competencies\CourseLoaderInterface;
use GuzzleHttp\Psr7\Request;
use GuzzleHttp\Psr7\Uri;
use Http\Adapter\Guzzle6\Client;
use Http\Client\Exception;

class Stepik implements CourseLoaderInterface
{
    private $client;
    private $stepikUrl = 'https://stepik.org';
    private $stepikApiUrl = 'https://stepik.org/api';

    public function __construct(Client $client) {
        $this->client = $client;
    }

    public function nonRecursiveQueryBuild($queryData) {
        $queryTokens = [];

        foreach ($queryData as $key => $value) {
            if ( is_array($value) ) {
                foreach ($value as $arrayValue) {
                    $queryTokens[] = "${key}[]=$arrayValue";
                }
            }
            elseif ( is_bool($value) ) {
                $queryTokens[] = "${key}=".($value?'1':'0');
            }
            else {
                $queryTokens[] = "${key}=${value}";
            }
        }

        $query = implode('&', $queryTokens);
        return $query;
    }

    public function getStepikObjectByIds($objectName, $ids) {
        $uri = new Uri($this->stepikApiUrl.'/'.$objectName);
        $uri = $uri->withQuery($this->nonRecursiveQueryBuild([
            'ids' => $ids,
        ]));

        $detailsRequest = new Request('GET', $uri);
        $response = $this->client->sendRequest($detailsRequest);

        $decodeAssoc = true;
        $json = json_decode($response->getBody(), $decodeAssoc);

        return $json[$objectName];
    }

    /**
     * @param $courseIds
     * @return mixed
     * @throws Exception
     */
    public function getCourseDetails($courseIds) {
        return $this->getStepikObjectByIds('courses', $courseIds);
    }

    public function getCourseSections(array $stepikCourseData) {
        $sectionIds = $stepikCourseData['sections'];
        return $this->getStepikObjectByIds('sections', $sectionIds);
    }

    public function getSectionUnits(array $stepicSectionData) {
        $unitIds = $stepicSectionData['units'];
        return $this->getStepikObjectByIds('units', $unitIds);
    }

    public function getCourseLessons(array $stepikCourseData) {
        $sections = $this->getCourseSections($stepikCourseData);

        $lessonIds = [];
        foreach ($sections as $section) {
            $sectionUnits = $this->getSectionUnits($section);
            foreach ($sectionUnits as $sectionUnit) {
                $lessonIds[] = $sectionUnit['lesson'];
            }
        }

        $lessons = $this->getStepikObjectByIds('lessons', $lessonIds);
        return $lessons;
    }

    public function getLessonTitles(array $stepikCourseData) {
        $lessons = $this->getCourseLessons($stepikCourseData);

        $titles = [];
        foreach ($lessons as $lesson) {
            $titles[] = $lesson['title'];
        }

        return $titles;
    }

    /**
     * @param $query
     * @return array
     * @throws Exception
     */
    public function findCourseIds($query) {
        $searchParams = [
            'is_public'  => true,
            'language'   => 'ru',
            'page'       => 1,
            'query'      => $query,
            'type'       => 'course',
        ];

        $uri = new Uri($this->stepikApiUrl.'/search-results');
        $uri = $uri->withQuery( $this->nonRecursiveQueryBuild($searchParams) );

        $searchRequest = new Request('GET', $uri);
        $response = $this->client->sendRequest($searchRequest);

        $decodeAssoc = true;
        $json = json_decode($response->getBody()->__toString(), $decodeAssoc);
        $courseIds = [];
        foreach ($json['search-results'] as $searchProps) {
            $courseIds[] = $searchProps['course'];
        }

        return $courseIds;
    }

    /**
     * @param string $query
     * @return Course[]|bool
     */
    public function findCourses($query) {
        try {
            $matchingCourseIds = $this->findCourseIds($query);
            $courseDetails = $this->getCourseDetails($matchingCourseIds);
        } catch (Exception $exception) {
            return false;
        }

        $foundCourses = [];
        foreach ($courseDetails as $courseProps) {
            /**
             * @var array $courseProps
             * @see https://stepik.org/api/docs/#!/courses/Course_list
             */

            $matchingSkills = [];

            $course = Course::fromArray([
                'externalId'           => $courseProps['id'],
                'name'                 => $courseProps['title'],
                'description'          => $courseProps['summary'],
                'url'                  => $this->stepikUrl . '/course/' . $courseProps['id'],
                'skills'               => $matchingSkills,
                'externalRequirements' => $courseProps['requirements'],
                'externalSkills'       => $this->getLessonTitles($courseProps),
            ]);

            $foundCourses[] = $course;
        }

        return $foundCourses;
    }
}