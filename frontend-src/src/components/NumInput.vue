<template>
    <div class="input-group">
        <div class="input-group-prepend">
            <button type="button" class="btn btn-success btn-minus btn-lg" @click="decrease" :disabled="typeof(min) === 'number' && newValue === min">&mdash;</button>
        </div>
        <input type="text" class="form-control text-center form-control-lg" v-model.number="newValue" @change="updateValue">
        <div class="input-group-append">
            <button type="button" class="btn btn-success btn-plus btn-lg" @click="increase" :disabled="typeof(max) === 'number' && newValue === max">&plus;</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "IntInput",
        props: ['value', 'min', 'max', 'step'],
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
                this.newValue = this.newValue < this.max ? this.newValue + this.step : this.max;
                this.updateValue();
            },
            decrease() {
                this.newValue = this.newValue > this.min ? this.newValue - this.step : this.min;
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