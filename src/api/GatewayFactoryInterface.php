<?php

namespace Competencies;

interface GatewayFactoryInterface
{
    public static function make($gatewayCode);
}