<?php

use Competencies\Command\Parser;
use Competencies\Competency\CompetencyEntity;
use Competencies\Course\Course;
use Competencies\CourseLoaderInterface;
use Competencies\FileManagerInterface;
use Competencies\Gateway\GatewayFactory;
use Competencies\GatewayFactoryInterface;
use Competencies\Mocks\Database;
use Competencies\Skill\SkillEntity;
use PHPUnit\Framework\TestCase;
use Spot\Locator;
use Webmozart\Console\Api\IO\IO;
use Webmozart\Console\IO\BufferedIO;

class ParserTest extends TestCase
{
    /**
     * @return Course[]
     */
    private function makeCourses() {
        return [

            Course::fromArray([
                'externalId'           => '6075',
                'name'                 => 'IT-интенсив (Python)',
                'description'          => 'Интенсивный вводный курс в программирование на языке Python учащий эффективно решать задачи из реальной жизни. 

Студенты курса получат фундаментальные знания о том, как компьютеры хранят и оперируют данными на примере проектов различной сложности: от простых консольных игр до настоящих автоматизированных решений. ',
                'url'                  => 'https://stepik.org/course/6075',
                'skills'               => [],
                'externalRequirements' => '',
                'externalSkills'       => [
                    'Парсинг веб-сайтов',
                    'Работа с Excel, Word и PDF документами',
                    'Логика и условные команды',
                    'Массивы и циклы',
                    'Условия. Циклы.',
                    'Функции. ООП',
                    'Основные понятия',
                    'Работа с API',
                    'Telegram-боты',
                ],
            ]),

            Course::fromArray([
                'externalId'           => '4777',
                'name'                 => 'Рубежная работа по программированию на Python',
                'description'          => 'Курс предназначен для проведения итоговых 
 и зачетных работ по программированию',
                'url'                  => 'https://stepik.org/course/4777',
                'skills'               => [],
                'externalRequirements' => '',
                'externalSkills'       => [
                    'Задания для 8Г и 9Г классов',
                    'Вариант 1',
                    'Вариант 2',
                    'Вариант 1',
                    'Вариант 2',
                ],
            ]),

            Course::fromArray([
                'externalId'           => '3577',
                'name'                 => 'Информатика. 8 класс',
                'description'          => 'Этот курс будет пока представлять набор задач на основе УМК Людмилы Леонидовны Босовой "Информатика. 8 класс". Больше информации смотрите в самом УМК и на сайте http://новиков-дм.рф/',
                'url'                  => 'https://stepik.org/course/3577',
                'skills'               => [],
                'externalRequirements' => '',
                'externalSkills'       => [
                    'Общие сведения о системах счисления',
                    'Двоичная система счисления',
                    'Восьмеричная система счисления',
                    'Шестнадцатеричная система счисления',
                    'Взаимодействие с компьютером на языке Питон',
                    'Запись числовых выражений на языке Питон',
                    'Запись алгебраических выражений на языке Питон 1',
                    'Запись алгебраических выражений на языке Питон 2',
                    'Основные этапы составления программы на языке Питон',
                    'Написание линейных инструкций',
                ],
            ]),
        ];
    }

    /**
     * @param Course[] $courses
     * @param IO $io
     * @param array $savedData
     * @param GatewayFactoryInterface $gatewayFactory
     * @return Parser
     */
    private function makeParser(array $courses = [], IO $io = null, array $savedData = [], GatewayFactoryInterface $gatewayFactory = null) {
        if (!$gatewayFactory) {
            $gatewayFactory = new GatewayFactory();
        }

        $locator = Database::getTest();
        $fileManager = $this->makeFileManagerMock($savedData);

        $parser = new Parser($gatewayFactory, $locator, $courses, $fileManager);
        if ($io) {
            $parser->setIo($io);
        }

        return $parser;
    }

    private function makeFileManagerMock($loadData) {
        $fileManager = Mockery::mock(FileManagerInterface::class);
        $fileManager->shouldReceive('saveData')->andReturn(true);
        $fileManager->shouldReceive('loadData')->andReturn($loadData);

        return $fileManager;
    }

    private function getOutputFromIo(IO $io) {
        return $io->getOutput()->getStream()->fetch();
    }

    private function getErrorFromIo(IO $io) {
        return $io->getErrorOutput()->getStream()->fetch();
    }

    public function testGetDatabaseLocator() {
        $parser = $this->makeParser();
        $locator = $parser->getDatabaseLocator();

        $this->assertInstanceOf(Locator::class, $locator);
    }

    public function testGetSetLoadCompetency() {
        $expectedCompetencyCode = 'python';
        $parser = $this->makeParser();
        $competency = $parser->loadCompetency($expectedCompetencyCode);
        $parser->setCompetency($expectedCompetencyCode);
        $competencySet = $parser->getCompetency();

        $this->assertInstanceOf(CompetencyEntity::class, $competency);
        $this->assertEquals($expectedCompetencyCode, $competency->get('code'));
        $this->assertEquals($expectedCompetencyCode, $competencySet->get('code'));
    }

    public function testGetCurrentCourse() {
        $expectedCourses = $this->makeCourses();

        $parserNoCourses = $this->makeParser();
        $parserWithCourses = $this->makeParser( $expectedCourses );

        $courseResult = $parserNoCourses->getCurrentCourse();
        $this->assertFalse($courseResult);

        $firstCourse = $parserWithCourses->getCurrentCourse();
        $this->assertSame($expectedCourses[0], $firstCourse);
    }

    public function testShowCurrentCourse() {
        $expectedOutput = "=================
Номер: 1
Курс: IT-интенсив (Python)
Описание:
Интенсивный вводный курс в программирование на языке Python учащий эффективно решать задачи из реальной жизни. 

Студенты курса получат фундаментальные знания о том, как компьютеры хранят и оперируют данными на примере проектов различной сложности: от простых консольных игр до настоящих автоматизированных решений. 
Требования:

Навыки:
Парсинг веб-сайтов, Работа с Excel, Word и PDF документами, Логика и условные команды, Массивы и циклы, Условия. Циклы., Функции. ООП, Основные понятия, Работа с API, Telegram-боты
=================
";
        $io = new BufferedIO();
        $parser = $this->makeParser( $this->makeCourses(), $io );

        $parser->showCurrentCourse();
        $output = $this->getOutputFromIo($io);
        $this->assertEquals($expectedOutput, $output);
    }

    public function testProcessNext() {
        $expectedFirstCourseOutput = "=================
Номер: 1
Курс: IT-интенсив (Python)
Описание:
Интенсивный вводный курс в программирование на языке Python учащий эффективно решать задачи из реальной жизни. 

Студенты курса получат фундаментальные знания о том, как компьютеры хранят и оперируют данными на примере проектов различной сложности: от простых консольных игр до настоящих автоматизированных решений. 
Требования:

Навыки:
Парсинг веб-сайтов, Работа с Excel, Word и PDF документами, Логика и условные команды, Массивы и циклы, Условия. Циклы., Функции. ООП, Основные понятия, Работа с API, Telegram-боты
=================
";
        $expectedSecondCourseOutput = "=================
Номер: 2
Курс: Рубежная работа по программированию на Python
Описание:
Курс предназначен для проведения итоговых 
 и зачетных работ по программированию
Требования:

Навыки:
Задания для 8Г и 9Г классов, Вариант 1, Вариант 2, Вариант 1, Вариант 2
=================
";

        $io = new BufferedIO();
        $parser = $this->makeParser( $this->makeCourses(), $io );

        $parser->processNext();
        $secondCourseOutput = $this->getOutputFromIo($io);

        $parser->processNext();
        $io = new BufferedIO();
        $parser->setIo($io);
        $parser->processNext();
        $firstCourseOutput = $this->getOutputFromIo($io);

        $this->assertEquals($expectedSecondCourseOutput, $secondCourseOutput);
        $this->assertEquals($expectedFirstCourseOutput, $firstCourseOutput);
    }

    public function testProcessPrev() {
        $expectedLastCourseOutput = "=================
Номер: 3
Курс: Информатика. 8 класс
Описание:
Этот курс будет пока представлять набор задач на основе УМК Людмилы Леонидовны Босовой \"Информатика. 8 класс\". Больше информации смотрите в самом УМК и на сайте http://новиков-дм.рф/
Требования:

Навыки:
Общие сведения о системах счисления, Двоичная система счисления, Восьмеричная система счисления, Шестнадцатеричная система счисления, Взаимодействие с компьютером на языке Питон, Запись числовых выражений на языке Питон, Запись алгебраических выражений на языке Питон 1, Запись алгебраических выражений на языке Питон 2, Основные этапы составления программы на языке Питон, Написание линейных инструкций
=================
";
        $expectedSecondCourseOutput = "=================
Номер: 2
Курс: Рубежная работа по программированию на Python
Описание:
Курс предназначен для проведения итоговых 
 и зачетных работ по программированию
Требования:

Навыки:
Задания для 8Г и 9Г классов, Вариант 1, Вариант 2, Вариант 1, Вариант 2
=================
";

        $io = new BufferedIO();
        $parser = $this->makeParser( $this->makeCourses(), $io );

        $parser->processPrev();
        $lastCourseOutput = $this->getOutputFromIo($io);

        $io = new BufferedIO();
        $parser->setIo($io);
        $parser->processPrev();
        $secondCourseOutput = $this->getOutputFromIo($io);

        $this->assertEquals($expectedLastCourseOutput, $lastCourseOutput);
        $this->assertEquals($expectedSecondCourseOutput, $secondCourseOutput);
    }

    public function testProcessGo() {
        $humanCourseIndex = 2;
        $expectedSecondCourseOutput = "=================
Номер: 2
Курс: Рубежная работа по программированию на Python
Описание:
Курс предназначен для проведения итоговых 
 и зачетных работ по программированию
Требования:

Навыки:
Задания для 8Г и 9Г классов, Вариант 1, Вариант 2, Вариант 1, Вариант 2
=================
";

        $io = new BufferedIO();
        $parser = $this->makeParser( $this->makeCourses(), $io );

        $parser->processGo($humanCourseIndex);
        $secondCourseOutput = $this->getOutputFromIo($io);

        $this->assertEquals($expectedSecondCourseOutput, $secondCourseOutput);
    }

    public function testProcessShow() {
        $humanCourseIndex = 2;
        $expectedOutput = "=================
Номер: 2
Курс: Рубежная работа по программированию на Python
Описание:
Курс предназначен для проведения итоговых 
 и зачетных работ по программированию
Требования:

Навыки:
Задания для 8Г и 9Г классов, Вариант 1, Вариант 2, Вариант 1, Вариант 2
=================
";
        $goIo = new BufferedIO();
        $showIo = new BufferedIO();
        $parser = $this->makeParser( $this->makeCourses(), $goIo );
        $parser->processGo($humanCourseIndex);

        $parser->setIo($showIo);
        $parser->processShow();

        $output = $this->getOutputFromIo($showIo);
        $this->assertEquals($expectedOutput, $output);
    }

    public function testProcessSkills() {
        $extectedSkillsOutput = "1. Встроенные типы переменных [351]
2. Mutable/immutable типы [352]
3. Динамическая типизация [353]
4. Базовый синтаксис языка [354]
5. Синтаксис функций [355]
6. Области видимости переменных [356]
7. Итераторы [357]
8. Генераторы [358]
9. Документирование кода [359]
10. Средства функционального программирования [360]
11. Анонимные функции (lambda) [361]
12. Использование инструкции yield [362]
13. Проектирование модулей [363]
14. Работа с модулями [364]
15. Классы, создание и использование [365]
16. Наследование и переопределение методов [366]
17. Композиция и делегирование для классов [367]
18. Перегрузка операторов [368]
19. Фабрики объектов [369]
20. Классы \\\"старого\\\" и \\\"нового\\\" стилей [370]
21. Создание и использование исключений [371]
22. Создание и использование контекстных менеджеров [372]
23. Объекты unicode, bytes, bytearray [373]
24. Env-сборки [374]
25. Консольный отладчик python [375]
26. Декораторы функций [376]
27. Декораторы классов [377]
28. Дескрипторы [378]
29. Множественное наследование [379]
30. Различные варианты python [380]
31. Разработка с веб-фреймворками [381]
32. Разработка с GUI-фреймворками [382]
33. Метапрограммирование [383]
34. Сетевое программирование [384]
35. Асинхронное программирование [385]
36. Мультипроцессное программирование [386]
37. Мультипоточное программирование [387]
38. Специализированные библиотеки [388]
39. «Великодушный пожизненный диктатор» [389]
";
        $expectedErrorOutput = "Компетенция не установлена\n";
        $testCompetencyCode = "python";

        $io = new BufferedIO();
        $parser = $this->makeParser( $this->makeCourses(), $io );
        $parser->processSkills();
        $errorOutput = $this->getErrorFromIo($io);

        $parser->setCompetency($testCompetencyCode);
        $parser->processSkills();

        $skillsOutput = $this->getOutputFromIo($io);
        $this->assertEquals($extectedSkillsOutput, $skillsOutput);
        $this->assertEquals($expectedErrorOutput, $errorOutput);
    }

    public function testGetSkillById() {
        $skillId = 355;
        $skillName = "Синтаксис функций";
        $expectedErrorOutput = "Компетенция не установлена\n";
        $testCompetencyCode = "python";

        $io = new BufferedIO();
        $parser = $this->makeParser([], $io);
        $parser->getSkillById($skillId);
        $errorOutput = $this->getErrorFromIo($io);

        $parser->setCompetency($testCompetencyCode);
        $skill = $parser->getSkillById($skillId);

        $this->assertInstanceOf(SkillEntity::class, $skill);
        $this->assertEquals($skillName, $skill->get('text'));
        $this->assertEquals($expectedErrorOutput, $errorOutput);
    }

    public function testProcessAddSkill() {
        $skillId = 355;
        $competencyCode = "python";
        $expectedOutput = "Навык добавлен: Синтаксис функций\n";
        $expectedError = "Курсы не загружены\n";

        $io = new BufferedIO();
        $errorIo = new BufferedIO();

        $emptyParser = $this->makeParser([], $errorIo);
        $emptyParser->processAddSkill($skillId);
        $errorOutput = $this->getErrorFromIo($errorIo);

        $parser = $this->makeParser( $this->makeCourses(), $io );
        $parser->setCompetency($competencyCode);
        $parser->processAddSkill($skillId);
        $course = $parser->getCurrentCourse();
        $courseSkillIds = $course->getSkills();
        $output = $this->getOutputFromIo($io);

        $this->assertEquals([$skillId], $courseSkillIds);
        $this->assertEquals($expectedOutput, $output);
        $this->assertEquals($expectedError, $errorOutput);
    }

    public function testProcessTakeShowTaken() {
        $expectedErrorOutput = "Курс не найден\n";
        $expectedOutput = "Курс добавлен
Курс добавлен
1. IT-интенсив (Python) [1]
2. Информатика. 8 класс [3]
";

        $errorHumanIndex = 4;
        $firstCourseIndex = 1;
        $secondCourseIndex = 3;

        $io = new BufferedIO();
        $parser = $this->makeParser( $this->makeCourses(), $io );
        $parser->processTake($errorHumanIndex);
        $parser->processTake($firstCourseIndex);
        $parser->processTake($secondCourseIndex);
        $parser->processShowTaken();

        $errorOutput = $this->getErrorFromIo($io);
        $output = $this->getOutputFromIo($io);

        $this->assertEquals($expectedOutput, $output);
        $this->assertEquals($expectedErrorOutput, $errorOutput);
    }

    public function testProcessSaveLoadData() {
        $fileName = 'test.php';
        $savedData = require('data/savedDataWithSkills.php');
        $expectedOutput = "Данные сохранены
Данные загружены
1. IT-интенсив (Python) [1]
2. Python: основы и применение [14]
3. Адаптивный тренажер Python [15]
4. Программирование на Python [19]
";

        $io = new BufferedIO();
        $parser = $this->makeParser( [], $io, $savedData );

        $parser->processSaveData($fileName);
        $parser->processLoadData($fileName);
        $parser->processShowTaken();

        $output = $this->getOutputFromIo($io);

        $course = $parser->getCurrentCourse();
        $this->assertInstanceOf(Course::class, $course);
        $this->assertEquals($expectedOutput, $output);
    }

    public function testProcessQueryProvider() {
        $expectedQuery = "python";
        $expectedProviderCode = "stepik";
        $expectedOutput = "Загружено курсов: 3\n";

        $gatewayMock = Mockery::mock(CourseLoaderInterface::class);
        $gatewayMock
            ->shouldReceive('findCourses')
            ->withArgs([$expectedQuery])
            ->andReturn( $this->makeCourses() )
            ->getMock();

        $gatewayFactory = Mockery::mock(GatewayFactoryInterface::class)
            ->shouldReceive('make')
            ->withArgs([$expectedProviderCode])
            ->andReturn($gatewayMock)
            ->getMock();

        $io = new BufferedIO();
        $parser = $this->makeParser([], $io, [], $gatewayFactory);
        $parser->setProvider($expectedProviderCode);
        $parser->processQueryProvider($expectedQuery);
        $output = $this->getOutputFromIo($io);

        $this->assertEquals($expectedOutput, $output);
    }
}