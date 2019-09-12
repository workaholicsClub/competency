<template>
    <form class="course-form">
        <div class="form-group">
            <label>Название записи</label>
            <input type="text" class="form-control" v-model="item.title">
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
            <button type="button" class="btn btn-outline-info btn-link btn-block" @click="save">Сохранить запись</button>
        </div>
    </form>
</template>

<script>
    import SkillInput from '../SkillInput.vue'
    import CheckInput from '../CheckInput.vue'
    import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
    import BasicTextCard from '../Cards/BasicText.vue'

    export default {
        name: 'BasicTextForm',
        props: ['item', 'enums', 'skills', 'mobile', 'card-title'],
        components: {
            SkillInput,
            CheckInput,
            BasicTextCard
        },
        data() {
            return {
                editor: ClassicEditor,
                editorConfig: {
                }
            }
        },
        methods: {
            save() {
                this.$emit('save', this.item);
            }
        },
    }
</script>