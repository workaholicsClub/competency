<template>
    <div class="course-list-page">
        <page-header
                v-model="request"
                :request-values="requestValues"
                :user="user"
                :favourites="favourites"
                :count-favourites="countFavourites"
                :show-salary="true"
                :salary="salary"
                :salaryRangeReadable="salaryRangeReadable"
                :salaryLoaded="salaryLoaded"
                :histogram="histogram"

                @login="login"
                @logout="logout"
                @remove-favourite="removeFavourite"
                @open-skills="openPanel('skills')"
        >
        </page-header>
        <div class="view-on-desktop d-none d-sm-block d-md-block">
            <div class="pr-4 pl-4 pb-4">
                <div class="container wide-container d-flex flex-row align-items-start">
                    <section class="skills-section pr-4 pl-4 pb-4">
                        <section class="avatar d-flex flex-column align-items-center mb-4">
                            <img src="/assets/images/avatar.svg" @click="login" v-if="!user">
                            <img :src="user.picture" class="custom-avatar" v-else>
                            <a href="javascript:0;" class="user-name" @click="login" v-if="!user">Неопознанный Итчер</a>
                            <a href="javascript:0;" class="user-name" v-else>{{user.name}}</a>
                        </section>
                        <section class="existing-skills-data input-group mb-4">
                            <label class="group-title-label filter-group-title-label mb-0">
                                Мои профессиональные навыки
                            </label>
                            <div class="skills-filter-text mb-3">
                                фильтруют курсы по требованиям к знаниям
                            </div>

                            <skill-input
                                    :skills="allSkills"
                                    v-model="filter.existingSkills"
                                    :initial-selection="selectedExistingSkills"
                                    :shown-skills="existingSkillNames"
                                    :use-in-filter="true">
                            </skill-input>
                        </section>
                        <section class="salary-data mb-2" :class="{'block-hidden': sidebarSalaryHidden}">
                            <salary-input v-model="salary" :histogram="histogram" width="260" height="" v-if="histogram"></salary-input>
                        </section>
                        <section class="skills-data input-group">
                            <label class="group-title-label skills-filter-text filter-group-title-label mb-0">
                                Недостающие проф. навыки на основе
                                <span class="skills-input-display editable-toggle" v-if="vacancyDataLoaded" @click="sidebarSalaryHidden = !sidebarSalaryHidden">{{vacancyCountText}}</span>
                                <span class="skills-input-display editable-toggle" v-else>...</span>
                                с ЗП
                                <span class="salary-input-display editable-toggle" v-if="salaryLoaded" @click="sidebarSalaryHidden = !sidebarSalaryHidden">
                                    <span v-html="salaryRangeReadable"></span>
                                </span>
                                <span class="salary-input-display editable-toggle" v-else>...</span>
                            </label>
                            <div class="skills-filter-text mb-3">
                                фильтруют по содержанию материалов
                            </div>

                            <skill-input
                                    :skills="allSkills"
                                    v-model="filter.neededSkills"
                                    :initial-selection="selectedNeededSkills"
                                    :shown-skills="neededSkillNames"
                                    :use-in-filter="true">
                            </skill-input>
                        </section>
                    </section>
                    <div class="flex-fill">
                        <filter-form v-model="filter" split-at="format"></filter-form>
                        <main class="course-list px-4" :class="{'loading': isLoading}" v-if="catalogHasItems">
                            <autodetect-card
                                    v-for="item in catalog"
                                    v-show="!isLoading"
                                    :item="item"
                                    :skills-in-filter="neededSkillNames"
                                    :mobile="false"
                                    :show-full="false"
                                    :key="item._id"
                                    :is-favourite="isFavourite(item)"
                                    @favourite="toggleFavourite(item)"
                            ></autodetect-card>
                        </main>
                        <main class="course-list px-4 loading" v-else-if="isLoading"></main>
                        <section class="no-result-text p-4 d-flex flex-column" v-else>
                            <h2>Ой! Такого не нашлось</h2>
                            <p class="flex-fill">Материалов, подходящих по условиям из фильтра, сейчас нет.</p>
                        </section>
                    </div>
                </div>
                <footer></footer>
            </div>
        </div>
        <div class="view-on-mobile d-block d-sm-none d-md-none">
            <main>
                <section class="pagination d-flex flex-row justify-content-center align-items-center no-result-hide">
                    <div class="swiper-button-prev"></div>
                    <div class="swiper-pagination"></div>
                    <div class="swiper-button-next"></div>
                </section>
                <swiper :options="swiperOptions" class="course-list" :class="{'loading': isLoading}" v-if="catalogHasItems">
                    <autodetect-card
                            v-for="item in catalog"
                            v-show="!isLoading"
                            :item="item"
                            :skills-in-filter="neededSkillNames"
                            :mobile="true"
                            :show-full="false"
                            :key="item._id"
                            :is-favourite="isFavourite(item)"
                            @favourite="toggleFavourite(item)"
                    ></autodetect-card>
                </swiper>

                <section class="swiper-container" v-else-if="isLoading">
                    <div class="swiper-wrapper course-list loading"></div>
                </section>

                <section class="no-result-text p-4 d-flex flex-column" v-else>
                    <h2>Ой! Такого не нашлось</h2>
                    <p class="flex-fill">Материалов, подходящих по условиям из фильтра, сейчас нет.</p>
                    <button class="btn btn-outline-primary btn-outline-special apply-btn" @click="openPanel('filter')">
                        Изменить фильтр
                    </button>
                </section>
            </main>
            <footer class="d-flex flex-row justify-content-center mb-4 p-2" v-if="isMobileFooterShown">
                <button class="btn btn-favourites-list flex-fill d-flex align-items-center justify-content-center" :class="{'active': countFavourites}" @click="openPanel('favourites')">
                    <i class="fas fa-bookmark icon-background"></i>
                    <i class="far fa-bookmark icon-overlay"></i>
                    <span class="fav-count ml-2">{{countFavourites}}</span>
                </button>
                <div class="divisor"></div>
                <button class="btn btn-skills flex-fill" @click="openPanel('skills')"><i class="fas fa-graduation-cap"></i></button>
                <div class="divisor"></div>
                <button class="btn btn-filter flex-fill" @click="openPanel('filter')">
                    <i class="fas fa-sliders-h"></i>
                    <span class="fav-count ml-2" v-if="countFilter">{{countFilter}}</span>
                </button>
            </footer>
            <section class="skills-panel sliding-panel" :class="{'show': isPanelShown.skills}">
                <div class="margin-wrapper m-4">
                    <div class="flex-row d-flex align-items-center justify-content-center mb-4 section-title">
                        <label class="flex-fill text-center mb-0">Навыки</label>
                        <a class="close-panel-btn" href="#" @click="closePanel('skills')">&times;</a>
                    </div>

                    <div class="existing-skills-data input-group mb-4">
                        <label class="group-title-label filter-group-title-label mb-0">
                            Мои профессиональные навыки
                        </label>
                        <div class="skills-filter-text mb-3">
                            фильтруют материалы по требованиям к знаниям
                        </div>

                        <skill-input
                                :skills="allSkills"
                                v-model="filter.existingSkills"
                                :initial-selection="selectedExistingSkills"
                                :shown-skills="existingSkillNames"
                                :use-in-filter="true">
                        </skill-input>
                    </div>

                    <div class="input-group">
                        <salary-input v-model="salary" :histogram="histogram" width="260" height="51" v-if="histogram"></salary-input>
                    </div>

                    <div class="input-group mb-4">
                        <label class="group-title-label filter-group-title-label">
                            Недостающие проф. навыки на основе
                            <span class="skills-input-display editable-toggle" v-if="vacancyDataLoaded">{{vacancyCountText}}</span>
                            <span class="skills-input-display editable-toggle" v-else>...</span>
                            с ЗП
                            <span class="salary-input-display editable-toggle" v-if="salaryLoaded"><span v-html="salaryRangeReadable"></span></span>
                            <span class="salary-input-display editable-toggle" v-else>...</span>
                        </label>
                        <label class="group-title-label skill-group-title-label mb-0">
                            Навыки для прокачки
                        </label>

                        <skill-input
                                :skills="allSkills"
                                v-model="filter.neededSkills"
                                :initial-selection="selectedNeededSkills"
                                :shown-skills="neededSkillNames"
                                :use-in-filter="true">
                        </skill-input>
                    </div>

                    <div class="d-flex flex-row justify-content-center mb-4 p-2">
                        <button class="btn btn-outline-primary btn-outline-special flex-fill d-flex align-items-center justify-content-center" @click="closePanel('skills')">
                            Применить
                        </button>
                    </div>
                </div>
            </section>
            <filter-form v-model="filter" :mobile="true" :class="{'show': isPanelShown.filter}" @close="closePanel('filter')"></filter-form>
            <section class="favourite-panel sliding-panel" :class="{'show': isPanelShown.favourites}">
                <div class="margin-wrapper m-4">
                    <div class="flex-row d-flex align-items-center justify-content-center mb-4 section-title">
                        <label class="flex-fill text-center mb-0">Моя подборка</label>
                        <a class="close-panel-btn" href="#" @click="closePanel('favourites')">&times;</a>
                    </div>

                    <div class="favourite-list">
                        <favourite-card v-for="item in favourites" :item="item" @remove="removeFavourite(item)" :key="item._id"></favourite-card>
                    </div>
                </div>
            </section>
        </div>
        <div class="floating-buttons">
            <button class="add-item-button btn-outline-info active" @click="gotoAdd">
                <i class="fas fa-plus"></i>
            </button>
        </div>
        <div class="modal fade" id="surveyModal" tabindex="-1" role="dialog" aria-labelledby="surveyModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="surveyModalLabel">Отзыв о курсе</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body p-0 survey-data">
                        <div class="d-flex flex-column align-items-center text-center">
                            <img src="/assets/images/avatar_facebook.png" class="auth-trigger itcher-avatar mt-4 mb-4">
                            <button class="btn btn-outline-info auth-trigger mt-4">Пожалуйста, представьтесь</button>
                            <p>Мы переживаем за качество отзывов</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import SkillInput from './components/SkillInput.vue';
    import SalaryInput from './components/SalaryInput.vue';
    import ApiClient from './unsorted/ApiClient';
    import AutodetectCard from './components/Cards/AutodetectCard.vue';
    import FavouriteCard from './components/Cards/Favourite.vue';
    import FilterForm from './components/FilterForm.vue';
    import PageHeader from './components/PageHeader.vue';
    import Enums from "./unsorted/Enums";
    import TextFormat from "./unsorted/TextFormat";
    import UrlFunctions from "./unsorted/UrlFunctions";
    import {initAuth, login, logout, isAuthenticated, checkSession, getSavedProfileData} from "./unsorted/Auth";
    import InputTemplate from "./unsorted/InputTemplate";
    import Favourites from "./unsorted/Favourites";

    export default {
        name: 'Catalog',
        components: {
            SkillInput,
            SalaryInput,
            AutodetectCard,
            FavouriteCard,
            FilterForm,
            PageHeader
        },
        data() {
            return {
                user: false,
                filter: {},
                professionCode: UrlFunctions.getProfessionCodeFromUrl(),
                catalog: false,
                enums: Enums,
                neededSkills: [],
                selectedNeededSkills: [],
                existingSkills: [],
                selectedExistingSkills: [],
                allSkills: false,
                favourites: [],
                firstTimeLoaded: false,
                isLoading: true,
                request: {},
                isPanelShown: {
                    favourites: false,
                    skills: false,
                    filter: false
                },
                sidebarSalaryHidden: true,
                histogram: false,
                vacancyCount: false,
                salary: {from: false, to: false},
                swiperOptions: {
                    slidesPerView: 'auto',
                    centeredSlides: true,
                    spaceBetween: 12,
                    pagination: {
                        el: '.swiper-pagination',
                        type: 'fraction',
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                }
            }
        },
        async created() {
            //initScroll();

            initAuth();
            this.loadFavourites();
            this.getRequestValuesFromURL();

            this.filter = this.getTemplateFilterValues();

            try {
                await checkSession();
                if (isAuthenticated()) {
                    this.user = getSavedProfileData();
                }
                else {
                    this.user = false;
                }
            }
            catch (error) {
                this.user = false;
            }

            await this.loadRequestData();
        },
        watch: {
            request: {
                handler() {
                    this.loadRequestData();
                    this.saveRequestInUrl();
                },
                deep: true
            },
            filter: {
                handler() {
                    this.loadCourses();
                },
                deep: true
            },
            favourites: {
                handler() {
                    this.saveFavourites();
                },
                deep: true
            },
            salary: {
                handler() {
                    this.loadSalarySkills();
                },
                deep: true
            },
            existingSkills: {
                handler() {
                    let [rateFrom, rateTo] = this.skillRateInitialRange.existing || [];
                    this.selectedExistingSkills = this.existingSkills
                        .filter(skill => skill.rate >= rateFrom && skill.rate <= rateTo)
                        .map(skill => skill.title);

                    this.loadCourses();
                },
                deep: true
            },
            neededSkills: {
                handler() {
                    let [rateFrom, rateTo] = this.skillRateInitialRange.needed;
                    this.selectedNeededSkills = this.neededSkills
                        .filter(skill => skill.rate >= rateFrom && skill.rate <= rateTo)
                        .map(skill => skill.title);
                    this.loadCourses();
                },
                deep: true
            }
        },

        methods: {
            login() {
                login();
            },
            logout() {
                logout();
            },
            gotoAdd() {
                let addUrl = location.origin + '/add_edu_item.html';
                window.open(addUrl, '_blank');
            },
            findSkill(skills, title) {
                let results = skills.filter((skill) => skill.title === title);
                return results.length > 0 ? results[0] : false;
            },
            removeSkill(skills, title) {
                let skillToRemove = this.findSkill(skills, title);
                if (!skillToRemove) {
                    return false;
                }

                let index = skills.indexOf(skillToRemove);
                skills.splice(index, 1);
                return skillToRemove;
            },
            addSkill(skills, title) {
                let removedSkill = this.removeNeededSkill(title);
                if (!removedSkill) {
                    removedSkill = this.removeExistingSkill(title);
                }

                let skillData = removedSkill;

                if (!skillData) {
                    skillData = {
                        title: title,
                        level: 1,
                        rate: 0,
                        userAdded: true,
                        checked: true
                    };
                }
                else {
                    skillData.checked = true;
                    skillData.userAdded = true;
                }

                skills.push(skillData);
            },
            findNeededSkill(title) {
                return this.findSkill(this.neededSkills, title);
            },
            findExistingSkill(title) {
                return this.findSkill(this.existingSkills, title);
            },
            removeNeededSkill(title) {
                return this.removeSkill(this.neededSkills, title);
            },
            removeExistingSkill(title) {
                return this.removeSkill(this.existingSkills, title);
            },
            addNeededSkill(title) {
                return this.addSkill(this.neededSkills, title);
            },
            addExistingSkill(title) {
                return this.addSkill(this.existingSkills, title);
            },

            getRequestValuesFromURL() {
                let requestValues = UrlFunctions.getRequestValuesFromURL();
                if (requestValues) {
                    this.request = requestValues;
                }
                else {
                    this.request = {
                        who: this.requestValues['who'][0],
                        exp: this.requestValues['exp'][0],
                        want: this.requestValues['want'][0],
                    }
                }
            },
            getTemplateFilterValues() {
                let price = UrlFunctions.getParameterByName('price');
                let defaultPrice = !price;
                let hasPractice = UrlFunctions.getParameterByName('hasPractice');
                let defaultPractice = !hasPractice;
                let hasAudience = UrlFunctions.getParameterByName('audience');
                let defaultAudience = !hasAudience;

                let filter = {};

                if (this.inputTemplateCode === 'novice') {
                    if (defaultPractice) {
                        //filter.hasPractice = ["1"];
                    }

                    if (defaultAudience) {
                        filter.audience = ['junior'];
                    }
                }

                if (this.inputTemplateCode === 'other-novice') {
                    if (defaultPractice) {
                        //filter.hasPractice = ["1"];
                    }

                    if (defaultAudience) {
                        filter.audience = ['junior'];
                    }
                }

                if (this.inputTemplateCode === 'novice-continue' || this.inputTemplateCode === 'other-novice-continue') {
                    if (defaultAudience) {
                        filter.audience = ['junior', 'middle'];
                    }
                }

                if (this.inputTemplateCode === 'middle-continue') {
                    if (defaultAudience) {
                        filter.audience = ['middle', 'senior'];
                    }
                }

                if (this.inputTemplateCode === 'senior-continue') {
                    if (defaultAudience) {
                        filter.audience = ['senior'];
                    }
                }

                if (!defaultPrice && price !== "-1") {
                    filter.price = [price];
                }

                if (!defaultPractice && hasPractice !== "-1") {
                    filter.hasPractice = [hasPractice];
                }

                return filter;
            },

            openPanel(panelCode) {
                this.closeAllPanels();
                this.isPanelShown[panelCode] = true;
            },
            closePanel(panelCode) {
                this.isPanelShown[panelCode] = false;
            },
            closeAllPanels() {
                Object.keys(this.isPanelShown).forEach( (code) => this.closePanel(code) );
            },
            isFavourite(item) {
                return Favourites.findFavouriteIndex(item, this.favourites) !== -1;
            },
            addFavourite(item) {
                this.favourites = Favourites.addFavourite(item, this.favourites);
            },
            removeFavourite(item) {
                this.favourites = Favourites.removeFavourite(item, this.favourites);
            },
            toggleFavourite(item) {
                if (this.isFavourite(item)) {
                    this.removeFavourite(item);
                }
                else {
                    this.addFavourite(item);
                }
            },
            saveFavourites() {
                Favourites.saveFavourites(this.favourites);
            },
            loadFavourites() {
                return Favourites.loadFavourites();
            },
            isSkillExisting(skillRate) {
                let template = this.inputTemplate;
                if (!template) {
                    return false;
                }

                if (!template.skillRateFilter.existing) {
                    return false;
                }

                let fromRate = template.skillRateFilter.existing[0];
                let toRate = template.skillRateFilter.existing[1];

                return  skillRate > fromRate && skillRate <= toRate;
            },
            isSkillNeeded(skillRate) {
                let template = this.inputTemplate;
                if (!template) {
                    return true;
                }

                if (!template.skillRateFilter.needed) {
                    return false;
                }

                let fromRate = template.skillRateFilter.needed[0];
                let toRate = template.skillRateFilter.needed[1];

                return  skillRate > fromRate && skillRate <= toRate;
            },

            async loadAllSkills() {
                this.allSkills = await ApiClient.loadProfessionSkills( this.professionName );
            },
            async loadSalarySkills() {
                let response = await ApiClient.loadSkillsDataDebounced(this.salary.from, this.salary.to, this.filterRate, this.professionCode);

                this.vacancyCount = response.vacanciesCount;

                if (this.inputTemplateCode === 'skill') {
                    return;
                }

                let skills = response.skills.map((skill) => {
                    skill.level = skill.modeLevel;
                    return skill;
                });

                let existingSkills = skills.filter((skill) => this.isSkillExisting(skill.rate) );
                let notExistingSkills = skills.filter((skill) => !this.isSkillExisting(skill.rate) );

                let urlSkills = UrlFunctions.getParameterByName('skills[]');
                let hasUrlSkills = Boolean(urlSkills);

                existingSkills = existingSkills.map((skill) => {
                    skill.userAdded = false;
                    skill.checked = true;

                    return skill;
                });

                notExistingSkills = notExistingSkills.map((skill) => {
                    skill.userAdded = false;
                    skill.checked = hasUrlSkills ? false : this.isSkillNeeded(skill.rate);

                    return skill;
                });

                this.neededSkills = notExistingSkills;
                this.existingSkills = existingSkills;

                if (hasUrlSkills) {
                    urlSkills.forEach((title) => {
                        this.addNeededSkill(title);
                    });
                }
            },
            async loadCourses() {
                let filter = this.prefixedFilterWithoutSkills;
                filter['professionCode'] = this.professionCode;
                filter['filter[skills]'] = this.filter.neededSkills;
                filter['filter[requirements]'] = this.filter.existingSkills;

                this.isLoading = true;
                this.catalog = await ApiClient.loadCoursesDebounced(filter);
                if (!this.firstTimeLoaded) {
                    this.firstTimeLoaded = true;
                }
                else {
                    this.isLoading = false;
                }

                return this.catalog;
            },
            async loadSalaryData() {
                this.histogram = await ApiClient.loadHistogramData(this.professionCode);

                let salaryFrom = this.histogram.salary.from.median;
                let salaryTo = this.histogram.salary.to.median;

                if (this.inputTemplateCode === 'novice' || this.inputTemplateCode === 'other-novice') {
                    salaryFrom = this.histogram.salary.min;
                    salaryTo = this.histogram.salary.to.q25;
                }

                if (this.inputTemplateCode === 'middle-continue') {
                    salaryFrom = this.histogram.salary.from.q25;
                    salaryTo = this.histogram.salary.to.q75;
                }

                if (this.inputTemplateCode === 'senior-continue') {
                    salaryFrom = this.histogram.salary.from.q75;
                    salaryTo = this.histogram.salary.max;
                }

                if (salaryFrom === salaryTo) {
                    salaryFrom -= this.histogram.step;
                }

                this.salary.from = salaryFrom;
                this.salary.to = salaryTo;
            },
            async loadRequestData() {
                await this.loadAllSkills();
                await this.loadSalaryData();
                await this.loadSalarySkills();
                this.loadCourses();
            },
            saveRequestInUrl() {
                UrlFunctions.setRequestValuesInURL(this.request);
            }
        },
        computed: {
            neededSkillNames() {
                return this.neededSkills.map( skill => skill.title );
            },
            existingSkillNames() {
                return this.existingSkills.map( skill => skill.title );
            },
            professionName() {
                if (!this.professionCode) {
                    return false;
                }

                return Enums.professionNames[this.professionCode];
            },
            professionNameTP() {
                if (!this.professionCode) {
                    return false;
                }

                return Enums.professionNamesTP[this.professionCode];
            },
            requestValues() {
                return {
                    who: ['новичок', this.professionName, 'специалист из другой области'],
                    exp: ['без опыта работы', 'с опытом работы до 3 лет', 'с опытом работы 3 или более года'],
                    want: ['стать '+ this.professionNameTP, 'начать с нуля', 'продолжить обучение', 'повысить квалификацию', 'прокачать навык']
                }
            },
            inputTemplateCode() {
                return InputTemplate.getTemplateCode(this.request, this.professionName);
            },
            inputTemplate() {
                return InputTemplate.getTemplate(this.inputTemplateCode);
            },
            filterRate() {
                let filterRate = 10;

                if (this.inputTemplateCode === 'middle-continue' || this.inputTemplateCode === 'senior-continue') {
                    filterRate = 0;
                }

                return filterRate;
            },
            skillRateInitialRange() {
                return this.inputTemplate.skillRateFilter;
            },
            catalogHasItems() {
                return this.catalog && this.catalog.length > 0 && !this.isLoading;
            },
            sliderInitialized() {
                return this.slider !== false;
            },
            prefixedFilterWithoutSkills() {
                let skillKeyNames = ['existingSkills', 'neededSkills'];

                let filter = Object.keys(this.filter).reduce( (processedFilter, currentKey) => {
                    let skipKey = skillKeyNames.indexOf(currentKey) !== -1;
                    if (!skipKey) {
                        processedFilter['filter['+currentKey+']'] = this.filter[currentKey];
                    }

                    return processedFilter;
                }, {});

                return filter;
            },
            salaryLoaded() {
                return this.salary.from !== false && this.salary.to !== false;
            },
            salaryRangeReadable() {
                let fromThousands = Math.round(this.salary.from / 1000);
                let toThousands = Math.round(this.salary.to / 1000);

                return TextFormat.formatNumber(fromThousands) + 'k&nbsp;&mdash;&nbsp;' +
                    TextFormat.formatNumber(toThousands)+'k&nbsp;&#8381;'
            },
            vacancyDataLoaded() {
                return this.vacancyCount !== false;
            },
            vacancyCountText() {
                return this.vacancyCount+ ' ' + TextFormat.declensionUnits( this.vacancyCount, 'вакансий');
            },
            isAnyPanelShown() {
                return Object.keys(this.isPanelShown).reduce( (result, code) => result || this.isPanelShown[code], false );
            },
            isMobileFooterShown() {
                return !this.isAnyPanelShown && this.catalogHasItems;
            },
            countFavourites() {
                return this.favourites.length;
            },
            activeFilters() {
                return Object.keys(this.filter).filter( (currentFieldCode) => {
                    let fieldValue = this.filter[currentFieldCode];
                    let isDefined = typeof(fieldValue) !== 'undefined';
                    let isArray = isDefined && fieldValue instanceof Array;
                    let isNotEmptyArray = isArray && fieldValue.length > 0;
                    let hasNonArrayValue = !isArray && Boolean(fieldValue);

                    let hasValue = isDefined && ( isNotEmptyArray || hasNonArrayValue );

                    return hasValue;
                });
            },
            countFilter() {
                return this.activeFilters.length;
            }
        }
    }
</script>
<style>
    header.expanded {height: 290px;}
    .floating-buttons {
        position: fixed;
        right: 0.5rem;
        bottom: 0.5rem;
        z-index: 100;
    }
    .add-item-button {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
    }
</style>