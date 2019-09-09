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
            <course-form :course="course" :enums="enums.course" :mobile="isMobile" :skills="allSkills" v-show="currentTabCode === 'course'"></course-form>
        </div>
    </div>
</template>

<script>
    import CourseForm from './components/CourseForm.vue'
    import ApiClient from './unsorted/ApiClient'

    export default {
        name: 'addEduItemForm',
        components: {
            CourseForm
        },
        data() {
            return {
                tabs: [
                    {code: 'course', title: 'Курс'},
                    {code: 'book', title: 'Книга'},
                    {code: 'project', title: 'Проект'},
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
                        audience: [
                            {code: 'junior', title: 'Для начинающих'},
                            {code: 'middle', title: 'Средний уровень'},
                            {code: 'senior', title: 'Для профессионалов'},
                        ]
                    }
                },
                currentTabCode: 'course',
                allSkills: false,
                course: {
                    type: 'course',
                    priceType: 'total',
                    durationUnits: 'minute',
                    loadUnits: 'hour-per-day'
                },
                book: {
                    type: 'book'
                },
                window: {
                    width: 0,
                    height: 0
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
