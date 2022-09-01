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
            <p class="px-3 py-2 m-0"><a href="/kupioxa/" target="_blank">Как Кирюха программистом стал и не зациклился</a></p>
            <p class="px-3 py-2 m-0"><a href="/ducks/">Уточки-дифференцуточки</a></p>
            <p class="px-3 py-2 m-0"><a href="/slope/">Лыжи едут</a></p>
            <p class="px-3 py-2 m-0"><a href="/steepest/">Наискорейший Пью</a></p>
            <p class="px-3 py-2 m-0"><a href="/cauldron/">100%-ный приворот</a></p>
        </b-nav>
    </b-card>
</template>

<script>
    export default {
        name: 'Home',
    }
</script>
