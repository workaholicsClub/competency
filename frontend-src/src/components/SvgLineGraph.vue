<template>
    <div>
        <div v-if="showLegend" class="legend">
            <ul>
                <li v-for="(d,index) in dataset" @click="toggleLegend(index)" :style="'opacity: '+(filterIndex.includes(index)?'0.25':'1')+';'" :key="'dataset'+index">
                    <label :style="'background-color: '+d.color+'; margin: auto '+fontSize/2+'px; width: '+fontSize+'px; height: '+fontSize+'px; border-radius: '+fontSize/4+'px;'" />
                    <span :style="'color: '+color+';'">{{d.label}}</span>
                </li>
            </ul>
        </div>
        <div class="chartCont" :id="id"><div>
            <svg>
                <generic-base :propsObj="baseProps" @hover="handleHover">
                    <g v-for="l in lines" :key="l.label">
                        <polyline :points="l.linePoints" :style="'fill: none; stroke: '+l.color+'; stroke-width: 2;'" />
                        <defs v-if="lineFill==='gradient'">
                            <linearGradient :id="id+'-'+l.label.split(' ').join('-')" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" :stop-color="l.color"/>
                                <stop offset="100%" stop-color="white" stop-opacity="0"/>
                            </linearGradient>
                        </defs>
                        <polygon v-if="lineFill==='solid'||lineFill==='gradient'" :points="l.polygonPoints" :fill="lineFill==='solid'?l.color:'url(#'+id+'-'+l.label.split(' ').join('-')+')'" :style="'opacity: '+lineFillOpacity+';'"/>
                        <circle v-for="(p,index) in l.points" :id="id+'-'+l.label+'-data-point-'+index" :cx="p.x" :cy="p.y" :r="circleR(index)" :style="'transition: r 0.15s ease-out; fill: #fff; stroke: '+l.color+'; stroke-width: '+circleR(index)/2+';'" :key="l.label+'-point-'+index"/>
                    </g>
                </generic-base>
            </svg>
        </div></div>
    </div>
</template>

<script>
    import GenericBase from "./GraphParts/GenericBase";
    import flatten from 'lodash.flatten';
    import mixin from "vue-naive-svg-chart/src/mixin";

    export default {
        props: {
            id: {type: String, required: true},
            type: {type: String, required: true},
            fontSize: {type: Number, default: 16},
            padding: {type: Number, default: 16},
            dataset: {type: Array, required: true},
            labels: {type: Array, required: true},
            showLegend: {type: Boolean, default: true},
            color: {type: String, default: '#000'},
            axesStrokeWidth: {type: Number, default: 2},
            stack: {type: Boolean, default: false},
            lineFill: {type: String, default: 'none'},
            lineFillOpacity: {type: Number, default: 0.6},
            animateClass: {type: String},
            showPopUp: {type: Boolean, default: true},
            popUpPadding: {type: Number, default: 16},
            active: {type: Array, default: () => []},
            units: {type: Object, default: () => {}},
        },
        components: {GenericBase},
        mixins: [mixin.generic, mixin.lineAndCol],
        data () {
            return {
                filterIndex: []
            }
        },
        watch: {
            dataset: {
                deep: true,
                handler() {
                    this.sendXPoints();
                    this.sendYPoints();
                }
            },
            innerHeight() {
                this.sendYPoints();
            },
            innerWidth() {
                this.sendXPoints();
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.sendXPoints();
                this.sendYPoints();
            });
        },
        methods: {
            genericCompute (dataset) {
                const ele = document.getElementById(this.id)
                this.longestLabelLength = this.labels.map(l => {
                    let labelText = typeof l === 'string' ? l : l.value;
                    if (this.units && this.units.x) {
                        labelText += ' ' + this.units.x;
                    }
                    return labelText;
                }).sort((a, b) => { return b.length - a.length })[0].length * 10
                this.innerWidth = ele.getBoundingClientRect().width - (this.padding * 2) - this.yAxisSpace
                this.innerHeight = ele.getBoundingClientRect().height - (this.padding * 2) - this.xAxisSpace
                const tempDataArr = (this.type === 'column' || this.type === 'bar') && this.stack ? this.computeStack(dataset) : flatten(dataset.map(d => { return d.data }))
                this.biggest = tempDataArr.reduce((a, b) => { return Math.max(a, b) })
                this.max = Math.ceil(this.biggest / this.stepBaseFactor) * this.stepBaseFactor
                this.smallest = tempDataArr.reduce((a, b) => { return Math.min(a, b) })
                this.min = Math.floor(this.smallest / this.stepBaseFactor) * this.stepBaseFactor
                this.min = this.min > 0 ? 0 : this.min
            },
            handleHover(val) {
                this.hovered = val;
                this.$emit('hover', val);
            },
            toggleLegend (index) {
                const i = this.filterIndex.indexOf(index)
                if (i >= 0) {
                    this.filterIndex.splice(i, 1)
                } else if (this.filterIndex.length !== this.dataset.length - 1) {
                    this.filterIndex.push(index)
                }
            },
            calX (index) {
                return (this.innerWidth / this.labels.length) * (index + 0.5) + this.padding + this.yAxisSpace
            },
            calY (d) {
                return this.padding + this.innerHeight * (1 - ((d - this.min) / (this.max - this.min)));
            },
            circleR (index) {
                const base = Math.min(Math.max((this.innerWidth / this.labels.length) / 10, 4), this.fontSize / 4)
                return index === this.hovered ? base * 2 : base
            },
            sendXPoints() {
                this.$emit('tickUpdate', this.xPoints);
            },
            sendYPoints() {
                this.$emit('pathUpdate', this.yPoints);
            },
            filterByIndex(p, index, lineIndex) {
                let hasActive = this.active && this.active.length === this.computedDataset.length;
                if (!hasActive) {
                    return true;
                }

                return index <= this.active[lineIndex];
            }
        },
        computed: {
            propsObj () {
                return {
                    id: this.id,
                    type: this.type,
                    fontSize: this.fontSize,
                    padding: this.padding,
                    dataset: this.dataset,
                    labels: this.labels,
                    color: this.color,
                    axesStrokeWidth: this.axesStrokeWidth,
                    animateClass: this.animateClass,
                    innerWidth: this.innerWidth,
                    innerHeight: this.innerHeight,
                    yAxisSpace: this.yAxisSpace,
                    xAxisSpace: this.xAxisSpace,
                    hovered: this.hovered,
                    max: this.max,
                    min: this.min,
                    yStepSize: this.yStepSize,
                    xStepSize: this.xStepSize,
                    needRotateLabel: this.needRotateLabel,
                    inView: this.inView,
                    showPopUp: this.showPopUp,
                    popUpPadding: this.popUpPadding,
                    units: this.units
                }
            },
            stepBaseFactor () {
                let range = this.min >= 0 ? this.max : this.max - this.min
                const tens = 10 ** (range.toString().length - 2)
                switch (range.toString().charAt(0)) {
                    case '1':
                    case '2':
                        return 1 * tens;
                    case '3':
                    case '4':
                        return 2 * tens;
                    case '5':
                    case '6':
                        return 5 * tens;
                    case '7':
                    case '8':
                    case '9':
                        return 10 * tens;
                }

                return 1;
            },
            yAxisSpace () {
                let longestLabel = this.max.toString();
                if (this.units && this.units.y) {
                    longestLabel += ' ' + this.units.y;
                }
                return Math.max(longestLabel.length, this.min.toString().length) * 10
            },
            baseProps() {
                return Object.assign(this.propsObj, {
                    hovered: this.active ? this.active : this.hovered,
                });
            },
            computedDataset () {
                return this.dataset.filter((d, index) => {
                    return !this.filterIndex.includes(index)
                })
            },
            xPoints() {
                return this.computedDataset.map(line => {
                    return line.data.map((d, index) => this.calX(index));
                });
            },
            yPoints() {
                const ele = document.getElementById(this.id);
                const containerHeight = ele.getBoundingClientRect().height;
                const rotateGap = this.xAxisSpace - this.fontSize;
                const padding = containerHeight - this.innerHeight - rotateGap;

                return this.computedDataset.map(line => {
                    return line.data.map(d => this.calY(d) + padding);
                });
            },
            lines () {
                return this.computedDataset.map((line, lineIndex) => {
                    const baseLinePoints = line.data.map((d, index) => {
                        return this.calX(index) + ',' + this.calY(d)
                    }).filter((p, index) => this.filterByIndex(p, index, lineIndex));

                    return {
                        color: line.color,
                        label: line.label,
                        points: line.data.map((d, index) => {
                            return {
                                val: d,
                                x: this.calX(index),
                                y: this.calY(d)
                            }
                        }).filter((p, index) => this.filterByIndex(p, index, lineIndex)),
                        linePoints: baseLinePoints.join(' '),
                        polygonPoints: baseLinePoints.concat([
                            this.calX(line.data.length - 1) + ',' + this.calY(0),
                            this.calX(0) + ',' + this.calY(0)
                        ]).join(' ')
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .legend {
        text-align: center;
    }
    .legend ul {
        list-style-type: none;
        margin: 0;
    }
    .legend li {
        display: inline-flex;
        margin: 0 10px;
        cursor: pointer;
    }
    .legend label {
        cursor: pointer;
    }
    .chartCont {
        width: 100%;
        height: 100%;
        position: relative;
    }
    .chartCont > div {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
    }
    .chartCont svg {
        width: 100%;
        height: 100%;
    }
</style>