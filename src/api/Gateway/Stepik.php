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
    
    /**
     * @param $courseIds
     * @return mixed
     * @throws \Http\Client\Exception
     */
    public function getCourseDetails($courseIds) {
        $uri = new Uri($this->stepikApiUrl.'/courses');
        $uri = $uri->withQuery($this->nonRecursiveQueryBuild([
            'ids' => $courseIds,
        ]));

        $detailsRequest = new Request('GET', $uri);
        $response = $this->client->sendRequest($detailsRequest);

        $decodeAssoc = true;
        $json = json_decode($response->getBody(), $decodeAssoc);

        return $json['courses'];
    }

    /**
     * @param $query
     * @return array
     * @throws \Http\Client\Exception
     */
    public function findCourseIds($query) {
        $searchParams = [
            'is_popular' => true,
            'is_public'  => true,
            'language'   => 'ru',
            'page'       => 1,
            'query'      => $query,
            'type'       => 'course',
        ];

        $searchRequest = new Request('GET', $this->stepikApiUrl.'/search-results', $searchParams);
        $response = $this->client->sendRequest($searchRequest);

        $decodeAssoc = true;
        $json = json_decode($response->getBody(), $decodeAssoc);
        $courseIds = [];
        foreach ($json['search-results'] as $searchProps) {
            $courseIds[] = $searchProps['course'];
        }

        return $courseIds;
    }

    /**
     * @param string $query
     * @return array
     * @throws \Http\Client\Exception
     */
    public function findCourses($query) {
        $matchingCourseIds = $this->findCourseIds($query);
        $courseDetails = $this->getCourseDetails($matchingCourseIds);

        $foundCourses = [];
        foreach ($courseDetails as $courseProps) {
            /**
             * @var array $courseProps
             * @see https://stepik.org/api/docs/#!/courses/Course_list
             */

            $course = Course::fromArray([
                'externalId'  => $courseProps['id'],
                'name'        => $courseProps['title'],
                'description' => $courseProps['summary'],
                'url'         => $this->stepikUrl . '/course/' . $courseProps['id'],
                'skills'      => [],
            ]);

            $foundCourses[] = $course;
        }

        return $foundCourses;
    }
}