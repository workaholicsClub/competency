<template>
    <div class="skill-input">
        <autocomplete ref="autocomplete" :search="searchSkill" @submit="addSkill" placeholder="Добавить навык"></autocomplete>
        <div class="skills-list mt-2">
            <label v-for="skill in allSkills" class="btn btn-outline-primary btn-skill-toggle skill" :class="{'active': isSelected(skill)}" :key="skill">
                {{skill}}
                <input type="checkbox" v-model="selectedSkills" :value="skill">
            </label>
        </div>
    </div>
</template>

<script>
    import Autocomplete from '@trevoreyre/autocomplete-vue'
    import '@trevoreyre/autocomplete-vue/dist/style.css'

    export default {
        name: 'SkillInput',
        props: ['value', 'skills'],
        components: {
            Autocomplete
        },
        data() {
            return {
                selectedSkills: [],
                allSkills: this.value || [],
            }
        },
        watch: {
            selectedSkills() {
                this.$emit('input', this.selectedSkills);
            }
        },
        methods: {
            searchSkill(input) {
                if (input.length < 1) {
                    return [];
                }

                return this.skillNames.filter( (skillName) => skillName.toLowerCase().indexOf(input.toLowerCase()) !== -1 );
            },
            isSelected(skill) {
                return this.selectedSkills.indexOf(skill) !== -1;
            },
            addSkill(selectedSkill) {
                this.selectedSkills.push(selectedSkill);
                this.allSkills.push(selectedSkill);
                this.$refs.autocomplete.setValue('');
                this.$emit('input', this.selectedSkills);
            },
        },
        computed: {
            skillNames() {
                return this.skills ? this.skills.map( (skill) => skill.name ) : [];
            }
        }
    }
</script>

<style>
    .skill-input .autocomplete-input {
        border-radius: 4px;
        border: solid 1px #cfd7de;
        background-color: #ffffff;
    }

    .skill-input .autocomplete-input::placeholder {
        color: #a3afbc;
        font-size: 0.9em;
    }

    .skill-input .autocomplete-result {
        background-image: none;
    }
    .skill-input .autocomplete-result:hover {
        background-image: none;
        background-color: #ffcc00;
    }
</style>