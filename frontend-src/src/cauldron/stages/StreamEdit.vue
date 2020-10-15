<template>
    <div class="row text-center">
        <div class="col-12 col-md-6 d-flex flex-column align-items-center">
            <label class="subst-a">Раствор желания, л/сек</label>
            <vue-mathjax :formula='`$$\\nu^0_Ж$$`'></vue-mathjax>
            <num-input v-model="flow1" :min="min" :max="max" :step="0.1"></num-input>
        </div>
        <div class="col-12 col-md-6 d-flex flex-column align-items-center">
            <label class="subst-b">Раствор нетерпения, л/сек</label>
            <vue-mathjax :formula="`$$\\nu^0_Н$$`"></vue-mathjax>
            <num-input v-model="flow2" :min="min" :max="max" :step="0.1"></num-input>
        </div>
        <div class="col-12 d-flex flex-column align-items-center mt-4">
            <label class="subst-p">Готовое зелье, л/сек</label>
            <vue-mathjax :formula="`$$\\nu_З = \\nu^0_Ж + \\nu^0_Н$$`"></vue-mathjax>
            <p>{{smartRound(sumFlow)}}</p>
        </div>
        <div class="col-12">
            <button class="btn btn-success btn-block" :disabled="(!changed) || (started && mana < manaCost)" @click="updateFlows">
                {{started ? 'Поменять ('+manaCost+' Маны)' : 'Запустить'}}
            </button>
        </div>
    </div>
</template>

<script>
    import NumInput from "../../components/NumInput";
    import {VueMathjax} from 'vue-mathjax';
    import smartRound from "../mixins/smartRound";

    export default {
        name: "StreamEdit",
        props: ['value', 'max', 'min', 'mana', 'manaCost'],
        components: {NumInput, VueMathjax},
        mixins: [smartRound],
        data() {
            return {
                flow1: this.value[0],
                flow2: this.value[1],
                started: false,
            }
        },
        watch: {
            value() {
                this.flow1 = this.value[0];
                this.flow2 = this.value[1];
            }
        },
        methods: {
            updateFlows() {
                if (this.started) {
                    this.$emit('mana');
                }

                this.started = true;
                this.$emit('input', [this.flow1, this.flow2, this.sumFlow]);
            },
        },
        computed: {
            sumFlow() {
                return this.flow1 + this.flow2;
            },
            changed() {
                return this.flow1 !== this.value[0] || this.flow2 !== this.value[1];
            }
        }
    }
</script>

<style scoped>

</style>