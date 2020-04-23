<template>
    <div class="editMenu">
        <div class="form-group justify-content-md-center d-flex">
            <button class="btn btn-link" @click="$root.$emit('logout')" v-if="userLoggedIn">Выйти</button>
            <button class="btn btn-link" @click="$root.$emit('login')" v-else>Войти</button>
        </div>

        <div class="form-group pt-4">
            <button class="btn btn-link" @click="$root.$emit('addTextItem')">Добавить текст</button>
        </div>
        <div class="form-group">
            <button class="btn btn-link" @click="$root.$emit('addLinkItem')">Добавить материал</button>
        </div>
        <div class="form-group">
            <button class="btn btn-link" @click="$root.$emit('addManyLinksItem')">Добавить блок выбора</button>
        </div>
        <div class="form-group">
            <button class="btn btn-link" @click="$root.$emit('previewMode', true)" v-if="previewMode === false">Предпросмотр</button>
            <button class="btn btn-link" @click="$root.$emit('previewMode', false)" v-else>Редактировать</button>
        </div>

        <div class="form-group pt-4">
            <button class="btn btn-link text-danger" @click="$root.$emit('clear')">Очистить все</button>
        </div>

        <div class="form-group pt-4">
            <button class="btn btn-primary btn-save" @click="$root.$emit('saveCollection')" v-if="collectionChanged">
                {{userLoggedIn ? 'Сохранить' : 'Сохранить локально'}}
            </button>
            <button class="btn disabled btn-save" disabled v-else>
                {{userLoggedIn ? 'Сохранить' : 'Сохранить локально'}}
            </button>
        </div>
    </div>

</template>

<script>
    export default {
        name: "EditModeMenu",
        props: ['previewMode', 'collectionChanged', 'userLoggedIn']
    }
</script>

<style scoped>
    .btn-save {
        margin-left: .375rem;
    }
</style>