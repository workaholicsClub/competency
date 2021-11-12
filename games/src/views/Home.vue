<template>
    <b-card class="w-50">
        <b-nav vertical>
            <b-nav-item>
                <router-link to="/micropetka">Микроб Петька и Бродильный Чан</router-link>
            </b-nav-item>
            <b-nav-item>
                <router-link to="/matrixmovers">Супер-грузчики с матричным телекинезом двигают мебель</router-link>
            </b-nav-item>
            <b-nav-item>
                <router-link to="/shop">Заработай миллион</router-link>
            </b-nav-item>
        </b-nav>
    </b-card>
</template>

<script>
    export default {
        name: 'Home',
    }
</script>
