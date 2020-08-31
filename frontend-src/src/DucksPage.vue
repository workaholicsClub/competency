<template>
    <div class="sea">
        <div class="ducks-container">
            <div class="header text-center text-black">
                <h1>Уровень {{levelNumber}} из {{duckLevels.length}}</h1>
                <p><vue-mathjax :formula="mathJaxCurrentEquation"></vue-mathjax></p>
            </div>
            <div class="duck-line">
                <div class="duck duck-red"
                        :style="{'top': duckPosition.red}"
                        :class="{'parked': parked.red, 'back': goesBack.red}"
                >
                    <img :src="require('@/assets/duck_red.png')">
                    <div class="speech-bubble" v-html="duckSays.red" v-if="duckSays.red"></div>
                </div>
                <div class="duck duck-black"
                        :style="{'top': duckPosition.black}"
                        :class="{'parked': parked.black, 'back': goesBack.black}"
                >
                    <img :src="require('@/assets/duck_black.png')">
                    <div class="speech-bubble" v-html="duckSays.black" v-if="duckSays.black"></div>
                </div>

                <div class="graph-container">
                    <svg-line-graph
                            id="line-chart-1"
                            class="duck-graph"
                            type="line"
                            :dataset="lineData"
                            :labels="labels"
                            :padding="16"
                            :showLegend="false"
                            :active="activeGraphPoints"
                            :units="{x: 'сек', y: 'см'}"
                            @hover="handleHover"
                            @pathUpdate="setDuckPath"
                            @tickUpdate="setTickPositions"
                    ></svg-line-graph>
                    <div class="progress-line" :style="{'left': progressPosition+'px'}" :class="{'hidden': isProgressOnStart}"></div>
                </div>

                <div class="hint-speed" :class="{'hidden': hovered === null}">
                    {{hovered}} сек:
                    <span class="text-black">{{hoveredBlack}} см</span>,
                    <span class="text-red">{{hoveredRed}} см</span>
                </div>
            </div>
            <div class="duck-line settings-line">
                <div class="settings-pool"></div>
                <button class="btn btn-duck"
                        :class="{'btn-success': activeButton === 'settings', 'btn-secondary': activeButton !== 'settings'}"
                        @click="toggleSettings"
                >
                    <i class="fas fa-cog"></i>
                </button>
                <button class="btn btn-duck"
                        :class="{'btn-success': activeButton === 'play', 'btn-secondary': activeButton !== 'play'}"
                        @click="goDuckGo"
                >
                    <i class="fas fa-play"></i>
                </button>
            </div>
            <div class="settings-row" :class="{'hidden': !showSettings}">
                <div class="form-group">
                    <label class="text-black">Подбери уравнение <span class="text-red">скорости</span> красной уточки</label>
                    <input type="text" class="form-control form-control-lg" v-model="currentSpeedEquation">
                    <small class="form-text text-right"
                            :class="{'text-red': !speedEquationCorrect, 'text-black': speedEquationCorrect}"
                    >{{speedEquationCorrect ? 'Все ОК' : 'Ошибка в уравнении'}}</small>
                </div>

                <label class="text-black" v-if="currentLevel.coeffs">или пощелкай кнопками</label>
                <div class="form-row form-row mb-4 pb-4" v-if="currentLevel.coeffs">
                    <div class="col-12 col-md-4" v-for="(coeff, index) in currentLevel.coeffs" :key="coeff.title">
                        <num-input :max="coeff.max" :min="coeff.min" :step="coeff.step || 1" v-model="coeffs[index]"></num-input>
                        <label class="coeff-label" v-if="coeff.title">
                            <vue-mathjax :formula="'$$'+coeff.title+'$$'"></vue-mathjax>
                        </label>
                    </div>
                </div>

                <div class="header text-center text-black">
                    <p><vue-mathjax :formula="mathJaxSpeedEquation" v-if="speedEquationCorrect"></vue-mathjax></p>
                </div>
                <div class="graph-container">
                    <svg-line-graph
                            id="line-chart-2"
                            class="duck-graph"
                            type="line"
                            :dataset="speedLineData"
                            :labels="labels"
                            :padding="16"
                            :showLegend="false"
                            :active="[]"
                            :units="{x: 'сек', y: 'см/сек'}"
                            @hover="handleSpeedHover"
                    ></svg-line-graph>
                </div>

                <div class="hint-speed" :class="{'hidden': hoveredSpeed === null}">
                    {{hoveredSpeed}} сек:
                    <span class="text-red">{{hoveredSpeedRed}} см/сек</span>
                </div>
            </div>
        </div>

        <div class="modal fade" :class="{'show': showSuccess}">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-body">
                        <h1 class="mb-4 text-center">Ура!<br>Уровень {{levelNumber}} пройден!</h1>
                        <p class="mt-2"><img class="prize" :src="require('@/assets/prize.png')"></p>
                    </div>
                    <div class="modal-footer justify-content-center">
                        <button type="button" class="btn btn-success btn-lg" @click="nextLevel">Следующий уровень</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" :class="{'show': gameFinished}">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-body">
                        <h1 class="mb-4 text-center">Ученик. Теперь ты Мастер. Постиг ты производные.</h1>
                        <p class="mt-2"><img class="prize" :src="require('@/assets/duck_zen.png')"></p>
                    </div>
                </div>
            </div>
        </div>

        <div class="btn-toolbar btn-toolbar-fixed">
            <div class="btn-group mr-2">
                <a href="https://t.me/skill_itch" target="_blank" class="btn btn-link text-white">
                    <i class="fab fa-telegram-plane"></i>
                </a>
                <a href="https://vk.com/skill_itch" target="_blank" class="btn btn-link text-white">
                    <i class="fab fa-vk"></i>
                </a>
                <a href="https://github.com/workaholicsClub/competency/blob/master/frontend-src/src/DucksPage.vue" target="_blank" class="btn btn-link text-white">
                    <i class="fab fa-github"></i>
                </a>
            </div>
        </div>

    </div>
</template>

<script>
    import SvgLineGraph from "./components/SvgLineGraph";
    import {VueMathjax} from 'vue-mathjax';
    import NumInput from "./components/NumInput";
    import duckLevels from "./duckLevels";
    import { create, all } from 'mathjs';
    const math = create(all, {});

    export default {
        name: "DucksPage",
        components: {SvgLineGraph, VueMathjax, NumInput},
        data() {
            let startPosition = '50vh';
            let settingsPosition = 'calc(50vh + 116px)';

            let levelFromUrl = location.href.replace(/.*\//, '').replace(/\?.*$/, '');
            let isLevelOnlyNumbers = /^\d+$/.test(levelFromUrl);
            let levelNumber = isLevelOnlyNumbers ? parseInt(levelFromUrl) : 1;

            return {
                duckLevels,
                levelNumber,
                showSettings: false,
                showSuccess: false,
                gameFinished: false,
                activeButton: 'play',
                coeffs: [],
                hovered: null,
                hoveredSpeed: null,
                path: {
                    black: null,
                    red: null
                },
                duckPosition: {
                    black: startPosition,
                    red: settingsPosition
                },
                parked: {
                    black: false,
                    red: false,
                },
                goesBack: {
                    black: false,
                    red: false,
                },
                progressPosition: 0,
                ticks: null,
                duckSays: {
                    black: false,
                    red: false,
                },
                startPosition,
                settingsPosition,
                activeGraphPoints: [0, 0],
                animationDelay: 1000,
                duckSayDelay: 2000,
                integrationConst: 0,
                currentSpeedEquation: '10',
            }
        },
        watch: {
            coeffs: {
                deep: true,
                handler() {
                    this.updateSpeedEquation();
                }
            },
            currentSpeedEquation() {
                this.togglePlayButton();
            }
        },
        mounted() {
            this.resetCoeffs();
            this.updateSpeedEquation();
        },
        methods: {
            cssSizeToPx(cssSize) {
                let hiddenEl = document.createElement('div');
                hiddenEl.setAttribute('style', `position: fixed; opacity: 0; width: 1px; height: ${cssSize}`);
                document.body.appendChild(hiddenEl);
                let pxHeight = hiddenEl.getBoundingClientRect().height;
                hiddenEl.remove();

                return pxHeight;
            },
            handleHover(val) {
                this.hovered = val;
            },
            handleSpeedHover(val) {
                this.hoveredSpeed = val;
            },
            toggleSettings() {
                this.showSettings = !this.showSettings;
            },
            hideSettings() {
                this.showSettings = false;
            },
            toggleDuckPark(duckCode, newStatus) {
                this.$set(this.parked, duckCode, newStatus);
                return this.wait(this.animationDelay);
            },
            setDuckPath(paths) {
                this.path.black = paths[0];
                this.path.red = paths[1];

                this.resetDucksPositions();
            },
            setTickPositions(ticks) {
                this.ticks = ticks[0];

                this.resetProgress();
            },
            moveDuckTo(newPos, duckCode) {
                let currentPosition = this.duckPosition[duckCode];
                let currentPx = this.cssSizeToPx(currentPosition);
                let newPx = this.cssSizeToPx(newPos);

                this.$set( this.goesBack, duckCode, currentPx < newPx );
                this.$set( this.duckPosition, duckCode, newPos);

                return this.wait(this.animationDelay);
            },

            moveDuckToStart(duckCode) {
                let startPosition = this.path[duckCode]
                    ? this.path[duckCode][0]+'px'
                    : this.startPosition;

                return this.moveDuckTo(startPosition, duckCode);
            },

            wait(msec) {
                return new Promise(resolve => {
                    setTimeout(resolve, msec);
                });
            },

            async moveDuckToSettings(duckCode) {
                await this.moveDuckTo(this.settingsPosition, duckCode);
                this.$set( this.goesBack, duckCode, false );

                return this.wait(this.animationDelay);
            },

            resetDucksPositions() {
                return Promise.all([
                    this.moveDuckToSettings('red'),
                    this.moveDuckToStart('black')
                ]);
            },

            resetProgress() {
                this.progressPosition = this.ticks && this.ticks.length
                    ? this.ticks[0]
                    : 0;
            },

            resetCoeffs() {
                let newCoeffs = [];
                if (this.currentLevel.coeffs) {
                    newCoeffs = this.currentLevel.coeffs.map( coeff => coeff.start );
                }

                this.coeffs = newCoeffs;
            },

            moveProgressTo(x) {
                this.progressPosition = x;
                return this.wait(this.animationDelay);
            },
            duckSay(duckCode, msg) {
                this.$set(this.duckSays, duckCode, msg);
                return new Promise(resolve => {
                    setTimeout(() => {
                        this.$set(this.duckSays, duckCode, false);
                        resolve();
                    }, this.duckSayDelay);
                });
            },

            showGraphPoint(duckCode, pointIndex) {
                let graphIndex = duckCode === 'black' ? 0 : 1;
                this.$set(this.activeGraphPoints, graphIndex, pointIndex);
            },

            hideRedGraph() {
                this.showGraphPoint('red', 0);
            },

            hideAllGraphs() {
                this.showGraphPoint('red', 0);
                this.showGraphPoint('black', 0);
            },

            async duckSwim(duckCode) {
                for (const pointIndex in this.path[duckCode]) {
                    const point = this.path[duckCode][pointIndex];
                    const progressPoint = this.ticks[pointIndex];

                    this.moveProgressTo(progressPoint);
                    await this.moveDuckTo(point+'px', duckCode);

                    this.showGraphPoint(duckCode, pointIndex);
                }
            },

            showGameSuccess() {
                this.showSuccess = true;
            },

            hideGameSuccess() {
                this.showSuccess = false;
            },

            finishGame() {
                this.gameFinished = true;
            },

            nextLevel() {
                this.levelNumber++;
                history.pushState({}, document.title, '/ducks/'+this.levelNumber);
                this.resetGame();
            },

            async goDuckGo() {
                if (!this.path.red || !this.path.black) {
                    return;
                }

                this.hideSettings();
                this.togglePlayButton();

                if (!this.parked.black) {
                    await this.duckSay('black', `Могу я как. Смотри. Кря.`);
                    await this.duckSwim('black');
                    await this.wait(this.animationDelay);
                    await this.toggleDuckPark('black', true);
                }
                else {
                    this.hideRedGraph();
                    this.hideGameSuccess();
                    this.hideSettings();
                }

                await this.duckSay('black', `Повторить попробуй. Кря.`);

                await Promise.all([
                    this.duckSay('red', 'Не вопрос!'),
                    this.moveDuckToStart('red')
                ]);

                await this.duckSwim('red');

                if (this.isSuccess) {
                    await this.duckSay('red', `Кря! Элементарно!`);
                    await this.duckSay('black', `Преуспел ты ученик. Кря.`);

                    if (this.isGameSuccess) {
                        this.finishGame();
                    }
                    else {
                        this.showGameSuccess();
                        this.togglePlayButton();
                    }
                }
                else {
                    await this.duckSay('red', `Черт! Ща-ща, погоди!`);
                    await this.moveDuckToSettings('red');
                    this.toggleSettingsButton();
                    await this.duckSay('black', 'Ещё пробуй. Кря.');
                }
            },

            resetPark() {
                this.parked = {
                    black: false,
                    red: false,
                };
            },

            resetBack() {
                this.goesBack = {
                    black: false,
                    red: false,
                };
            },

            toggleSettingsButton() {
                this.activeButton = 'settings';
            },

            togglePlayButton() {
                this.activeButton = 'play';
            },

            async resetGame() {
                this.hideGameSuccess();
                this.hideSettings();
                this.hideAllGraphs();
                this.resetProgress();
                this.resetCoeffs();
                this.updateSpeedEquation();
                this.resetPark();
                await this.resetDucksPositions();
                this.resetBack();
                this.togglePlayButton();
            },

            smartRound(num) {
                let maxError = 0.01;
                let roundToInt = Math.round(num);
                let intError = Math.abs(roundToInt - num);
                let roundToFirstFraction = parseFloat(num.toFixed(1));
                let fractionError = Math.abs( roundToFirstFraction - num );

                if (intError <= maxError) {
                    return roundToInt;
                }
                else if (fractionError < maxError) {
                    return roundToFirstFraction;
                }

                return num;
            },

            updateSpeedEquation() {
                if (this.currentLevel.coeffs) {
                    this.currentSpeedEquation = this.currentLevel.speedEquation(this.coeffs);
                }
            }
        },
        computed: {
            speedEquationCorrect() {
                if (!this.currentSpeedEquation) {
                    return false;
                }

                try {
                    let f = math.compile(this.currentSpeedEquation);
                    let d = f.evaluate({t: 1});
                    return typeof d === 'number';
                }
                catch(e) {
                    return false;
                }
            },
            currentLevel() {
                return this.duckLevels[ this.levelNumber - 1 ];
            },
            currentEquation() {
                return this.currentLevel.equation;
            },
            mathJaxCurrentEquation() {
                let texEquation = math.parse(this.currentEquation).toTex();
                let fullEquation = `$$Путь = ${texEquation} (см)$$`;
                return fullEquation.replace('*', '\\cdot');
            },
            mathJaxSpeedEquation() {
                if (!this.currentSpeedEquation) {
                    return '';
                }
                let texEquation = math.parse(this.currentSpeedEquation).toTex();
                let fullEquation = `$$Скорость = ${texEquation} (см/сек)$$`;
                return fullEquation.replace('*', '\\cdot');
            },
            isProgressOnStart() {
                return this.progressPosition === 0 || this.progressPosition === this.ticks[0];
            },
            tPoints() {
                return [0, 1, 2, 3, 4, 5];
            },
            redPoints() {
                if (!this.speedEquationCorrect) {
                    return this.tPoints.map( () => 0 );
                }

                let f = math.compile(this.currentSpeedEquation);
                let tPoints = this.tPoints;
                let integration = [];
                let cumulative = this.integrationConst;
                let step = this.tPoints[1] - this.tPoints[0];
                let integrateScale = 10;
                let tPointsScaled = tPoints.map( t => t*integrateScale );

                /*
                 * Чтобы избежать проблем округления дробей (0.1 + 0.1 + 0.1 === 0.30000000000000004)
                 * хожу целым шагом, но текущее значение масштабирую
                 * Хочу с шагом 0.1 -- 0.1 + 0.1 + 0.1
                 * Хожу с шагом 1 -- 1 + 1 + 1 = 3 и делю на 10, ибо 3/10 это 0.3 а не 0.30000000000000004
                 */
                for (let t = tPoints[0] * integrateScale; t<= tPoints[tPoints.length - 1] * integrateScale; t+=step) {
                    if (tPointsScaled.indexOf(t) !== -1) {
                        integration.push( this.smartRound(cumulative) );
                    }
                    cumulative += f.evaluate({t: (t+step/2)/integrateScale}) * (step/integrateScale);
                }

                return integration;
            },
            blackPoints() {
                let f = math.compile(this.currentEquation);
                return this.tPoints.map((t) => {
                    return f.evaluate({t});
                });
            },
            speedPoints() {
                if (!this.speedEquationCorrect) {
                    return this.tPoints.map( () => 0 );
                }

                let f = math.compile(this.currentSpeedEquation);
                return this.tPoints.map((t) => {
                    return f.evaluate({t});
                });
            },
            isSuccess() {
                let maxError = 1;
                let redPoints = this.redPoints;
                let blackPoints = this.blackPoints;

                let delta = redPoints.map( (redPoint, index) => {
                    const blackPoint = blackPoints[index];
                    return Math.abs(redPoint - blackPoint);
                });

                let currentError = delta.reduce( (summ, point) => {
                    return summ + point;
                }, 0);

                return currentError <= maxError;
            },

            isGameSuccess() {
                return this.isSuccess && this.levelNumber === this.duckLevels.length;
            },

            hoveredRed() {
                return this.hovered !== null
                    ? this.redPoints[this.hovered]
                    : null;
            },
            hoveredBlack() {
                return this.hovered !== null
                    ? this.blackPoints[this.hovered]
                    : null;
            },
            hoveredSpeedRed() {
                return this.hoveredSpeed !== null
                    ? this.speedPoints[this.hoveredSpeed]
                    : null;
            },
            lineData() {
                return [
                    {data: this.blackPoints, color: 'black', label: 'Черная уточка'},
                    {data: this.redPoints, color: 'red', label: 'Красная уточка'},
                ]
            },
            speedLineData() {
                return [
                    {data: this.speedPoints, color: 'red', label: 'Красная уточка'},
                ]
            },
            labels() {
                return this.tPoints.map((point) => {
                    return {
                        value: point.toString(),
                        popUp: point,
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .sea {
        background: #0e7fe1;
        width: 100%;
        max-width: 100vw;
        min-height: 100vh;
        display: flex;
        justify-content: center;
        /*align-items: center;*/
        margin: 0;
        padding: 16px 0;
    }

    .ducks-container {
        max-width: 700px;
        width: 100%;
        margin: 0;
        padding: 0;
        /*display: flex;*/
    }

    .duck-line {
        position: relative;
        /*flex: 1 1 50%;*/
    }

    .settings-line {
        display: flex;
        align-items: center;
    }

    .duck-graph {
        /*width: 700px;*/
        height: 50vh;
        position: relative;
    }

    .duck,
    .duck img {
        height: 100px;
    }

    .duck {
        position: absolute;
        z-index: 10;
        top: 50vh;
        transform: translate(20px, -50px);
        transition: all 1s linear;
    }

    .duck.parked {
        top: -25px!important;
        left: -75px;
        transform: rotate(-270deg) translate(-50px, -30px);
    }

    .duck.back {
        transform: rotate(180deg) translate(-40px, 50px);
    }

    .settings-pool {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        border: 10px solid rgba(0,0,0,0.2);
        margin-right: 8px;
        margin-left: 23px;
    }

    .btn-duck {
        width: 100px;
        height: 100px;
        margin: 0 16px;
        font-size: 60px;
    }

    .hint-speed {
        height: 65px;
        font-size: 24px;
        text-align: center;
        color: black;
    }

    .text-black {
        color: black;
    }

    .text-red {
        color: red;
    }

    .settings-row {
        margin-top: 32px;
        position: relative;
        background: #fff;
        border-radius: .4em;
        padding: 24px;
    }

    .settings-row:after {
        content: '';
        position: absolute;
        top: 0;
        left: 65px;
        width: 0;
        height: 0;
        border: 20px solid transparent;
        border-bottom-color: #fff;
        border-top: 0;
        margin-left: -20px;
        margin-top: -20px;
    }

    .settings-row input {
        background: transparent;
        color: black;
        border: 2px solid black;
    }

    .hidden {
        opacity: 0;
    }
    .settings-row.hidden {
        left: -10000px;
        top: -10000px;
        position: absolute;
    }

    .speech-bubble {
        position: absolute;
        background: #ffffff;
        border-radius: .4em;
        top: 0px;
        right: 0px;
        transform: translate(100%, 0);
        padding: 10px;
    }

    .duck.parked .speech-bubble {
        transform: rotate(270deg) translate(100%, 0);
    }

    .duck.back .speech-bubble {
        transform: rotate(-180deg) translate(100%, 0);
    }

    .speech-bubble:after {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        width: 0;
        height: 0;
        border: 20px solid transparent;
        border-right-color: #ffffff;
        border-left: 0;
        border-top: 0;
        margin-top: -10px;
        margin-left: -20px;
    }

    .graph-container {
        position: relative;
    }

    .progress-line {
        position: absolute;
        width: 1px;
        height: 50vh;
        background: black;
        transform: translate(0, -50vh);
        transition: all 1s linear;
    }

    .modal.show {
        display: block;
    }

    .fade {
        background: rgba(0,0,0,0.3);
    }

    .prize {
        width: 50%;
        margin-left: 50%;
        transform: translate(-50%,0);
    }

    .coeff-label {
        margin-left: 5rem;
        transform: translate(-50%, 0);
    }

    .btn-toolbar-fixed {
        position: fixed;
        right: 8px;
        bottom: 8px;
    }
</style>

<style>
    #MathJax_Message {
        visibility: hidden;
    }
</style>