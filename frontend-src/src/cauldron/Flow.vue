<template>
    <div class="subst" :style="{
        top: top+'px',
        left: left+'px',
        width: flowWidth+'px',
        height: startedHeight+'px',
        backgroundSize: width*4+'px',
        backgroundColor: color,
        backgroundPosition: backgroundPosition,
        transition: (timeout/1000)+'s all linear',
    }" :key="speed"></div>
</template>

<script>
    export default {
        name: "Flow",
        props: ['top', 'left', 'width', 'height', 'color', 'speed', 'min', 'max'],
        data() {
            return {
                backgroundPosition: 0,
                flowInterval: false,
            }
        },
        watch: {
            speed() {
                this.toggleFlow();
            }
        },
        mounted() {
            this.toggleFlow();
        },
        methods: {
            moveFlow() {
                this.backgroundPosition += 64 * this.scaleFactor;
                this.$el.style.backgroundPosition = '0 '+this.backgroundPosition+'px';
            },
            startFlow() {
                this.flowInterval = setInterval(this.moveFlow, this.timeout);
            },
            stopFlow() {
                if (this.flowInterval) {
                    clearInterval(this.flowInterval);
                    this.flowInterval = false;
                }
            },
            restartFlow() {
                this.stopFlow();
                this.startFlow();
            },
            toggleFlow() {
                if (this.speed > 0) {
                    this.restartFlow();
                }
                else {
                    this.stopFlow();
                }
            }
        },
        computed: {
            scaleFactor() {
                return this.width / 4;
            },
            timeout() {
                return 3000 / this.speed;
            },
            startedHeight() {
                return this.height * (this.speed > 0 ? 1 : 0);
            },
            flowLeft() {
                let center = this.left + this.width/2;
                return center - this.flowWidth / 2;
            },
            flowWidth() {
                let avg = (this.min + this.max)/2;
                let scaleFactor = this.speed / avg;
                return this.width * scaleFactor;
            }
        }
    }
</script>

<style scoped>
    .subst {
        background: url('./assets/waterflow.png') repeat;
        position: absolute;
    }
</style>