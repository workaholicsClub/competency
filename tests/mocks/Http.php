<?php

namespace Competencies\Mocks;

use GuzzleHttp\Psr7\Request as GuzzleRequest;
use function GuzzleHttp\Psr7\stream_for;
use GuzzleHttp\Psr7\Uri;
use Psr\Http\Message\RequestInterface;
use Slim\Http\Headers;
use Slim\Http\Request as SlimRequest;
use Slim\Http\Response as SlimResponse;

class Http
{
    public static function makeUri(string $url, array $queryParams, string $type): Uri {
        $uri = new Uri($url);
        $query = http_build_query($queryParams);

        if ($type === 'GET') {
            $uri = $uri->withQuery($query);
        }

        return $uri;
    }

    public static function addParamsToRequestBody(RequestInterface $request, array $queryParams): RequestInterface {
        $query = http_build_query($queryParams);
        $body = \GuzzleHttp\Psr7\stream_for($query);
        return $request
            ->withBody($body)
            ->withHeader('Content-Type', 'application/x-www-form-urlencoded');

    }

    public static function makeRequest(string $url, array $queryParams, string $type = 'GET'): RequestInterface {
        $uri = self::makeUri($url, $queryParams, $type);
        $request = new GuzzleRequest($type, $uri);

        if ($type === 'POST') {
            $request = self::addParamsToRequestBody($request, $queryParams);
        }

        return $request;
    }

    public static function makeSlimRequest(string $url, array $queryParams, string $type = 'GET'): SlimRequest {
        $uri = self::makeUri($url, $queryParams, $type);

        $headers = new Headers([]);
        $body = stream_for('');
        $cookies = [];
        $serverParams = [];

        if ($type === 'POST') {
            $headers = new Headers(['Content-Type' => 'application/x-www-form-urlencoded']);
            $query = http_build_query($queryParams);
            $body = \GuzzleHttp\Psr7\stream_for($query);
        }

        $request = new SlimRequest($type, $uri, $headers, $cookies, $serverParams, $body);

        return $request;
    }

    public static function makeSlimResponse(): SlimResponse {
        $response = new SlimResponse();
        return $response;
    }
}