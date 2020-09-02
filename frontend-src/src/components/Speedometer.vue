<template>
    <div class="container">
        <svg :width="width" :height="height" :view-box="`0 0 ${width} ${height}`" ref="svg">

            <g class="scale" stroke="red">
                <line v-for="(tick, index) in ticks" :key="`tick-${index}`"
                    class="scale"
                    :x1="tick.x1"
                    :y1="tick.y1"
                    :x2="tick.x2"
                    :y2="tick.y2"
                ></line>

                <text v-for="(label, index) in tickLabels" :key="`tickLabel-${index}`"
                    class="scale"
                    :x="label.x"
                    :y="label.y"
                >{{label.text}}</text>
            </g>

            <path class="outline" :d="gaugeOutline" />
            <path class="fill" :d="gaugeFill" />

            <polygon class="needle" :points="needlePoints" />
        </svg>
        <div class="output">{{value}}</div>
    </div>
</template>

<script>
    const rad = Math.PI / 180;

    export default {
        name: "Speedometer",
        props: ['min', 'max', 'value'],
        data() {
            return {
                width: 330,
                height: 165,
                offset: 40,
                cy: 160,
            }
        },
        computed: {
            W() {
                //return parseInt(window.getComputedStyle(this.$refs.svg, null).getPropertyValue("width"));
                return this.width;
            },
            cx() {
                return ~~(this.W / 2);
            },
            r1() {
                return this.cx - this.offset;
            },
            r2() {
                return this.r1 - this.delta;
            },
            delta() {
                return ~~(this.r1 / 4);
            },
            x1() {
                return this.cx + this.r1;
            },
            x2() {
                return this.offset;
            },
            x3() {
                return this.x1 - this.delta;
            },
            y1() {
                return this.cy;
            },
            y2() {
                return this.cy;
            },
            y3() {
                return this.cy;
            },

            ticks() {
                const sr1 = this.r1 + 5;
                const sr2 = this.r2 - 5;

                let ticks = [];
                for (let sa = -180; sa <= 0; sa += 18) {
                    const sx1 = this.cx + sr1 * Math.cos(sa * rad);
                    const sy1 = this.cy + sr1 * Math.sin(sa * rad);
                    const sx2 = this.cx + sr2 * Math.cos(sa * rad);
                    const sy2 = this.cy + sr2 * Math.sin(sa * rad);

                    ticks.push({
                        x1: sx1,
                        y1: sy1,
                        x2: sx2,
                        y2: sy2
                    });
                }

                return ticks;
            },

            tickLabels() {
                const srT = this.r1 + 20;

                let labels = [];
                let currentValue = this.min;
                let step = (this.max - this.min) / 10;
                for (let sa = -180; sa <= 0; sa += 18) {
                    const sxT = this.cx + srT * Math.cos(sa * rad);
                    const syT = this.cy + srT * Math.sin(sa * rad);

                    labels.push({
                        text: Math.round(currentValue).toFixed(0),
                        x: sxT,
                        y: syT,
                    });

                    currentValue += step;
                }

                return labels;
            },

            gaugeOutline() {
                const x1 = this.cx + this.r1;
                const y1 = this.cy;
                const x2 = this.offset;
                const y2 = this.cy;
                const r2 = this.r1 - this.delta;
                const x3 = x1 - this.delta;
                const y3 = this.cy;
                const r1 = this.r1;
                const offset = this.offset;
                const delta = this.delta;

                return "M " + x1 + ", " + y1 + " A" + r1 + "," + r1 + " 0 0 0 " + x2 + "," + y2 + " H" + (offset + delta) + " A" + r2 + "," + r2 + " 0 0 1 " + x3 + "," + y3 + " z";
            },

            valuePoint() {
                const precentValue = (this.value - this.min) / (this.max - this.min) * 100;
                const pa = (precentValue * 1.8) - 180;

                const x = this.cx + this.r1 * Math.cos(pa * rad);
                const y = this.cy + this.r1 * Math.sin(pa * rad);
                return {x, y}
            },

            valueAngle() {
                const {x, y} = this.valuePoint;
                const lx = this.cx - x;
                const ly = this.cy - y;

                return Math.atan2(ly, lx) / rad - 180;
            },

            gaugeFill() {
                const a = this.valueAngle * rad;
                const r2 = this.r1 - this.delta;
                const x4 = this.cx + this.r1 * Math.cos(a);
                const y4 = this.cy + this.r1 * Math.sin(a);
                const x5 = this.cx + this.r2 * Math.cos(a);
                const y5 = this.cy + this.r2 * Math.sin(a);
                const r1 = this.r1;
                const x2 = this.x2;
                const y2 = this.y2;
                const offset = this.offset;
                const delta = this.delta;

                return "M " + x4 + ", " + y4 + " A" + r1 + "," + r1 + " 0 0 0 " + x2 + "," + y2 + " H" + (offset + delta) + " A" + r2 + "," + r2 + " 0 0 1 " + x5 + "," + y5 + " z";
            },

            needlePoints() {
                const nx1 = this.cx + 5 * Math.cos((this.valueAngle - 90) * rad);
                const ny1 = this.cy + 5 * Math.sin((this.valueAngle - 90) * rad);

                const nx2 = this.cx + (this.r1 + 15) * Math.cos(this.valueAngle * rad);
                const ny2 = this.cy + (this.r1 + 15) * Math.sin(this.valueAngle * rad);

                const nx3 = this.cx + 5 * Math.cos((this.valueAngle + 90) * rad);
                const ny3 = this.cy + 5 * Math.sin((this.valueAngle + 90) * rad);

                return  nx1 + "," + ny1 + " " + nx2 + "," + ny2 + " " + nx3 + "," + ny3;
            },
        }
    }
</script>

<style scoped>
    .container {
        position: relative;
        width: 100%;
    }

    .output {
        line-height: 35px;
        width: 60px;
        height: 30px;
        background-color: #0e7fe1;
        border-radius: 60px 60px 0 0;
        position: absolute;
        left: 50%;
        text-align: center;
        bottom: 0;
        transform: translate(-50%, 0);
        border: 1px solid black;
        color: black;
    }

    svg {
        margin: 0;
        padding: 0;
        cursor: pointer;
    }

    svg.focusable {
        border: 1px solid #0f4534;
    }

    .outline,
    .fill,
    .center,
    .needle,
    .scale,
    .output {
        pointer-events: none;
    }

    .outline {
        fill: rgba(0, 0, 0, 0);
        stroke: rgba(0, 0, 0, 0.4);
    }

    .fill {
        fill: rgba(0, 0, 0, 1);
    }

    .needle {
        fill: #ff0000;
    }

    .scale {
        stroke: rgba(0, 0, 0, 0.5);
    }

    text {
        text-anchor: middle;
        dominant-baseline: alphabetic;
        font: 12px verdana, sans-serif;
        color: black;
    }
</style>