<template>
    <form class="course-form">
        <div class="form-group">
            <label>Название программы стажировки</label>
            <input type="text" class="form-control" v-model="internship.title">
        </div>
        <div class="form-group">
            <label>Ссылка на стажировку</label>
            <input type="text" class="form-control" v-model="internship.url">
        </div>
        <div class="form-group">
            <label>Партнерская ссылка на стажировку</label>
            <input type="text" class="form-control" v-model="internship.partnerUrl">
            <small class="form-text text-muted">
                CPA, реферальная ссылка, "приведи друга" и пр.
            </small>
        </div>
        <div class="form-group">
            <label>Компания</label>
            <input type="text" class="form-control" v-model="internship.company">
        </div>
        <div class="form-group">
            <label>Город</label>
            <input type="text" class="form-control" v-model="internship.city">
        </div>
        <div class="form-group">
            <label>Оплата на руки</label>
            <div class="form-row">
                <div class="col-sm-4">
                    <input type="number" class="form-control" v-model.number="internship.salary">
                </div>
                <div class="col-sm-3">
                    <units-select v-model="internship.salaryType" :items-enum="enums.salaryTypes"></units-select>
                </div>
            </div>
            <small class="form-text text-muted">
                Если указана оплата без налогов, вычти 13% - будь лаской. 0, если стажировка не оплачивается
            </small>
        </div>
        <div class="form-group">
            <div class="form-row">
                <div class="col-sm-6">
                    <label>Продолжительность</label>
                </div>
                <div class="col-sm-6">
                    <label>Нагрузка</label>
                </div>
            </div>
            <div class="form-row">
                <div class="col-sm-2">
                    <input type="number" class="form-control" v-model.number="internship.duration">
                </div>
                <div class="col-sm-4">
                    <units-select v-model="internship.durationUnits" :items-enum="enums.durationUnits"></units-select>
                </div>
                <div class="col-sm-2">
                    <input type="number" class="form-control" v-model.number="internship.load">
                </div>
                <div class="col-sm-4">
                    <units-select v-model="internship.loadUnits" :items-enum="enums.loadUnits"></units-select>
                </div>
            </div>
        </div>
        <div class="form-group">
            <label>Описание</label>
            <textarea class="form-control" rows="3" v-model="internship.description"></textarea>
        </div>
        <div class="form-group">
            <label>Процесс</label>
            <div class="check-pills-list">
                <div class="form-check form-check-inline">
                    <label class="btn btn-outline-primary btn-filter-apply" :class="{'active': internship.canCombineStudy}">
                        Можно совмещать с учебой
                        <input type="checkbox" class="form-check-input" v-model="internship.canCombineStudy">
                    </label>
                </div>
                <div class="form-check form-check-inline">
                    <label class="btn btn-outline-primary btn-filter-apply" :class="{'active': internship.hasMentor}">
                        Есть наставник
                        <input type="checkbox" class="form-check-input" v-model="internship.hasMentor">
                    </label>
                </div>
                <div class="form-check form-check-inline">
                    <label class="btn btn-outline-primary btn-filter-apply" :class="{'active': internship.hasTraining}">
                        Есть тренинги
                        <input type="checkbox" class="form-check-input" v-model="internship.hasTraining">
                    </label>
                </div>
            </div>
        </div>
        <div class="form-row mb-4">
            <div class="col-sm">
                <div class="form-group">
                    <label>Какие навыки можно прокачать</label>
                    <div>
                        <skill-input v-model="internship.skills" :skills="skills"></skill-input>
                    </div>
                </div>
            </div>
            <div class="col-sm">
                <div class="form-group">
                    <label>Какие навыки нужны</label>
                    <div>
                        <skill-input v-model="internship.requirements" :skills="skills"></skill-input>
                    </div>
                </div>
            </div>
        </div>

        <div class="form-group mt-4">
            <label class="large">Предварительный просмотр</label>
            <internship-card :internship="internship" :enums="enums" :mobile="mobile"></internship-card>
        </div>

        <div class="form-group course-buttons">
            <button type="button" class="btn btn-link btn-block bg-success text-white" v-if="saveStatus">Cтажировка сохранена</button>
            <button type="button" class="btn btn-link btn-block bg-danger text-white" @click="save" v-else-if="saveError">{{saveError}}. Попробовать еще</button>
            <button type="button" class="btn btn-outline-info btn-link btn-block" @click="save" v-else>Сохранить стажировку</button>
        </div>
    </form>
</template>

<script>
    import SkillInput from '../SkillInput.vue'
    import UnitsSelect from '../UnitsSelect.vue'
    import InternshipCard from '../Cards/Internship.vue'

    export default {
        name: 'InternshipForm',
        props: ['internship', 'enums', 'skills', 'mobile', 'save-error', 'save-status'],
        components: {
            SkillInput,
            UnitsSelect,
            InternshipCard
        },
        methods: {
            save() {
                this.$emit('save', this.internship);
            }
        }
    }
</script>