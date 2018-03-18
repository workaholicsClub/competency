<?php

namespace Competencies\Command;

use Competencies\File\PhpConfigFileManager;
use Competencies\Gateway\GatewayFactory;
use Spot\Config;
use Spot\Locator;
use Webmozart\Console\Api\Args\Format\Argument;
use Webmozart\Console\Config\DefaultApplicationConfig;

class ParseConfig extends DefaultApplicationConfig
{
    protected function configure() {
        parent::configure();

        $this
            ->setName('parse')
            ->setDisplayName('Course Parser');

        $this->addLoadCommand();
    }

    protected function getLocator() {
        $connectionConfig = new Config();
        $connectionConfig->addConnection('mysql', getenv('MYSQL_DSN'));
        $locator = new Locator($connectionConfig);

        return $locator;
    }

    protected function addLoadCommand() {
        $gatewayFactory = new GatewayFactory();
        $locator = $this->getLocator();
        $courses = [];
        $fileManager = new PhpConfigFileManager();

        $this
            ->beginCommand('competency')
                ->setDescription('Загружает курсы')
                ->addArgument('provider', Argument::REQUIRED, 'Платформа для загрузки')
                ->addArgument('competencyCode', Argument::OPTIONAL, 'Код компетенции для загрузки курсов')
                ->setHandler( new Parser($gatewayFactory, $locator, $courses, $fileManager) )
            ->end();
    }
}