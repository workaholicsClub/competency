<template>
    <form class="course-form">
        <div class="form-group">
            <label>Название книги</label>
            <input type="text" class="form-control" v-model="book.title">
        </div>
        <div class="form-group">
            <label>Ссылка на книгу</label>
            <input type="text" class="form-control" v-model="book.url">
        </div>
        <div class="form-group">
            <label>Партнерская ссылка на книгу</label>
            <input type="text" class="form-control" v-model="book.partnerUrl">
            <small class="form-text text-muted">
                CPA, реферальная ссылка, "приведи друга" и пр.
            </small>
        </div>
        <div class="form-group">
            <label>Автор</label>
            <input type="text" class="form-control" v-model="book.author">
            <small class="form-text text-muted">
                Если несколько, то основной (или через запятую)
            </small>
        </div>
        <div class="form-group">
            <label>Формат</label>
            <check-input v-model="book.format" :items-enum="enums.formats"></check-input>
        </div>
        <div class="form-group">
            <label>Для кого</label>
            <check-input v-model="book.audience" :items-enum="enums.audience"></check-input>
        </div>
        <div class="form-group">
            <label>Стоимость</label>
            <input type="number" class="form-control" v-model.number="book.price">
            <small class="form-text text-muted">
                0, если книга бесплатная
            </small>
        </div>
        <div class="form-group">
            <label>Описание</label>
            <textarea class="form-control" rows="3" v-model="book.description"></textarea>
        </div>
        <div class="form-row mb-4">
            <div class="col-sm">
                <div class="form-group">
                    <label>Приобретаемые навыки</label>
                    <div>
                        <skill-input v-model="book.skills" :skills="skills"></skill-input>
                    </div>
                </div>
            </div>
            <div class="col-sm">
                <div class="form-group">
                    <label>Требования к знаниям</label>
                    <div>
                        <skill-input v-model="book.requirements" :skills="skills"></skill-input>
                    </div>
                </div>
            </div>
        </div>

        <div class="form-group mt-4">
            <label class="large">Предварительный просмотр</label>
            <book-card :book="book" :enums="enums" :mobile="mobile"></book-card>
        </div>

        <div class="form-group course-buttons">
            <button type="button" class="btn btn-outline-info btn-link btn-block" @click="save">Сохранить книгу</button>
        </div>
    </form>
</template>

<script>
    import SkillInput from '../SkillInput.vue'
    import CheckInput from '../CheckInput.vue'
    import BookCard from '../Cards/Book.vue'

    export default {
        name: 'BookForm',
        props: ['book', 'enums', 'skills', 'mobile', 'save-error', 'save-status'],
        components: {
            SkillInput,
            CheckInput,
            BookCard,
        },
        methods: {
            save() {
                this.$emit('save', this.book);
            }
        }
    }
</script>