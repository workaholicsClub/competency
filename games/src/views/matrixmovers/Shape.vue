<template>
    <g :class="shapeClasses">
        <polygon :points="points" v-if="shape.type === 'dashed'" />
        <polygon :points="points" v-else
            :marker-start="`url(#${marker})`"
            :marker-mid="`url(#${marker})`"
        />
        <text class="name"
            :x="centerX"
            :y="centerY"
            dominant-baseline="middle"
            text-anchor="middle"
            v-html="shapeName"
        ></text>
        <text v-for="(graphPoint, index) in shape.graphPoints" :key="index"
            class="coords"
            :x="textX(index)"
            :y="textY(index)"
            :text-anchor="anchor(index)"
        >
            {{`(${graphPoint.x}, ${graphPoint.y})`}}
        </text>
    </g>
</template>

<script>
export default {
    props: ['shape', 'marker', 'maxX', 'maxY'],
    methods: {
        baseTextX(index) {
            return this.shape.points[index].x + 4;
        },
        textX(index) {
            let x = this.baseTextX(index);
            if (x > this.maxX) {
                x -= 8;
            }

            return x;
        },
        textY(index) {
            let y = this.shape.points[index].y - 6;
            if (y < 0) {
                y += 20;
            }

            return y;
        },
        anchor(index) {
            return this.baseTextX(index) > this.maxX ? 'end' : 'start';
        }
    },
    computed: {
        shapeClasses() {
            let classes = {'shape': true};
            let typeClass = `shape__${this.shape.type}`;
            classes[typeClass] = true;
            return classes;
        },
        points() {
            return this.shape.points
                .map(point => `${point.x},${point.y}`)
                .join(' ');
        },
        centerX() {
            let x = this.shape.points.map(point => point.x);
            let minX = Math.min.apply(Math, x);
            let maxX = Math.max.apply(Math, x);
            return (minX+maxX)/2;
        },
        centerY() {
            let y = this.shape.points.map(point => point.y);
            let minY = Math.min.apply(Math, y);
            let maxY = Math.max.apply(Math, y);
            return (minY+maxY)/2;
        },
        shapeName() {
            let name = this.shape.name;
            if (name.indexOf('\n') === -1) {
                return name;
            }

            let lines = name.split('\n');
            let lineHeightEm = 1.2;
            let firstShiftEm = -(lines.length-1) * lineHeightEm / 2;

            return lines
                .map((line, index) => `<tspan x="${this.centerX}" dy="${index === 0 ? firstShiftEm : lineHeightEm}em">${line}</tspan>`)
                .join('')
        }
    }
}
</script>

<style scoped lang="scss">
    .shape {
        stroke: #000000;
        stroke-width: 0.5px;

        text {
            font-size: 10px;
            fill: black;
            stroke: white;
            stroke-width: 0.5;
            paint-order:stroke markers fill;
        }

        &__solid polygon {
            fill: white;
        }

        &__dashed {
            polygon {
                fill: rgba(255, 255, 255, 0.5);
                stroke-dasharray: 5 5;
            }

            .coords {
                opacity: 0;
            }
        }

    }
</style>