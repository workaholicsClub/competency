<?php

namespace Competencies\Command;

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

    protected function addLoadCommand() {
        $this
            ->beginCommand('load')
                ->setDescription('Загружает курсы')
                ->addArgument('provider', Argument::REQUIRED, 'Платформа для загрузки')
                ->setHandler(new Parser())
            ->end();
    }
}