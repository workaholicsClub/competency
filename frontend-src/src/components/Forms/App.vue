<template>
    <form class="course-form">
        <div class="form-group">
            <label>Название приложения</label>
            <input type="text" class="form-control" v-model="item.title">
        </div>
        <div class="form-group">
            <label>Автор</label>
            <input type="text" class="form-control" v-model="item.author">
        </div>
        <div class="form-group">
            <label>Ссылка Google Play</label>
            <input type="text" class="form-control" v-model="item.googlePlayUrl">
        </div>
        <div class="form-group">
            <label>Ссылка App Store</label>
            <input type="text" class="form-control" v-model="item.appStoreUrl">
        </div>
        <div class="form-group">
            <label>Ссылка Microsoft Store</label>
            <input type="text" class="form-control" v-model="item.microsoftStoreUrl">
        </div>
        <div class="form-group">
            <label>Ссылка на веб-версию</label>
            <input type="text" class="form-control" v-model="item.webVersionUrl">
        </div>
        <div class="form-group">
            <label>Ссылка на сайт</label>
            <input type="text" class="form-control" v-model="item.siteUrl">
        </div>
        <div class="form-group">
            <label>Для кого</label>
            <check-input v-model="item.audience" :items-enum="audience"></check-input>
        </div>
        <div class="form-group">
            <label>Прочее</label>
            <div class="check-pills-list">
                <div class="form-check form-check-inline">
                    <label class="btn btn-outline-primary btn-filter-apply" :class="{'active': item.isGame}">
                        Игровой формат
                        <input type="checkbox" class="form-check-input" v-model="item.isGame">
                    </label>
                    <label class="btn btn-outline-primary btn-filter-apply" :class="{'active': item.forKids}">
                        Подходит детям
                        <input type="checkbox" class="form-check-input" v-model="item.forKids">
                    </label>
                </div>
            </div>
        </div>

        <div class="form-group">
            <label>Стоимость</label>
            <input type="number" class="form-control" v-model.number="item.price">
            <small class="form-text text-muted">
                0, если приложение бесплатное
            </small>
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
            <app-card :item="item" :enums="enums" :mobile="mobile"></app-card>
        </div>

        <div class="form-group course-buttons">
            <button type="button" class="btn btn-link btn-block bg-success text-white" v-if="saveStatus">Приложение сохранено</button>
            <button type="button" class="btn btn-link btn-block bg-danger text-white" @click="save" v-else-if="saveError">{{saveError}}. Попробовать еще</button>
            <button type="button" class="btn btn-outline-info btn-link btn-block" @click="save" v-else>Сохранить приложение</button>
        </div>
    </form>
</template>

<script>
    import SkillInput from '../SkillInput.vue';
    import CheckInput from '../CheckInput.vue';
    import CustomEditor from '../../unsorted/CKEditor';
    import AppCard from '../Cards/App.vue';
    import Enums from "../../unsorted/Enums";

    export default {
        name: 'AppForm',
        props: ['item', 'enums', 'skills', 'mobile', 'card-title', 'save-error', 'save-status'],
        components: {
            SkillInput,
            CheckInput,
            AppCard
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