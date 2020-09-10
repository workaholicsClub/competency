<template>
    <div class="slope" :class="{'animate': showAnimation}">
        <div class="graph-container">
            <svg-line-graph
                    id="line-chart-1"
                    class="slope-graph"
                    type="line"
                    :dataset="lineData"
                    :labels="labels"
                    :padding="16"
                    :showLegend="false"
                    :units="{x: 'м', y: 'м'}"
                    @pathUpdate="setGraphY"
                    @tickUpdate="setGraphX"
            ></svg-line-graph>
        </div>

        <div class="controls">
            <button type="button" class="close" @click="showControls = !showControls">
                <i class="fa" :class="{'fa-eye': !showControls, 'fa-eye-slash': showControls}"></i>
            </button>

            <div class="mb-2">
                <h5>Лыжи едут, #{{levelNumber}}</h5>
                <button type="button" class="btn btn-link pl-0" @click="showWhy = true">Зачем?</button>
                <button type="button" class="btn btn-link" @click="showRules = true">Правила</button>
                <button type="button" class="btn btn-link" @click="showParamsInfo = true">О параметрах</button>
            </div>

            <div v-if="showControls">
                <div class="form-row">
                    <div class="col-12 mb-4">
                        <vue-mathjax :formula="`$$y=${approxEquation.replace(/\*/g, ' \\cdot ').replace(/\^(\d+)/g, '^{$1}')}$$`"></vue-mathjax>
                    </div>
                    <div class="col-12 col-md-6">
                        <vue-mathjax :formula="`$R^2=$`"></vue-mathjax><span>{{r2.toFixed(2)}}</span>
                    </div>
                    <div class="col-12 col-md-6">
                        <vue-mathjax :formula="`$R^2_{пров.}=$`"></vue-mathjax><span>{{r2test.toFixed(2)}}</span>
                    </div>
                </div>
                <div class="form-row mb-4 mt-4">
                    <div class="col-12 col-md-6 text-center d-flex align-items-center flex-column d-md-block text-md-left">
                        <label>Степень уравнения</label>
                        <num-input :max="10" :min="1" :step="1" v-model="approxPower"></num-input>
                    </div>
                    <div class="col-12 col-md-6 d-flex align-items-end" v-if="currentLevel.showLsq">
                        <button type="button" class="btn btn-success btn-block mt-2" @click="findCoeffs">Запустить МНК</button>
                    </div>
                </div>
                <div class="form-row">
                    <div class="col-12 col-md-6 col-lg-4" v-for="(_, index) in approxCoeffs" :key="'coeff'+index">
                        <num-input :step="1" v-model="approxCoeffs[index]" :lg="false" :fit="true"></num-input>
                        <label class="text-center w-100 mt-1">
                            <vue-mathjax formula="$$C$$" v-if="index === 0"></vue-mathjax>
                            <vue-mathjax formula="$$x$$" v-else-if="index === 1"></vue-mathjax>
                            <vue-mathjax :formula="`$$x^{${index}}$$`" v-else></vue-mathjax>
                        </label>
                    </div>
                </div>
                <div class="form-row">
                    <div class="col-12 col-md-6 mb-2">
                        <button class="btn btn-success btn-block" @click="updateRandomPoints">Новые флажки</button>
                    </div>
                    <div class="col-12 col-md-6">
                        <button class="btn btn-success btn-block" @click="startTest">Проверить</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="skier"
            :style="`top: ${skier.y}px; left: ${skier.x}px; transform: translate(${skierTranslate.x}px, ${skierTranslate.y}px) rotate(${skierRotation}deg);`"
        >
            <img :src="require('@/assets/skier.png')">
        </div>

        <div class="modal fade" :class="{'show': showWhy}">
            <div class="modal-dialog modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-body">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Закрыть" @click="showWhy = false">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h1 class="mb-4 text-center">Зачем?</h1>
                        <p class="mt-2">
                            Заглянуть в будущее &mdash; редко кто от этого откажется. &laquo;Знал бы прикуп, жил бы в Сочи&raquo;,
                            &laquo;Знал бы, где упаду &mdash; соломки б подложил&raquo; &mdash; известные многим пословицы. А
                            спортивный альманах 1950-2000 из &laquo;Назад в будущее&raquo;?
                        </p>
                        <p class="mt-2">
                            И вот аппроксимация дает нам возможность одним газком в это будущее заглянуть. Дело в том, что многие
                            события &mdash; закономерны. И зная закономерность, можно понять, что будет дальше. Чего ждать. К
                            чему готовится. На что стоит расчитывать, а что &mdash; нереально.
                        </p>
                        <p class="mt-2">
                            Аппроксимация позволяет подобрать уравнение, которое описывает закон, по которому измеряется какая-то величина.
                            Продажи туров в Турцию в зависимости от времени года, например.
                        </p>
                        <p class="mt-2">
                            Зная то, что было &mdash; измерения &mdash; и определив закон, по которому
                            все меняется &mdash; уравнение &mdash; можно немного предсказать будущее. И может быть даже немного заработать на этом.
                        </p>
                    </div>
                    <div class="modal-footer justify-content-center">
                        <button type="button" class="btn btn-success btn-lg" @click="showWhy = false">Закрыть</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" :class="{'show': showRules}">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-body">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Закрыть" @click="showRules = false">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h1 class="mb-4 text-center">Правила</h1>
                        <p class="mt-2">
                            Лыжню засыпало снегом, видны только флажки. Их ставили как могли, поэтому
                            стоят они немного криво. Но рядом с лыжней.
                        </p>
                        <p class="mt-2">
                            Флажки могут стоять по-разному, но лыжня всегда на одном и том же месте.
                            Нужно подобрать уравнение так, чтобы проложить новую лыжню как можно ближе к старой.
                        </p>
                    </div>
                    <div class="modal-footer justify-content-center">
                        <button type="button" class="btn btn-success btn-lg" @click="showRules = false">Закрыть</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" :class="{'show': showParamsInfo}">
            <div class="modal-dialog modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-body">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Закрыть" @click="showParamsInfo = false">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h1 class="mb-4 text-center">Параметры</h1>
                        <p class="mt-2">
                            $R^2$ &mdash; коэффициент детерминации. Показывает насколько близко лыжня проходит к
                            флажкам.
                        </p>
                        <p class="mt-2">
                            Чем ближе $R^2$ к 1, тем лучше. $R^2 = 1$ когда лыжня пройдет точно по флажкам. Или, выражаясь
                            математично &mdash; когда предсказания по уравнению на 100% совпали с наблюдениями. Такое бывает примерно никогда.<br>
                            Отрицательное зачение $R^2$ значит, что уравнение предсказывает наблюдения хуже, чем простое
                            среднее значение.
                        </p>
                        <p class="mt-2">
                            $R^2_{пров.}$ &mdash; коэффициент детерминации, определенный на проверочной выборке.
                        </p>
                        <p class="mt-2">
                            Существует легенда о том, что железная дорога Москва-Питер такая прямая, потому что Николай
                            2 провел ее линейкой на карте. А небольшой изгиб на этой дороге в том месте, где император случайно обвел
                            свой палец.
                        </p>
                        <p class="mt-2">
                            Стоит ли прокладывать лыжню так, чтобы она шла по обведенному пальцу? Стоит ли составлять уравнение
                            так, чтобы оно учитывало случайные ошибки измерений? Уверен &mdash; многие скажут твердое "нет". Ведь
                            если повторить измерения, то и ошибки будут другими.
                        </p>
                        <p class="mt-2">
                            Уравнение, которое "учитывает палец" называется переобученным. И чтобы переобучения не было,
                            уравнение проверяют на другом, тестовом наборе измерений. А в этой игре &mdash; на новом наборе
                            флажков. Поскольку засыпанная лыжня всегда одна и та же, новая лыжня должна проходить близко
                            с любым набором флажков старой лыжни.
                        </p>
                        <p class="mt-2">
                            Математически говоря, значение $R^2$ должно быть близко к значению $R^2{пров.}$
                        </p>
                        <p class="mt-2">
                            Чем ближе $R^2$ и $R^2_{пров.}$ друг к другу и к 1-це, тем лучше. Но легко ли подобрать?
                        </p>
                        <p class="mt-2">
                            МНК &mdash; метод автоматического подбора коэффициентов. Само уравнение задает форму лыжни. Прямая.
                            С изгибом. С одним поворотом или двумя. А где проходит лыжня выбранной формы и куда направлены ее повороты &mdash;
                            определяется коэффициентами. Подбирать их может утомительно. И для того, чтобы найти коэффициенты одним "щелчком"
                            есть метод наименьших квадратов, МНК, least squares или LSQ. Этот метод позволяет подобрать коэффициенты уравнения так,
                            чтобы лыжня выбранной формы прошла максимально близко к флажкам. И это очень распространенный метод.
                        </p>
                    </div>
                    <div class="modal-footer justify-content-center">
                        <button type="button" class="btn btn-success btn-lg" @click="showParamsInfo = false">Закрыть</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" :class="{'show': showResult}">
            <div class="modal-dialog">
                <div class="modal-content" v-if="levelSuccess">
                    <div class="modal-body">
                        <h1 class="mb-4 text-center">Ура!<br>Уровень {{levelNumber}} пройден!</h1>
                        <p class="mt-2">
                            Неплохая точность!
                        </p>
                        <p class="mt-2">
                            Исходное уравнение: <vue-mathjax :formula="`$$y=${flagsEquation.replace(/\*/g, ' \\cdot ').replace(/\^(\d+)/g, '^{$1}')}$$`"></vue-mathjax>
                        </p>
                        <p class="mt-2">
                            Твое уравнение: <vue-mathjax :formula="`$$y=${approxEquation.replace(/\*/g, ' \\cdot ').replace(/\^(\d+)/g, '^{$1}')}$$`"></vue-mathjax>
                        </p>
                    </div>
                    <div class="modal-footer justify-content-center">
                        <button type="button" class="btn btn-success btn-lg" @click="nextLevel">Следующий уровень</button>
                    </div>
                </div>
                <div class="modal-content" v-else>
                    <div class="modal-body">
                        <h1 class="mb-4 text-center">Неа:(</h1>
                        <p class="mt-2">
                            Ты можешь точнее!
                        </p>
                    </div>
                    <div class="modal-footer justify-content-center">
                        <button type="button" class="btn btn-success btn-lg" @click="showResult = false">Закрыть</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" :class="{'show': gameFinished}">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-body">
                        <h1 class="mb-4 text-center">Вот и все. Парам-парам-пам.</h1>
                        <p class="mt-2">
                            Так делается аппроксимация и определение параметров аппроксимационной зависимости.
                        </p>
                        <p class="mt-2">
                            Теперь ты представляешь, как можно определить правило изменения какой-то величины. Температуры.
                            Прибыли. Количества заказов. Выхода продукта в химическом реакторе.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="btn-toolbar btn-toolbar-fixed">
            <div class="btn-group mr-2">
                <a href="https://t.me/skill_itch" target="_blank" class="btn btn-link text-black">
                    <i class="fab fa-telegram-plane"></i>
                </a>
                <a href="https://vk.com/skill_itch" target="_blank" class="btn btn-link text-black">
                    <i class="fab fa-vk"></i>
                </a>
                <a href="https://github.com/workaholicsClub/competency/blob/master/frontend-src/src/DucksPage.vue" target="_blank" class="btn btn-link text-black">
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
    import regression from 'regression';
    import { create, all } from 'mathjs';
    const math = create(all, {});

    export default {
        name: "SlopePage",
        components: {SvgLineGraph, VueMathjax, NumInput},
        data() {
            let levelFromUrl = location.href.replace(/.*\//, '').replace(/\?.*$/, '');
            let isLevelOnlyNumbers = /^\d+$/.test(levelFromUrl);
            let levelNumber = isLevelOnlyNumbers ? parseInt(levelFromUrl) : 1;

            return {
                slopeLevels: [
                    {equation: '15 * x', showLsq: false},
                    {equation: '4.5 + 21 * x', showLsq: false},
                    {equation: '7.5 - 13 * x + 2*x^2', showLsq: true},
                    {equation: '3 + 25 * x -5*x^2', showLsq: true},
                    {equation: '-5 - 7 * x + x^3', showLsq: true},
                ],
                levelNumber,
                showAnimation: false,
                showRules: false,
                showParamsInfo: false,
                showResult: false,
                showWhy: false,
                levelSuccess: false,
                showControls: true,
                gameFinished: false,
                skier: {x: 0, y: 0},
                skierRotation: 0,
                skierTranslate: {x: 0, y: 0},
                approxPower: 1,
                approxCoeffs: [],
                randomPoints: [],
                randomTestPoints: [],
                r2results: [],
                currentTest: 1,
                totalTests: 5,
                graphY: [],
                graphX: [],
                xStep: 1,
                animationDelay: 300,
                errorCoeff: 3,
            }
        },
        mounted() {
            this.updateRandomPoints();
            this.syncApproxCoeffsCount();
        },
        watch: {
            approxPower() {
                this.syncApproxCoeffsCount();
            },
            graphY() {
                if (!this.showAnimation) {
                    this.skierToStart();
                }
            }
        },
        methods: {
            finishGame() {
                this.gameFinished = true;
            },
            nextLevel() {
                this.levelNumber++;
                history.pushState({}, document.title, '/slope/'+this.levelNumber);
                return this.resetGame();
            },
            resetGame() {
                this.showAnimation = false;
                this.showRules = false;
                this.showParamsInfo = false;
                this.showResult = false;
                this.showWhy = false;
                this.levelSuccess = false;
                this.updateRandomPoints();
                return this.skierToStart();
            },
            setGraphY(paths) {
                this.graphY = paths;
                this.skierToStart();
            },
            setGraphX(ticks) {
                this.graphX = ticks[0];
                this.skierToStart();
            },
            getSkierPosition(index) {
                return {
                    x: Math.round(this.graphX[index]),
                    y: Math.round(this.graphY[1][index]),
                }
            },
            getSkierRotation(index) {
                let isLastPoint = index === this.xPoints.length -1;
                if (isLastPoint) {
                    return this.getSkierRotation(index - 1);
                }

                let currentPosition = this.getSkierPosition(index);
                let nextPosition = this.getSkierPosition(index+1);

                let tgAlpha = (nextPosition.y - currentPosition.y) / (nextPosition.x - currentPosition.x);
                let alphaDeg = (Math.atan(tgAlpha) / Math.PI) * 180;
                let alphaDegCWFromTop = 90 + alphaDeg;
                return alphaDegCWFromTop;
            },
            getFlagPosition(index) {
                return {
                    x: Math.round(this.graphX[index]),
                    y: Math.round(this.graphY[0][index]),
                }
            },
            moveSkierToPoint(index, wait = false) {
                if (this.graphY.length > 0 && this.graphX.length > 0) {
                    this.skier = this.getSkierPosition(index);
                    this.skierRotation = this.getSkierRotation(index);

                    let a = this.skierRotation / 180 * Math.PI;

                    let x = 40;
                    let y = 51;

                    let trX = x + y * Math.sin(a);
                    let trY = 2 * y - y * Math.cos(a);

                    this.skierTranslate = {x: -trX, y: -trY};

                    return wait ? this.wait(this.animationDelay) : null;
                }
            },
            skierToStart() {
                let prevState = this.showAnimation;
                return this.$nextTick(() => {
                    this.moveSkierToPoint(0, false);
                    this.showAnimation = prevState;
                });
            },
            syncApproxCoeffsCount() {
                let approxCoeffCount = this.approxPower + 1;
                let oldCoeffs = this.approxCoeffs;
                let newCoeffs = Array(approxCoeffCount).fill(1).map((_, index) => {
                    return oldCoeffs[index] ? oldCoeffs[index] : _;
                });

                this.approxCoeffs = newCoeffs;
            },
            getEquationPoints(equation, xPoints) {
                let zeroes = Array(xPoints.length).fill(0);

                try {
                    let f = math.compile(equation);
                    return xPoints.map((x) => {
                        return f.evaluate({x});
                    });
                }
                catch (e) {
                    return zeroes;
                }
            },
            randomGaussianNumberUsingBoxMullerTransform(min, max, skew) {
                let u = 1 - Math.random();
                let v = 1 - Math.random();

                let gaussianRandom = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
                let gaussianRandomScaled01 = gaussianRandom / 10.0 + 0.5;

                if (gaussianRandomScaled01 > 1 || gaussianRandomScaled01 < 0) {
                    return this.randomGaussianNumberUsingBoxMullerTransform(min, max, skew);
                }

                let skewedRandom = Math.pow(gaussianRandomScaled01, skew);
                let scaledMinMax = skewedRandom * (max - min) + min;

                return scaledMinMax;
            },
            getDelta(points) {
                let prevPoint = false;
                let delta = [];

                for (let currentPoint of points) {
                    if (prevPoint !== false) {
                        delta.push(currentPoint - prevPoint);
                    }
                    prevPoint = currentPoint;
                }

                return delta;
            },
            generateEquationDataWithRandomError(equation, xPoints) {
                let yPoints = this.getEquationPoints(equation, xPoints);

                let dYPoints = this.getDelta(yPoints);
                let avgDelta = dYPoints.reduce( (sum, dY) => sum + dY, 0 )/dYPoints.length;
                let maxAbsError = this.errorCoeff * avgDelta;

                let min = -maxAbsError;
                let max = maxAbsError;
                let skew = 1;

                let yWithErrors = yPoints.map( y => {
                    let error = this.randomGaussianNumberUsingBoxMullerTransform(min, max, skew);
                    return y + error;
                });

                return yWithErrors;
            },
            determinationCoeff(yPoints, yRegrPoints) {
                let ySum = yPoints.reduce( (sum, y) => sum+y, 0 );
                let cntY = yPoints.length;
                let avgY = ySum/cntY;

                let SStot = yPoints.reduce( (sum, y) => sum+Math.pow(y - avgY, 2), 0 );
                let SSreg = yRegrPoints.reduce( (sum, ym) => sum+Math.pow(ym - avgY, 2), 0 );
                let R2 = 1 - SSreg/SStot;

                return R2;
            },
            findCoeffs() {
                let data = this.xPoints.map( (x, index) => {
                    let y = this.randomPoints[index];
                    return [x, y];
                });

                const result = regression.polynomial(data, {
                    order: this.approxPower,
                    precision: 2,
                });

                let coeffs = result.equation.reverse();
                this.approxCoeffs = coeffs;
            },
            updateRandomPoints() {
                this.randomPoints = this.generateEquationDataWithRandomError(this.flagsEquation, this.xPoints);
                this.randomTestPoints = this.generateEquationDataWithRandomError(this.flagsEquation, this.xPointsTestSample);
            },
            wait(msec) {
                return new Promise(resolve => {
                    setTimeout(resolve, msec);
                });
            },
            isLevelSuccessful(r2results) {
                let positive = r2results.filter(r2 => r2>0);
                let positiveCount = positive.length;
                let negativeCount = r2results.length - positiveCount;
                let min = Math.min.apply(null, r2results);
                let max = Math.max.apply(null, r2results);
                let magickLimit = 0.5;
                return (positiveCount > negativeCount) && (max-min < magickLimit);
            },
            showLevelResult(success) {
                this.levelSuccess = success;
                this.showResult = true;
            },
            async startTest() {
                this.r2results = [];
                await this.skierToStart();
                this.showAnimation = true;

                for (let t = 1; t <= this.totalTests; t++) {
                    await this.wait(this.animationDelay);
                    this.currentTest = t;

                    for (let index = 1; index < this.xPoints.length; index++) {
                        await this.moveSkierToPoint(index, true);
                    }

                    this.updateRandomPoints();
                    await this.skierToStart();

                    this.r2results.push( this.r2 );
                    this.r2results.push( this.r2test );
                }

                let isSuccess = this.isLevelSuccessful(this.r2results);
                let isGameSuccess = isSuccess && this.levelNumber === this.slopeLevels.length;

                if (isSuccess) {
                    if (isGameSuccess) {
                        return this.finishGame();
                    }
                }

                this.showLevelResult(isSuccess);
            }
        },
        computed: {
            flagsEquation() {
                return this.currentLevel.equation;
            },
            currentLevel() {
                return this.slopeLevels[ this.levelNumber - 1 ];
            },
            r2() {
                return this.determinationCoeff(this.randomPoints, this.slopePoints);
            },
            r2test() {
                return this.determinationCoeff(this.randomTestPoints, this.slopeTestPoints);
            },
            approxEquation() {
                let parts = this.approxCoeffs.map( (coeff, index) => {
                    let plus = coeff >= 0 ? '+' : '';

                    if (index === 0) {
                        return coeff;
                    }

                    if (index === 1) {
                        return plus+coeff+'*x';
                    }

                    return plus+coeff+'*x^'+index;
                });

                return parts.join('');
            },
            xPoints() {
                return Array(11).fill(0).map((_, index) => index * this.xStep);
            },
            xPointsTestSample() {
                let lastX = this.xPoints[ this.xPoints.length - 1 ];
                let startX = lastX + this.xStep;

                return Array(11).fill(0).map((_, index) => index * this.xStep + startX);
            },
            labels() {
                return this.xPoints.map((point) => {
                    return {
                        value: point.toString(),
                        popUp: point,
                    }
                });
            },
            slopePoints() {
                return this.getEquationPoints(this.approxEquation, this.xPoints);
            },
            slopeTestPoints() {
                return this.getEquationPoints(this.approxEquation, this.xPointsTestSample);
            },
            lineData() {
                return [
                    {data: this.randomPoints, color: 'red', lineColor: 'transparent', label: 'Флажки'},
                    {data: this.slopePoints, color: 'blue', label: 'Лыжня', dashed: true},
                ]
            },
        }
    }
</script>

<style scoped>
    .slope {
        width: 100vw;
        height: 50vh;
        background: url(/assets/images/snow_texture.jpg);
        position: relative;
    }

    .slope-graph,
    .graph-container {
        width: 100%;
        height: 50vh;
    }

    .controls {
        position: absolute;
        border-radius: 4px;
        background: #fff;
        top: 50vh;
        left: 0;
        padding: 1.5em;
    }

    .skier {
        position: absolute;
    }
    .animate .skier {
        transition: all 300ms linear;
    }

    .modal.show {
        display: block;
    }
    .modal-dialog-scrollable {
        display: flex;
        max-height: calc(100% - 1rem);
    }
    .modal-dialog-scrollable .modal-body {
        overflow-y: auto;
    }
    .fade {
        background: rgba(0,0,0,0.3);
    }

    .btn-toolbar-fixed {
        position: fixed;
        right: 8px;
        top: 8px;
    }

    @media (min-width: 576px) {
        .modal-dialog {
            max-width: 70vw;
        }

        .slope {
            width: 100vw;
            height: 100vh;
            overflow: hidden;
        }

        .slope-graph,
        .graph-container {
            width: 100%;
            height: 100%;
        }

        .controls {
            width: 40vw;
            top: 2vh;
            left: 10vw;
        }
    }

</style>

<style>
    #MathJax_Message {
        visibility: hidden;
    }
</style>