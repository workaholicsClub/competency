<?php

namespace Competencies;

use Competencies\Course\Course;

interface CourseLoaderInterface
{
    /**
     * @param string $query
     * @return Course[]
     */
    public function findCourses($query);
}