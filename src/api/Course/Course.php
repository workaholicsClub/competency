<?php

namespace Competencies\Course;

class Course
{
    /**
     * @var string
     */
    private $externalId;

    /**
     * @var string
     */
    private $name;

    /**
     * @var string
     */
    private $description;

    /**
     * @var string
     */
    private $url;

    /**
     * @var array
     */
    private $skills;

    /**
     * @param $courseProps
     * @return Course
     */
    public static function fromArray($courseProps) {
        $instance = new Course();

        if (isset($courseProps['externalId'])) {
            $instance->setExternalId($courseProps['externalId']);
        }

        if (isset($courseProps['name'])) {
            $instance->setName($courseProps['name']);
        }

        if (isset($courseProps['description'])) {
            $instance->setDescription($courseProps['description']);
        }

        if (isset($courseProps['url'])) {
            $instance->setUrl($courseProps['url']);
        }

        if (isset($courseProps['skills'])) {
            $instance->setSkills($courseProps['skills']);
        }

        return $instance;
    }

    /**
     * @return string
     */
    public function getName() {
        return $this->name;
    }

    /**
     * @param string $name
     */
    public function setName($name) {
        $this->name = $name;
    }

    /**
     * @return string
     */
    public function getDescription() {
        return $this->description;
    }

    /**
     * @param string $description
     */
    public function setDescription($description) {
        $this->description = $description;
    }

    /**
     * @return array
     */
    public function getSkills() {
        return $this->skills;
    }

    /**
     * @param array $skills
     */
    public function setSkills($skills) {
        $this->skills = $skills;
    }

    public function addSkill($skill) {
        $this->skills[] = $skill;
    }

    /**
     * @return string
     */
    public function getUrl(): string {
        return $this->url;
    }

    /**
     * @param string $url
     */
    public function setUrl(string $url) {
        $this->url = $url;
    }

    /**
     * @return string
     */
    public function getExternalId(): string {
        return $this->externalId;
    }

    /**
     * @param string $externalId
     */
    public function setExternalId(string $externalId) {
        $this->externalId = $externalId;
    }

    public function isEqualTo(Course $course) {
        return $this->getExternalId() == $course->getExternalId();
    }
}