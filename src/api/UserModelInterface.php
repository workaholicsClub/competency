<?php

namespace Competencies;

interface UserModelInterface
{
    /**
     * @return string
     */
    public function getEmail();

    /**
     * @return string
     */
    public function getToken();

    /**
     * @return \Spot\Mapper
     */
    public function getMapper();

    /**
     * @param \Spot\Mapper $mapper
     */
    public function setMapper($mapper);
}