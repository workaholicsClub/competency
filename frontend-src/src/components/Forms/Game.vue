<template>
    <form class="course-form">
        <div class="form-group">
            <label>Название игры</label>
            <input type="text" class="form-control" v-model="item.title">
        </div>
        <div class="form-group">
            <label>Автор</label>
            <input type="text" class="form-control" v-model="item.author">
        </div>
        <div class="form-group">
            <label>Ссылка на игру</label>
            <input type="text" class="form-control" v-model="item.url">
        </div>
        <div class="form-group">
            <label>Партнерская ссылка на книгу</label>
            <input type="text" class="form-control" v-model="item.partnerUrl">
            <small class="form-text text-muted">
                CPA, реферальная ссылка, "приведи друга" и пр.
            </small>
        </div>
        <div class="form-group">
            <label>Платформы</label>
            <check-input v-model="item.platform" :items-enum="platform"></check-input>
        </div>
        <div class="form-group">
            <label>Для кого</label>
            <check-input v-model="item.audience" :items-enum="audience"></check-input>
        </div>
        <div class="form-group">
            <label>Прочее</label>
            <div class="check-pills-list">
                <div class="form-check form-check-inline">
                    <label class="btn btn-outline-primary btn-filter-apply" :class="{'active': item.singlePlayer}">
                        Для одного игрока
                        <input type="checkbox" class="form-check-input" v-model="item.singlePlayer">
                    </label>
                    <label class="btn btn-outline-primary btn-filter-apply" :class="{'active': item.multiPlayer}">
                        Мультиплеер
                        <input type="checkbox" class="form-check-input" v-model="item.multiPlayer">
                    </label>
                    <label class="btn btn-outline-primary btn-filter-apply" :class="{'active': item.online}">
                        Онлайн
                        <input type="checkbox" class="form-check-input" v-model="item.online">
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
                0, если игра бесплатная
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
            <game-card :item="item" :enums="enums" :mobile="mobile"></game-card>
        </div>

        <div class="form-group course-buttons">
            <button type="button" class="btn btn-link btn-block bg-success text-white" v-if="saveStatus">Игра сохранена</button>
            <button type="button" class="btn btn-link btn-block bg-danger text-white" @click="save" v-else-if="saveError">{{saveError}}. Попробовать еще</button>
            <button type="button" class="btn btn-outline-info btn-link btn-block" @click="save" v-else>Сохранить игру</button>
        </div>
    </form>
</template>

<script>
    import SkillInput from '../SkillInput.vue';
    import CheckInput from '../CheckInput.vue';
    import CustomEditor from '../../unsorted/CKEditor';
    import GameCard from '../Cards/Game.vue';
    import Enums from "../../unsorted/Enums";

    export default {
        name: 'GameForm',
        props: ['item', 'enums', 'skills', 'mobile', 'card-title', 'save-error', 'save-status'],
        components: {
            SkillInput,
            CheckInput,
            GameCard
        },
        data() {
            return {
                editor: CustomEditor,
                editorConfig: {},
                audience: Enums.audience,
                platform: Enums.game.platform
            }
        },
        methods: {
            save() {
                this.$emit('save', this.item);
            }
        },
    }
</script>