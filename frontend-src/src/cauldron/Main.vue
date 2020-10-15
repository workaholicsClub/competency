<template>
    <div class="main container container-fluid full-height pb-4 mb-4" >
        <div class="row full-height">
            <div class="col-12 col-sm-6 bg-level p-0" :style="{ backgroundSize: backgroundSize+'px'}" :key="backgroundSize">
                <div class="potion-color" :style="{backgroundColor: potionColor}">
                    <img src="./assets/background.png" ref="bgimg">
                </div>

                <flow :top="substTop" :left="center - substShift" :width="substWidth" :height="substAHeight" color="red"  :speed="flows[0]" :min="flowMin" :max="flowMax"></flow>
                <flow :top="substTop" :left="center + substShift" :width="substWidth" :height="substBHeight" color="blue" :speed="flows[1]" :min="flowMin" :max="flowMax"></flow>
                <flow :top="potionTop" :left="potionLeft" :width="substWidth" :height="substPHeight" :color="potionColor" :speed="flows[2]" :min="flowMin" :max="flowMax"></flow>

                <label class="img-label flow-label" :style="{top: 0, left: 8 * sizeCoefficient + 'px'}">
                    Мана:<br>{{Math.round(mana)}}
                </label>
                <label class="img-label flow-label" :style="{top: 0, left: 160 * sizeCoefficient + 'px'}">
                    Приворот:<br>{{Math.round(fraction*100)}}%
                </label>

                <div class="empty-flasks-bg" :class="{'started': isConveyorStarted}" :style="{top: conveyorTop+'px'}">
                    <div class="conveyor" ref="conveyor" :style="{
                        backgroundSize: conveyorWidth+'px',
                        width: backgroundSize+'px'
                    }">
                        <img src="./assets/conveyer_flask.png" :style="{width: conveyorWidth+'px', opacity: 0}">
                    </div>
                </div>
                <img src="./assets/mixer.png" class="mixer" ref="mixer" :style="{left: mixerLeft+'px', top: mixerTop+'px', width: mixerWidth+'px'}">
            </div>
            <div class="col-12 col-sm-6">
                <h1 class="mb-4">Как сделать 100%-ый приворот?</h1>

                <intro v-if="stage === 1" @next="stage++"></intro>
                <equations v-if="stage === 2" @next="stage++"></equations>

                <div v-if="stage === 3">
                    <button class="btn btn-success btn-block mb-4" @click="stage++" v-if="isFlowStarted">
                        Посчитать наилучший вариант
                    </button>
                    <stream-edit
                            v-model="flows"
                            :min="flowMin"
                            :max="flowMax"
                            :mana="mana"
                            :manaCost="manaCost"
                            @mana="updateManaAndCost"
                            @input="checkWin"
                    ></stream-edit>
                </div>

                <div v-if="stage >= 4 && stage <= 8">
                    <text-stage v-if="stage === 4"
                            title="Про котоел, приворотность и растворы"
                            text="<div>
                                <p>Для приготовления любовного зелья ведьма использует волшебный котел идеального смешения непрерывного действия.</p>
                                <p>На уровне интуиции многим понятно, что приворотность зависит от того, насколько концентрированное любовное зелье вытекает из этого котла.</p>
                                <p>Чем меньше втекает растворов желания и нетерпения, тем медленнее заполняется котел. И тем дольше варится в нем зелье, прежде чем вытечь.</p>
                                <p>Быстро вливается &mdash; меньше варится.</p>
                                <p>Медленно вливается &mdash; долго варится.</p>
                                <p>Варить надо не слишком мало &mdash; тогда сварится много любовного зелья. И не слишком долго &mdash; тогда оно не успеет превратиться в отворотное.</p>
                             </div>
                             <p>Получается, чтобы найти максимум любовного зелья, нужно понять, как его концентрация меняется при изменении потоков.</p>"
                            button-text="Понятно, но с чего начать?"
                            @next="stage++"
                    ></text-stage>
                    <text-stage v-if="stage === 5"
                        title="Природа любит гармонию и баланс"
                        text="<p>
                                В природе все меняет форму, перетекая и мутируя. И даже в волшебном котле все превращается,
                                но не берется из ниоткуда и не пропадает в никуда.
                             </p>
                             <p>И этот баланс &mdash; первая отправная точка для расчета.</p>"
                        button-text="Начнем с баланса"
                        @next="stage++"
                    ></text-stage>

                    <system-of-equations v-if="stage >= 6 && stage <= 8"
                            class="mb-4"
                            :equation-system="equationSystem"
                    ></system-of-equations>

                    <balance v-if="stage === 6"
                            title="Баланс для раствора желания"
                            :scale-factor="sizeCoefficient"
                            color="red"
                            :items="wishItems"
                            v-model="equationSystem[0]"
                            @next="flowStep(0)"
                            :key="stage"
                    ></balance>

                    <balance v-if="stage === 7"
                            title="Баланс для раствора нетерпения"
                            :scale-factor="sizeCoefficient"
                            color="blue"
                            :items="impatienceItems"
                            v-model="equationSystem[1]"
                            @next="flowStep(1)"
                            :key="stage"
                    ></balance>

                    <balance v-if="stage === 8"
                            title="Баланс для любовного зелья"
                            hint="Оно тоже первращаетяся и нужно понять, как быстро"
                            :scale-factor="sizeCoefficient"
                            :color="lovePotionColor"
                            :items="potionItems"
                            v-model="equationSystem[2]"
                            @next="flowStep(2)"
                            :key="stage"
                    ></balance>
                </div>

                <div v-if="stage === 9">
                    <equations-edit
                            v-model="equationSystem"
                            :scale-factor="sizeCoefficient"
                            :edit-rules="expandEquations"
                            @finish="stage++"
                    ></equations-edit>
                </div>

                <div v-if="stage === 10">
                    <constants-edit
                        :equation-system="equationSystem"
                        :constants="constants"
                        @next="afterConstants"
                    ></constants-edit>
                </div>

                <div v-if="stage === 11">
                    <system-of-equations
                            class="mb-4"
                            :equation-system="equationSystem"
                    ></system-of-equations>

                    <text-stage
                            title="Вот что дальше делать с этими уравнениями"
                            button-text="Так. Функция готова!"
                            @next="stage++"
                    >
                        <template v-slot:text>
                            <p>Чтобы найти подходящие потоки желания и нетерпения, нужно понять как от них зависит концентрация любовного зелья.</p>
                            <p>Математически для этого нужно выразить x<sub>Л</sub> через v<sup>вх</sup><sub>Ж</sub> и v<sup>вх</sup><sub>Н</sub>. Для этого и нужны уравнения этой системы.</p>
                            <p class="my-4">
                                <vue-mathjax formula="$$x_Л(\nu^{вх}_Ж, \nu^{вх}_Н) = ?$$"></vue-mathjax>
                            </p>
                            <p>Подставляя в полученную функцию разные значения потоков мы можем понять, где x<sub>Л</sub> максимально.</p>
                            <p>При этих же значениях потоков будет максимальным приворот.</p>
                            <p class="mt-4">Можно проделать все вычисления на бумаге, а можно попробовать
                                <a :href="sympyLink" target="_blank">использовать Python</a>
                            </p>
                        </template>
                    </text-stage>
                </div>

                <div v-if="stage === 12">
                    <text-stage
                            button-text="Можно пробовать новые значения потоков"
                            @next="stage++"
                    >
                        <template v-slot:text>
                            <p>Для начала стоит сверить наши вычисления.</p>
                            <p class="my-4">
                                <vue-mathjax :formula='`$$x_Л(1, 1) = ${Xl(1, 1).toFixed(5)}\\text{ моль/л}$$`'></vue-mathjax>
                                <vue-mathjax :formula='`$$x_Л(4, 5) = ${Xl(4, 5).toFixed(5)}\\text{ моль/л}$$`'></vue-mathjax>
                                <vue-mathjax :formula='`$$x_Л(7, 7) = ${Xl(7, 7).toFixed(5)}\\text{ моль/л}$$`'></vue-mathjax>
                            </p>
                            <p>Когда все будет верно, можно приступить к поиску максимума.</p>
                            <p>Самый простой способ найти максимум &mdash; посчитать в табличном редакторе. Excel или Google Spreadsheet.</p>
                            <p>Понятнее, когда значения <vue-mathjax formula="$\nu^{вх}_Ж$"></vue-mathjax> (0, 0.5, 1.0, ... 7.0) записаны в первом столбце,
                                а значения <vue-mathjax formula="$\nu^{вх}_Н$"></vue-mathjax> (0, 0.5, 1.0, ... 7.0) &mdash; в первой строке. Значения
                                <vue-mathjax formula="$x_Л$"></vue-mathjax> считаются по формуле на пересечении строки и столбца.
                            </p>
                        </template>
                    </text-stage>
                </div>

                <div v-if="stage === 13">
                    <stream-edit
                            v-model="flows"
                            :min="flowMin"
                            :max="flowMax"
                            :mana="mana"
                            :manaCost="manaCost"
                            @mana="updateManaAndCost"
                            @input="checkWin"
                    ></stream-edit>
                </div>

                <div v-if="stage === 0">
                    <p>100%! Вот это да!</p>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import {getMaximum, getConstrainedMinimum} from './df';
    import {Color, findColorBetween} from './color';

    import Flow from './Flow';
    import StreamEdit from "./stages/StreamEdit";

    import Intro from "./stages/Intro";
    import Equations from "./stages/Equations";
    import Balance from "./stages/Balance";
    import TextStage from "./stages/TextStage";
    import EquationsEdit from "./stages/EquationsEdit";
    import SystemOfEquations from "./stages/SystemOfEquations";
    import ConstantsEdit from "./stages/ConstantsEdit";

    import smartRound from "./mixins/smartRound";
    import {VueMathjax} from 'vue-mathjax';

    export default {
        name: "Main",
        components: {EquationsEdit, TextStage, Flow, Intro, Equations, Balance, StreamEdit, SystemOfEquations, ConstantsEdit, VueMathjax},
        mixins: [smartRound],
        data() {
            let levelFromUrl = location.href.replace(/.*\//, '').replace(/\?.*$/, '');
            let isLevelOnlyNumbers = /^\d+$/.test(levelFromUrl);
            let levelNumber = isLevelOnlyNumbers ? parseInt(levelFromUrl) : 1;
            let sympyLink = 'https://colab.research.google.com/drive/1q3gaDEr4le4THcp5d0OjxH042vuV1pDJ?usp=sharing';

            return {
                levelNumber,
                sizeCoefficient: 1,
                backgroundSize: this.getBackgroundSize(),
                wishStreamColor: '#ff0000',
                impatienceStreamColor: '#0000ff',
                sourcePotionColor: '#ff00ff',
                lovePotionColor: '#ffff00',
                hatePotionColor: '#00aaaa',

                potionsPerCoveyorMove: 1,
                maxManaPerPotion: 5,
                mana: 0,
                manaCost: 100,

                conveyorPosition: 0,
                mixerTop: 0,
                mixerLeft: 0,
                mixerShift: 19,
                conveyorInterval: false,
                mixerInterval: false,

                stage: 1,

                leftWeight: 5,
                rightWeight: 7,

                flowMin: 1,
                flowMax: 7,
                flows: [0, 0, 0],
                cauldronV: 60,
                k: [0.45, 0.17],
                Xw0: 0.25,
                Xi0: 0.4,

                sympyLink,
                equationSystem: ['? = ?', '? = ?', '? = ?'],
                //equationSystem: ["n^{вх}_Ж = n^{реаг}_Ж+n^{вых}_Ж", "n^{вх}_Н = n^{реаг}_Н+n^{вых}_Н", "n^{реаг}_Л = n^{отв}_Л+n^{вых}_Л"],

                wishItems: {
                    left: [
                        { title: 'пролилось мимо, моль/сек', formula: 'n^{мимо}_Ж', weight: 4 },
                        { title: 'втекло в котел', formula: 'n^{вх}_Ж', weight: 15 },
                        { title: 'разбрызгалось', formula: 'n^{брызг}_Ж', weight: 1 },
                    ],
                    right: [
                        { title: 'вытекло из котла', formula: 'n^{вых}_Ж', weight: 3 },
                        { title: 'превратилось в котле', formula: 'n^{реаг}_Ж', weight: 12 },
                        { title: 'превратилось и вытекло из котла', formula: 'n^{реаг}_Ж+n^{вых}_Ж', weight: 15 },
                    ],
                },
                impatienceItems: {
                    left: [
                        { title: 'пролилось мимо', formula: 'n^{мимо}_Н', weight: 4 },
                        { title: 'разбрызгалось', formula: 'n^{брызг}_Н', weight: 1 },
                        { title: 'втекло в котел', formula: 'n^{вх}_Н', weight: 15 },
                    ],
                    right: [
                        { title: 'превратилось и вытекло из котла', formula: 'n^{реаг}_Н+n^{вых}_Н', weight: 15 },
                        { title: 'вытекло из котла', formula: 'n^{вых}_Н', weight: 3 },
                        { title: 'превратилось в котле', formula: 'n^{реаг}_Н', weight: 12 },
                    ],
                },
                potionItems: {
                    left: [
                        { title: 'сварилось нового', formula: 'n^{реаг}_Л', weight: 15 },
                        { title: 'выкипело', formula: 'n^{выкип}_Л', weight: 1 },
                        { title: 'прикипело', formula: 'n^{кип}_Л', weight: 4 },
                    ],
                    right: [
                        { title: 'превратилось в отворотное или вытекло из котла, моль/сек', formula: 'n^{отв}_Л+n^{вых}_Л', weight: 15 },
                        { title: 'вытекло из котла, моль/сек', formula: 'n^{вых}_Л', weight: 3 },
                        { title: 'превратилось в отворотное, моль/сек', formula: 'n^{отв}_Л', weight: 12 },
                    ],
                },
                expandEquations: [
                    {
                        left: [ { title: 'втекло в котел, моль/сек', formula: 'n^{вх}_*', weight: 15 } ],
                        right: [
                            { title: 'количество ингредиента во входном потоке раствора, моль/сек', formula: '\\nu^{вх}_* \\cdot x^0_*', weight: 15 },
                            { title: 'поток раствора на входе, л/сек', formula: '\\nu^{вх}_*', weight: 1 },
                            { title: 'концентрация ингредиента в растворе, моль/л', formula: 'x^0_*', weight: 25 },
                        ]
                    },
                    {
                        left: [ { title: 'вытекло из котла, моль/сек', formula: 'n^{вых}_*', weight: 15 } ],
                        right: [
                            { title: 'поток раствора на выходе, л/сек', formula: '\\nu^{вых}', weight: 1 },
                            { title: 'количество ингредиента в выходном потоке раствора, моль/сек', formula: '\\nu^{вых} x_*', weight: 15 },
                            { title: 'концентрация ингредиента в растворе, моль/л', formula: 'x_*', weight: 25 },
                        ]
                    },
                    {
                        left: [ { title: 'превратилось в котле, л/сек', formula: 'n^{реаг}_*', weight: 15 } ],
                        right: [
                            { title: 'сколько ингредиентов превращается во всем объеме котла, л/сек', formula: 'V \\cdot k_1 x_Ж x_Н', weight: 15 },
                            { title: 'сколько ингредиентов превращается в одном литре, 1/сек', formula: 'k_1 x_Ж x_Н', weight: 1 },
                            { title: 'объем котла, л', formula: 'V', weight: 25 },
                        ]
                    },
                    {
                        left: [ { title: 'превратилось в отворотное, моль/сек', formula: 'n^{отв}_Л', weight: 15 } ],
                        right: [
                            { title: 'сколько любовного зелья превращается в отворотное в одном литре, 1/сек', formula: 'k_2 x_Л', weight: 1 },
                            { title: 'объем котла, л', formula: 'V', weight: 25 },
                            { title: 'сколько любовного зелья превращается в отворотное зелье во всем объеме котла, л/сек', formula: 'V \\cdot k_2 x_Л', weight: 15 },
                        ]
                    },
                    {
                        left: [ { title: 'сколько раствора вытекает из котла, л/сек', formula: '\\nu^{вых}', weight: 15 } ],
                        right: [
                            { title: 'поток раствора желания, л/сек', formula: '\\nu^{вх}_Ж', weight: 10 },
                            { title: 'поток раствора нетерпения, л/сек', formula: '\\nu^{вх}_Н', weight: 7 },
                            { title: 'сумма двух потоков, л/сек', formula: '(\\nu^{вх}_Ж+\\nu^{вх}_Н)', weight: 15 },
                        ]
                    },
                ]
            }
        },
        mounted() {
            this.backgroundSize = this.getBackgroundSize();
            this.sizeCoefficient = this.backgroundSize / 256;
            this.conveyorPosition = 32 * this.sizeCoefficient;
            this.mixerTop = 140 * this.sizeCoefficient;
            this.mixerLeft = 117 * this.sizeCoefficient;
        },
        watch: {
            flows: {
                deep: true,
                handler() {
                    this.stopConveyor();
                    this.stopMixer();

                    if (this.flows[0] > 0 || this.flows[1] > 0) {
                        this.startConveyor();
                        this.startMixer();
                    }
                }
            }
        },
        methods: {
            getBackgroundSize() {
                return this.$refs.bgimg ? this.$refs.bgimg.width : 0;
            },
            moveConveyor() {
                this.conveyorPosition += this.conveyorWidth;
                this.mana += this.potionMana * this.potionsPerCoveyorMove;
                this.$refs.conveyor.style.backgroundPosition = this.conveyorPosition+'px center';
            },
            moveMixer() {
                this.mixerLeft += this.mixerShift * this.sizeCoefficient;
                this.$refs.mixer.style.left = this.mixerLeft+'px';
                this.mixerShift = -this.mixerShift;
            },
            startConveyor() {
                this.conveyorInterval = setInterval(this.moveConveyor, 2000);
            },
            stopConveyor() {
                if (this.conveyorInterval) {
                    clearInterval(this.conveyorInterval);
                    this.conveyorInterval = false;
                }
            },
            startMixer() {
                this.mixerInterval = setInterval(this.moveMixer, 500);
            },
            stopMixer() {
                if (this.mixerInterval) {
                    clearInterval(this.mixerInterval);
                    this.mixerInterval = false;
                }
            },

            updateManaAndCost() {
                this.mana -= this.manaCost;
                this.manaCost = Math.round(this.manaCost/100 + 1)*100;
            },

            flowStep(flowId) {
                this.stage++;

                if (flowId === 2) {
                    this.startConveyor();
                    this.startMixer();
                }
            },
            randomInRange(min, max) {
                return min + parseFloat( (Math.random()*(max-min)).toFixed(2) );
            },

            Xw(flowW, flowI) {
                if (flowW === 0 || flowI === 0) {
                    return 0;
                }

                let V = this.cauldronV;
                let k1 = this.k[0];
                let nwi = flowW;
                let nii = flowI;
                let xi = this.Xi(flowW, flowI);
                let xw0 = this.Xw0;

                return (nwi*xw0)/(V*k1*xi+nwi+nii);
            },

            Xi(flowW, flowI) {
                if (flowW === 0 || flowI === 0) {
                    return 0;
                }

                let V = this.cauldronV;
                let k1 = this.k[0];
                let nwi = flowW;
                let nii = flowI;
                let xw0 = this.Xw0;
                let xi0 = this.Xi0;

                let a = V*k1*nii*xi0;
                let b = V*k1*nwi*xw0;
                let c = (nii+nwi)**2;
                let d = 2*V*k1*(nii+nwi);

                let x1 = ( a - b - c - Math.sqrt( a**2 - 2*a*b + b**2 + 2*a*c + 2*b*c + c**2 ) )/d;
                let x2 = ( a - b - c + Math.sqrt( a**2 - 2*a*b + b**2 + 2*a*c + 2*b*c + c**2 ) )/d;

                return x1 > 0 ? x1 : x2;
            },

            Xl(flowW, flowI) {
                if (flowW === 0 || flowI === 0) {
                    return 0;
                }

                let V = this.cauldronV;
                let k1 = this.k[0];
                let k2 = this.k[1];
                let nwi = flowW;
                let nii = flowI;
                let xi = this.Xi(flowW, flowI);
                let xw = this.Xw(flowW, flowI);

                return V * k1 * xi * xw / (V * k2 + nwi + nii);
            },

            maxXl() {
                return this.Xl(this.flowsOpt[0], this.flowsOpt[1]);
            },
            minXl(constraints) {
                return getConstrainedMinimum(this.Xl, constraints);
            },
            afterConstants(systemWithConstants) {
                this.equationSystem = systemWithConstants.map( eqn => {
                    return eqn
                        .replace('\\nu^{вх}_Ж \\cdot '+this.Xw0, this.Xw0+' \\cdot \\nu^{вх}_Ж')
                        .replace('\\nu^{вх}_Н \\cdot '+this.Xi0, this.Xi0+' \\cdot \\nu^{вх}_Н')
                        .replace(this.cauldronV + ' \\cdot ' + this.k[0], (this.cauldronV * this.k[0]).toFixed(2) + ' \\cdot')
                        .replace(this.cauldronV + ' \\cdot ' + this.k[1], (this.cauldronV * this.k[1]).toFixed(2) + ' \\cdot');
                });
                this.stage++;
            },
            checkWin() {
                let isWin = Math.round(this.fraction*100) === 100;
                if (isWin) {
                    this.stage = 0;
                }
            }
        },
        computed: {
            fraction() {
                if (!this.flowsOpt || !this.flowsOpt[0] || !this.flowsOpt[1]) {
                    return 0;
                }

                let nu = [this.flows[0]*this.Xw0, this.flows[1]*this.Xi0];
                let minNu = Math.min.apply(null, nu);
                let nuIndex = nu.indexOf(minNu);
                let optFlow = this.flowsOpt[nuIndex];

                let leftMin = this.minXl([this.flowMin, optFlow]);
                let rightMin = this.minXl([optFlow, this.flowMax]);

                let currentXl = this.Xl(this.flows[0], this.flows[1]);
                let maxXl = this.maxXl();
                let minXl = this.flows[nuIndex] > optFlow
                    ? rightMin
                    : leftMin;

                return Math.abs( currentXl - minXl )/Math.abs( maxXl - minXl );
            },
            potionMana() {
                let displayFraction = Math.round(this.fraction*100);
                if (displayFraction === 100) {
                    return 100;
                }

                if (displayFraction === 99) {
                    return 25;
                }

                let minMana = 0.5;
                let mana = this.maxManaPerPotion * this.fraction;
                if (mana < minMana) {
                    mana = minMana;
                }

                return mana;
            },
            flowsOpt() {
                let flow0 = [this.flows[0], this.flows[1]];
                let flowsOpt = getMaximum( (x) => this.Xl(x[0], x[1]), flow0 );

                if (!flowsOpt || !flowsOpt[0] || !flowsOpt[1]) {
                    return false;
                }

                return flowsOpt;
            },
            potionColor() {
                if (this.flows[0] === 0 && this.flows[1] === 0) {
                    return '#000000';
                }

                if (this.flows[0] === 0) {
                    return this.impatienceStreamColor;
                }

                if (this.flows[1] === 0) {
                    return this.wishStreamColor;
                }

                let noReactionColor = new Color(this.sourcePotionColor);
                let lovePotionColor = new Color(this.lovePotionColor);
                let hatePotionColor = new Color(this.hatePotionColor);
                let potionColor;

                let currentFlow = Math.min(this.flows[0], this.flows[1]);
                let optFlow = Math.min(this.flowsOpt[0], this.flowsOpt[1]);

                if (optFlow > currentFlow) {
                    potionColor = findColorBetween(noReactionColor, lovePotionColor, this.fraction);
                }
                else {
                    potionColor = findColorBetween(hatePotionColor, lovePotionColor, this.fraction);
                }

                return potionColor.asRgbCss();
            },
            conveyorWidth() {
                return 43 * this.sizeCoefficient;
            },
            conveyorTop() {
                return 308 * this.sizeCoefficient;
            },
            mixerWidth() {
                return 4 * this.sizeCoefficient;
            },
            substTop() {
                return 20 * this.sizeCoefficient;
            },
            center() {
                return 128 * this.sizeCoefficient;
            },
            substShift() {
                return 10 * this.sizeCoefficient;
            },
            substHeight() {
                return 136 * this.sizeCoefficient;
            },
            substWidth() {
                return 4 * this.sizeCoefficient;
            },
            potionTop() {
                return 190 * this.sizeCoefficient;
            },
            potionLeft() {
                return 126 * this.sizeCoefficient;
            },
            potionHeight() {
                return 145 * this.sizeCoefficient;
            },
            substAHeight() {
                return this.substHeight * ( this.flows[0] === 0 ? 0 : 1 );
            },
            substBHeight() {
                return this.substHeight * ( this.flows[1] === 0 ? 0 : 1 );
            },
            substPHeight() {
                return this.potionHeight * ( this.flows[2] === 0 ? 0 : 1 );
            },
            isConveyorStarted() {
                return this.conveyorInterval !== false;
            },
            isFlowStarted() {
                return this.flows[0] > 0 || this.flows[1] > 0;
            },
            constants() {
                return [
                    { text: 'Объем котла', formula: 'V', value: this.cauldronV, units: 'л' },
                    { text: 'Концентрация желания', formula: 'x^0_Ж', value: this.Xw0, units: 'моль/л' },
                    { text: 'Концентрация нетерпения', formula: 'x^0_Н', value: this.Xi0, units: 'моль/л' },
                    { text: 'Константа скорости превращения в любовное зелье', formula: 'k_1', value: this.k[0], units: 'л/(моль &sdot; сек)' },
                    { text: 'Константа скорости превращения в отворотное зелье', formula: 'k_2', value: this.k[1], units: 'л/(моль &sdot; сек)' },
                ];
            }
        }
    }
</script>

<style scoped>
    .bg-level {
        position: relative;
        background: url('./assets/dirt_background.png') repeat;
        image-rendering: pixelated;
    }

    .bg-level img {
        width: 100%;
        image-rendering: pixelated;
    }

    .full-height {
        height: 100vh;
    }

    .potion-color {
    }

    .conveyor {
        background: url('./assets/conveyer_flask.png') repeat-x;
        transition: 1s all;
    }

    .mixer {
        position: absolute;
        transition: 1s all;
    }

    .empty-flasks-bg {
        position: absolute;
        left: 0;
        background: rgba(75,28,6,1);
    }

    .empty-flasks-bg.started {
        background: linear-gradient(90deg, rgba(75,28,6,1) 0%, rgba(75,28,6,1) 40%, rgba(75,28,6,0) 47%, rgba(75,28,6,0) 100%);
    }

    .img-label {
        font-size: 64px;
        line-height: 40px;
        color: white;
        position: absolute;
        text-shadow: 2px 0 #000, -2px 0 #000, 0 2px #000, 0 -2px #000;
    }
</style>

<style>
    @font-face {
        font-family: "Thintel";
        src: local("Thintel"),
        url(./assets/thintel.ttf) format("truetype");
    }

    .main, .main .btn {
        font-family: 'Thintel';
        font-size: 30px;
        line-height: 30px;
    }

    #MathJax_Message {
        visibility: hidden;
    }

    .MathJax_Display {
        font-size: 20px;
        line-height: 20px;
    }

    div.subst-a {background-color: red;}
    span.subst-a, label.subst-a {color: red;}
    div.subst-b {background-color: blue;}
    span.subst-b, label.subst-b {color: blue;}
    span.subst-p, label.subst-p {
        color: #ffff00;
        text-shadow: 1px 0 #000, -1px 0 #000, 0 1px #000, 0 -1px #000;
    }
    span.subst-s, label.subst-s {
        color: #00aaaa;
        text-shadow: 1px 0 #000, -1px 0 #000, 0 1px #000, 0 -1px #000;
    }
</style>