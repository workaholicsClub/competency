<template>
    <div class="field">
        <svg :width="width" :height="height"
            @mousedown="startDrag"
            @mousemove="doDrag"
            @mouseup="endDrag"
            @touchstart="startDrag"
            @touchmoce="doDrag"
            @touchend="endDrag"
        >
            <defs>
                <marker id="circle" markerWidth="8" markerHeight="8" refX="4" refY="4">
                    <circle cx="4" cy="4" r="4"/>
                </marker>
            </defs>
            <g class="dots">
                <g v-for="rowIndex in dotsVertical" :key="'r'+rowIndex">
                    <circle v-for="colIndex in dotsHorizontal" :key="'c'+colIndex"
                        style="fill: black"
                        :cx="widthPadding + (colIndex-1)*widthStep"
                        :cy="heightPadding + (rowIndex-1)*heightStep"
                        r="1"
                    />
                </g>
            </g>
            <g class="axis">
                <path id="v-line"
                    :d="`M ${arrowX},0 V ${height}`"
                />
                <path id="h-line"
                    :d="`M 0,${arrowY} H ${width}`"
                />
                <text :x="arrowX-8" :y="arrowY+10">0</text>
            </g>
            <g class="shapes">
                <shape v-for="(shape, index) in shapes" :key="index"
                    :shape="convertShapeToSvgCoors(shape)"
                    marker="circle"
                    :max-x="width"
                    :max-y="height"
                ></shape>
            </g>
        </svg>
        <b-row class="d-sm-none mt-4">
            <b-col cols="6">
                <span>Ось X</span>
                <b-button size="sm" class="ml-2" @click="moveAxis('x', -1)">&minus;</b-button>
                <b-button size="sm" class="ml-2" @click="moveAxis('x', 1)">&plus;</b-button>
            </b-col>
            <b-col cols="6">
                <span>Ось Y</span>
                <b-button size="sm" class="ml-2" @click="moveAxis('y', -1)">&minus;</b-button>
                <b-button size="sm" class="ml-2" @click="moveAxis('y', 1)">&plus;</b-button>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import Shape from "./Shape";
import clone from "lodash.clonedeep";
import {roundToPrecision} from "./round";

export default {
    props: ['width', 'height', 'dotsHorizontal', 'dotsVertical', 'zero', 'snap', 'shapes'],
    components: {Shape},
    data() {
        let heightPadding = 1;
        let widthPadding = 1;

        return {
            arrowX: 0,
            arrowY: 0,
            heightPadding,
            widthPadding,
            dragstart_x: 0,
            dragstart_x_arrow: 0,
            dragstart_y: 0,
            dragstart_y_arrow: 0,
            draggingElement: null,
        }
    },
    watch: {
        width() {
            this.updateAxisPosition();
        },
        height() {
            this.updateAxisPosition();
        },
        zero() {
            this.updateAxisPosition();
        }
    },
    mounted() {
        this.updateAxisPosition();
    },
    methods: {
        updateAxisPosition() {
            let {x, y} = this.gridXYToSvgXY(this.zero);
            this.arrowX = x;
            this.arrowY = y;
        },
        startDrag(event) {
            let isVerticalAxis = event.target.id === 'v-line';
            let isHorizontalAxis = event.target.id === 'h-line';

            if (isVerticalAxis || isHorizontalAxis) {
                this.draggingElement = event.target;
            }

            if (isVerticalAxis) {
                return this.startHorizontalDrag(event);
            }

            if (isHorizontalAxis) {
                return this.startVerticalDrag(event);
            }
        },
        doDrag(event) {
            if (this.draggingElement) {
                event.preventDefault();

                let isVerticalAxis = this.draggingElement.id === 'v-line';
                let isHorizontalAxis = this.draggingElement.id === 'h-line';

                if (isVerticalAxis) {
                    return this.doHorizontalDrag(event);
                }

                if (isHorizontalAxis) {
                    return this.doVerticalDrag(event);
                }
            }
        },
        endDrag(event) {
            if (this.draggingElement) {
                let isVerticalAxis = this.draggingElement.id === 'v-line';
                let isHorizontalAxis = this.draggingElement.id === 'h-line';

                if (isVerticalAxis || isHorizontalAxis) {
                    this.draggingElement = null;
                }

                if (isVerticalAxis) {
                    return this.endHorizontalDrag(event);
                }

                if (isHorizontalAxis) {
                    return this.endVerticalDrag(event);
                }
            }
        },
        startVerticalDrag(event) {
            this.dragstart_y = event.clientY;
            this.dragstart_y_arrow = this.arrowY;
        },
        doVerticalDrag(event) {
            let dragY = event.clientY;
            let dragDelta = dragY - this.dragstart_y;
            this.arrowY = this.dragstart_y_arrow + dragDelta;
        },
        endVerticalDrag() {
            this.dragstart_y = 0;
            if (this.snap) {
                this.arrowY = this.closestGridY(this.arrowY);
            }
            this.emitZeroPosition();
        },
        startHorizontalDrag(event) {
            this.dragstart_x = event.clientX;
            this.dragstart_x_arrow = this.arrowX;
        },
        doHorizontalDrag(event) {
            let dragX = event.clientX;
            let dragDelta = dragX - this.dragstart_x;
            this.arrowX = this.dragstart_x_arrow + dragDelta;
        },
        endHorizontalDrag() {
            this.dragstart_x = 0;
            if (this.snap) {
                this.arrowX = this.closestGridX(this.arrowX);
            }
            this.emitZeroPosition();
        },
        closestGridX(x) {
            return Math.round(x/this.widthStep) * this.widthStep + this.widthPadding;
        },
        closestGridY(y) {
            return Math.round(y/this.heightStep) * this.heightStep + this.heightPadding;
        },
        svgXYToGridXY({x: svgX = 0, y: svgY = 0}, widthPadding = null, heightPadding = null) {
            if (!widthPadding) {
                widthPadding = this.widthPadding;
            }

            if (!heightPadding) {
                heightPadding = this.heightPadding;
            }

            let gridX = (svgX-widthPadding)/(this.width-2*widthPadding) * this.dotsHorizontal;
            let gridY = (svgY-heightPadding)/(this.height-2*heightPadding) * this.dotsVertical;
            return {x: roundToPrecision(gridX, 4), y: roundToPrecision(gridY, 4)};
        },
        gridXYToSvgXY({x: gridX = 0, y: gridY = 0}, widthPadding = null, heightPadding = null) {
            if (!widthPadding) {
                widthPadding = this.widthPadding;
            }

            if (!heightPadding) {
                heightPadding = this.heightPadding;
            }

            let svgX = gridX/this.dotsHorizontal * (this.width-2*widthPadding) + widthPadding;
            let svgY = gridY/this.dotsVertical * (this.height-2*heightPadding) + heightPadding;
            return {x: svgX, y: svgY};
        },
        emitZeroPosition() {
            let zeroPos = this.svgXYToGridXY({x: this.arrowX, y: this.arrowY});
            this.$emit('zeroposition', zeroPos);
        },
        convertShapeToSvgCoors(shape) {
            let convertedShape = clone(shape);
            convertedShape.points = shape.points.map(point => this.gridXYToSvgXY(point));
            return convertedShape;
        },
        moveAxis(axisType, delta) {
            if (axisType === 'x') {
                let {x: step} = this.gridXYToSvgXY({x: delta});
                let newArrowX = this.closestGridX(this.arrowX + step);
                if (newArrowX <= this.width && newArrowX >= 0) {
                    this.arrowX = newArrowX;
                    this.emitZeroPosition();
                }
            }

            if (axisType === 'y') {
                let {y: step} = this.gridXYToSvgXY({y: delta});
                let newArrowY = this.closestGridX(this.arrowY - step);
                if (newArrowY <= this.height && newArrowY >= 0) {
                    this.arrowY = newArrowY;
                    this.emitZeroPosition();
                }
            }
        }
    },
    computed: {
        heightStep() {
            return (this.height-2*this.heightPadding)/(this.dotsVertical-1);
        },
        widthStep() {
            return (this.width-2*this.widthPadding)/(this.dotsHorizontal-1);
        }
    }
}
</script>

<style scoped lang="scss">
    #circle {
        fill: black;
        stroke: none;
    }

    .axis {
        path {
            fill: none;
            fill-rule: evenodd;
            stroke: red;
            stroke-width: 1.265;
            stroke-linecap: butt;
            stroke-linejoin: miter;
            stroke-opacity: 1;
            stroke-miterlimit: 4;
            stroke-dasharray: none;
        }

        text {
            font-size:10px;
            fill: red;
            fill-opacity: 1;
            stroke: white;
            stroke-width: 0.2;
            stroke-miterlimit: 4;
            stroke-dasharray: none;
            stroke-opacity: 1;
            paint-order:stroke markers fill;
        }

        #v-line {
            cursor: e-resize;
        }

        #h-line {
            cursor: n-resize;
        }
    }
</style>