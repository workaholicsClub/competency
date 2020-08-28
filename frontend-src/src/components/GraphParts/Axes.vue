<template>
    <g>
        <polyline :points="axisPoints" :style="'fill: none; stroke: '+color+'; stroke-width: '+axesStrokeWidth+';'"/>
        <g>
            <text v-for="n in (ySteps+1)" :fill="color" text-anchor="end" :x="yAxisSpace+(padding*3/4)" :y="innerHeight+padding-(innerHeight*(n-1)/ySteps)+fontSize/2" :key="n+'label'">
                {{ (n - 1 + min / yStepSize) * yStepSize }} {{ units && units.y ? units.y : '' }}
            </text>
            <line v-for="n in (ySteps+1)" :x1="padding+yAxisSpace" :y1="innerHeight+padding-(innerHeight*(n-1)/ySteps)" :x2="innerWidth+yAxisSpace+padding" :y2="innerHeight+padding-(innerHeight*(n-1)/ySteps)" :style="'stroke: '+color+'; opacity: 0.35;'" :key="n+'line'"/>
        </g>
        <text v-for="(l,index) in computedLabel" :fill="color" :text-anchor="needRotateLabel||type==='bar'?'end':'middle'" :x="l.x" :y="l.y" :transform="l.r" :key="index+'text'">
            {{ index % computedXStepSize === 0 || type === 'bar' ? l.val : '' }}
        </text>
    </g>
</template>

<script>
    export default {
        props: ['fontSize', 'padding', 'labels', 'color', 'axesStrokeWidth', 'innerWidth', 'innerHeight', 'yAxisSpace', 'xAxisSpace', 'max', 'min', 'yStepSize', 'xStepSize', 'needRotateLabel', 'type', 'units'],
        computed: {
            axisPoints() {
                const baseX = this.padding + this.yAxisSpace
                const baseY = this.innerHeight + this.padding
                return baseX + ',' + this.padding + ' ' + baseX + ',' + baseY + ' ' + (baseX + this.innerWidth) + ',' + baseY
            },
            ySteps() {
                return Math.ceil((this.max - this.min) / this.yStepSize)
            },
            xSteps() {
                return Math.ceil((this.max - this.min) / this.computedXStepSize)
            },
            computedLabel() {
                return this.labels.map((l, index) => {
                    const x = this.type === 'bar' ? this.yAxisSpace + this.padding * 3 / 4 : this.yAxisSpace + this.padding + ((index + 0.5) * this.innerWidth / this.labels.length)
                    const y = this.type === 'bar' ? (index + 0.5) * this.innerHeight / this.labels.length + this.fontSize / 2 + this.padding : this.innerHeight + this.padding + 10 + (this.needRotateLabel ? 0 : this.xAxisSpace)
                    let val = typeof l === 'string' ? l : l.value;
                    if (this.units && this.units.x) {
                        val = val + ' ' + this.units.x;
                    }
                    return {val, x, y, r: 'rotate(' + (this.needRotateLabel ? '-45' : '0') + ',' + x + ', ' + y + ')'}
                })
            },
            computedXStepSize() {
                return this.type === 'bar' ? this.xStepSize : ((this.needRotateLabel && (this.innerWidth / this.labels.length) < this.fontSize * 2) ? Math.ceil(this.fontSize * 2 / (this.innerWidth / this.labels.length)) : 1)
            }
        }
    }
</script>
