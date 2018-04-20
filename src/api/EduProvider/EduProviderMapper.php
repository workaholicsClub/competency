<?php

namespace Competencies\EduProvider;

use Spot\Mapper;

class EduProviderMapper extends Mapper
{
    public function loadByCode(string $code): EduProviderEntity {
        return $this->first(['code' => $code]);
    }
}