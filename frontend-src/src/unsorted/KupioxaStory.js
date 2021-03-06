import Print from "../components/Kupioxa/Animantion/Print";
import Vars from "../components/Kupioxa/Animantion/Vars";
import Dialog from "../components/Kupioxa/Animantion/Dialog";
import ShowImage from "../components/Kupioxa/Animantion/ShowImage";
import Corners from "../components/Kupioxa/Animantion/Corners";

export default [
    {
        title: 'Как Кирюха программистом стал<br> и не зациклился',
        type: 'story',
        text: `<p>Перед вами курс по Python начального уровня. Курс и история про Кирюху одновременно. Уверен, многие согласятся,
                    что не видели подобных курсов раньше.</p>

                <p>Поэтому как только вы захотите освоить азы программирования, и поймете, что можете читать, писать и немного обращаться
                    с компьютером &mdash; сразу же приступайте.</p>`,
        nextChapterButtonText: 'Я могу!'
    },
    {
        title: 'Глава 1',
        type: 'story',
        text: `<p>&mdash; Дааа, мечта... &mdash; задумчиво вздохнул Кирюха, снова разглядывая витрину с кроссовками.</p>

                <p>Они были как дикие варвары, которые обвесили себя слегка выцветшими трофеями поверженных врагов.
                Варвары, которые сумели пройти дикие века и довести китч красных, желтых и синих лоскутов до пастельной уверенности в себе и 
                своем внешнем виде. Они не замечали черно-белого общества. Им был безразличен подростковый вызов
                кислотных сине-зеленых соседей. Они наслаждались собой и своей внутренней силой, проступавшей сквозь
                необычный наряд из кожи и ткани. Наслаждались по-взрослому, без показухи, без оглядки и без сожалений.
                Наслаждались с глубокой уверенностью в том, что мимо них нельзя пройти, не восхитившись.</p>

                <p>И их пастельно-каменное спокойствие заражало Кирюху уверенностью в себе.</p>

                <p>&mdash; Пожалуй, я примерю вот эти кроссовки &mdash; Кирюха ткнул пальцем в своих фаворитов.</p>
                <p>&mdash; Пожалуй, нет &mdash; тем же надменным тоном ответил ему сухолицый продавец.</p>`,
        nextChapterButtonText: '&mdash; Но... Но почему?!'
    },
    {
        type: 'story',
        text: `<p>&mdash; Каждый день примерять, но так и не купить? Думаю, у тебя просто нет денег. Так что перестань
отнимать мое время, &mdash; раздраженно отрезал продавец.</p>
<p>Грустный Кирюха уже направился к двери, как вдруг резко обернулся:</p>
<p>&mdash; Но может быть мы сможем их отработать? &mdash; хитро прищурившись он показал продавцу свое запястье.</p>
<p>&mdash; М-м-м-м... &mdash; продавец разглядывал новенький Кирюхин браслет, &mdash; Так и быть, я подумаю.</p>`,
        nextChapterButtonText: 'Приходи завтра'
    },
    {
        title: 'Глава 2',
        type: 'story',
        text: `<p>Весеннее солнце ярко светило в окно и нежно гладило тёплыми лучами кудрявый Кирюхин затылок.
                Вокруг что-то монотонно бубнили, а за окном весело щебетали птички.</p>

               <p>Было так тепло и хорошо, что Кирюха даже немного задремал, сложив голову на скрещенные руки.</p>
               <p>Кирюхе снилось, как гордой походкой он выходит из магазина в блестящих новых кроссах. А где-то там, за прилавком,
                громко рыдает злобный продавец.</p>`,
        nextChapterButtonText: 'Как вдруг...'
    },
    {
        type: 'story',
        text: `<p>&mdash; Петров! К доске! &mdash; раскатисто громыхнуло в безмятежности.<br>
                    Этого он никак не ожидал.</p>
                <p>Медленно переставляя ноги, он поковылял к месту будущего позора. Вся надежда теперь на Жулю.</p> 
                <p>Уже у доски, делая вид, что чешет затылок, Кирюха прошептал браслету на руке:<br>
                &mdash; Ну, Жулище, ну выручи в последний разочек! Ну помоги решить примеры! Пожа-а-алуйста!</p>`,
        nextChapterButtonText: '- Ну ладно, так и быть...'
    },
    {
        type: 'task',
        taskCode: 'print',
        wide: false,
        text: `<p>Строгим учительским почерком на доске было написано четыре примера. Именно их предлагалось решить. И записать
                    результат на доске, конечно. Иначе за что хвалить-то?</p>
                <p>Щелкая простые задачи, Жуля с подозрением поглядывала на Кирюху. &laquo;Филонит, сорванец!&raquo;</p>`,
        formalText: `<p>Напиши программу, которая напечатает ответы на все примеры с доски</p>`,
        nextChapterButtonText: 'Все верно! Ура!',
        formalDescription: `
                <p>Любая программа состоит из команд. Команды можно создавать самим, когда не хватает встроенных. Каждая команда указывается с новой строки.</p>
                <p>У некоторых команд есть аргументы. Например, мы командуем: "Забей болт!". "Забей" это команда, а "болт" &mdash; аргумент. Аргумент это то,
                с чем будет работать команда.</p>
                <p>Одна из самых важных команд - <code>print()</code>. Она нужна для вывода результата на экран.
                Как иначе узнать, что программа сработала?</p>
                <p>Нужно ли говорить, что именно этой командой Жуля и общается с окружающим миром.</p>
                <p>Команду <code>print()</code> можно использовать много раз в любом месте программы. 
                Аргументы для любой команды, и для <code>print()</code> в том числе, мы указываем внутри скобок. Этот аргумент она и напечатает.</p>
                <p>Программу можно запускать сколько угодно раз. И когда вам покажется, что она работает как надо, смело жмите
                на кнопку проверки результата и двигайтесь дальше.</p>
        `,
        starterCode: 'print(1+1)\n\n',
        prefixCode: false,
        visualComponent: Print,
        tests: [{
            exec: false,
            expect: "2\n12\n-2\n4.5\n"
        }],
        validator: function (stdout, test) {
            return stdout === test.expect || "Что-то посчитано неправильно";
        }
    },
    {
        type: 'story',
        text: `<p>&mdash; Это в последний раз, когда я помогаю тебе бездельничать! &mdash; обиженно заявила Жуля.</p>
<p>&mdash; Спасибо, Жуууулечка! Что бы я без тебя делал!&nbsp;&mdash; примирительно промурлыкал Кирюха.</p>
<p>&mdash; Так, сегодня первый день нашей отработки. И думаю, что нам нужно заправиться, &mdash; продолжил он, &mdash; Давай купим тебе батареек?</p>
<p>&mdash; Клубничных? &mdash; Жуля пыталась делать вид, что еще обижается.</p>
<p>&mdash; Хоть клубничных, хоть ананасовых!</p>

<p>В ближайшем к школе магазе Кирюха понял, что и сам непротив заправиться шоколадкой.</p>`,
        nextChapterButtonText: 'Только вот незадача...'
    },
    {
        type: 'task',
        taskCode: 'vars',
        wide: false,
        text: `<p>Достав горстку монет из левого кармана, Кирюха понял, что может и не хватить.</p>
                <p>&mdash; Жуля, нужна помощь! Я буду говорить цены, а ты запоминай и складывай! </p>`,
        formalText: `<p>Напиши программу, которая напечатает результат сложения <code>a</code> и <code>b</code></p>`,
        nextChapterButtonText: 'Ням! Клубничные, мои любимые!',
        formalDescription: `
            <p>Прежде чем вы двинетесь дальше, вопрос. Насколько хорошо вы помните первый урок о том, как Жуля общается с Кирюхой?</p>
            <p class="mb-4">Если честно, я рад, что вы помните про <code>print()</code>, а значит можно двигаться дальше.</p>
            <p>Хорошо, когда все данные для программы известны заранее. Так было, когда Кирюха стоял у доски, и все
            примеры были перед глазами. Но так получается далеко не всегда.</p>
            <p>Чаще программа работает с данными, которые неизвестны заранее. Жуля, например, не знает, что схватит Кирюха в
            следующий раз. А программист заранее не знает, какую шоколадку выберет
            покупатель в интернет-магазине.</p>
            <p>Но программа должна работать с любыми данными! И вот что придумали программисты.</p>
            <p>Они придумали давать данным имена! А точнее давать имена специальным корзинкам, которые будут хранить эти данные.
            Например, назвать корзинку для цены батареек <code>a</code>, а корзинку для цены шоколадки &mdash; <code>b</code>.
            И теперь уже не важно, что цены неизвестны заранее. Ведь мы всегда можем их сложить, используя эти имена.</p>
            <p>Такая корзинка с именем у программистов называется &laquo;переменной&raquo;. &laquo;Переменной&raquo; потому, что содержимое
            этой корзинки может меняться. А вот ее название всегда постоянно.</p>
            <p>Положить данные в корзинку можно при помощи знака равенства <code>=</code>. Слева пишется название корзинки,
            а справа &mdash; данные, которые туда кладутся. Это действие у программистов называется &laquo;присвоение&raquo;.</p>
            <p>Присвоение работает чуть иначе, чем математический знак равенства. В математике &laquo;равно&raquo; &mdash; сравнивает. Математическое &laquo;равно&raquo;
            говорит о том, что выражение слева по-сути совпадает с выражением справа.</p>
            <p>А &laquo;присвоение&raquo; у программистов &mdash; приравнивает. Оно как бы говорит Жуле: &laquo;Возьми то,
            что справа и положи в корзинку с названием, которое написано слева&raquo;.</p>
            <p>В остальном же работа с переменными ничем не отличается от работы с числами.</p>
        `,
        testIsPrefix: true,
        starterCode: false,
        prefixCode: false,
        visualComponent: Vars,
        tests: [
            {
                exec: 'a=11.3\nb=21',
                expect: "32.3"
            },
            {
                exec: 'a=7.2\nb=10.3',
                expect: "17.5"
            },
            {
                exec: 'a=2.5\nb=3',
                expect: "5.5"
            },
        ],
        validator: function (stdout, test) {
            if (!stdout) {
                return "Жуля, не молчи! Скажи что-нибудь!"
            }

            return stdout.trim() === test.expect || "Что-то посчитано неправильно";
        }
    },
    {
        title: 'Глава 3',
        type: 'story',
        text: `<p>Магазин был закрыт, на двери висел ржавый замок, а пустые прилавки были покрыты толстым слоем старой пыли. Кирюха удивленно огляделся.</p>
<p>&mdash; Жуля, мы же туда пришли?</p>
<p>&mdash; Координаты те же,&nbsp;&mdash; сухо ответила Жуля,&nbsp;&mdash; да и вывеска на месте.</p>
<p>&mdash; Да... Только выцвела. Как так-то?&nbsp;&mdash; расстроился Кирюха.</p>
<p>Не придумав ничего лучше, он ходил вокруг здания, пытаясь найти другой вход. Пустой магазин.
Аптека. Кафе. Нотариус. Снова пустой магазин. Снова аптека, кафе и нотариус.</p>
<p>Другого входа не было.</p>
`,
        nextChapterButtonText: '&mdash; Может быть спросить у соседей, когда магазин снова откроется?&nbsp;&mdash; предложила Жуля'
    },
    {
        type: 'task',
        taskCode: 'concat',
        wide: true,
        text: `
<p>&mdash; Жуля, кто тут работает?&nbsp;&mdash; шепотом спросил Кирюха на входе в аптеку.</p>
<p>&mdash; Тётенька аптекарь,&nbsp;&mdash; прошептала в ответ Жуля.</p>
<p>&mdash; Здравствуйте, тётенька аптекарь! Вы знаете, когда откроется обувной магазин?</p>
<p>&mdash; К сожалению, не знаю</p>
<p>&mdash; Жаль. Спасибо за ответ</p>
<p>Диалог повторялся снова и снова. Слова, конечно, были немного разные. Но смысл не менялся и расстраивал Кирюху всё больше.</p>
        `,
        formalText: `<p>Напишите программу, которая будет повторять Кирюхину реплику для разных тётенек и дяденек. 
Можно фантазировать - проверку пройдет любой вопрос с нужным обращением.</p>`,
        nextChapterButtonText: 'Эх... Никто не знает.',
        formalDescription: `
<p>Вы же помните про переменные? Отличненько.</p>
        
<p>Многие поймут интуитивно, но я лучше скажу словами. Ну мало ли. В переменных-корзинках можно хранить разные данные.
Кроме чисел там может быть текст. Могут быть даты, списки и всякие сложные структуры &mdash; объекты. Можно даже
свои типы данных придумать.</p>

<p>Так вот. Что будет, если сложить два числа многим понятно. 1 плюс 1 будет 2. И редкий трёхлетний ребенок этого ещё не знает.
Но что будет если текст прибавить к тексту? <code>"Петя"</code> плюс <code>"Маша"</code> равно... А вот и нет! Будет совсем другое.</p>

<p><code>"Петя"</code> плюс <code>"Маша"</code> равно <code>"ПетяМаша"</code>. Слиплись как сиамские близнецы. По-заумному
склейка двух кусков текста &mdash; или строк, как их называют программисты &mdash; называется "конкатенацией". И нужна она для того,
чтобы конструировать текст из кусочков. Например для того, собрать Кирюхину реплику из приветствия, обращения из переменной и вопроса.</p>

<p>&mdash; Ну а что будет, если текст сложить с числом? &mdash; спросит будущий гуру.</p>
<p>Некоторые языки сделают так: <code>1 + "1" = "11"</code>. Ну а Python, при попытке сложить 5 и "красное" просто покрутит у виска и скажет: &laquo;Ошибка&raquo;.</p>`,
        testIsPrefix: true,
        starterCode: 'print("Здравствуйте,"+"! Вы знаете, когда откроется обувной магазин?")\nprint("К сожалению, не знаю")',
        prefixCode: false,
        visualComponent: Dialog,
        componentProps: {
            saveDialog: true,
            stdoutKupioxaOnly: false,
        },
        resetAnimationOnStart: true,
        tests: [
            {
                exec: 'у_кого_спросить = "тётенька аптекарь"',
                expect: 'тётенька аптекарь'
            },
            {
                exec: 'у_кого_спросить = "дяденька бармен"',
                expect: 'дяденька бармен'
            },
            {
                exec: 'у_кого_спросить = "тётенька нотариус"',
                expect: 'тётенька нотариус'
            },
        ],
        validator: function (stdout, test) {
            if (!stdout) {
                return "Кирюха! Не стесняйся, скажи что-нибудь!"
            }

            let isValid = stdout.indexOf(test.expect) !== -1;

            return isValid || "Что-то не так с обращением";
        }
    },
    {
        type: 'story',
        text: `<p>На следующий день у закрытого входа Кирюха обнаружил здоровенного пса.
Пёс склонил голову на бок и с интересом разглядывал Кирюху. А Кирюха с интересом разглядывал пса.</p>

<p>&mdash; Кхм! — Жуля попыталась прервать игру в гляделки. Не вышло.</p>
<p>&mdash; Мне кажется он нас ждёт,&nbsp;&mdash; заявил Кирюха не отрывая глаз.</p>

<p>Пес встал, толкнул задом дверь и пятясь вошёл в покосившуюся и потертую дверь. Кирюха пошел за ним.</p>`,
        nextChapterButtonText: 'Игра в гляделки продолжалась'
    },
    {
        type: 'task',
        taskCode: 'first_if',
        wide: false,
        text: `<p>По прежнему не отрывая взгляда от Кирюхи, пёс пятился к пыльной тумбочке неподалеку от входа.
Уткнувшись в нее задом, пёс немного развернулся и поскреб лапой по покосившиеся двери.</p>
<p>Внутри Кирюха обнаружил бумажку. Слева было написано:</p>

<p><pre>2 — беги
1 — прыгай
3 — плыви</pre></p>

<p>Справа:</p>

<p><pre>3 — в угол
… — в дверь
… — в стол</pre></p>

<p>Некоторые цифры были смазаны.</p>
<p>Пёс ударил два раза левой лапой.</p>

<p>&mdash; Жуля, что-то я не понял… Что тут происходит?</p>
`,
        formalText: `Напишите программу, которая расшифрует сообщение пса`,
        nextChapterButtonText: '&mdash; Плыть в стол?!',
        formalDescription: `<p>Уф, вот это тему начинаем! Мощную! Условия и ветвления!</p>
<p>Самая простая программа &mdash; как рецепт.</p>
<ol>
    <li>Берем</li>
    <li>Режем</li>
    <li>Мешаем</li>
    <li>Заправляем</li>
</ol>
<p>Ну и приятного аппетита!</p>

<p>Одно за другим. Шаг за шагом. Аккуратно выполняется. Топ-топ. И вот &mdash; результат. Но так бывает редко. Насколько хорошо вы помните, что
чем универсальнее программа, тем лучше? Чем больше вариантов начальных данных она учитывает, тем больше возможностей
ей пользоваться? Вот эта универсальность все сильно усложняет.</p>

<p>Вот взять, к примеру второй пункт моего рецепта &mdash; &laquo;Режем&raquo;. Ножом. А вдруг уже нарезано? Овощи, например, можно купть в
помытом и нарезанном виде. Выходит, что дотошный до порядка автомат &laquo;Поваренок-3000&raquo;, увидев нарезанные
ингредиенты, на втором пункте зависнет. Ну или нашинкует их в кашу, например. Автомат &mdash; не человек, по обстоятельствам действовать не привык.</p>

<p>А программы мы пишем как раз для автоматов. И чтобы такие &laquo;умные&raquo; поварята превратились
в умных &mdash; уже без кавычек &mdash; Жулей, нужно сообщить им, что выполнять этот пункт нужно только если овощи целые. Вот так:</p>

<ol>
    <li>Берем</li>
    <li>Если овощи целые, режем</li>
    <li>...</li>
</ol>

<p>Или так. <code>Если</code> пёс ударил два раза, печатаем <code>"беги"</code>. Вот для этого &laquo;если&raquo; и нужно ветвление. Оно позволяет сделать 
такие ответвления в прогамме, которые выполняются при соблюдении какого-то условия: <code>if колво_ударов == 2:</code>.</p>

<p>&mdash; Если...</p>
<p>&mdash; Если &mdash; что?</p>

<p>Ответ на это &laquo;что?&raquo; &mdash; и есть условие. Входная дверь в ветвление. Оно всегда немного про будущее, про тот славный момент, когда программа дойдет
до этого условия и будет его проверять. Если &laquo;на улице будет темно&raquo;, Если &laquo;рыбки будут жидкими&raquo;...</p>

<p>Многие вспомнят, как я говорил, что <code>=</code> у программистов &mdash; &laquo;присвоение&raquo;. Запись в переменную. И знаете что? Чтобы понять выполняется условие или нет,
нужно что-то с чем-то сравнить. Сравнить рыбок и жидкость, овощи на столе с нарезанными овощами, количество ударов пса и два. Сравнить значение в
переменной со значением которое мы ожидаем увидеть.</p>

<p>Чувствуете? Надо &mdash; &laquo;сравнить&raquo;. Сравнить, а не &laquo;присвоить&raquo;, не &laquo;записать&raquo;. Чтобы машине было легче разобраться в тонкостях этих смыслов,
программисты придумали обозначать сравнение двойным знаком равенства: <code>==</code>. Т.е. <code>колво_ударов == 2</code>, значит,
что значение внутри переменной <code>колво_ударов</code> сравнивается с <code>2</code>-йкой.</p>

<p>Если внутри <code>колво_ударов</code> тоже хранится <code>2</code>, то ключик подошел, дверь открылась и все команды внутри ветвления выполнились.
Если внути <code>колво_ударов</code> сидит <code>3</code>, то ключик не подходит, дверь закрыта, команды пропущены.</p>

<p>Команд внутри ветвления может быть много. Если условие сработало, дверь открылась, то выполняются все команды, которые внутри.</p>

<p>&mdash; А как понять, какие команды за дверью, а какие &mdash; нет?</p>
<p>&mdash; Как-как... По отступам, вот как.</p>

<p>Все команды, которые прячутся в ветвлении, имеют небольшой отступ от начала строки. Например, два пробела. Как это было в предыдущем задании с циклом.
Пробел-пробел &mdash; и команда спряталась в ветвлении. А условие указано где-то вверху, без отступа.</p> 

<p>&mdash; А если одно ветвление будет внутри другого? Так можно?</p>
<p>&mdash; Можно. Тогда условие первого ветвления будет без отступа. А условие второго ветвления, как и другие команды внутри, будет иметь один отступ. Пробел-пробел.
А у команд внутри второго ветвления будет два отступа. Пробел-пробел. Пробел-пробел.</p>

<p>Такая вот лесенка.</p>
`,
        testIsPrefix: true,
        starterCode: '',
        prefixCode: `if лапа == "левая":
  if колво_ударов == 2:
    print("беги")
  if колво_ударов == 1:
    print("прыгай")
  if колво_ударов == 3:
    print("плыви")
`,
        visualComponent: Dialog,
        componentProps: {
            inputPersonLines: [
                ['Левая: тук-тук-тук'],
                ['Правая: тук'],
                ['Левая: тук'],
                ['Правая: тук-тук-тук'],
            ],
            saveDialog: true,
            startPerson: true,
            stdoutKupioxaOnly: true,
        },
        resetAnimationOnStart: true,
        tests: [
            {
                exec: 'лапа="левая"\nколво_ударов=3',
                expect: 'плыви'
            },
            {
                exec: 'лапа="правая"\nколво_ударов=1',
                expect: 'в стол'
            },
            {
                exec: 'лапа="левая"\nколво_ударов=1',
                expect: 'прыгай'
            },
            {
                exec: 'лапа="правая"\nколво_ударов=3',
                expect: 'в угол'
            },
        ],
        validator: function (stdout, test) {
            if (!stdout) {
                return "Жуля! Что пес сказал-то?"
            }

            return stdout.trim() === test.expect || "Что-то не так! Пёс гавкнул и повторил движение. Может надо поменять смазанные цифры?";
        }
    },
    {
        type: 'story',
        text: `<p>&mdash; Плыть в стол?! Прыгать в стену?! Жуля, ты уверена? &mdash; Кирюха... был удивлен.</p>
<p>Пёс одобрительно гавкнул.</p>
<p>&mdash; Я-то уверена. А ты сомневаешься в моих способностях? &mdash; возмутилась Жуля.</p>
<p>Сомневаться в Жуле Кирюха не решился.</p>
<p>&mdash; Ерунда какая-то! &mdash; развел он руками и посмотрел на пса.</p>
<p>Пёс высунул язык и приветливо вилял хвостом. Кирюха замер, думая о чем-то своем.</p>
<p>&mdash; Знаешь что, Жуля, &mdash; печально сказал он, &mdash; я просто хотел классные кроссовки, а не вот это вот все. Плыть в стол и прыгать в угол.</p>
<p>На последних словах пёс снова одобрительно гавкнул.</p>`,
        nextChapterButtonText: 'А Кирюха развернулся и громко вышел в дверь'
    },
    {
        title: 'Глава 4',
        type: 'story',
        text: `<p>Весеннее солнце ярко светило в окно и нежно гладило тёплыми лучами кудрявый Кирюхин затылок. За окном весело щебетали птички.</p>
<p>Кирюха одиноко сидел за партой и печально смотрел куда-то в себя.</p>
<p>Уже прозвенел последний звонок и все давно разбежались.</p>
<p>&mdash; Может, перекусишь? &mdash; Жуля попыталась подбодрить Кирюху.</p>
<p>&mdash; Давай, &mdash; промямлил Кирюха в ответ. И медленно направился в сторону столовой.</p> 
`,
        nextChapterButtonText: 'Жуля знала, чем можно подбодрить Кирюху'
    },
    {
        type: 'task',
        taskCode: 'second_if',
        wide: false,
        text: `<p>Кирюха любил молоко и блины со сгущенкой. И сладкую булочку с компотом тоже любил.</p>
<p>Жуля полезла в меню столовой, чтобы проверить что осталось.</p>
`,
        formalText: `Напишите программу, которая напечатает "<code>молоко</code>", если в меню "<code>блины</code>".
Или "<code>компот</code>", если в меню &mdash; "<code>булочка</code>"`,
        nextChapterButtonText: 'Кажется, Кирюха немного повеселел!',
        formalDescription: `<p>Ветвления с условиями &mdash; второй из трех китов программирования.</p>
<p>Первым был &laquo;следование&raquo;. Он про то, что программа это отдельные команды, которые выполняются одна за другой. Но если &laquo;следование&raquo;
многим &mdash; очевдно, то с ветвлением лучше потренероваться.</p>
<p>Первое задание на ветвления было большим, но с подсказкой. А это маленькое, но без подсказки.</p>
<p>Уверен, вы сможете справится с ним самостоятельно. И это будет просто суперски!</p>
<p>PS. Ну а про то, что для сравнения ипользуется двойной знак равенства <code>==</code> вы и сами помните</p>
`,
        testIsPrefix: true,
        starterCode: false,
        prefixCode: false,
        visualComponent: ShowImage,
        componentProps: {
            inputs: ['молоко', 'компот'],
            images: ['/assets/kupioxa/moloko.jpg', '/assets/kupioxa/kompot.jpg'],
        },
        resetAnimationOnStart: true,
        tests: [
            {
                exec: 'в_меню="блины"',
                expect: 'молоко'
            },
            {
                exec: 'в_меню="булочка"',
                expect: 'компот'
            },
        ],
        validator: function (stdout, test) {
            if (!stdout) {
                return "Эм? Не понимаем ваш заказ"
            }

            let inMenu = test.exec === 'в_меню="блины"' ? 'Блины' : 'Булочка';

            return stdout.trim() === test.expect || `Эм? ${inMenu} и ${stdout}? А Кирюхе это точно понравится?`;
        }
    },
    {
        type: 'story',
        text: `<p>Сытый и порозовевший от столовых наслаждений Кирюха вышел на школьное крыльцо.</p>
<p>Неподалеку, у приоткрытой калитки, сидел пёс.</p>
<p>Лицо Кирюхи окаменело. Он развернулся и пошел к черному выходу.</p>
<p>У черного выхода его снова ждал пёс.</p>
<p>&mdash; Жуля, что ему от меня нужно?</p> 
`,
        nextChapterButtonText: '&mdash; Мне он тоже об этом не сказал, &mdash; неумело отшутилась Жуля'
    },
    {
        type: 'task',
        taskCode: 'if_else',
        wide: false,
        text: `<p>Кирюха решительно прошел мимо пса и быстрым шагом пошел по улице.</p>
<p>&mdash; Гав! &mdash; пёс бежал следом</p>
<p>&mdash; Отстань! &mdash; крикнул через плечо злой Кирюха</p>
<p>&mdash; Гав! &mdash; пёс настаивал</p>
<p>&mdash; Жуля, что мне делать?</p>
<p>&mdash; Думаю будет лучше идти домой, &mdash; неуверенно ответила Жуля</p>
<p>&mdash; Гав! &mdash; а пёс все еще бежал неподалеку</p>`,
        formalText: `Напишите программу, которая будет отвечать на уговоры пса. Сначала она должна отвечать <code>"домой"</code>,
        но когда число попыток будет больше 3, программа скажет <code>"спроси пса"</code>. Постарайтесь использовать <code>else</code>.`,
        nextChapterButtonText: '&mdash; Ладно! Ладно! Ладно... Ну что тебе нужно?',
        formalDescription: `<p>Не знаю, стоит ли долго мусолить то, что сравнение это не только ценное <code>==</code> &laquo;равно&raquo;, но и
 два-три килограмма <code>!=</code> &laquo;не равно&raquo;, <code>&gt;</code> &laquo;больше&raquo; и <code>&lt;</code> &laquo;меньше&raquo;. Да ещё и <code>&gt;=</code>
 &laquo;больше равно&raquo; с <code>&lt;=</code> &laquo;меньше равно&raquo; впридачу.</p>
 
<p>Знаю, что многие решат эту задачу через два ветвления. Одно будет &laquo;больше трех&raquo;, а второе &mdash; &laquo;меньше равно 3&raquo;.
И это отличный, привычный и понятный многим способ.</p>
<p>Я же предлагаю использовать только одно, первое, ветвление &mdash; &laquo;больше трех&raquo;. Без второго.<p>
<p>Чтобы провернуть такой фокус, нужно только добавить в это ветвление дополнительную часть &mdash; 
&laquo;во всех прочих случаях&raquo; или <code>else</code>.</p>
<p>&laquo;<code>Если тебя зовут Кирюха &mdash; иди сюда. Во всех прочих случаях &mdash; иди туда</code>&raquo; &mdash; что-то такое получится.</p>

<p>Обычное ветвление больше похоже на закрытый дворик сбоку &mdash; в него можно заглянуть, если будет интересно. Побродить там. И выйти обратно
на улицу.</p>
<p>А ветвление с <code>else</code> больше похоже на развилку. По одной дороге идут избранные, а по второй &mdash; ну... все остальные, кто не выбран могучим Условием.</p>
<p><code><pre>
if имя == "Кирюха":
  print("Дорога для Кирюх!")
  print("Привет, Кирюха!")
else:
  print("Дорога для всех остальных, кто не Кирюха!")
</pre></code></p>
<p>Мимо этой развилки уже не пройти. Тут либо налево, либо направо. Либо по первой дороге, либо по второй. И других дорог нет.</p>
<p>Так и в этой задаче &mdash; попыток может быть больше трех, значит пёс уже уговорил Кирюху. Первая дорога. Или не уговорил,
потому что попыток меньше &mdash; вторая дорога, <code>else</code>.</p>`,
        testIsPrefix: true,
        starterCode: false,
        prefixCode: false,
        visualComponent: ShowImage,
        componentProps: {
            inputs: ['домой', 'спроси пса'],
            images: ['/assets/kupioxa/home.png', '/assets/kupioxa/resya.jpg'],
        },
        resetAnimationOnStart: true,
        tests: [
            {
                exec: 'попыток=1',
                expect: 'домой'
            },
            {
                exec: 'попыток=2',
                expect: 'домой'
            },
            {
                exec: 'попыток=3',
                expect: 'домой'
            },
            {
                exec: 'попыток=4',
                expect: 'спроси пса'
            },
            {
                exec: 'попыток=5',
                expect: 'спроси пса'
            },
        ],
        validator: function (stdout, test) {
            if (!stdout) {
                return "Жуля, посоветуй, а! Не молчи!"
            }

            return stdout.trim() === test.expect || "Какой-то совет неправильный, а?";
        }
    },
    {
        type: 'story',
        text: `<p> Пёс забарабанил хвостом и начал подпрыгивать передними лапами.</p>
<p>&mdash;Гав! Гав! &mdash; он ткнулся мокрым носом в Кирюхино колено и побежал вперед.</p>
<p>Поначалу Кирюха пытался делать вид, что ему просто по пути. И как же чертовски сложно это делать рядом с игривым и всесёлым псом!</p>
<p>Хохот, лай, грохот каких-то банок, летящие по сторонам ветки и кошки &mdash; Кирюха и пёс не заметили, как оказались у магазина лучшими друзьями.</p>
<p>Внутри все по-прежнему было как в чулане Папы Карло.</p>
<p>Пёс подошел к столу, который стоял недалеко от входа в бывшую подсобку.</p>
<p>&mdash; Жуля, куда там надо было плыть?</p>
<p>&mdash; Плыви в стол, прыгай в угол, &mdash; ревниво бросила Жуля</p>
`,
        nextChapterButtonText: 'Кирюха подошел к столу.'
    },
    {
        type: 'task',
        taskCode: 'if_or_and',
        wide: false,
        text: `<p>Нижний ящик заклинило, а верхний выдвигался только наполовину. Пёс одобрительно уфнул, когда Кирюха засунул в него руку.</p>
<p>Кирюха немного пошарил в ящике и что-то зацепил. Он вытянул руку обратно и увидел в ладони игрушечный кораблик-пищалку.</p>
<p>&mdash; Приплыли, &mdash; расстроился Кирюха и отдал пищалку псу, &mdash; это твоя игрушка, наверное...</p>
<p>Пёс взял игрушку и пошел в подсобку, а Кирюха повернулся к выходу.</p>
<p>Пёс глухо зарычал, вернулся и ткнулся носом в Кирюхину руку. Кирюха выставил руку, а пёс выплюнул в нее игрушку и подтолкнул Кирюху в подсобку.</p>
<p>&mdash; Кажется она немного светится, когда ты у стены, &mdash; заметила Жуля</p>
<p>&mdash; Гав! Гав! Гав! &mdash; радостно залаял пёс.</p>
<p>&mdash; Интересно, &mdash; почезал затылок Кирюха, &mdash; Жуля, подскажешь, где она будет светиться сильнее всего?</p>
`,
        formalText: `Напиши программу, которая скажет <code>"сильно"</code>, когда Кирюха будет по центру верхней или правой стены. Когда Кирюха будет в правом
верхнем углу, программа должна написать <code>"тут сильнее всего"</code>. Во всех остальных местах программа должна написать <code>"слабо"</code>.`,
        formalDescription: `<p>Пока вы это читаете, я немного помечтаю. Ах, если бы я был сильным и умелым! Если бы был большим и храбрым! Если бы только я был успешным
и директором вселенной!</p>
<p>В этих своих мечтах я соединял два условия при помощи <code>и</code>. Большим и храбрым. Вот бы и в этой задаче можно было слепить <code>право</code>
и <code>верх</code>. И ведь можно. Только для этого используется <code>and</code>, что тоже &laquo;и&raquo;, только на английско-программистском.</p>
<p><code><pre>
if большой == "да" and храбрый == "да":
  print("Мечтать не вредно!")
</pre></code></p>
<p>Но интересно другое &mdash; как будет работать <code>else</code> для такого условия. Во &laquo;всех прочих&raquo; попадут не только <i>маленькие</i> и <i>осторожные</i>.
Еще туда попадут <i>маленькие</i> и <b>храбрые</b> с <b>большими</b> и <i>осторожными</i>. Все, кто не <b>большой</b> и <b>храбрый</b> одновременно.</p>
<p>Ну так и вот, к чему я это все. В этой толпе тоже бывает полезно разобраться. И создать не две дороги, а больше. Многие сразу же поймут, что и тут можно
сделать еще одно ветвление внутри <code>else</code>, и будут правы. А я хочу без лишних объяснений показать вот что.</p>
<p><code><pre>
if большой == "да" and храбрый == "да":
  print("Добро пожаловать в Вальгаллу, герой!")
elif большой == "да":
  print("Размеры есть, осталось прокачать храбрость!")
elif храбрый == "да":
  print("Храбрость есть, осталось набрать размеры!")
else:
  print("Ни размеров, ни храбрости. Остается только мечтать:(")
</pre></code></p>
<p>Осталось теперь помечтать о верхнем правом угле!</p>
`,
        nextChapterButtonText: '&mdash; И что, мне прыгать в этом углу?!',
        testIsPrefix: true,
        starterCode: false,
        prefixCode: false,
        visualComponent: Corners,
        resetAnimationOnStart: true,
        tests: [
            {
                exec: 'x="лево"\ny="центр"',
                expect: 'слабо'
            },
            {
                exec: 'x="центр"\ny="верх"',
                expect: 'сильно'
            },
            {
                exec: 'x="лево"\ny="верх"',
                expect: 'слабо'
            },
            {
                exec: 'x="центр"\ny="низ"',
                expect: 'слабо'
            },
            {
                exec: 'x="право"\ny="центр"',
                expect: 'сильно'
            },
            {
                exec: 'x="право"\ny="низ"',
                expect: 'слабо'
            },
            {
                exec: 'x="лево"\ny="низ"',
                expect: 'слабо'
            },
            {
                exec: 'x="право"\ny="верх"',
                expect: 'тут сильнее всего'
            },
        ],
        validator: function (stdout, test) {
            if (!stdout) {
                return "Жуля, ну где светится, а! Не молчи!"
            }

            return stdout.trim() === test.expect || "Жуля, а тебе точно хорошо видно?";
        }
    },
    {
        type: 'finish',
        title: 'Пока все!',
        text: `<p>Тут можно написать о своих впечатлениях, пока ждете продолжения</p>`
    },

]