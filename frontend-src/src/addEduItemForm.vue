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
                    :save-status="saved.course"
                    :save-error="error.course"
                    @save="saveItem"
            ></course-form>

            <book-form
                    v-show="currentTabCode === 'book'"
                    :book="book"
                    :enums="enums.book"
                    :mobile="isMobile"
                    :skills="allSkills"
                    :save-status="saved.book"
                    :save-error="error.book"
                    @save="saveItem"
            ></book-form>

            <project-form
                    v-show="currentTabCode === 'project'"
                    card-title="Идея проекта"
                    :item="project"
                    :enums="enums.project"
                    :mobile="isMobile"
                    :skills="allSkills"
                    :save-status="saved.project"
                    :save-error="error.project"
                    @save="saveItem"
            ></project-form>

            <explain-form
                    v-show="currentTabCode === 'explain'"
                    card-title="Объяснение"
                    :item="explain"
                    :enums="enums.explain"
                    :mobile="isMobile"
                    :skills="allSkills"
                    :save-status="saved.explain"
                    :save-error="error.explain"
                    @save="saveItem"
            ></explain-form>

            <motivation-form
                    v-show="currentTabCode === 'motivation'"
                    card-title="Мотивация"
                    :item="motivation"
                    :enums="enums.motivation"
                    :mobile="isMobile"
                    :skills="allSkills"
                    :save-status="saved.motivation"
                    :save-error="error.motivation"
                    @save="saveItem"
            ></motivation-form>

            <homework-form
                    v-show="currentTabCode === 'homework'"
                    card-title="Домашка"
                    :item="homework"
                    :enums="enums.homework"
                    :mobile="isMobile"
                    :skills="allSkills"
                    :save-status="saved.homework"
                    :save-error="error.homework"
                    @save="saveItem"
            ></homework-form>

            <internship-form
                    v-show="currentTabCode === 'internship'"
                    :internship="internship"
                    :enums="enums.internship"
                    :mobile="isMobile"
                    :skills="allSkills"
                    :save-status="saved.internship"
                    :save-error="error.internship"
                    @save="saveItem"
            ></internship-form>

            <app-form
                    v-show="currentTabCode === 'app'"
                    :item="app"
                    :enums="enums.app"
                    :mobile="isMobile"
                    :skills="allSkills"
                    :save-status="saved.app"
                    :save-error="error.app"
                    @save="saveItem"
            ></app-form>

            <game-form
                    v-show="currentTabCode === 'game'"
                    :item="game"
                    :enums="enums.game"
                    :mobile="isMobile"
                    :skills="allSkills"
                    :save-status="saved.game"
                    :save-error="error.game"
                    @save="saveItem"
            ></game-form>
        </div>
    </div>
</template>

<script>
    import CourseForm from './components/Forms/Course.vue';
    import BookForm from './components/Forms/Book.vue';
    import ProjectForm from './components/Forms/BasicText.vue';
    import ExplainForm from './components/Forms/BasicText.vue';
    import MotivationForm from './components/Forms/BasicText.vue';
    import HomeworkForm from './components/Forms/BasicText.vue';
    import InternshipForm from './components/Forms/Internship.vue';
    import AppForm from './components/Forms/App.vue';
    import GameForm from './components/Forms/Game.vue';
    import ApiClient from './unsorted/ApiClient';
    import Enums from "./unsorted/Enums";
    import ArraysAndObjects from "./unsorted/ArraysAndObjects";
    import {initAuth, login, isAuthenticated, checkSession, getSavedProfileData} from "./unsorted/Auth";

    export default {
        name: 'addEduItemForm',
        components: {
            CourseForm,
            BookForm,
            ProjectForm,
            ExplainForm,
            MotivationForm,
            HomeworkForm,
            InternshipForm,
            AppForm,
            GameForm
        },
        data() {
            return {
                tabs: Enums.types,
                enums: Enums,
                currentTabCode: 'course',
                allSkills: false,
                window: {
                    width: 0,
                    height: 0
                },

                user: false,
                error: {
                    course: false,
                    book: false,
                    project: false,
                    explain: false,
                    motivation: false,
                    homework: false,
                    internship: false,
                    app: false,
                    game: false
                },
                saved: {
                    course: false,
                    book: false,
                    project: false,
                    explain: false,
                    motivation: false,
                    homework: false,
                    internship: false,
                    app: false,
                    game: false
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
                explain: {
                    type: 'explain'
                },
                motivation: {
                    type: 'motivation'
                },
                homework: {
                    type: 'homework'
                },
                internship: {
                    type: 'internship',
                    salaryType: 'month',
                    durationUnits: 'month',
                    loadUnits: 'hour-per-week'
                },
                app: {
                    type: 'app'
                },
                game: {
                    type: 'game'
                }
            };
        },
        async created() {
            initAuth();
            await checkSession();
            if (isAuthenticated()) {
                this.user = getSavedProfileData();
            }

            if (!this.user) {
                login();
            }

            window.addEventListener('resize', this.handleResize);

            this.handleResize();
            this.loadAllSkills();
        },
        destroyed() {
            window.removeEventListener('resize', this.handleResize)
        },
        watch: {
            course: {
                handler() {
                    this.clearSaveStatus('course');
                },
                deep: true
            },
            book: {
                handler() {
                    this.clearSaveStatus('book');
                },
                deep: true
            },
            project: {
                handler() {
                    this.clearSaveStatus('project');
                },
                deep: true
            },
            explain: {
                handler() {
                    this.clearSaveStatus('explain');
                },
                deep: true
            },
            motivation: {
                handler() {
                    this.clearSaveStatus('motivation');
                },
                deep: true
            },
            homework: {
                handler() {
                    this.clearSaveStatus('homework');
                },
                deep: true
            },
            internship: {
                handler() {
                    this.clearSaveStatus('internship');
                },
                deep: true
            },
            app: {
                handler() {
                    this.clearSaveStatus('app');
                },
                deep: true
            },
            game: {
                handler() {
                    this.clearSaveStatus('game');
                },
                deep: true
            },
        },
        methods: {
            async loadAllSkills() {
                this.allSkills = await ApiClient.loadSkills();
            },
            async saveItem(item) {
                let itemData = ArraysAndObjects.clone(item);
                itemData.user = ArraysAndObjects.clone(this.user);

                try {
                    let response = await ApiClient.saveItem(itemData);
                    let hasError = response && response.error;
                    let successfullySaved = response && response.eduItem;

                    if (successfullySaved) {
                        this[ response.eduItem.type ] = response.eduItem;
                        await this.$nextTick;
                        this.saved[response.eduItem.type] = true;
                    }

                    if (hasError) {
                        this.saved[itemData.type] = false;
                        this.error[itemData.type] = response.error || 'Какая-то ошибка сохранения';
                    }
                }
                catch (error) {
                    this.saved[itemData.type] = false;
                    this.error[itemData.type] = error || 'Какая-то ошибка сохранения';
                }

            },
            clearSaveStatus(type) {
                this.saved[type] = false;
            },
            showMessage(messageText) {
            },
            showError(errorMessage) {
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
