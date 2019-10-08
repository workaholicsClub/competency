<template>
    <div class="card course-card course-card-text" :class="{'take-a-look': hasPartnerUrl}">
        <div class="card-body">
            <div v-if="mobile" class="d-flex flex-row align-items-center course-card-header">
                <span class="badge badge-course-info mr-2">Курс</span>
                <h6 class="text-muted flex-fill mb-0" v-if="course.platform">от <a :href="redirectUrl">{{course.platform}}</a></h6>
                <a class="top-favourite-add" @click="toggleFavourite">
                    <i :class="{'fas': isFavourite, 'far': !isFavourite}" class="fa-bookmark"></i>
                </a>
            </div>
            <div v-else class="d-flex flex-row justify-content-between align-items-start">
                <span class="badge badge-course-info">Курс</span>
                <div class="d-flex flex-row justify-content-end course-card-header">
                    <h6 class="text-muted" v-if="course.platform">от <a :href="redirectUrl">{{course.platform}}</a></h6>
                    <a class="top-favourite-add" @click="toggleFavourite">
                        <i :class="{'fas': isFavourite, 'far': !isFavourite}" class="fa-bookmark"></i>
                    </a>
                </div>
            </div>

            <h5>{{course.title || ''}}</h5>

            <p class="mt-0 mb-0 price" v-if="mobile"><span v-html="humanPrice"></span></p>

            <p class="mt-1 mb-0" v-if="originalDuration && (originalDuration != humanDuration)">{{originalDuration}} &asymp; {{humanDuration}}</p>
            <p class="mt-1 mb-0" v-else-if="originalDuration">{{originalDuration}}</p>
            <p :class="{'mt-0': originalDuration, 'mt-1': !originalDuration}" v-if="originalLoad">{{originalLoad}}</p>
            <p class="mt-1 mb-0 text-info" v-if="originalFormAndTime">
                {{originalFormAndTime}}
            </p>
            <p class="text-info" :class="{'mt-1': !originalFormAndTime}">
                {{attributesLine.join('&nbsp;&bull;&nbsp;')}}
            </p>

            <div v-if="allSkills">
                <label class="mt-1 mb-0">По окончании будете уметь</label>
                <matched-skill-list :skills="allSkills" :skills-in-filter="skillsInFilter"></matched-skill-list>
            </div>

            <div v-if="allRequirements">
                <label class="mt-1 mb-0">Нужно знать</label>
                <skill-list :skills="allRequirements"></skill-list>
            </div>

            <p v-if="course.description" class="mb-0 mt-4">
                <span v-if="showFull">{{course.description}}</span>
                <split-description :text="course.description" v-else></split-description>
            </p>
            <a :href="pageUrl" class="details-link" v-if="!showFull">Подробнее на странице курса</a>

            <div class="mt-4" :class="{'row': !mobile}">
                <div class="col price-duration-data" v-if="!mobile">
                    <p class="mt-0 mb-0 price"><span v-html="humanPrice"></span></p>
                </div>
                <div :class="{'course-buttons flex-fill d-flex flex-row mt-0 p-0': mobile, 'col course-buttons d-flex flex-row mt-1': !mobile}">
                    <a v-if="mobile" :href="redirectUrl" class="btn btn-outline-info flex-fill d-flex justify-content-center btn-link mr-2">
                        Записаться
                    </a>
                    <button class="btn btn-outline-info d-flex flex-row btn-favourite mr-2"
                            type="button"
                            :class="{'active': isFavourite}"
                            @click="toggleFavourite"
                    >
                        <i :class="{'fas fa-check': isFavourite, 'far fa-bookmark': !isFavourite}"></i>
                    </button>
                    <!--button type="button" class="btn btn-outline-info btn-feedback mr-2" @click="$emit('comment', course)">
                        <i class="far fa-comment"></i>
                    </button>
                    <share-button></share-button-->
                    <a v-if="!mobile" :href="redirectUrl" target="_blank" class="btn btn-outline-info flex-fill btn-link mr-2">
                        Записаться
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
    import UrlFunctions from '../../unsorted/UrlFunctions'

    export default {
        name: 'CourseCard',
        components: {
            SkillList,
            MatchedSkillList,
            SplitDescription,
            ShareButton
        },
        props: ['course', 'skills-in-filter', 'enums', 'mobile', 'show-full', 'is-favourite'],
        data() {
            return {
            }
        },
        computed: {
            redirectUrl() {
                return this.course.url || false;
            },
            pageUrl() {
                return UrlFunctions.makeItemUrl(this.course);
            },
            hasPartnerUrl: function () {
                return Boolean(this.course.partnerUrl);
            },
            originalDuration() {
                if (!this.course.duration) {
                    return false;
                }

                let readableDuration = TextFormat.getReadableValue(this.course.durationUnits, this.enums['durationUnits']);
                return this.course.duration + ' ' + TextFormat.declensionUnits(this.course.duration, readableDuration);
            },
            humanDuration() {
                if (!this.course.duration) {
                    return false;
                }

                let readableDuration = TextFormat.getReadableValue(this.course.durationUnits, this.enums['durationUnits']);
                return TextFormat.getHumanReadableTime(this.course.duration, readableDuration);
            },
            originalLoad() {
                if (!this.course.load) {
                    return false;
                }

                if (this.course.loadUnits === 'self') {
                    return 'Свободный график';
                }

                let readableLoad = TextFormat.getReadableValue(this.course.loadUnits, this.enums['loadUnits']);

                return this.course.load + ' ' + TextFormat.declensionUnits(this.course.load, readableLoad);
            },
            originalFormAndTime() {
                if (!this.course.form) {
                    return false;
                }

                let readableForms = this.course.form.map( (form) => TextFormat.getReadableValue(form, this.enums['forms']) );
                let formAndMaybeTime = TextFormat.lcfirstJoin(readableForms,'/');

                if (this.course.time) {
                    let readableTime = this.course.time.map( (time) => TextFormat.getReadableValue(time, this.enums['times']) );
                    formAndMaybeTime += ', ' + TextFormat.lcfirstJoin(readableTime, '/');
                }

                return formAndMaybeTime;
            },
            humanPrice() {
                if ( typeof(this.course.price) !== 'number') {
                    return 'Бесплатно';
                }

                let formattedPrice = TextFormat.formatNumber(this.course.price) + '&nbsp;&#8381;';

                if (this.course.priceType === 'lesson') {
                    formattedPrice += '/урок';
                }

                if (this.course.priceType === 'module') {
                    formattedPrice += '/модуль';
                }

                if (this.course.priceType === 'month') {
                    formattedPrice += '/месяц';
                }

                return this.course.price > 0 ? formattedPrice : 'Бесплатно';
            },
            allSkills() {
                return TextFormat.skillsToObjectList(this.course.skills);
            },
            allRequirements() {
                let hasCorrectRequirementsField = typeof(this.course.requirements) !== 'undefined' && this.course.requirements instanceof Array;
                if (!hasCorrectRequirementsField) {
                    return false;
                }

                let hasOneRequirement = this.course.requirements.length === 1;
                let hasDatabaseChangeGlitch = hasOneRequirement && typeof(this.course.requirements[0]) !== 'undefined' && this.course.requirements[0] === "";
                let processRequirements = this.course.requirements.length > 0 && !hasDatabaseChangeGlitch;

                return processRequirements ? TextFormat.skillsToObjectList(this.course.requirements) : false;
            },
            attributesLine() {
                let certificateShortNames = {
                    'Нет': 'Без сертификата',
                    'Собственный': 'Собственный',
                    'Гос. образца': 'Государственный',
                    'Международный': 'Международный'
                };
                let noCertificate = certificateShortNames['Нет'];

                let attributes = [];

                if (this.course.audience && this.course.audience.length > 0) {
                    let readableAudience = this.course.audience.map( (audience) => TextFormat.getReadableValue(audience, this.enums['audience']) );
                    attributes.push( TextFormat.lcfirstJoin(readableAudience, '/') );
                }

                if (this.course.format && this.course.format.length > 0) {
                    let readableFormats = this.course.format.map( (format) => TextFormat.getReadableValue(format, this.enums['formats']) );
                    attributes.push( TextFormat.lcfirstJoin(readableFormats, '/') );
                }

                attributes.push( this.course.hasTeacher ? 'С преподавателем' : 'Без преподавателя' );
                attributes.push( this.course.hasPractice ? 'С практикой' : 'Без практики' );

                if (this.course.jobPlacement) {
                    attributes.push('Помощь в трудоустройстве');
                }

                if (this.course.forKids) {
                    attributes.push('Подходит детям и школьникам');
                }

                if (this.course.certificate && this.course.certificate.length > 0) {
                    let certificateNames = this.course.certificate.map( (certificate) => {
                        return certificateShortNames[ TextFormat.getReadableValue(certificate, this.enums['certificates']) ];
                    });
                    attributes.push( TextFormat.lcfirstJoin(certificateNames, '/') + ' сертификат' );
                }
                else {
                    attributes.push(noCertificate);
                }

                return attributes;
            },
        },
        methods: {
            toggleFavourite() {
                this.$emit('favourite', this.item);
            },
        }
    }
</script>

<style>
    .course-card-text {
        font-family: Gilroy, sans-serif;
    }
</style>