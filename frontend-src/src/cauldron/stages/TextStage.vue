<template>
    <div>
        <h2 class="my-4 text-center">{{title}}</h2>
        <div class="text-center">
            <slot name="text">
                <div v-html="text"></div>
            </slot>
        </div>
        <p class="text-center mt-4">
            <button class="btn btn-success" @click="$emit('next')">{{buttonText}}</button>
        </p>
    </div>
</template>

<script>
    export default {
        name: "TextStage",
        props: ['title', 'text', 'buttonText']
    }
</script>

<style scoped>

</style>