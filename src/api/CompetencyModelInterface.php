<?php

namespace Competencies;

interface CompetencyModelInterface
{
    /**
     * @return \Spot\Mapper
     */
    public function getMapper();

    /**
     * @param \Spot\Mapper $mapper
     */
    public function setMapper($mapper);
}