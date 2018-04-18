<?php

namespace Competencies\Course;

use Competencies\Skill\Skill;

class Course
{
    const MODE_OF_STUDY_IN_PERSON = "inPerson";
    const MODE_OF_STUDY_LONG_DISTANCE = "longDistance";
    const MODE_OF_STUDY_ONLINE = "online";
    const MODE_OF_STUDY_IN_PERSON_AND_ONLINE = "inPersonOnline";
    const MODE_OF_STUDY_SELF_STUDY = "selfStudy";

    const COURSE_FORM_VIDEO = "video";
    const COURSE_FORM_TEXT = "text";
    const COURSE_FORM_INTERACTIVE = "interactive";
    const COURSE_FORM_CRASHCOURSE = "crashCourse";
    const COURSE_FORM_TRAINING = "training";

    const SCHEDULE_FREE = "free";
    const SCHEDULE_DAY = "day";
    const SCHEDULE_EVENING = "evening";
    const SCHEDULE_WEEKENDS = "weekends";

    const TASKS_NO_TASKS = "noTasks";
    const TASKS_TEACHER_CHECK = "teacherCheck";
    const TASKS_AUTO_CHECK = "autoCheck";
    const TASKS_SELF_CHECK = "selfCheck";

    const LENGTH_SHORT = "short";
    const LENGTH_MEDIUM = "medium";
    const LENGTH_LONG = "long";

    /**
     * @var string
     */
    private $externalId = "";

    /**
     * @var string
     */
    private $name = "";

    /**
     * @var string
     */
    private $description = "";

    /**
     * @var string
     */
    private $url = "";

    /**
     * @var array
     */
    private $skills = [];

    /**
     * @var array
     */
    private $requirements = [];

    /**
     * @var mixed
     */
    private $externalRequirements;

    /**
     * @var mixed
     */
    private $externalSkills;

    /**
     * @var string
     */
    private $modeOfStudy = "";

    /**
     * @var string
     */
    private $courseForm = "";

    /**
     * @var string
     */
    private $schedule = "";

    /**
     * @var bool
     */
    private $certificate = false;

    /**
     * @var string
     */
    private $tasksType = "";

    /**
     * @var int
     */
    private $lengthDays = 0;

    /**
     * @var float
     */
    private $price = 0.00;

    /**
     * @param $courseProps
     * @return Course
     */
    public static function fromArray($courseProps): Course {
        $instance = new Course();

        $fieldSetters = [
            'externalId'           => 'setExternalId',
            'name'                 => 'setName',
            'description'          => 'setDescription',
            'url'                  => 'setUrl',
            'skills'               => 'setSkills',
            'externalSkills'       => 'setExternalSkills',
            'requirements'         => 'setRequirements',
            'externalRequirements' => 'setExternalRequirements',
            'modeOfStudy'          => 'setModeOfStudy',
            'courseForm'           => 'setCourseForm',
            'schedule'             => 'setSchedule',
            'certificate'          => 'setCertificate',
            'tasksType'            => 'setTasksType',
            'lengthDays'           => 'setLengthDays',
            'price'                => 'setPrice',
        ];

        foreach ($fieldSetters as $fieldName => $setterName) {
            if ( isset($courseProps[$fieldName]) ) {
                $instance->$setterName($courseProps[$fieldName]);
            }
        }

        return $instance;
    }

    public static function __set_state(array $courseProps): Course {
        return self::fromArray($courseProps);
    }

    public static function fromEntity(CourseEntity $entity) {
        $skillLinks = $entity->relation('skillLinks')->execute();
        $requirementLinks = $entity->relation('requirementLinks')->execute();

        $skills = [];
        foreach ($skillLinks as $skillLink) {
            $skills[] = Skill::fromLinkEntity($skillLink);
        }

        $requirements = [];
        foreach ($requirementLinks as $requirementLink) {
            $requirements[] = Skill::fromLinkEntity($requirementLink);
        }

        $props = $entity->toArray();
        $props['skills'] = $skills;
        $props['requirements'] = $requirements;

        $instance = self::fromArray($props);
        return $instance;
    }

    public static function makeEmpty(): Course {
        $instance = new Course();
        return $instance;
    }

    /**
     * @return string
     */
    public function getName(): string {
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
    public function getDescription(): string {
        return $this->description;
    }

    /**
     * @param string $description
     */
    public function setDescription($description) {
        $this->description = $description;
    }

    /**
     * @return Skill[]
     */
    public function getSkills(): array {
        return $this->skills;
    }

    /**
     * @param Skill[] $skills
     */
    public function setSkills(array $skills) {
        $this->skills = $skills;
    }

    /**
     * @param Skill $skill
     */
    public function addSkill(Skill $skill) {
        $this->skills[] = $skill;
    }

    /**
     * @return Skill[]
     */
    public function getRequirements(): array {
        return $this->requirements;
    }

    /**
     * @param Skill[] $requirements
     */
    public function setRequirements(array $requirements) {
        $this->requirements = $requirements;
    }

    public function addRequirement(Skill $requirement) {
        $this->requirements[] = $requirement;
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

    public function isSame(Course $course) {
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

    /**
     * @return string
     */
    public function getModeOfStudy(): string {
        return $this->modeOfStudy;
    }

    /**
     * @param string $modeOfStudy
     */
    public function setModeOfStudy(string $modeOfStudy) {
        $this->modeOfStudy = $modeOfStudy;
    }

    /**
     * @return string
     */
    public function getCourseForm(): string {
        return $this->courseForm;
    }

    /**
     * @param string $courseForm
     */
    public function setCourseForm(string $courseForm) {
        $this->courseForm = $courseForm;
    }

    /**
     * @return string
     */
    public function getSchedule(): string {
        return $this->schedule;
    }

    /**
     * @param string $schedule
     */
    public function setSchedule(string $schedule) {
        $this->schedule = $schedule;
    }

    /**
     * @return bool
     */
    public function hasCertificate(): bool {
        return $this->certificate;
    }

    /**
     * @param bool $certificate
     */
    public function setCertificate(bool $certificate) {
        $this->certificate = $certificate;
    }

    /**
     * @return string
     */
    public function getTasksType(): string {
        return $this->tasksType;
    }

    /**
     * @param string $tasksType
     */
    public function setTasksType(string $tasksType) {
        $this->tasksType = $tasksType;
    }

    /**
     * @return int
     */
    public function getLengthDays(): int {
        return $this->lengthDays;
    }

    /**
     * @param int $lengthDays
     */
    public function setLengthDays(int $lengthDays) {
        $this->lengthDays = $lengthDays;
    }

    public function getCode(): string {
        $translit = \Transliterator::create('Cyrillic-Latin')->transliterate($this->getName());
        $specialCharsToDash = preg_replace('#[ _:()\.,]+#','-', $translit);
        $noDuplicates = preg_replace('#-+#', '-', $specialCharsToDash);
        $lowerCase = strtolower($noDuplicates);

        return $lowerCase;
    }

    /**
     * @param int $skillId
     * @return bool|Skill
     */
    public function getSkillById(int $skillId) {
        $skillFound = false;

        foreach ($this->getSkills() as $skill) {
            if ($skill->getId() == $skillId) {
                $skillFound = $skill;
            }
        }

        return $skillFound;
    }

    /**
     * @param int $requirementId
     * @return bool|Skill
     */
    public function getRequirementById(int $requirementId) {
        $requirementFound = false;

        foreach ($this->getRequirements() as $requirement) {
            if ($requirement->getId() == $requirementId) {
                $requirementFound = $requirement;
            }
        }

        return $requirementFound;
    }

    public function hasSkillId(int $skillId): bool {
        $skill = $this->getSkillById($skillId);
        $skillFound = $skill !== false;

        return $skillFound;
    }

    public function hasRequirementId(int $requirementId): bool {
        $requirement = $this->getRequirementById($requirementId);
        $requirementFound = $requirement !== false;

        return $requirementFound;
    }

    public function givesSkillHigherThan(int $skillId, string $level) {
        $skill = $this->getSkillById($skillId);

        if ($skill === false) {
            return false;
        }

        return $skill->isLevelGreaterOrEquals($level);
    }

    public function requiresSkillLessThan(int $requirementId, string $level) {
        $requirement = $this->getRequirementById($requirementId);

        if ($requirement === false) {
            return true;
        }

        return $requirement->isLevelLessOrEquals($level);
    }

    public function toArray(): array {
        $fieldGetters = [
            'externalId'           => 'getExternalId',
            'name'                 => 'getName',
            'description'          => 'getDescription',
            'url'                  => 'getUrl',
            'modeOfStudy'          => 'getModeOfStudy',
            'courseForm'           => 'getCourseForm',
            'schedule'             => 'getSchedule',
            'certificate'          => 'hasCertificate',
            'tasksType'            => 'getTasksType',
            'lengthDays'           => 'getLengthDays',
            'price'                => 'getPrice',
        ];

        $resultArray = [];
        foreach ($fieldGetters as $fieldName => $getterName) {
            $resultArray[$fieldName] = $this->$getterName();
        }

        $resultArray['skills'] = [];
        foreach ($this->getSkills() as $skill) {
            $resultArray['skills'][] = $skill->toArray();
        }

        $resultArray['requirements'] = [];
        foreach ($this->getRequirements() as $requirement) {
            $resultArray['requirements'][] = $requirement->toArray();
        }

        return $resultArray;
    }

    /**
     * @return float
     */
    public function getPrice(): float {
        return $this->price;
    }

    /**
     * @param float $price
     */
    public function setPrice(float $price) {
        $this->price = $price;
    }
}