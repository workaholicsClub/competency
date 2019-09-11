<template>
    <div class="card course-card course-card-text" :class="{'take-a-look': isPopular, 'swiper-slide': mobile}">
        <div class="card-body">
            <div v-if="mobile" class="d-flex flex-row align-items-center course-card-header">
                <span class="badge badge-course-info mr-2">{{cardTitle}}</span>
                <a class="top-favourite-add" @click="toggleFavourite">
                    <i :class="{'fas': isFavourited, 'far': !isFavourited}" class="fa-bookmark"></i>
                </a>
            </div>
            <div v-else class="d-flex flex-row justify-content-between align-items-start">
                <span class="badge badge-course-info">{{cardTitle}}</span>
                <div class="d-flex flex-row justify-content-end course-card-header">
                    <a class="top-favourite-add" @click="toggleFavourite">
                        <i :class="{'fas': isFavourited, 'far': !isFavourited}" class="fa-bookmark"></i>
                    </a>
                </div>
            </div>

            <h5>{{item.title || ''}}</h5>

            <div v-if="allSkills">
                <label class="mt-1 mb-0">Какие навыки можно прокачать</label>
                <matched-skill-list :skills="allSkills" :skills-in-filter="skillsInFilter"></matched-skill-list>
            </div>

            <div v-if="allRequirements">
                <label class="mt-1 mb-0">Какие навыки нужны</label>
                <skill-list :skills="allRequirements"></skill-list>
            </div>

            <div v-if="item.description" class="mb-0 mt-4">
                <span v-html="item.description"></span>
            </div>

            <div class="mt-4" :class="{'row': !mobile}">
                <div class="col price-duration-data" v-if="!mobile">
                </div>
                <div class="course-buttons d-flex flex-row justify-content-end"
                     :class="{'flex-fill mt-0 p-0': mobile, 'col mt-1': !mobile}">
                    <button class="btn btn-outline-info d-flex flex-row btn-favourite mr-2"
                            type="button"
                            :class="{'active': isFavourited}"
                            @click="toggleFavourite"
                    >
                        <i :class="{'fas fa-check': isFavourited, 'far fa-bookmark': !isFavourited}"></i>
                    </button>
                    <share-button></share-button>
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
        name: 'BasicTextCard',
        components: {
            SkillList,
            MatchedSkillList,
            SplitDescription,
            ShareButton
        },
        props: ['item', 'skills-in-filter', 'enums', 'mobile', 'card-title'],
        data() {
            return {
                isFavourited: false,
            }
        },
        methods: {
            toggleFavourite() {
                this.isFavourited = !this.isFavourited;
            },
        },
        computed: {
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