<template>
    <div class="viewMenu">
        <div class="form-group justify-content-md-center d-flex">
            <button class="btn btn-link" @click="$root.$emit('logout')" v-if="userLoggedIn">Выйти</button>
            <button class="btn btn-link" @click="$root.$emit('login')" v-else>Войти</button>
        </div>

        <div class="form-group pt-4" v-if="userLoggedIn">
            <button class="btn btn-link" @click="$root.$emit('bookmarks')" >
                {{bookmarksMode ? 'Вернуться к подборке' : 'Мои закладки'}}
            </button>
        </div>
    </div>

</template>

<script>
    export default {
        name: "ViewModeMenu",
        props: ['userLoggedIn', 'bookmarksMode']
    }
</script>

<style scoped>
</style>