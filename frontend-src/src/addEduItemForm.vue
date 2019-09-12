<template>
    <div class="container" id="addEduItemForm">
        <section class="logo mb-4">
            <a href="/"><img alt="Жажда знаний" src="./assets/logo.png"></a>
        </section>

        <h1>Добавление материала</h1>

        <ul class="nav nav-tabs justify-content-center mb-4">
            <li class="nav-item" v-for="tab in tabs" :key="tab.code">
                <a :class="{'active': tab.code === currentTabCode}" @click="currentTabCode = tab.code" class="nav-link" href="#">{{tab.title}}</a>
            </li>
        </ul>

        <div :class="{'view-on-mobile': isMobile, 'view-on-desktop': isDesktop}">
            <course-form
                    v-show="currentTabCode === 'course'"
                    :course="course"
                    :enums="enums.course"
                    :mobile="isMobile"
                    :skills="allSkills"
                    @save="saveItem"
            ></course-form>

            <book-form
                    v-show="currentTabCode === 'book'"
                    :book="book"
                    :enums="enums.book"
                    :mobile="isMobile"
                    :skills="allSkills"
                    @save="saveItem"
            ></book-form>

            <project-form
                    v-show="currentTabCode === 'project'"
                    card-title="Идея проекта"
                    :item="project"
                    :enums="enums.project"
                    :mobile="isMobile"
                    :skills="allSkills"
                    @save="saveItem"
            ></project-form>

            <explain-form
                    v-show="currentTabCode === 'explain'"
                    card-title="Объяснение"
                    :item="explanation"
                    :enums="enums.explanation"
                    :mobile="isMobile"
                    :skills="allSkills"
                    @save="saveItem"
            ></explain-form>

            <motivation-form
                    v-show="currentTabCode === 'motivation'"
                    card-title="Мотивация"
                    :item="motivation"
                    :enums="enums.motivation"
                    :mobile="isMobile"
                    :skills="allSkills"
                    @save="saveItem"
            ></motivation-form>

            <internship-form
                    v-show="currentTabCode === 'internship'"
                    :internship="internship"
                    :enums="enums.internship"
                    :mobile="isMobile"
                    :skills="allSkills"
                    @save="saveItem"
            ></internship-form>
        </div>
    </div>
</template>

<script>
    import CourseForm from './components/Forms/Course.vue'
    import BookForm from './components/Forms/Book.vue'
    import ProjectForm from './components/Forms/BasicText.vue'
    import ExplainForm from './components/Forms/BasicText.vue'
    import MotivationForm from './components/Forms/BasicText.vue'
    import InternshipForm from './components/Forms/Internship.vue'
    import ApiClient from './unsorted/ApiClient'
    import axios from 'axios'

    let audience = [
        {code: 'junior', title: 'Для начинающих'},
        {code: 'middle', title: 'Средний уровень'},
        {code: 'senior', title: 'Для профессионалов'},
    ];

    export default {
        name: 'addEduItemForm',
        components: {
            CourseForm,
            BookForm,
            ProjectForm,
            ExplainForm,
            MotivationForm,
            InternshipForm
        },
        data() {
            return {
                tabs: [
                    {code: 'course', title: 'Курс'},
                    {code: 'book', title: 'Книга'},
                    {code: 'project', title: 'Идея проекта'},
                    {code: 'explain', title: 'Объяснение'},
                    {code: 'motivation', title: 'Мотивация'},
                    {code: 'internship', title: 'Стажировка'},
                ],
                enums: {
                    course: {
                        forms: [
                            {code: 'online', title: 'Онлайн'},
                            {code: 'offline', title: 'Очный'},
                        ],
                        formats: [
                            {code: 'video', title: 'Видео'},
                            {code: 'webinar', title: 'Вебинар'},
                            {code: 'chat', title: 'Чат'},
                            {code: 'intensive', title: 'Интенсив'},
                            {code: 'interactive', title: 'Интерактивный'},
                            {code: 'textbook', title: 'Электронный учебник'},
                        ],
                        times: [
                            {code: 'day', title: 'Днем'},
                            {code: 'evening', title: 'Вечером'},
                            {code: 'dayoffs', title: 'По выходным'},
                        ],
                        certificates: [
                            {code: 'self', title: 'Собственный'},
                            {code: 'state', title: 'Гос. образца'},
                            {code: 'international', title: 'Международный'},
                        ],
                        priceTypes: [
                            {code: 'total', title: 'За весь курс'},
                            {code: 'lesson', title: 'За занятие'},
                            {code: 'module', title: 'За модуль'},
                            {code: 'month', title: 'В месяц'},
                        ],
                        durationUnits: [
                            {code: 'minute', title: 'минута'},
                            {code: 'hour', title: 'час'},
                            {code: 'academic-hour', title: 'ак. час'},
                            {code: 'day', title: 'день'},
                            {code: 'week', title: 'неделя'},
                            {code: 'month', title: 'месяц'},
                            {code: 'lesson', title: 'урок'},
                            {code: 'module', title: 'модуль'}
                        ],
                        loadUnits: [
                            {code: 'hour-per-day', title: 'час в день'},
                            {code: 'hour-per-week', title: 'час в неделю'},
                            {code: 'day-per-week', title: 'день в неделю'},
                            {code: 'self', title: 'самостоятельно'},
                        ],
                        audience: audience
                    },
                    book: {
                        formats: [
                            {'code': 'digital', 'title': 'Электронная'},
                            {'code': 'print', 'title': 'Печатная'},
                        ],
                        audience: audience
                    },
                    project: {},
                    explanation: {},
                    motivation: {},
                    internship: {
                        salaryTypes: [
                            {code: 'month', title: 'В месяц'},
                            {code: 'hour', title: 'В час'},
                        ],
                        durationUnits: [
                            {code: 'week', title: 'неделя'},
                            {code: 'month', title: 'месяц'},
                            {code: 'year', title: 'год'},
                        ],
                        loadUnits: [
                            {code: 'hour-per-day', title: 'час в день'},
                            {code: 'hour-per-week', title: 'час в неделю'},
                            {code: 'day-per-week', title: 'день в неделю'},
                            {code: 'self', title: 'самостоятельно'},
                        ],

                    }
                },
                currentTabCode: 'course',
                allSkills: false,
                window: {
                    width: 0,
                    height: 0
                },

                course: {
                    type: 'course',
                    priceType: 'total',
                    durationUnits: 'minute',
                    loadUnits: 'hour-per-day'
                },
                book: {
                    type: 'book'
                },
                project: {
                    type: 'project'
                },
                explanation: {
                    type: 'explanation'
                },
                motivation: {
                    type: 'motivation'
                },
                internship: {
                    type: 'internship',
                    salaryType: 'month',
                    durationUnits: 'month',
                    loadUnits: 'hour-per-week'
                }
            };
        },
        created() {
            window.addEventListener('resize', this.handleResize);

            this.handleResize();
            this.loadAllSkills();
        },
        destroyed() {
            window.removeEventListener('resize', this.handleResize)
        },
        methods: {
            async loadAllSkills() {
                this.allSkills = await ApiClient.loadSkills();
            },
            async saveItem(item) {
                let isNewItem = typeof (item['_id']) !== 'string';
                let url = '/api/saveEduItem.php';

                let response = await axios.post(url, item);

                let hasError = response && response.error;
                let successfullySaved = response && response.eduItem;

                if (successfullySaved) {
                    this[ response.eduItem.type ] = response.eduItem;
                    this.showMessage('Сохранилось!')
                }

                if (hasError) {
                    this.showError(response.error);
                }
            },
            showMessage(messageText) {
                console.log(messageText);
            },
            showError(errorMessage) {
                console.log(errorMessage);
            },
            handleResize() {
                this.window.width = window.innerWidth;
                this.window.height = window.innerHeight;
            }
        },
        computed: {
            isMobile() {
                let bootstrapBreakPoints = {
                    sm: 576,
                    md: 768,
                    lg: 992,
                    xl: 1200,
                };

                return this.window.width <= bootstrapBreakPoints.md;
            },
            isDesktop() {
                return !this.isMobile;
            }
        }
    }
</script>

<style>
    body {
        font-family: GoogleSans, sans-serif;
    }

    .logo img {
        width: 249px;
    }
</style>
