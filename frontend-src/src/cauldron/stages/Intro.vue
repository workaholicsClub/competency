<template>
    <div>
        <h2 class="my-4 text-center">О чем речь?</h2>
        <p class="text-center">
            Будем варить любовное зелье.
        </p>
        <p class="text-center">
            Но аккуратно, если перестараться - получится отворотное!
        </p>
        <p class="text-center mt-4">
            <button class="btn btn-success" @click="$emit('next')">Сначала рецепт</button>
        </p>
    </div>
</template>

<script>
    export default {
        name: "Intro"
    }
</script>

<style scoped>

</style>