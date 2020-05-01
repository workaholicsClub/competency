<template>
    <div class="">
        <h1 v-if="chapter.title" class="mt-4 text-center" v-html="chapter.title"></h1>

        <div class="row pt-4 justify-content-center">
            <div class="col col-12 col-md-6">
                <div class="mb-4" v-html="chapter.text"></div>

                <vue-disqus
                        shortname="skillitch"
                        identifier="kupioxa_finish"
                        :url="href"
                        :title="chapter.title"
                        language="ru"
                ></vue-disqus>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "FinishPage",
        props: ['chapter'],
        computed: {
            href() {
                return window.location.href;
            }
        }
    }
</script>

<style scoped>

</style>