<template>
    <div class="container mb-4">
        <story-page v-if="currentChapter.type === 'story'"
                :chapter="currentChapter"

                @next="currentChapterIndex++"
        ></story-page>

        <task-page v-if="currentChapter.type === 'task'"
                :chapter="currentChapter"
                @next="currentChapterIndex++"
        ></task-page>

        <finish-page v-if="currentChapter.type === 'finish'"
                :chapter="currentChapter"
        ></finish-page>
    </div>
</template>

<script>
    import TaskPage from "./components/Kupioxa/TaskPage";
    import StoryPage from "./components/Kupioxa/StoryPage";
    import FinishPage from "./components/Kupioxa/FinishPage";
    import KupioxaStory from "./unsorted/KupioxaStory";

    export default {
        name: "KupioxaPage",
        components: {
            TaskPage,
            StoryPage,
            FinishPage
        },
        data() {
            return {
                story: KupioxaStory,
                currentChapterIndex: 0
            }
        },
        computed: {
            currentChapter() {
                return this.story[this.currentChapterIndex];
            },
            isTitlePage() {
                return this.currentChapterIndex === 0;
            }
        }
    }
</script>

<style scoped>

</style>