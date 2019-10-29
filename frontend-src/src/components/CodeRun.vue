<template>
    <div class="code-run">
        <iframe frameborder="0" width="100%" :height="height+'px'" :src="iframeSrc" v-if="iframeSrc"></iframe>
    </div>
</template>
<script>
    import Enums from "../unsorted/Enums";

    export default {
        name: 'CoreRun',
        props: ['lang', 'height'],
        components: {},
        data() {
            return {
                defaultLang: Enums.homework.defaultLang,
                repls: Enums.homework.lang
            };
        },
        methods: {
            detectLang() {
                return this.defaultLang;
            }
        },
        computed: {
            replPath() {
                let lang = this.lang || this.detectLang();
                let replData = this.repls.reduce( (result, current) => current.code === lang ? current : result, false );
                return replData ? replData.repl : false;
            },
            iframeSrc() {
                return this.replPath ? `https://repl.it/${this.replPath}?lite=true` : false;
            }
        }
    }
</script>