<template>
    <div>
        <div v-if="useHtml">
            <span v-html="splitDescription.visible"></span>
            <span v-if="splitDescription.hidden">
                <a v-if="!hiddenDescriptionShown"
                        href="javascript:0;"
                        class="continue-toggle d-flex justify-content-end flex-column"
                        @click="toggleHiddenDescription"
                >
                    <i class="fas fa-angle-down"></i>
                </a>
                <span class="continue" v-if="hiddenDescriptionShown"><span v-html="splitDescription.hidden"></span></span>
            </span>
        </div>
        <div v-else>
            {{splitDescription.visible}}
            <span v-if="splitDescription.hidden">
                <a v-if="!hiddenDescriptionShown"
                    href="javascript:0;"
                    class="continue-toggle d-flex justify-content-end flex-column"
                    @click="toggleHiddenDescription"
                >
                    <i class="fas fa-angle-down"></i>
                </a>
                <span class="continue" v-if="hiddenDescriptionShown">{{splitDescription.hidden}}</span>
            </span>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'SplitDescription',
        props: ['text', 'word-limit', 'use-html'],
        data() {
            return {
                hiddenDescriptionShown: false,
            }
        },
        methods: {
            toggleHiddenDescription() {
                this.hiddenDescriptionShown = !this.hiddenDescriptionShown;
            },
        },
        computed: {
            splitDescription() {
                if (!this.text) {
                    return {
                        visible: false,
                        hidden: false
                    };
                }

                let wordLimit = this.wordLimit || 25;
                let words = this.text.split(" ");
                let visible = this.text;
                let hidden = false;

                if (words.length > wordLimit) {
                    visible = words.slice(0, wordLimit).join(" ");
                    hidden = words.slice(wordLimit).join(" ");
                }

                return {
                    visible: visible,
                    hidden: hidden
                };
            }
        }
    }
</script>