<template>
    <div class="">
        <h1 v-if="chapter.title" class="mt-4 text-center" v-html="chapter.title"></h1>

        <div class="row pt-4 justify-content-center">
            <div class="col col-12 col-md-6">
                <div class="mb-4" v-html="chapter.text"></div>
                <button class="btn btn-primary btn-lg btn-block" @click="$emit('next')" v-html="chapter.nextChapterButtonText">
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "StoryPage",
        props: ['chapter']
    }
</script>

<style scoped>
    .btn-block {
        white-space: normal;
    }
</style>