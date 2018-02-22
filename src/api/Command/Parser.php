<?php
namespace Competencies\Command;

use Webmozart\Console\Api\Args\Args;
use Webmozart\Console\Api\Command\Command;
use Webmozart\Console\Api\IO\IO;

class Parser
{
    public function handle(Args $args, IO $io, Command $command) {
        $io->writeLine('Платформа: '.$args->getArgument('provider'));
    }
}