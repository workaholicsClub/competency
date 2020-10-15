<template>
    <div class="main">
    </div>
</template>

<script>
    export default {
        name: "Main",
        components: {},
        data() {
            let levelFromUrl = location.href.replace(/.*\//, '').replace(/\?.*$/, '');
            let isLevelOnlyNumbers = /^\d+$/.test(levelFromUrl);
            let levelNumber = isLevelOnlyNumbers ? parseInt(levelFromUrl) : 1;

            return {
                levelNumber,
            }
        },
        methods: {
        },
        computed: {
        }
    }
</script>

<style scoped>
</style>

<style>
    #MathJax_Message {
        visibility: hidden;
    }
</style>