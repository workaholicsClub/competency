<template>
    <form class="course-form">
        <div class="form-group">
            <label>Название записи</label>
            <input type="text" class="form-control" v-model="item.title">
        </div>
        <div class="form-group">
            <label>Автор</label>
            <input type="text" class="form-control" v-model="item.author">
        </div>
        <div class="form-group">
            <label>Ссылка на изображение</label>
            <input type="text" class="form-control" v-model="item.imageUrl">
        </div>
        <div class="form-group">
            <label>Для кого</label>
            <check-input v-model="item.audience" :items-enum="audience"></check-input>
        </div>
        <div class="form-group">
            <label>Текст задачи</label>
            <ckeditor :editor="editor" v-model="item.description" :config="editorConfig"></ckeditor>
        </div>
        <div class="form-group">
            <label>Ответ</label>
            <input type="text" class="form-control" v-model="item.answer">
        </div>
        <div class="form-group">
            <label>Язык программирования по-умолчанию</label>
            <select class="form-control" v-model="item.lang">
                <option value="" selected>Не задан</option>
                <option v-for="item in langs" :value="item.code" :key="item.code">{{item.title}}</option>
            </select>
        </div>
        <div class="form-row mb-4">
            <div class="col-sm">
                <div class="form-group">
                    <label>Какие навыки можно прокачать</label>
                    <div>
                        <skill-input v-model="item.skills" :skills="skills"></skill-input>
                    </div>
                </div>
            </div>
            <div class="col-sm">
                <div class="form-group">
                    <label>Какие навыки нужны</label>
                    <div>
                        <skill-input v-model="item.requirements" :skills="skills"></skill-input>
                    </div>
                </div>
            </div>
        </div>

        <div class="form-group mt-4">
            <label class="large">Предварительный просмотр</label>
            <homework-card :item="item" :enums="enums" :mobile="mobile" :card-title="cardTitle"></homework-card>
        </div>

        <div class="form-group course-buttons">
            <button type="button" class="btn btn-link btn-block bg-success text-white" v-if="saveStatus">Запись сохранена</button>
            <button type="button" class="btn btn-link btn-block bg-danger text-white" @click="save" v-else-if="saveError">{{saveError}}. Попробовать еще</button>
            <button type="button" class="btn btn-outline-info btn-link btn-block" @click="save" v-else>Сохранить запись</button>
        </div>
    </form>
</template>

<script>
    import SkillInput from '../SkillInput.vue'
    import CheckInput from '../CheckInput.vue'
    import CustomEditor from '../../unsorted/CKEditor';
    import HomeworkCard from '../Cards/Homework.vue'
    import Enums from "../../unsorted/Enums";

    export default {
        name: 'BasicTextForm',
        props: ['item', 'enums', 'skills', 'mobile', 'card-title', 'save-error', 'save-status'],
        components: {
            SkillInput,
            CheckInput,
            HomeworkCard
        },
        data() {
            return {
                editor: CustomEditor,
                editorConfig: {},
                audience: Enums.audience,
                langs: Enums.homework.lang
            }
        },
        methods: {
            save() {
                this.$emit('save', this.item);
            }
        },
    }
</script>