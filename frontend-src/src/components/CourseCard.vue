<template>
    <div class="card course-card course-card-text" :class="{'take-a-look': hasPartnerUrl, 'swiper-slide': mobile}">
        <div class="card-body">
            <div v-if="mobile" class="d-flex flex-row align-items-center course-card-header">
                <span class="badge badge-course-info mr-2">Курс</span>
                <h6 class="text-muted flex-fill mb-0" v-if="course.platform">от <a :href="redirectUrl">{{course.platform}}</a></h6>
                <a class="top-favourite-add" @click="toggleFavourite">
                    <i :class="{'fas': isFavourited, 'far': !isFavourited}" class="fa-bookmark"></i>
                </a>
            </div>
            <div v-else class="d-flex flex-row justify-content-between align-items-start">
                <span class="badge badge-course-info">Курс</span>
                <div class="d-flex flex-row justify-content-end course-card-header">
                    <h6 class="text-muted" v-if="course.platform">от <a :href="redirectUrl">{{course.platform}}</a></h6>
                    <a class="top-favourite-add" @click="toggleFavourite">
                        <i :class="{'fas': isFavourited, 'far': !isFavourited}" class="fa-bookmark"></i>
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
                <div v-if="filteredSkills">
                    <label class="mt-1 mb-0">По окончании будете уметь</label>
                    <p>
                        <skill-list :skills="filteredSkills"></skill-list>

                        <span v-if="additionalSkills">
                            <a class="continue-toggle" v-if="additionalSkillsShown" @click="toggleAdditionalSkills">Показать все</a>
                            <a class="continue-toggle" v-else @click="toggleAdditionalSkills">Спрятать</a>
                            <span class="continue" v-if="additionalSkillsShown">
                                <skill-list :skills="additionalSkills"></skill-list>
                            </span>
                        </span>
                    </p>
                </div>
                <div v-else>
                    <label class="mt-1 mb-0">По окончании будете уметь</label>
                    <p>
                        <skill-list :skills="allSkills"></skill-list>
                    </p>
                </div>
            </div>

            <div v-if="allRequirements">
                <label class="mt-1 mb-0">Нужно знать</label>
                <p>
                    <skill-list :skills="allRequirements"></skill-list>
                </p>
            </div>

            <p v-if="splitDescription.visible">
                {{splitDescription.visible}}
                <span v-if="splitDescription.hidden">
                    <a href="javascript:0;" class="continue-toggle d-flex justify-content-end flex-column" @click="toggleHiddenDescription" v-if="!hiddenDescriptionShown">
                        <i class="fas fa-angle-down"></i>
                    </a>
                    <span class="continue" v-if="hiddenDescriptionShown">{{splitDescription.hidden}}</span>
                </span>
            </p>
            <a :href="pageUrl" class="details-link" v-if="splitDescription.visible">Подробнее на странице курса</a>

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
                            :class="{'active': isFavourited}"
                            @click="toggleFavourite"
                    >
                        <i :class="{'fas fa-check': isFavourited, 'far fa-bookmark': !isFavourited}"></i>
                    </button>
                    <button type="button" class="btn btn-outline-info btn-feedback mr-2">
                        <i class="far fa-comment"></i>
                    </button>
                    <button type="button" class="btn btn-outline-info btn-share mr-2">
                        <i class="fas fa-share-alt"></i>
                        <ul class="share-menu dropdown-menu">
                            <li class="dropdown-item"><a data-social="vkontakte">Вконтакте</a></li>
                            <li class="dropdown-item"><a data-social="facebook">Facebook</a></li>
                            <li class="dropdown-item"><a data-social="twitter">Twitter</a></li>
                            <li class="dropdown-item"><a data-social="whatsapp">WhatsApp</a></li>
                            <li class="dropdown-item"><a data-social="telegram">Telegram</a></li>
                        </ul>
                    </button>
                    <a v-if="!mobile" :href="redirectUrl" class="btn btn-outline-info flex-fill btn-link mr-2">
                        Записаться
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import SkillList from './SkillList.vue'
    import TextFormat from '../unsorted/TextFormat'

    export default {
        name: 'CourseCard',
        components: {
            SkillList
        },
        props: ['course', 'filter-skills', 'enums', 'mobile'],
        data() {
            return {
                isFavourited: false,
                additionalSkillsShown: false,
                hiddenDescriptionShown: false,
            }
        },
        computed: {
            redirectUrl() {
                return this.course.url || false;
            },
            pageUrl() {
                return "/course.html?id="+this.course.id || false;
            },
            hasPartnerUrl() {
                return Boolean(this.course.partnerUrl);
            },
            originalDuration() {
                if (!this.course.duration) {
                    return false;
                }

                let readableDuration = this.getReadableValue(this.course.durationUnits, 'durationUnits');
                return this.course.duration + ' ' + TextFormat.declensionUnits(this.course.duration, readableDuration);
            },
            humanDuration() {
                if (!this.course.duration) {
                    return false;
                }

                let readableDuration = this.getReadableValue(this.course.durationUnits, 'durationUnits');
                return TextFormat.getHumanReadableTime(this.course.duration, readableDuration);
            },
            originalLoad() {
                if (!this.course.load) {
                    return false;
                }

                if (this.course.loadUnits === 'self') {
                    return 'Свободный график';
                }

                let readableLoad = this.getReadableValue(this.course.loadUnits, 'loadUnits');

                return this.course.load + ' ' + TextFormat.declensionUnits(this.course.load, readableLoad);
            },
            originalFormAndTime() {
                if (!this.course.form) {
                    return false;
                }

                let readableForms = this.course.form.map( (form) => this.getReadableValue(form, 'forms') );
                let formAndMaybeTime = TextFormat.lcfirstJoin(readableForms,'/');

                if (this.course.time) {
                    let readableTime = this.course.time.map( (time) => this.getReadableValue(time, 'times') );
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
            filteredSkills() {
                let isFilterSkillsDefined = this.filterSkills instanceof Array && this.filterSkills.length > 0;

                if ( !isFilterSkillsDefined ) {
                    return false;
                }

                return [];
            },
            additionalSkills() {
                if (!this.filteredSkills) {
                    return false;
                }

                return [];
            },
            allSkills() {
                return this.skillsToObjectList(this.course.skills);
            },
            allRequirements() {
                return this.skillsToObjectList(this.course.requirements);
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
                    let readableAudience = this.course.audience.map( (audience) => this.getReadableValue(audience, 'audience') );
                    attributes.push( TextFormat.lcfirstJoin(readableAudience, '/') );
                }

                if (this.course.format && this.course.format.length > 0) {
                    let readableFormats = this.course.format.map( (format) => this.getReadableValue(format, 'formats') );
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
                        return certificateShortNames[ this.getReadableValue(certificate, 'certificates') ];
                    });
                    attributes.push( TextFormat.lcfirstJoin(certificateNames, '/') + ' сертификат' );
                }
                else {
                    attributes.push(noCertificate);
                }

                return attributes;
            },
            splitDescription() {
                if (!this.course.description) {
                    return {
                        visible: false,
                        hidden: false
                    };
                }

                let wordLimit = 25;
                let words = this.course.description.split(" ");
                let visible = this.course.description;
                let hidden = false;

                if (words.length > wordLimit) {
                    visible = words.slice(0, wordLimit).join(" ");
                    hidden = words.slice(wordLimit).join(" ");
                }

                return {
                    visible: visible,
                    hidden: hidden
                };
            }
        },
        methods: {
            toggleFavourite() {
                this.isFavourited = !this.isFavourited;
            },
            toggleAdditionalSkills() {
                this.additionalSkillsShown = !this.additionalSkillsShown;
            },
            toggleHiddenDescription() {
                this.hiddenDescriptionShown = !this.hiddenDescriptionShown;
            },
            getReadableValue(value, type) {
                if (!this.enums[type]) {
                    return value;
                }

                return this.enums[type].reduce( (previousValue, enumValue) => {
                    if (enumValue.code === value) {
                        return enumValue.title;
                    }

                    return previousValue;
                }, value);
            },
            skillsToObjectList(maybeKeyValueObjectOrStringList) {
                let isList = maybeKeyValueObjectOrStringList instanceof Array;
                let isObjectList = isList && maybeKeyValueObjectOrStringList[0] instanceof Object;
                let isStringList = isList && typeof(maybeKeyValueObjectOrStringList[0]) === 'string';

                if (!isList) {
                    return false;
                }

                if (isObjectList) {
                    return maybeKeyValueObjectOrStringList;
                }

                if (isStringList) {
                    return maybeKeyValueObjectOrStringList.map( (skillName) => {
                        return {
                            name: skillName,
                            level: 0
                        };
                    });
                }

                return Object.keys(maybeKeyValueObjectOrStringList, (skillName) => {
                    let skillLevel = maybeKeyValueObjectOrStringList[skillName];

                    return {
                        name: skillName,
                        level: skillLevel,
                    }
                });
            }
        }
    }
</script>

<style>
    .course-card-text {
        font-family: Gilroy, sans-serif;
    }
</style>