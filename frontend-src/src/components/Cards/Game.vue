<template>
    <div class="card course-card course-card-text" :class="{'take-a-look': hasPartnerUrl}">
        <div class="card-body">
            <div v-if="mobile" class="d-flex flex-row align-items-center course-card-header">
                <span class="badge badge-course-info mr-2">Игра</span>
                <h6 class="text-muted flex-fill mb-0" v-if="item.author">{{item.author}}</h6>
                <a class="top-favourite-add" @click="toggleFavourite">
                    <i :class="{'fas': isFavourite, 'far': !isFavourite}" class="fa-bookmark"></i>
                </a>
            </div>
            <div v-else class="d-flex flex-row justify-content-between align-items-start">
                <span class="badge badge-course-info">Игра</span>
                <div class="d-flex flex-row justify-content-end course-card-header">
                    <h6 class="text-muted" v-if="item.author">{{item.author}}</h6>
                    <a class="top-favourite-add" @click="toggleFavourite">
                        <i :class="{'fas': isFavourite, 'far': !isFavourite}" class="fa-bookmark"></i>
                    </a>
                </div>
            </div>

            <h5>{{item.title || ''}}</h5>

            <p class="mt-0 mb-0 price" v-if="mobile"><span v-html="humanPrice"></span></p>

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

            <p v-if="item.description" class="mb-0 mt-4">
                <span v-html="item.description" v-if="showFull"></span>
                <split-description :text="item.description" :use-html="true" v-else></split-description>
            </p>

            <a :href="pageUrl" class="details-link" target="_blank" v-if="!showFull">Подробнее на странице игры</a>

            <div class="mt-4" :class="{'row': !mobile}">
                <div class="col price-duration-data" v-if="!mobile">
                    <p class="mt-0 mb-0 price"><span v-html="humanPrice"></span></p>
                </div>
                <div :class="{'course-buttons flex-fill d-flex flex-row mt-0 p-0': mobile, 'col course-buttons d-flex flex-row mt-1': !mobile}">
                    <a v-if="mobile" :href="redirectUrl" target="_blank" class="btn btn-outline-info flex-fill d-flex justify-content-center btn-link mr-2">
                        {{buttonTitle}}
                    </a>
                    <button class="btn btn-outline-info d-flex flex-row btn-favourite mr-2"
                            type="button"
                            :class="{'active': isFavourite}"
                            @click="toggleFavourite"
                    >
                        <i :class="{'fas fa-check': isFavourite, 'far fa-bookmark': !isFavourite}"></i>
                    </button>
                    <a v-if="!mobile" :href="redirectUrl" target="_blank" class="btn btn-outline-info flex-fill btn-link mr-2">
                        {{buttonTitle}}
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
    import TextFormat from '../../unsorted/TextFormat'
    import UrlFunctions from "../../unsorted/UrlFunctions"

    export default {
        name: 'GameCard',
        components: {
            SkillList,
            MatchedSkillList,
            SplitDescription,
        },
        props: ['item', 'skills-in-filter', 'enums', 'mobile', 'show-full', 'is-favourite'],
        data() {
            return {
            }
        },
        computed: {
            redirectUrl() {
                return this.item.url || false;
            },
            pageUrl() {
                return UrlFunctions.makeItemUrl(this.item);
            },
            hasPartnerUrl() {
                return Boolean(this.item.partnerUrl);
            },
            humanPrice() {
                if ( typeof(this.item.price) !== 'number') {
                    return 'Бесплатно';
                }

                let formattedPrice = TextFormat.formatNumber(this.item.price) + '&nbsp;&#8381;';

                return this.item.price > 0 ? formattedPrice : 'Бесплатно';
            },
            buttonTitle() {
                let hasWeb = this.item.platform && this.item.platform.indexOf('web') !== -1;
                if (hasWeb) {
                    return 'Играть';
                }

                return this.item.price > 0 ? 'Купить' : 'Скачать';
            },
            allSkills() {
                return TextFormat.skillsToObjectList(this.item.skills);
            },
            allRequirements() {
                return TextFormat.skillsToObjectList(this.item.requirements);
            },
            attributesLine() {
                let attributes = [];

                if (this.item.audience && this.item.audience.length > 0) {
                    let readableAudience = this.item.audience.map( (audience) => TextFormat.getReadableValue(audience, this.enums['audience']) );
                    attributes.push( TextFormat.lcfirstJoin(readableAudience, '/') );
                }

                if (this.item.platform && this.item.platform.length > 0) {
                    let readablePlatforms = this.item.platform.map( (platform) => TextFormat.getReadableValue(platform, this.enums['platform']) );
                    attributes.push( readablePlatforms.join('/') );
                }

                if (this.item.singlePlayer) {
                    attributes.push('Есть одиночная игра');
                }

                if (this.item.multiPlayer) {
                    attributes.push('Есть мультиплеер');
                }

                attributes.push( this.item.online ? 'Онлайн' : 'Оффлайн' );

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