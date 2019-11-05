<template>
    <div class="card course-card course-card-text" :class="{'take-a-look': hasPartnerUrl}">
        <div class="card-body">
            <div v-if="mobile" class="d-flex flex-row align-items-center course-card-header">
                <span class="badge badge-course-info mr-2">Стажировка</span>
                <h6 class="text-muted flex-fill mb-0" v-if="internship.company">{{internship.company}}</h6>
                <a class="top-favourite-add" @click="toggleFavourite">
                    <i :class="{'fas': isFavourite, 'far': !isFavourite}" class="fa-bookmark"></i>
                </a>
            </div>
            <div v-else class="d-flex flex-row justify-content-between align-items-start">
                <span class="badge badge-course-info">Стажировка</span>
                <div class="d-flex flex-row justify-content-end course-card-header">
                    <h6 class="text-muted" v-if="internship.company">{{internship.company}}</h6>
                    <a class="top-favourite-add" @click="toggleFavourite">
                        <i :class="{'fas': isFavourite, 'far': !isFavourite}" class="fa-bookmark"></i>
                    </a>
                </div>
            </div>

            <h5>{{internship.title || ''}}</h5>

            <p class="mt-0 mb-0 price" v-if="mobile"><span v-html="humanSalary"></span></p>

            <p class="mt-1 mb-0" v-else-if="originalDuration">{{originalDuration}}</p>
            <p :class="{'mt-0': originalDuration, 'mt-1': !originalDuration}" v-if="originalLoad">{{originalLoad}}</p>

            <p class="text-info mt-1">
                {{attributesLine.join('&nbsp;&bull;&nbsp;')}}
            </p>

            <div v-if="allSkills">
                <label class="mt-1 mb-0">Какие навыки можно прокачать</label>
                <matched-skill-list :skills="allSkills" :skills-in-filter="skillsInFilter"></matched-skill-list>
            </div>

            <div v-if="allRequirements">
                <label class="mt-1 mb-0">Какие навыки нужны</label>
                <skill-list :skills="allRequirements"></skill-list>
            </div>

            <div v-if="internship.description" class="mb-0 mt-4">
                <span v-if="showFull">{{internship.description}}</span>
                <split-description :text="internship.description" v-else></split-description>
            </div>

            <a :href="pageUrl" class="details-link" target="_blank" v-if="!showFull">Подробнее на странице стажировки</a>

            <div class="mt-4" :class="{'row': !mobile}">
                <a v-if="mobile" :href="redirectUrl" target="_blank" class="btn btn-outline-info flex-fill d-flex justify-content-center btn-link mr-2">
                    Подать заявку
                </a>
                <div class="col price-duration-data" v-if="!mobile">
                    <p class="mt-0 mb-0 price"><span v-html="humanSalary"></span></p>
                </div>
                <div class="course-buttons d-flex flex-row justify-content-end"
                     :class="{'flex-fill mt-0 p-0': mobile, 'col mt-1': !mobile}">
                    <button class="btn btn-outline-info d-flex flex-row btn-favourite mr-2"
                            type="button"
                            :class="{'active': isFavourite}"
                            @click="toggleFavourite"
                    >
                        <i :class="{'fas fa-check': isFavourite, 'far fa-bookmark': !isFavourite}"></i>
                    </button>
                    <!--share-button></share-button-->
                    <a v-if="!mobile" :href="redirectUrl" target="_blank" class="btn btn-outline-info flex-fill btn-link mr-2">
                        Подать заявку
                    </a>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import SkillList from '../SkillList.vue'
    import MatchedSkillList from '../MatchedSkillList.vue'
    import SplitDescription from '../SplitDescription.vue'
    import ShareButton from '../ShareButton'
    import TextFormat from '../../unsorted/TextFormat'
    import UrlFunctions from "../../unsorted/UrlFunctions";

    export default {
        name: 'InternshipCard',
        components: {
            SkillList,
            MatchedSkillList,
            SplitDescription,
        },
        props: ['internship', 'skills-in-filter', 'enums', 'mobile', 'show-full', 'is-favourite'],
        data() {
            return {
            }
        },
        methods: {
            toggleFavourite() {
                this.$emit('favourite', this.internship)
            },
            pageUrl() {
                return UrlFunctions.makeItemUrl(this.internship);
            },
        },
        computed: {
            redirectUrl() {
                return this.internship.url || false;
            },
            allSkills() {
                let hasSkills = this.internship.skills && this.internship.skills.length > 0;
                if (!hasSkills) {
                    return false;
                }

                return TextFormat.skillsToObjectList(this.internship.skills);
            },
            allRequirements() {
                let hasRequirements = this.internship.requirements && this.internship.requirements.length > 0;
                if (!hasRequirements) {
                    return false;
                }

                return TextFormat.skillsToObjectList(this.internship.requirements);
            },
            hasPartnerUrl() {
                return Boolean(this.internship.partnerUrl);
            },
            originalDuration() {
                if (!this.internship.duration) {
                    return false;
                }

                let readableDuration = TextFormat.getReadableValue(this.internship.durationUnits, this.enums['durationUnits']);
                return this.internship.duration + ' ' + TextFormat.declensionUnits(this.internship.duration, readableDuration);
            },
            originalLoad() {
                if (!this.internship.load) {
                    return false;
                }

                if (this.internship.loadUnits === 'self') {
                    return 'Свободный график';
                }

                let readableLoad = TextFormat.getReadableValue(this.internship.loadUnits, this.enums['loadUnits']);

                return this.internship.load + ' ' + TextFormat.declensionUnits(this.internship.load, readableLoad);
            },
            humanSalary() {
                if ( typeof(this.internship.salary) !== 'number') {
                    return 'Неоплачиваемая';
                }

                let formattedPrice = TextFormat.formatNumber(this.internship.salary) + '&nbsp;&#8381;';

                if (this.internship.salaryType === 'hour') {
                    formattedPrice += '/час';
                }

                return this.internship.salary > 0 ? formattedPrice : 'Неоплачиваемая';
            },
            attributesLine() {
                let attributes = [];

                if (this.internship.city) {
                    attributes.push(this.internship.city);
                }

                if (this.internship.canCombineStudy) {
                    attributes.push('Можно совмещать с учебой');
                }

                if (this.internship.hasMentor) {
                    attributes.push('Есть наставник');
                }

                if (this.internship.hasTraining) {
                    attributes.push('Есть тренинги');
                }

                return attributes;
            },
        }
    }
</script>