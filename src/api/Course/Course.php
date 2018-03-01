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
     * @var mixed
     */
    private $externalRequirements;

    /**
     * @var mixed
     */
    private $externalSkills;


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

        if (isset($courseProps['externalRequirements'])) {
            $instance->setExternalRequirements($courseProps['externalRequirements']);
        }

        if (isset($courseProps['externalSkills'])) {
            $instance->setExternalSkills($courseProps['externalSkills']);
        }

        return $instance;
    }

    public static function __set_state(array $courseProps) {
        return self::fromArray($courseProps);
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

    /**
     * @return mixed
     */
    public function getExternalRequirements() {
        return $this->externalRequirements;
    }

    /**
     * @param mixed $externalRequirements
     */
    public function setExternalRequirements($externalRequirements) {
        $this->externalRequirements = $externalRequirements;
    }

    /**
     * @return mixed
     */
    public function getExternalSkills() {
        return $this->externalSkills;
    }

    /**
     * @param mixed $externalSkills
     */
    public function setExternalSkills($externalSkills) {
        $this->externalSkills = $externalSkills;
    }
}