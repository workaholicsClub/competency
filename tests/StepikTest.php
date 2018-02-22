<?php

use Competencies\Gateway\Stepik;
use Http\Adapter\Guzzle6\Client;
use PHPUnit\Framework\TestCase;

class StepikTest extends TestCase
{
    public function testQueryBuild() {
        $httpClient = new Client();
        $gateway = new Stepik($httpClient);

        $query = $gateway->nonRecursiveQueryBuild([
            'a' => [1, 2, 4],
            'b' => 'abc',
            'c' => false
        ]);

        $this->assertEquals('a[]=1&a[]=2&a[]=4&b=abc&c=0', $query);
    }

    public function testFindCourses() {
        $httpClient = new Client();
        $gateway = new Stepik($httpClient);
        $courses = $gateway->findCourses('курс');
        $defaultStepikResponseLimit = 20;

        $this->assertCount($defaultStepikResponseLimit, $courses);
    }
}