<template>
    <div>
        <p>
            Некоторые из этих величин нам известны из древних магических книг. Некоторые мы выбрали сами.
            Можно сразу заменить их в уравнениях, чтобы было легче считать.
        </p>
        <p class="my-4">
            <system-of-equations :equation-system="displaySystem" :highlight-values="constantFormulas" color="blue"></system-of-equations>
        </p>
        <div class="form-group row" v-for="(constant, index) in constants" :key="index">
            <div class="col-6" v-html="constant.text +',<br>'+ constant.units"></div>
            <div class="col-6">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" v-model="replace[index]" :id="'cb'+index">
                    <label class="form-check-label" :for="'cb'+index">
                        <vue-mathjax :formula="`$${constant.formula} = ${constant.value}$`"></vue-mathjax>
                    </label>
                </div>
            </div>
        </div>
        <p class="text-center">
            <button class="btn btn-success" @click="$emit('next', displaySystem)" :disabled="!allChecked">Готово! Что дальше?</button>
        </p>
    </div>
</template>

<script>
    import SystemOfEquations from "./SystemOfEquations";
    import {VueMathjax} from 'vue-mathjax';

    export default {
        name: "ConstantsEdit",
        components: {SystemOfEquations, VueMathjax},
        props: ['constants', 'equationSystem'],
        data() {
            return {
                replace: Array(this.constants.length).fill(false),
            }
        },
        methods: {
            replaceInArray(arr, from, to) {
                return arr.map( str => str.replaceAll(from, to) );
            },
        },
        computed: {
            constantFormulas() {
                return this.constants.map( constant => constant.formula );
            },
            displaySystem() {
                let display = this.equationSystem.slice();

                for (const index in this.constants) {
                    let replaceConstant = this.replace[index] === true;
                    if (replaceConstant) {
                        let constant = this.constants[index];
                        display = this.replaceInArray(display, constant.formula, constant.value);
                    }
                }

                return display;
            },
            allChecked() {
                return this.replace.reduce( (result, current) => result && current, true );
            }
        }
    }
</script>

<style scoped>

</style>