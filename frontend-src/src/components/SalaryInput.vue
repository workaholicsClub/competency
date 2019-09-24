<template>
    <div class="salary-input-wrapper">
    </div>
</template>
<script>
    import HistogramInput from "../unsorted/HistogramInput";

    export default {
        name: 'SalaryInput',
        props: ['histogram', 'value', 'width', 'height'],
        data() {
            return {
                roundTo: 1000,
                from: this.value.from,
                to: this.value.to,
                input: false,
                inputId: false
            }
        },
        watch: {
            value: {
                handler() {
                    this.from = this.value.from;
                    this.to = this.value.to;

                    this.input.setHandlePositions(this.from, this.to);
                },
                deep: true
            }
        },
        mounted() {
            this.inputId = 'salary-input-'+this._uid;

            this.input = new HistogramInput(this.$el, {
                inputId: this.inputId,
                fromHandle: this.from,
                toHandle: this.to,
                graphWidth: this.width,
                graphHeight: this.height,
                handleHeight: 53,
                binValues: this.histogram.binValues,
                labelsText: this.histogram.binLabels,
                valueRange: [this.histogram.salary.min, this.histogram.salary.max],
                changeFrom: this.setFrom,
                changeTo: this.setTo
            });
        },
        methods: {
            setRounded(valueCode, rawValue) {
                let roundedValue = Math.round( rawValue / this.roundTo ) * this.roundTo;
                if (this[valueCode] !== roundedValue) {
                    this[valueCode] = roundedValue;
                    this.$emit('input', {from: this.from, to: this.to});
                }
            },
            setFrom(newFrom) {
                this.setRounded('from', newFrom);
            },
            setTo(newTo) {
                this.setRounded('to', newTo);
            }
        }
    }
</script>