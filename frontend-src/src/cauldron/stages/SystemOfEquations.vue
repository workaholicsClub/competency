<template>
    <div class="system">
        <vue-mathjax :formula="displaySystem"></vue-mathjax>
    </div>
</template>

<script>
    import {VueMathjax} from 'vue-mathjax';

    export default {
        name: "SystemOfEquations",
        props: ['equationSystem', 'highlightValues', 'color'],
        components: {VueMathjax},
        computed: {
            displaySystem() {
                return this.systemOfEquations;
            },
            systemOfEquations() {
                return `\\begin{cases} ${this.equationSystem[0]} \\\\ ${this.equationSystem[1]} \\\\ ${this.equationSystem[2]} \\end{cases}`;
            },
        }
    }
</script>

<style scoped>
    .system {
        font-size: 20px;
    }
</style>