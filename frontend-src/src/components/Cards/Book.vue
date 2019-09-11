<template>
    <div class="card course-card course-card-text" :class="{'take-a-look': hasPartnerUrl, 'swiper-slide': mobile}">
        <div class="card-body">
            <div v-if="mobile" class="d-flex flex-row align-items-center course-card-header">
                <span class="badge badge-course-info mr-2">Книга</span>
                <h6 class="text-muted flex-fill mb-0" v-if="book.author">{{book.author}}</h6>
                <a class="top-favourite-add" @click="toggleFavourite">
                    <i :class="{'fas': isFavourited, 'far': !isFavourited}" class="fa-bookmark"></i>
                </a>
            </div>
            <div v-else class="d-flex flex-row justify-content-between align-items-start">
                <span class="badge badge-course-info">Книга</span>
                <div class="d-flex flex-row justify-content-end course-card-header">
                    <h6 class="text-muted" v-if="book.author">{{book.author}}</h6>
                    <a class="top-favourite-add" @click="toggleFavourite">
                        <i :class="{'fas': isFavourited, 'far': !isFavourited}" class="fa-bookmark"></i>
                    </a>
                </div>
            </div>

            <h5>{{book.title || ''}}</h5>

            <p class="mt-0 mb-0 price" v-if="mobile"><span v-html="humanPrice"></span></p>

            <p class="text-info mt-1">
                {{attributesLine.join('&nbsp;&bull;&nbsp;')}}
            </p>

            <div v-if="allSkills">
                <label class="mt-1 mb-0">После прочтения будете знать</label>
                <matched-skill-list :skills="allSkills" :skills-in-filter="skillsInFilter"></matched-skill-list>
            </div>

            <div v-if="allRequirements">
                <label class="mt-1 mb-0">Нужно знать</label>
                <skill-list :skills="allRequirements"></skill-list>
            </div>

            <p v-if="book.description" class="mb-0">
                <split-description :text="book.description"></split-description>
            </p>

            <div class="mt-4" :class="{'row': !mobile}">
                <div class="col price-duration-data" v-if="!mobile">
                    <p class="mt-0 mb-0 price"><span v-html="humanPrice"></span></p>
                </div>
                <div :class="{'course-buttons flex-fill d-flex flex-row mt-0 p-0': mobile, 'col course-buttons d-flex flex-row mt-1': !mobile}">
                    <a v-if="mobile" :href="redirectUrl" class="btn btn-outline-info flex-fill d-flex justify-content-center btn-link mr-2">
                        {{buttonTitle}}
                    </a>
                    <button class="btn btn-outline-info d-flex flex-row btn-favourite mr-2"
                            type="button"
                            :class="{'active': isFavourited}"
                            @click="toggleFavourite"
                    >
                        <i :class="{'fas fa-check': isFavourited, 'far fa-bookmark': !isFavourited}"></i>
                    </button>
                    <share-button></share-button>
                    <a v-if="!mobile" :href="redirectUrl" class="btn btn-outline-info flex-fill btn-link mr-2">
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
    import ShareButton from '../ShareButton'
    import TextFormat from '../../unsorted/TextFormat'

    export default {
        name: 'BookCard',
        components: {
            SkillList,
            MatchedSkillList,
            SplitDescription,
            ShareButton
        },
        props: ['book', 'skills-in-filter', 'enums', 'mobile'],
        data() {
            return {
                isFavourited: false,
            }
        },
        computed: {
            redirectUrl() {
                return this.book.url || false;
            },
            pageUrl() {
                return "/book.html?id=" + this.book.id || false;
            },
            hasPartnerUrl() {
                return Boolean(this.book.partnerUrl);
            },
            humanPrice() {
                if ( typeof(this.book.price) !== 'number') {
                    return 'Бесплатно';
                }

                let formattedPrice = TextFormat.formatNumber(this.book.price) + '&nbsp;&#8381;';

                return this.book.price > 0 ? formattedPrice : 'Бесплатно';
            },
            buttonTitle() {
                return this.book.price > 0 ? 'Купиить' : 'Скачать';
            },
            allSkills() {
                return TextFormat.skillsToObjectList(this.book.skills);
            },
            allRequirements() {
                return TextFormat.skillsToObjectList(this.book.requirements);
            },
            attributesLine() {
                let attributes = [];

                if (this.book.audience && this.book.audience.length > 0) {
                    let readableAudience = this.book.audience.map( (audience) => TextFormat.getReadableValue(audience, this.enums['audience']) );
                    attributes.push( TextFormat.lcfirstJoin(readableAudience, '/') );
                }

                if (this.book.format && this.book.format.length > 0) {
                    let readableFormats = this.book.format.map( (format) => TextFormat.getReadableValue(format, this.enums['formats']) );
                    attributes.push( TextFormat.lcfirstJoin(readableFormats, '/') );
                }

                return attributes;
            },
        },
        methods: {
            toggleFavourite() {
                this.isFavourited = !this.isFavourited;
            },
        }
    }
</script>