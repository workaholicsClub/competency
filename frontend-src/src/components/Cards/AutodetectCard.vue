<template>
    <component :is="mobile && correctType ? 'swiper-slide' : 'div'" :class="item.type+'-item'">
        <course-card
                v-if="item.type === 'course'"
                :course="item"
                :enums="enums.course"
                :mobile="mobile"
                :show-full="showFull"
                :skills-in-filter="skillsInFilter"
                :is-favourite="isFavourite"
                @favourite="emitFavourite(item)"
        >
        </course-card>

        <book-card
                v-if="item.type === 'book'"
                :book="item"
                :enums="enums.book"
                :mobile="mobile"
                :show-full="showFull"
                :is-favourite="isFavourite"
                @favourite="emitFavourite(item)"
        >
        </book-card>

        <project-card
                v-if="item.type === 'project'"
                :item="item" :enums="enums.project"
                :mobile="mobile"
                :show-full="showFull"
                card-title="Идея проекта"
                :is-favourite="isFavourite"
                @favourite="emitFavourite(item)"
        >
        </project-card>

        <explain-card
                v-if="item.type === 'explain'"
                :item="item"
                :enums="enums.explanation"
                :mobile="mobile"
                :show-full="showFull"
                card-title="Объяснение"
                :is-favourite="isFavourite"
                @favourite="emitFavourite(item)"
        >
        </explain-card>

        <motivation-card
                v-if="item.type === 'motivation'"
                :item="item"
                :enums="enums.motivation"
                :mobile="mobile"
                :show-full="showFull"
                card-title="Мотивация"
                :is-favourite="isFavourite"
                @favourite="emitFavourite(item)"
        >
        </motivation-card>

        <homework-card
                v-if="item.type === 'homework'"
                :item="item"
                :enums="enums.homework"
                :mobile="mobile"
                :show-full="showFull"
                card-title="Домашка"
                :is-favourite="isFavourite"
                @favourite="emitFavourite(item)"
        >
        </homework-card>

        <internship-card
                v-if="item.type === 'internship'"
                :internship="item"
                :enums="enums.internship"
                :mobile="mobile"
                :show-full="showFull"
                :is-favourite="isFavourite"
                @favourite="emitFavourite(item)"
        >
        </internship-card>

        <app-card
                v-if="item.type === 'app'"
                :item="item"
                :enums="enums.app"
                :mobile="mobile"
                :show-full="showFull"
                :is-favourite="isFavourite"
                @favourite="emitFavourite(item)"
        >
        </app-card>

    </component>
</template>

<script>
    import CourseCard from './Course.vue'
    import BookCard from './Book.vue'
    import ProjectCard from './BasicText.vue'
    import ExplainCard from './BasicText.vue'
    import MotivationCard from './BasicText.vue'
    import HomeworkCard from './BasicText.vue'
    import InternshipCard from './Internship.vue'
    import AppCard from './App.vue'
    import Enums from "../../unsorted/Enums";

    export default {
        name: 'AutodetectCard',
        props: ['item', 'skills-in-filter', 'mobile', 'show-full', 'is-favourite'],
        components: {
            CourseCard,
            BookCard,
            ProjectCard,
            ExplainCard,
            MotivationCard,
            HomeworkCard,
            InternshipCard,
            AppCard
        },
        data() {
            return {
                enums: Enums
            }
        },
        methods: {
            emitFavourite(item) {
                this.$emit('favourite', item);
            }
        },
        computed: {
            correctType() {
                let availableTypes = Enums.types.map( item => item.code );
                return availableTypes.indexOf(this.item.type) !== -1;
            }
        }
    }
</script>