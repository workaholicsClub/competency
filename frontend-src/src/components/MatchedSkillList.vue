<template>
    <div v-if="filteredSkills">
        <skill-list :skills="filteredSkills"></skill-list>

        <span v-if="additionalSkills">
            <a href="javascript: 0;" class="continue-toggle" v-if="additionalSkillsShown" @click="toggleAdditionalSkills">Спрятать</a>
            <a href="javascript: 0;" class="continue-toggle" v-else @click="toggleAdditionalSkills">Показать все</a>
            <span class="continue" v-if="additionalSkillsShown">
                <skill-list :skills="additionalSkills"></skill-list>
            </span>
        </span>
    </div>
    <div v-else>
        <skill-list :skills="allSkills"></skill-list>
    </div>
</template>

<script>
    import SkillList from './SkillList.vue'
    import TextFormat from '../unsorted/TextFormat'

    export default {
        name: 'MatchedSkillList',
        components: {
            SkillList
        },
        props: ['skills', 'skills-in-filter'],
        data() {
            return {
                additionalSkillsShown: false
            }
        },
        methods: {
            toggleAdditionalSkills() {
                this.additionalSkillsShown = !this.additionalSkillsShown;
            },
        },
        computed: {
            filteredSkills() {
                let isFilterSkillsDefined = this.skillsInFilter instanceof Array && this.skillsInFilter.length > 0;

                if ( !isFilterSkillsDefined ) {
                    return false;
                }

                return this.skills.filter( (skill) => this.skillsInFilter.indexOf(skill.name) !== -1 );
            },
            additionalSkills() {
                if (!this.filteredSkills) {
                    return false;
                }

                let additionalSkills = this.skills.filter( (skill) => this.skillsInFilter.indexOf(skill.name) === -1 );

                if (additionalSkills.length === 0) {
                    return false;
                }

                return additionalSkills;
            },
            allSkills() {
                return TextFormat.skillsToObjectList(this.skills);
            },
        }
    }
</script>