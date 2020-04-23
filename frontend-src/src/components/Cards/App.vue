<template>
    <div class="card course-card course-card-text" :class="{'take-a-look': isPopular}">
        <div class="card-img-top" v-if="item.imageUrl">
            <img :src="item.imageUrl">
        </div>
        <div class="card-body">
            <div v-if="mobile" class="d-flex flex-row align-items-center course-card-header">
                <span class="badge badge-course-info mr-2">Приложение</span>
                <h6 class="text-muted flex-fill mb-0" v-if="item.author && item.siteUrl"><a :href="item.siteUrl" target="_blank">{{item.author}}</a></h6>
                <h6 class="text-muted flex-fill mb-0" v-else-if="item.author">{{item.author}}</h6>


                <a class="top-favourite-add" @click="toggleFavourite">
                    <i :class="{'fas': isFavourite, 'far': !isFavourite}" class="fa-bookmark"></i>
                </a>
            </div>
            <div v-else class="d-flex flex-row justify-content-between align-items-start">
                <span class="badge badge-course-info">Приложение</span>
                <h6 class="text-muted flex-fill text-right" v-if="item.author && item.siteUrl"><a :href="item.siteUrl" target="_blank">{{item.author}}</a></h6>
                <h6 class="text-muted flex-fill text-right" v-else-if="item.author">{{item.author}}</h6>


                <div class="d-flex flex-row justify-content-end course-card-header">
                    <a class="top-favourite-add" @click="toggleFavourite">
                        <i :class="{'fas': isFavourite, 'far': !isFavourite}" class="fa-bookmark"></i>
                    </a>
                </div>
            </div>

            <h5>{{item.title || ''}}</h5>

            <p class="mt-0 mb-0 price" v-if="mobile"><span v-html="humanPrice"></span></p>

            <p class="text-info mt-1" v-if="item.audience">
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

            <div v-if="item.description" class="mb-0 mt-4">
                <span v-html="item.description" v-if="showFull"></span>
                <split-description :text="item.description" :use-html="true" v-else></split-description>
            </div>

            <a :href="pageUrl" class="details-link" target="_blank" v-if="!showFull">Подробнее на странице записи</a>

            <div class="mt-4" :class="{'row': !mobile}">
                <div class="col price-duration-data" v-if="!mobile">
                    <p class="mt-0 mb-0 price"><span v-html="humanPrice"></span></p>
                </div>
                <div class="course-buttons d-flex flex-row justify-content-end"
                     :class="{'flex-fill mt-0 p-0': mobile, 'col mt-1': !mobile}">

                    <span v-if="mobile">
                        <a v-for="(button, index) in downloadButtons"
                                :href="button.url"
                                target="_blank"
                                class="btn btn-outline-info mr-2"
                                :key="'u'+index"
                                :class="{'btn-link': button.isHighlighted, 'btn-share': !button.isHighlighted}">
                            <i :class="button.icon"></i>
                        </a>
                    </span>

                    <button class="btn btn-outline-info d-flex flex-row btn-favourite mr-2"
                            type="button"
                            :class="{'active': isFavourite}"
                            @click="toggleFavourite"
                    >
                        <i :class="{'fas fa-check': isFavourite, 'far fa-bookmark': !isFavourite}"></i>
                    </button>

                    <span v-if="!mobile">
                        <a v-for="(button, index) in downloadButtons"
                                :href="button.url"
                                target="_blank"
                                class="btn btn-outline-info mr-2"
                                :key="'l'+index"
                                :class="{'btn-link flex-fill': button.isHighlighted, 'btn-share': !button.isHighlighted}">
                            {{button.text}} <i :class="button.icon"></i>
                        </a>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import SkillList from '../SkillList.vue'
    import MatchedSkillList from '../MatchedSkillList.vue'
    import SplitDescription from '../SplitDescription.vue'
    import TextFormat from '../../unsorted/TextFormat'
    import UrlFunctions from "../../unsorted/UrlFunctions";
    import Enums from "../../unsorted/Enums";

    export default {
        name: 'AppCard',
        components: {
            SkillList,
            MatchedSkillList,
            SplitDescription,
        },
        props: ['item', 'skills-in-filter', 'enums', 'mobile', 'show-full', 'card-title', 'is-favourite'],
        data() {
            return {
            }
        },
        methods: {
            toggleFavourite() {
                this.$emit('favourite', this.item);
            },
            detectMobileOS() {
                let userAgent = navigator.userAgent || navigator.vendor || window.opera;

                if (/windows phone/i.test(userAgent)) {
                    return "Windows Phone";
                }

                if (/android/i.test(userAgent)) {
                    return "Android";
                }

                if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
                    return "iOS";
                }

                return false;
            },
            detectPlatforms() {
                let platform = this.detectMobileOS();
                return {
                    android: platform === 'Android',
                    ios: platform === 'iOS',
                    windows: platform === 'Windows Phone',
                    web: platform === false
                }
            }
        },
        computed: {
            pageUrl() {
                return UrlFunctions.makeItemUrl(this.item);
            },
            readableAudience() {
                let readableAudience = this.item.audience.map( (audience) => TextFormat.getReadableValue(audience, Enums.audience) );
                return TextFormat.lcfirstJoin(readableAudience, '/');
            },
            allSkills() {
                let hasSkills = this.item.skills && this.item.skills.length > 0;
                if (!hasSkills) {
                    return false;
                }

                return TextFormat.skillsToObjectList(this.item.skills);
            },
            allRequirements() {
                let hasRequirements = this.item.requirements && this.item.requirements.length > 0;
                if (!hasRequirements) {
                    return false;
                }

                return TextFormat.skillsToObjectList(this.item.requirements);
            },
            isPopular() {
                return false;
            },
            downloadButtons() {
                let buttons = [
                    {code: 'android', icon: 'fab fa-google-play', text: 'Скачать', isHighlighted: false, url: this.item.googlePlayUrl},
                    {code: 'ios', icon: 'fab fa-apple', text: 'Скачать', isHighlighted: false, url: this.item.appStoreUrl},
                    {code: 'windows', icon: 'fab fa-microsoft', text: 'Скачать', isHighlighted: false, url: this.item.microsoftStoreUrl},
                    {code: 'web', icon: 'fas fa-globe', text: 'Перейти', isHighlighted: false, url: this.item.webVersionUrl},
                ];
                let platforms = this.detectPlatforms();

                let buttonsWithLinks = buttons.filter( button => button.url && button.url.length > 0 );

                if (buttonsWithLinks.length === 0) {
                    return [];
                }

                buttonsWithLinks.sort( (buttonA, buttonB) => {
                    if ( platforms[ buttonA.code ] === true) {
                        return -1;
                    }

                    if ( platforms[ buttonB.code ] === true) {
                        return 1;
                    }

                    return 0;
                });

                let firstButtonCode = buttonsWithLinks[0].code;
                let isCurrentPlatform = platforms[firstButtonCode] === true;

                if (isCurrentPlatform) {
                    buttonsWithLinks[0].isHighlighted = true;
                }

                buttonsWithLinks = buttonsWithLinks.map( (button, index) => {
                    if (index !== 0) {
                        button.text = '';
                    }

                    return button;
                });

                return buttonsWithLinks;
            },
            humanPrice() {
                if ( typeof(this.item.price) !== 'number') {
                    return 'Бесплатно';
                }

                let formattedPrice = TextFormat.formatNumber(this.item.price) + '&nbsp;&#8381;';

                return this.item.price > 0 ? formattedPrice : 'Бесплатно';
            },
            attributesLine() {
                let attributes = [];

                if (this.item.audience && this.item.audience.length > 0) {
                    attributes.push( this.readableAudience );
                }

                if (this.item.isGame) {
                    attributes.push('Игровой формат');
                }

                if (this.item.forKids) {
                    attributes.push('Подходит детям и школьникам');
                }

                return attributes;
            },
        }
    }
</script>
<style>
    .card-img-top {
        max-height: 25rem;
        overflow: hidden;
    }
    .card-img-top img {
        width: 100%;
    }

</style>