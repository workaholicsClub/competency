<template>
    <div>
        <p>{{title}}</p>
        <p v-if="hint">{{hint}}</p>
        <div class="d-flex justify-content-center mb-4">
            <scales :scale-factor="scaleFactor * 2" :left-weight="leftWeight" :right-weight="rightWeight"></scales>
        </div>
        <div class="row mb-4 answers">
            <div class="col-6" :class="{'d-flex align-items-center': items.left.length === 1}">
                <ul class="list-group" v-if="items.left.length > 1">
                    <li v-for="item in items.left" :key="item.title"
                            class="list-group-item d-flex justify-content-between align-items-center text-right"
                            :class="{'active': item.formula === leftActive}"
                            @click="updateLeft(item)"
                    >
                        <img src="../assets/ingredient.png" :style="{backgroundColor: color}" v-if="!skipPotionImg">
                        <span><span v-html="item.title"></span><br> <vue-mathjax :formula="'$'+item.formula+'$'"></vue-mathjax></span>
                    </li>
                </ul>
                <div class="list-group w-100" v-else>
                    <div class="d-flex justify-content-between align-items-center text-right list-group-item active">
                        <img src="../assets/ingredient.png" :style="{backgroundColor: color}" v-if="!skipPotionImg">
                        <span><span v-html="items.left[0].title"></span><br> <vue-mathjax :formula="'$'+items.left[0].formula+'$'"></vue-mathjax></span>
                    </div>
                </div>
            </div>
            <div class="col-1 d-flex align-items-center justify-content-center eq"><span>=</span></div>
            <div class="col-6">
                <ul class="list-group text-right">
                    <li v-for="item in items.right" :key="item.title"
                        class="list-group-item d-flex justify-content-between align-items-center"
                        :class="{'active': item.formula === rightActive}"
                        @click="updateRight(item)"
                    >
                        <img src="../assets/ingredient.png" :style="{backgroundColor: color}" v-if="!skipPotionImg">
                        <span><span v-html="item.title"></span><br> <vue-mathjax :formula="'$'+item.formula+'$'"></vue-mathjax></span>
                    </li>
                </ul>
            </div>
        </div>
        <p class="text-center">
            <button class="btn btn-success" @click="$emit('next')" :disabled="!isBalanced">{{buttonTitle || 'Следующий ингредиент'}}</button>
        </p>
    </div>
</template>

<script>
    import Scales from "../Scales";
    import {VueMathjax} from 'vue-mathjax';

    export default {
        name: "Balance",
        components: {Scales, VueMathjax},
        props: ['scaleFactor', 'color', 'title', 'items', 'buttonTitle', 'hint', 'skipPotionImg'],
        data() {
            return {
                leftActive: this.items.left.length > 1 ? false : this.items.left[0].formula,
                leftWeight: this.items.left.length > 1 ? false : this.items.left[0].weight,

                rightActive: false,
                rightWeight: false,
            }
        },
        methods: {
            updateLeft(item) {
                this.leftActive = item.formula;
                this.leftWeight = item.weight;
                this.emitInput();
            },
            updateRight(item) {
                this.rightActive = item.formula;
                this.rightWeight = item.weight;
                this.emitInput();
            },
            emitInput() {
                let eq = (this.leftActive || '?') + ' = ' + (this.rightActive || '?');
                this.$emit('input', eq, this.rightActive);
            }
        },
        computed: {
            isBalanced() {
                return this.leftWeight > 0 && this.rightWeight > 0 && this.leftWeight === this.rightWeight;
            }
        }
    }
</script>

<style scoped>
    .list-group {
        font-size: 20px;
        line-height: 20px;
    }

    .list-group-item {
        cursor: pointer;
    }

    .answers {
        position: relative;
    }

    .eq {
        position: absolute;
        left: 50%;
        margin-left: -15px;
        width: 30px;
        height: 100%;
    }
</style>