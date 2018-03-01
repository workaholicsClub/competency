<?php
namespace Competencies\Command;

use Competencies\Competency\CompetencyModel;
use Competencies\Course\Course;
use Competencies\FileManagerInterface;
use Competencies\Gateway\GatewayFactory;
use Competencies\GatewayFactoryInterface;
use Competencies\Skill\SkillEntity;
use Spot\Locator;
use Webmozart\Console\Api\Args\Args;
use Webmozart\Console\Api\Command\Command;
use Webmozart\Console\Api\IO\IO;

class Parser
{
    protected $gatewayFactory;
    protected $gateway;

    protected $locator;

    /**
     * @var FileManagerInterface
     */
    protected $fileManager;

    /**
     * @var Course[]
     */
    protected $courses = [];

    /**
     * @var array
     */
    protected $takenCourses = [];

    protected $competency;
    protected $courseIndex;

    /**
     * @var IO
     */
    protected $io;

    /**
     * Parser constructor.
     * @param GatewayFactoryInterface $factory
     * @param Locator $locator
     * @param array $courses
     * @param FileManagerInterface $fileManager
     */
    public function __construct(GatewayFactoryInterface $factory, Locator $locator, array $courses = [], FileManagerInterface $fileManager) {
        $this->gatewayFactory = $factory;
        $this->locator = $locator;
        $this->fileManager = $fileManager;
        $this->courses = $courses;
        $this->courseIndex = 0;
    }

    /**
     * @param IO $io
     */
    public function setIo(IO $io) {
        $this->io = $io;
    }

    /**
     * @return Locator
     */
    public function getDatabaseLocator() {
        return $this->locator;
    }

    public function loadCompetency($competencyCode) {
        $locator = $this->getDatabaseLocator();
        $instance = CompetencyModel::make($locator);

        $entity = $instance->load($competencyCode);
        return $entity;
    }

    public function setCompetency($competencyCode) {
        $this->competency = $this->loadCompetency($competencyCode);
    }

    public function getCompetency() {
        return $this->competency;
    }

    public function getCurrentCourse() {
        return !empty($this->courses)
            ? $this->courses[$this->courseIndex]
            : false;
    }

    public function showCurrentCourse() {
        $course = $this->getCurrentCourse();
        if (!$course) {
            $this->io->errorLine('Курсы не загружены');
            return;
        }

        $humanIndex = $this->courseIndex+1;

        $showRequirements = $course->getExternalRequirements();
        if ( is_array($showRequirements) ) {
            $showRequirements = implode(', ', $showRequirements);
        }

        $showSkills = $course->getExternalSkills();
        if ( is_array($showSkills) ) {
            $showSkills = implode(', ', $showSkills);
        }

        $this->io->writeLine('=================');
        $this->io->writeLine('<b>Номер</b>: '.$humanIndex);
        $this->io->writeLine('<b>Курс</b>: '.$course->getName());
        $this->io->writeLine('<b>Описание</b>:');
        $this->io->writeLine($course->getDescription());
        $this->io->writeLine('<b>Требования</b>:');
        $this->io->writeLine($showRequirements);
        $this->io->writeLine('<b>Навыки</b>:');
        $this->io->writeLine($showSkills);
        $this->io->writeLine('=================');
    }

    public function processNext() {
        $this->courseIndex++;
        if ($this->courseIndex > count($this->courses)-1) {
            $this->courseIndex = 0;
        }
        $this->showCurrentCourse();
    }

    public function processPrev() {
        $this->courseIndex--;
        if ($this->courseIndex < 0) {
            $this->courseIndex = count($this->courses)-1;
        }
        $this->showCurrentCourse();
    }

    public function processGo($humanCourseIndex) {
        $this->courseIndex = $humanCourseIndex-1;
        $this->showCurrentCourse();
    }

    public function processShow() {
        $this->showCurrentCourse();
    }

    public function processSkills() {
        if (!$this->competency) {
            $this->io->errorLine('Компетенция не установлена');
            return;
        }

        foreach ($this->competency->relation('skills') as $index => $skillEntity) {
            $humanIndex = $index+1;
            $skillName = $skillEntity->get('text');
            $skillId = $skillEntity->get('id');

            $skillText = "${humanIndex}. ${skillName} [${skillId}]";

            $this->io->writeLine( $skillText );
        }
    }

    /**
     * @param $skillId
     * @return bool|SkillEntity
     */
    public function getSkillById($skillId) {
        if (!$this->competency) {
            $this->io->errorLine('Компетенция не установлена');
            return false;
        }

        foreach ($this->competency->relation('skills') as $skillEntity) {
            if ($skillEntity->get('id') == $skillId) {
                return $skillEntity;
            }
        }

        return false;
    }

    public function processAddSkill($skillId) {
        if (empty($this->courses)) {
            $this->io->errorLine('Курсы не загружены');
            return;
        }

        $skill = $this->getSkillById($skillId);
        if ($skill) {
            $this->courses[$this->courseIndex]->addSkill($skill->get('id'));
            $this->io->writeLine('Навык добавлен: '.$skill->get('text'));
        }
    }

    public function processTake($humanCourseIndex = false) {
        $courseIndex = $humanCourseIndex
            ? $humanCourseIndex-1
            : $this->courseIndex;

        if (!isset($this->courses[$courseIndex])) {
            $this->io->errorLine('Курс не найден');
            return;
        }

        $this->takenCourses[] = $courseIndex;
        $this->takenCourses = array_unique($this->takenCourses);
        $this->io->writeLine('Курс добавлен');
    }

    public function processShowTaken() {
        foreach ($this->takenCourses as $index => $courseIndex) {
            $humanIndex = $index+1;
            $humanCourseIndex = $courseIndex + 1;
            $course = $this->courses[$courseIndex];
            $courseName = $course->getName();

            $this->io->writeLine("${humanIndex}. ${courseName} [${humanCourseIndex}]");
        }
    }

    public function processSaveData($fileName) {
        $data = [
            'taken'   => $this->takenCourses,
            'courses' => $this->courses,
        ];

        $this->fileManager->saveData($fileName, $data);
        $this->io->writeLine('<b>Данные сохранены</b>');
    }

    public function processLoadData($fileName) {
        $data = $this->fileManager->loadData($fileName);
        $this->takenCourses = $data['taken'];
        $this->courses = $data['courses'];
        $this->io->writeLine('<b>Данные загружены</b>');
    }

    public function processQueryProvider($query = false) {
        if (!$query) {
            $query = $this->competency->get('name');
        }

        $this->courses = $this->gateway->findCourses($query);
        if (!$this->courses) {
            $this->io->errorLine('Ошибка загрузки курсов!');
            return;
        }

        $this->io->writeLine('Загружено курсов: '.count($this->courses));
    }

    public function setProvider($providerCode) {
        $this->gateway = $this->gatewayFactory::make($providerCode);
    }

    public function handle(Args $args, IO $io, Command $command) {
        $providerCode = $args->getArgument('provider');
        $competencyCode = $args->getArgument('competencyCode');

        $this->io = $io;

        $io->writeLine('Платформа: '.$providerCode);
        $io->writeLine('Компетенция: '.$competencyCode);

        $this->setProvider($providerCode);
        $this->setCompetency($competencyCode);

        $command = false;
        while ($command !== 'exit') {
            $io->write('<c2>Команда</c2>: ');

            $command = trim( strtolower($io->readLine()) );
            $commandArgs = [];

            $commandHasArgs = strpos($command, ' ') !== false;
            if ($commandHasArgs) {
                $commandArgs = explode(' ', $command);
                $command = array_shift($commandArgs);
            }

            $functionName = 'process'.ucfirst($command);

            $io->flush();

            if (method_exists($this, $functionName)) {
                call_user_func_array([$this, $functionName], $commandArgs);
            }
            else {
                $io->writeLine('Нераспознанная комманда: '.$command);
            }
        }

        $io->writeLine('Работа с курсами завершена');
    }

    /**
     * @param GatewayFactory $gatewayFactory
     */
    public function setGatewayFactory(GatewayFactory $gatewayFactory) {
        $this->gatewayFactory = $gatewayFactory;
    }
}