<template>
    <div class="container mb-4">
        <story-page v-if="currentChapter.type === 'story'"
                :chapter="currentChapter"

                @next="gotoNextChapter"
        ></story-page>

        <task-page v-if="currentChapter.type === 'task'"
                :chapter="currentChapter"
                @next="gotoNextChapter"
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
        created() {
            this.updateChapterFromUrl();
            window.onpopstate = this.updateChapterFromUrl;
        },
        methods: {
            updateChapterFromUrl() {
                let match = location.href.match(/\/(\d+)/);
                if (match && match[1]) {
                    let chapterIndex = parseInt(match[1])-1;
                    this.gotoChapter(chapterIndex);
                }
                else {
                    this.gotoChapter(0);
                }
            },
            gotoNextChapter() {
                this.gotoChapter( this.currentChapterIndex + 1 );
            },
            gotoChapter(chapterIndex) {
                let url = '/kupioxa/'+(chapterIndex+1);
                this.currentChapterIndex = chapterIndex;
                history.pushState({}, document.title, url);
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