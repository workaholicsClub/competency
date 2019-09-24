<template>
    <div :class="{'swiper-slide': mobile}">
        <course-card
                v-if="item.type === 'course'"
                :course="item"
                :enums="enums.course"
                :mobile="mobile"
                :skills-in-filter="skillsInFilter"
                :is-favourite="isFavourite"
                @favourite="$emit('favourite', item)"
        >
        </course-card>

        <book-card
                v-if="item.type === 'book'"
                :book="item"
                :enums="enums.book"
                :mobile="mobile"
                :is-favourite="isFavourite"
                @favourite="$emit('favourite', item)"
        >
        </book-card>

        <project-card
                v-if="item.type === 'project'"
                :item="item" :enums="enums.project"
                :mobile="mobile"
                card-title="Идея проекта"
                :is-favourite="isFavourite"
                @favourite="$emit('favourite', item)"
        >
        </project-card>

        <explain-card
                v-if="item.type === 'explanation'"
                :item="item"
                :enums="enums.explanation"
                :mobile="mobile"
                card-title="Объяснение"
                :is-favourite="isFavourite"
                @favourite="$emit('favourite', item)"
        >
        </explain-card>

        <motivation-card
                v-if="item.type === 'motivation'"
                :item="item"
                :enums="enums.motivation"
                :mobile="mobile"
                card-title="Мотивация"
                :is-favourite="isFavourite"
                @favourite="$emit('favourite', item)"
        >
        </motivation-card>

        <internship-card
                v-if="item.type === 'internship'"
                :internship="item"
                :enums="enums.internship"
                :mobile="mobile"
                :is-favourite="isFavourite"
                @favourite="$emit('favourite', item)"
        >
        </internship-card>
    </div>
</template>

<script>
    import CourseCard from './Course.vue'
    import BookCard from './Book.vue'
    import ProjectCard from './BasicText.vue'
    import ExplainCard from './BasicText.vue'
    import MotivationCard from './BasicText.vue'
    import InternshipCard from './Internship.vue'
    import Enums from "../../unsorted/Enums";

    export default {
        name: 'AutodetectCard',
        props: ['item', 'skills-in-filter', 'mobile', 'is-favourite'],
        components: {
            CourseCard,
            BookCard,
            ProjectCard,
            ExplainCard,
            MotivationCard,
            InternshipCard
        },
        data() {
            return {
                enums: Enums
            }
        },
        computed: {

        }
    }
</script>