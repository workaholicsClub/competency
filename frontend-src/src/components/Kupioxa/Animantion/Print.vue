<template>
    <div class="desk">
        <p>1 + 1 = <span :class="{'animate-text': animation}">{{solutions[0] || '?'}}</span></p>
        <p>3 * 4 = <span :class="{'animate-text': animation}">{{solutions[1] || '?'}}</span></p>
        <p>5 - 7 = <span :class="{'animate-text': animation}">{{solutions[2] || '?'}}</span></p>
        <p>9 / 2 = <span :class="{'animate-text': animation}">{{solutions[3] || '?'}}</span></p>
        <p class="mark" v-if="success">/5+</p>
    </div>
</template>

<script>
    import {pause} from "../Helpers";

    export default {
        name: "Print",
        props: ['stdout', 'test', 'success'],
        data() {
            return {
                animation: false
            }
        },
        watch: {
            async stdout() {
                this.animation = true;
                await pause(1000);
                this.animation = false;
                this.$emit('finish');
            }
        },
        computed: {
            solutions() {
                return this.stdout
                    ? this.stdout.split('\n') || []
                    : [];
            }
        }
    }
</script>

<style scoped>
    .desk {
        position: relative;
        font-family: monospace;
        background: url("/assets/kupioxa/chapter3.png");
        background-size: auto 100%;
        background-repeat: no-repeat;
        min-height: 300px;
        color: white;
        padding: 40px;
        font-size: 25px;
        font-weight: bold;
    }

    .mark {
        position: absolute;
        left: 250px;
        bottom: 20px;
        font-size: 30px;
        background: none;
    }

    .animate-text {
        -webkit-animation: glow 1s ease-in-out infinite alternate;
        -moz-animation: glow 1s ease-in-out infinite alternate;
        animation: glow 1s ease-in-out infinite alternate;
    }

    @-webkit-keyframes glow {
        from {
            text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #e60073, 0 0 40px #e60073, 0 0 50px #e60073, 0 0 60px #e60073, 0 0 70px #e60073;
        }
        to {
            text-shadow: 0 0 20px #fff, 0 0 30px #ff4da6, 0 0 40px #ff4da6, 0 0 50px #ff4da6, 0 0 60px #ff4da6, 0 0 70px #ff4da6, 0 0 80px #ff4da6;
        }
    }

</style>