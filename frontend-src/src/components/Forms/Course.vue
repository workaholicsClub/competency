<template>
    <form class="course-form">
        <div class="form-group">
            <label>Название курса</label>
            <input type="text" class="form-control" v-model="course.title">
        </div>
        <div class="form-group">
            <label>Ссылка на курс</label>
            <input type="text" class="form-control" v-model="course.url">
        </div>
        <div class="form-group">
            <label>Партнерская ссылка на курс</label>
            <input type="text" class="form-control" v-model="course.partnerUrl">
            <small class="form-text text-muted">
                CPA, реферальная ссылка, "приведи друга" и пр.
            </small>
        </div>
        <div class="form-group">
            <label>Платформа</label>
            <input type="text" class="form-control" v-model="course.platform">
            <small class="form-text text-muted">
                Автор курса
            </small>
        </div>
        <div class="form-group">
            <label>Форма</label>
            <check-input v-model="course.form" :items-enum="enums.forms"></check-input>
        </div>
        <div class="form-group" v-show="needsCity">
            <label>Город</label>
            <input type="text" class="form-control" v-model="course.city">
        </div>
        <div class="form-group">
            <label>Формат</label>
            <check-input v-model="course.format" :items-enum="enums.formats"></check-input>
        </div>
        <div class="form-group">
            <label>Для кого</label>
            <check-input v-model="course.audience" :items-enum="enums.audience"></check-input>
        </div>
        <div class="form-group">
            <label>Сертификат</label>
            <check-input v-model="course.certificate" :items-enum="enums.certificates"></check-input>
        </div>
        <div class="form-group">
            <label>Стоимость</label>
            <div class="form-row">
                <div class="col-sm-4">
                    <input type="number" class="form-control" v-model.number="course.price">
                </div>
                <div class="col-sm-3">
                    <units-select v-model="course.priceType" :items-enum="enums.priceTypes"></units-select>
                </div>
            </div>
            <small class="form-text text-muted">
                0, если курс бесплатный
            </small>
        </div>
        <div class="form-group">
            <label>Время занятий</label>
            <check-input v-model="course.time" :items-enum="enums.times"></check-input>
        </div>
        <div class="form-group">
            <label>Процесс</label>
            <div class="check-pills-list">
                <div class="form-check form-check-inline">
                    <label class="btn btn-outline-primary btn-filter-apply" :class="{'active': course.hasPractice}">
                        Есть практика
                        <input type="checkbox" class="form-check-input" v-model="course.hasPractice">
                    </label>
                </div>
                <div class="form-check form-check-inline">
                    <label class="btn btn-outline-primary btn-filter-apply" :class="{'active': course.hasTeacher}">
                        Есть преподаватель
                        <input type="checkbox" class="form-check-input" v-model="course.hasTeacher">
                    </label>
                </div>
                <div class="form-check form-check-inline">
                    <label class="btn btn-outline-primary btn-filter-apply" :class="{'active': course.jobPlacement}">
                        Помощь в трудоустройстве
                        <input type="checkbox" class="form-check-input" v-model="course.jobPlacement">
                    </label>
                </div>
                <div class="form-check form-check-inline">
                    <label class="btn btn-outline-primary btn-filter-apply" :class="{'active': course.forKids}">
                        Подходит детям
                        <input type="checkbox" class="form-check-input" v-model="course.forKids">
                    </label>
                </div>
            </div>
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
                    <input type="number" class="form-control" v-model.number="course.duration">
                </div>
                <div class="col-sm-4">
                    <units-select v-model="course.durationUnits" :items-enum="enums.durationUnits"></units-select>
                </div>
                <div class="col-sm-2">
                    <input type="number" class="form-control" v-model.number="course.load">
                </div>
                <div class="col-sm-4">
                    <units-select v-model="course.loadUnits" :items-enum="enums.loadUnits"></units-select>
                </div>
            </div>
        </div>
        <div class="form-group">
            <label>Описание</label>
            <textarea class="form-control" rows="3" v-model="course.description"></textarea>
        </div>
        <div class="form-row mb-4">
            <div class="col-sm">
                <div class="form-group">
                    <label>Приобретаемые навыки</label>
                    <div>
                        <skill-input v-model="course.skills" :skills="skills"></skill-input>
                    </div>
                </div>
            </div>
            <div class="col-sm">
                <div class="form-group">
                    <label>Требования к знаниям</label>
                    <div>
                        <skill-input v-model="course.requirements" :skills="skills"></skill-input>
                    </div>
                </div>
            </div>
        </div>

        <div class="form-group mt-4">
            <label class="large">Предварительный просмотр</label>
            <course-card :course="course" :enums="enums" :mobile="mobile"></course-card>
        </div>

        <div class="form-group course-buttons">
            <button type="button" class="btn btn-outline-info btn-link btn-block" @click="save">Сохранить курс</button>
        </div>
    </form>
</template>

<script>
    import SkillInput from '../SkillInput.vue'
    import CheckInput from '../CheckInput.vue'
    import UnitsSelect from '../UnitsSelect.vue'
    import CourseCard from '../Cards/Course.vue'

    export default {
        name: 'CourseForm',
        props: ['course', 'enums', 'skills', 'mobile'],
        components: {
            SkillInput,
            CheckInput,
            UnitsSelect,
            CourseCard
        },
        methods: {
            save() {
            }
        },
        computed: {
            needsCity() {
                return this.course.form && this.course.form.indexOf('offline') !== -1;
            }
        }
    }
</script>

<style>
    .course-form {
        font-family: GoogleSans, sans-serif;
    }

    .course-form label {
        font-size: 1em;
        height: 1.25em;
    }

    .course-form label.large {
        font-size: 1.5em;
        height: 1.75em;
    }
</style>