<?php

namespace Competencies\Gateway;

use Competencies\Course\Course;
use GuzzleHttp\Psr7\Request;
use GuzzleHttp\Psr7\Uri;
use Http\Adapter\Guzzle6\Client;

class Stepik
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
     * @throws \Http\Client\Exception
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
     * @throws \Http\Client\Exception
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

    public function getMatchingSkills($courseProps, $ourSkills) {
        $lessonTitles = $this->getLessonTitles($courseProps);
        $similarityThreshold = 70;

        $matchedSkills = [];

        foreach ($ourSkills as $ourSkill) {
            $similarities = [];

            foreach ($lessonTitles as $lessonTitle) {
                similar_text($ourSkill, $lessonTitle, $percent);
                $similarities[] = $percent;
            }

            if (max($similarities) > $similarityThreshold) {
                $maxSimilarLessonIndex = array_search(max($similarities), $similarities);
                $maxSimilarLesson = $lessonTitles[ $maxSimilarLessonIndex ];

                $matchedSkills[$ourSkill] = $maxSimilarLesson;
            }
        }

        return $matchedSkills;
    }

    /**
     * @param string $query
     * @param array $ourSkills
     * @return array
     * @throws \Http\Client\Exception
     */
    public function findCourses($query, array $ourSkills = []) {
        $matchingCourseIds = $this->findCourseIds($query);
        $courseDetails = $this->getCourseDetails($matchingCourseIds);

        $foundCourses = [];
        foreach ($courseDetails as $courseProps) {
            /**
             * @var array $courseProps
             * @see https://stepik.org/api/docs/#!/courses/Course_list
             */

            $matchingSkills = [];
            if ($ourSkills) {
                $matchingSkills = $this->getMatchingSkills($courseProps, $ourSkills);
            }

            $course = Course::fromArray([
                'externalId'  => $courseProps['id'],
                'name'        => $courseProps['title'],
                'description' => $courseProps['summary'],
                'url'         => $this->stepikUrl . '/course/' . $courseProps['id'],
                'skills'      => $matchingSkills,
            ]);

            $foundCourses[] = $course;
        }

        return $foundCourses;
    }
}