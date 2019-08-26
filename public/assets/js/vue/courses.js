Vue.component('skill', {
    template: '#skill-template',
    props: ['skill'],
    data() {
        return {
        }
    },
    methods: {
    }
});

let vueInstance = new Vue({
    el: '#app-root',
    data: {
        neededSkills: [],
        existingSkills: [],
        isFavouritesShown: false,
        isRequestShown: {
            profession: false,
            exp: false,
            want: false,
        },
    },
    watch: {
        existingSkills: {
            handler() {
                debouncedUpdateCourses();
            },
            deep: true
        },
        neededSkills: {
            handler() {
                debouncedUpdateCourses();
            },
            deep: true
        }
    },
    methods: {
        toggleRequest(block) {
            this.isRequestShown[block] = !this.isRequestShown[block];
            let otherBlocks = Object.keys(this.isRequestShown).filter(otherBlock => otherBlock !== block);
            otherBlocks.forEach(otherBlock => {
                this.isRequestShown[otherBlock] = false;
            });
        },
        toggleFavourites() {
            this.isFavouritesShown = !this.isFavouritesShown;
        },
        findSkill(skills, title) {
            let results = skills.filter((skill) => skill.title === title);
            return results.length > 0 ? results[0] : false;
        },
        removeSkill(skills, title) {
            let skillToRemove = this.findSkill(skills, title);
            if (!skillToRemove) {
                return false;
            }

            let index = skills.indexOf(skillToRemove);
            skills.splice(index, 1);
            return skillToRemove;
        },
        addSkill(skills, title) {
            let removedSkill = this.removeNeededSkill(title);
            if (!removedSkill) {
                removedSkill = this.removeExistingSkill(title);
            }

            let skillData = removedSkill;

            if (!skillData) {
                skillData = {
                    title: title,
                    level: 1,
                    rate: 0,
                    userAdded: true,
                    checked: true
                };
            }
            else {
                skillData.checked = true;
                skillData.userAdded = true;
            }

            skills.push(skillData);
        },
        findNeededSkill(title) {
            return this.findSkill(this.neededSkills, title);
        },
        findExistingSkill(title) {
            return this.findSkill(this.existingSkills, title);
        },
        removeNeededSkill(title) {
            return this.removeSkill(this.neededSkills, title);
        },
        removeExistingSkill(title) {
            return this.removeSkill(this.existingSkills, title);
        },
        addNeededSkill(title) {
            return this.addSkill(this.neededSkills, title);
        },
        addExistingSkill(title) {
            return this.addSkill(this.existingSkills, title);
        }
    }
});