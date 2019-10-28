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
            <label>Описание</label>
            <ckeditor :editor="editor" v-model="item.description" :config="editorConfig"></ckeditor>
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
            <basic-text-card :item="item" :enums="enums" :mobile="mobile" :card-title="cardTitle"></basic-text-card>
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
    import BasicTextCard from '../Cards/BasicText.vue'
    import Enums from "../../unsorted/Enums";

    export default {
        name: 'BasicTextForm',
        props: ['item', 'enums', 'skills', 'mobile', 'card-title', 'save-error', 'save-status'],
        components: {
            SkillInput,
            CheckInput,
            BasicTextCard
        },
        data() {
            return {
                editor: CustomEditor,
                editorConfig: {},
                audience: Enums.audience,
            }
        },
        methods: {
            save() {
                this.$emit('save', this.item);
            }
        },
    }
</script>