<template>
    <div class="card course-card course-card-text" :class="{'take-a-look': isPopular}">
        <div class="card-img-top" v-if="item.imageUrl">
            <img :src="item.imageUrl">
        </div>
        <div class="card-body">
            <div v-if="mobile" class="d-flex flex-row align-items-center course-card-header">
                <span class="badge badge-course-info mr-2">{{cardTitle}}</span>
                <h6 class="text-muted flex-fill mb-0" v-if="item.author">{{item.author}}</h6>
                <a class="top-favourite-add" @click="toggleFavourite">
                    <i :class="{'fas': isFavourite, 'far': !isFavourite}" class="fa-bookmark"></i>
                </a>
            </div>
            <div v-else class="d-flex flex-row justify-content-between align-items-start">
                <span class="badge badge-course-info">{{cardTitle}}</span>
                <h6 class="text-muted text-muted flex-fill text-right" v-if="item.author">{{item.author}}</h6>
                <div class="d-flex flex-row justify-content-end course-card-header">
                    <a class="top-favourite-add" @click="toggleFavourite">
                        <i :class="{'fas': isFavourite, 'far': !isFavourite}" class="fa-bookmark"></i>
                    </a>
                </div>
            </div>

            <h5>{{item.title || ''}}</h5>

            <p class="text-info mt-1" v-if="item.audience">
                {{readableAudience}}
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
        name: 'BasicTextCard',
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
            }
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