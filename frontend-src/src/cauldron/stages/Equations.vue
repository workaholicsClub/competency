<template>
    <div>
        <h2 class="my-4 text-center">Рецепт</h2>
        <p class="text-center">
            <span class="subst-a"><b>Ж</b>елание</span> + <span class="subst-b"><b>Н</b>етерпение</span>
            <vue-mathjax :formula="`$$\\downarrow$$`"></vue-mathjax>
            <span>варим</span>
            <vue-mathjax :formula="`$$\\downarrow$$`"></vue-mathjax>
            <span class="subst-p"><b>Л</b>юбовное зелье</span>
            <vue-mathjax :formula="`$$\\downarrow$$`"></vue-mathjax>
            <span>если переварили</span>
            <vue-mathjax :formula="`$$\\downarrow$$`"></vue-mathjax>
            <span class="subst-s"><b>О</b>творотное зелье</span>
        </p>
        <h2 class="my-4 pt-4 text-center">Схема реакции</h2>
        <p class="text-center big-formula">
            <span class="subst-a">Ж</span> + <span class="subst-b">Н</span>&nbsp;
            <vue-mathjax :formula="'$\\xrightarrow{k_1}$'" class="small-font"></vue-mathjax>&nbsp;
            <span class="subst-p">Л</span>&nbsp;
            <vue-mathjax :formula="'$\\xrightarrow{k_2}$'" class="small-font"></vue-mathjax>&nbsp;
            <span class="subst-s">О</span>
        </p>
        <p class="text-center">
            <button class="btn btn-success" @click="$emit('next')">Можно запускать!</button>
        </p>
    </div>
</template>

<script>
    import {VueMathjax} from 'vue-mathjax';

    export default {
        name: "Equations",
        components: {VueMathjax},
    }
</script>

<style scoped>
    .big-formula {
        font-size: 64px;
    }

    .big-formula .small-font {
        font-size: 30px!important;
    }
</style>

<style>
</style>
