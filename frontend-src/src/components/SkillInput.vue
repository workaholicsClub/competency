<template>
    <div class="skill-input">

        <div v-if="useInFilter">
            <div class="skills-input-wrapper">
                <div class="skills-list checkbox-group">
                    <label v-for="skill in allSkills" class="btn btn-outline-primary btn-skill-toggle skill" :class="{'active': isSelected(skill)}" :key="skill+'-filter'">
                        {{skill}}
                        <input type="checkbox" v-model="selectedSkills" :value="skill" @change="selectionChanged(skill)">
                    </label>
                </div>

                <span class="add-skill-wrapper form-inline d-inline-flex mt-2 mb-2" v-if="showAddField">
                    <autocomplete ref="autocomplete" :search="searchSkill" @submit="addSkill" placeholder="Добавить навык"></autocomplete>
                </span>
                <button class="btn btn-outline-primary btn-with-plus btn-add-existing-skill" @click="toggleAddField">Добавить навык</button>
            </div>
        </div>

        <div v-else>
            <autocomplete ref="autocomplete" :search="searchSkill" @submit="addSkill" placeholder="Добавить навык"></autocomplete>
            <div class="skills-list mt-2">
                <label v-for="skill in allSkills" class="btn btn-outline-primary btn-skill-toggle skill" :class="{'active': isSelected(skill)}" :key="skill">
                    {{skill}}
                    <input type="checkbox" v-model="selectedSkills" :value="skill" @change="selectionChanged(skill)">
                </label>
            </div>
        </div>

    </div>
</template>

<script>
    import Autocomplete from '@trevoreyre/autocomplete-vue'
    import '@trevoreyre/autocomplete-vue/dist/style.css'

    export default {
        name: 'SkillInput',
        props: ['value', 'skills', 'shownSkills', 'initialSelection', 'useInFilter'],
        components: {
            Autocomplete
        },
        data() {
            return {
                selectedSkills: this.initialSelection || [],
                userChangedSkills: [],
                systemSkills: this.shownSkills || this.value || [],
                showAddField: false,
            }
        },
        watch: {
            initialSelection() {
                let newSelectionWithoutUserChanged = this.initialSelection.filter( skill => this.userChangedSkills.indexOf(skill) === -1 );
                let selectedUserChanged = this.selectedSkills.filter( skill => this.userChangedSkills.indexOf(skill) !== -1 );
                this.selectedSkills = newSelectionWithoutUserChanged.concat(selectedUserChanged);
                this.$emit('input', this.selectedSkills);
            },
            shownSkills() {
                this.systemSkills = this.shownSkills;
            }
        },
        methods: {
            toggleAddField() {
                this.showAddField = !this.showAddField;
            },
            searchSkill(input) {
                if (input.length < 1) {
                    return [];
                }

                return this.skillNames.filter( (skillName) => skillName.toLowerCase().indexOf(input.toLowerCase()) !== -1 );
            },
            selectionChanged(triggeredSkillName) {
                let wasNotChangedBefore = this.userChangedSkills.indexOf(triggeredSkillName) === -1;
                if (wasNotChangedBefore) {
                    this.userChangedSkills.push(triggeredSkillName);
                }

                this.$emit('input', this.selectedSkills);
            },
            isSelected(skill) {
                return this.selectedSkills.indexOf(skill) !== -1;
            },
            addSkill(selectedSkill) {
                this.userChangedSkills.push(selectedSkill);
                this.selectedSkills.push(selectedSkill);
                this.$refs.autocomplete.setValue('');
                this.$emit('input', this.selectedSkills);
            },
        },
        computed: {
            allSkills() {
                let systemSkillsWithoutChanged = this.systemSkills.filter( skill => this.userChangedSkills.indexOf(skill) === -1 );
                return this.userChangedSkills.concat(systemSkillsWithoutChanged);
            },
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