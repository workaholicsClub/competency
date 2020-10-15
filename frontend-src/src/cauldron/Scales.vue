<template>
    <div class="scales" :style="{width: width+'px', height: height+'px'}">
        <img src="./assets/scales_top.png" :style="{
            width: width+'px',
            top: '0px',
            left: '0px',
            transition: '1s all',
            transform: 'rotate('+angle+'deg)',
            transformOrigin: 'center '+ (7*scaleFactor)+'px',
        }">

        <img src="./assets/scales_cup.png" :style="{
            width: cupWidth+'px',
            top: leftCupTop+'px',
            left: leftCupLeft+'px',
            transition: '1s all',
        }">
        <img src="./assets/scales_cup.png" :style="{
            width: cupWidth+'px',
            top: rightCupTop+'px',
            left: rightCupLeft+'px',
            transition: '1s all',
        }">
    </div>
</template>

<script>
    export default {
        name: "Scales",
        props: ['scaleFactor', 'leftWeight', 'rightWeight'],
        data() {
            return {
                baseWidth: 50,
                baseHeight: 50,
                topWidth: 33,
                baseCupWidth: 24,

                maxAngle: 45,

                baseLeftCupLeft: 0,
                baseLeftCupTop: 9,
                baseRightCupLeft: 26,
                baseRightCupTop: 9,
            }
        },
        computed: {
            width() {
                return this.baseWidth * this.scaleFactor;
            },
            height() {
                return this.baseHeight * this.scaleFactor;
            },
            cupWidth() {
                return this.baseCupWidth * this.scaleFactor;
            },
            angle() {
                let maxWeight = Math.max(this.leftWeight, this.rightWeight);
                let deltaPercent = maxWeight > 0
                    ? (this.rightWeight - this.leftWeight) / maxWeight
                    : 0;

                return this.maxAngle * deltaPercent;
            },
            angleRad() {
                return (90-this.angle) * Math.PI / 180;
            },
            shiftX() {
                return 0;
            },
            shiftY() {
                return this.topWidth / 2 * Math.cos(this.angleRad);
            },
            leftCupLeft() {
                return (this.baseLeftCupLeft - this.shiftX) * this.scaleFactor;
            },
            leftCupTop() {
                return (this.baseLeftCupTop - this.shiftY) * this.scaleFactor;
            },
            rightCupLeft() {
                return (this.baseRightCupLeft - this.shiftX) * this.scaleFactor;
            },
            rightCupTop() {
                return (this.baseRightCupTop + this.shiftY) * this.scaleFactor;
            }
        }
    }
</script>

<style scoped>
    .scales {
        position: relative;
    }

    .scales img {
        position: absolute;
        image-rendering: pixelated;
    }
</style>