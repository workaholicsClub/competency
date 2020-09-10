<template>
    <div class="input-group" :style="fit ? `width: 100%!important` : ''">
        <div class="input-group-prepend">
            <button
                    type="button"
                    class="btn btn-success"
                    :class="{'btn-lg': this.lg, 'btn-sm': this.sm}"
                    @click="decrease"
                    :disabled="typeof(min) === 'number' && newValue === min"
            >&mdash;</button>
        </div>
        <input
                type="text"
                class="form-control text-center"
                :class="{'form-control-lg': this.lg, 'form-control-sm': this.sm}"
                v-model.number="newValue"
                @change="updateValue"
        >
        <div class="input-group-append">
            <button
                    type="button"
                    class="btn btn-success"
                    :class="{'btn-lg': this.lg, 'btn-sm': this.sm}"
                    @click="increase"
                    :disabled="typeof(max) === 'number' && newValue === max"
            >&plus;</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "IntInput",
        props: {
            'value': {},
            'min': {},
            'max': {},
            'step': {},
            'lg': {type: Boolean, default: true},
            'sm': {type: Boolean, default: false},
            'fit': {type: Boolean, default: false},
        },
        data() {
            return {
                newValue: this.value,
            }
        },
        watch: {
            value() {
                this.newValue = this.value;
            },
            min() {
                this.updateValue();
            },
            max() {
                this.updateValue();
            }
        },
        methods: {
            increase() {
                if (this.max) {
                    this.newValue = this.newValue < this.max ? this.newValue + this.step : this.max;
                }
                else {
                    this.newValue += this.step;
                }

                this.updateValue();
            },
            decrease() {
                if (this.min) {
                    this.newValue = this.newValue > this.min ? this.newValue - this.step : this.min;
                }
                else {
                    this.newValue -= this.step;
                }
                this.updateValue();
            },
            updateValue() {
                if (typeof (this.min) === 'number' && this.newValue < this.min) {
                    this.newValue = this.min;
                }

                if (typeof (this.max) === 'number' && this.newValue > this.max) {
                    this.newValue = this.max;
                }

                this.$emit( 'input', this.newValue );
            }
        }
    }
</script>

<style scoped>
    .input-group {
        width: 10rem;
    }
</style>