<?php

namespace Competencies\Gateway;

use Competencies\CourseLoaderInterface;
use Competencies\GatewayFactoryInterface;
use Http\Adapter\Guzzle6\Client;

class GatewayFactory implements GatewayFactoryInterface
{
    /**
     * @param $gatewayCode
     * @return CourseLoaderInterface
     */
    public static function make($gatewayCode) {
        $className = '\\Competencies\\Gateway\\'.ucfirst($gatewayCode);
        $httpClient = new Client();
        $gateway = new $className($httpClient);
        return $gateway;
    }
}