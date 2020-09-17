<template>
    <div class="w-100">
        <img :src="image" v-if="image" class="w-100">
    </div>
</template>

<script>
    import {pause} from "../Helpers";

    export default {
        name: "ShowImage",
        props: ['stdout', 'test', 'success', 'reset', 'inputs', 'images'],
        data() {
            return {
            }
        },
        watch: {
            async stdout() {
                await this.$nextTick();
                this.finish();
            },
            reset() {
                this.finish();
            },
            success() {
                this.finish();
            }
        },
        methods: {
            async finish() {
                await pause(4000);
                this.$emit('finish');
            },
        },
        computed: {
            resultKeyword() {
                return this.stdout
                    ? this.stdout.trim().toLocaleLowerCase()
                    : false;
            },
            imageIndex() {
                return this.resultKeyword
                    ? this.inputs.findIndex( input => input === this.resultKeyword )
                    : -1;
            },
            image() {
                return this.imageIndex !== -1
                    ? this.images[ this.imageIndex ] || false
                    : false;
            },
        }
    }

</script>

<style scoped>
    img {max-width: 300px;}
</style>