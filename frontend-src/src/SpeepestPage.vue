<template>
    <div class="container pt-4" :class="{'mobile': isMobile}">
        <div class="row">
            <div class="col-12">
                <h1>Наискорейший Пью
                    <a href="https://t.me/skill_itch" class="btn btn-link">Предыстория</a>
                    <a href="https://github.com/workaholicsClub/competency/blob/master/frontend-src/src/SpeepestPage.vue" class="btn btn-link">Github</a>
                </h1>
                <p>Поиск минимума функции методом наискорейшего спуска</p>
                <p>Побродите для начала в темноте, не торопитесь смотреть поверхность</p>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="collapse mb-4" id="settings" ref="settings">
                    <div class="form-group">
                        <label>Уравнение</label>
                        <input class="form-control" placeholder="x^2 + y^2" v-model="equation">
                        <small class="form-text"
                                :class="{'text-danger': !equationCorrect, 'text-success': equationCorrect}"
                        >{{equationCorrect ? 'Все ОК' : 'Ошибка в уравнении'}}</small>
                    </div>
                    <div class="form-group">
                        <label>Начальное положение:</label>
                        <div class="form-row">
                            <div class="col-6">
                                <div class="input-group mr-2">
                                    <div class="input-group-prepend">
                                        <div class="input-group-text">X</div>
                                    </div>
                                    <input type="number" class="form-control" v-model.number="startPoint.x">
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <div class="input-group-text">Y</div>
                                    </div>
                                    <input type="number" class="form-control" v-model.number="startPoint.y">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Шаг</label>
                        <input class="form-control" v-model.number="step" type="number">
                    </div>

                    <div class="form-group">
                        <label>Точность</label>
                        <input class="form-control" v-model.number="error" type="number">
                    </div>

                    <button class="btn btn-success" @click="goHome">Применить</button>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <button class="btn btn-success mr-2 mt-2" @click="updateGradient">1. Посчитать градиент</button>
                <button class="btn btn-success mr-2 mt-2" :disabled="!gradient" @click="makeStep">2. Сделать шаг</button>
                <button class="btn btn-success mr-2 mt-2" @click="goHome">Сбросить</button>
                <button class="btn btn-outline-success mr-4 mt-2" @click="showSurface = true" v-if="!showSurface">
                    <i class="fa fa-eye"></i> Поверхность
                </button>
                <button class="btn btn-outline-success mr-4 mt-2" @click="showSurface = false" v-else>
                    <i class="fa fa-eye-slash"></i> Поверхность
                </button>

                <button class="btn btn-secondary mt-2" data-toggle="collapse" data-target="#settings" aria-expanded="false">
                    <i class="fa fa-cog"></i>
                </button>
            </div>
        </div>
        <div class="row mt-2" v-if="warning">
            <div class="col-12">
                <div :class="'alert '+warning.type">{{warning.message}}</div>
            </div>
        </div>
        <div class="row mt-2">
            <div class="col-12">
                Текущий X, Y, Z: [{{currentPoint.x.toFixed(4)}}, {{currentPoint.y.toFixed(4)}}, {{getZ(currentPoint).toFixed(4)}}]
            </div>
        </div>
        <div class="row">
            <div class="col-12" v-if="gradient">
                Градиент: [{{gradient.x.toFixed(4)}}, {{gradient.y.toFixed(4)}}]
            </div>
            <div class="col-12" v-else>
                Градиент не посчитан
            </div>
        </div>
        <div class="row mt-2">
            <div class="col-12">
                <div ref="plot"></div>
            </div>
        </div>
        <div class="row mt-4">
            <div class="col-12">
                <button class="btn btn-success" :disabled="!equationCorrect" @click="updatePlot(true)">Обновить график</button>
            </div>
        </div>
    </div>
</template>

<script>
    import Plotly from 'plotly.js/dist/plotly.min.js';
    import { create, all } from 'mathjs';
    const math = create(all, {});

    export default {
        name: "SpeepestPage",
        components: {
        },
        data() {
            return {
                startPoint: {x: 5, y: 0},
                currentPoint: {x: 5, y: 0},
                step: 0.1,
                error: 0.01,
                gradient: false,
                showSurface: false,
                steepestPath: {x: [], y: [], z: []},
                plotEl: false,
                equation: '2*(x-5.07)^2 + (y-10.3)^2 - 0.2*(x-5.07)^3',
            }
        },
        mounted() {
            this.resetPath();
            this.updatePlot();
        },
        watch: {
            showSurface() {
                this.updatePlot(true);
            }
        },
        methods: {
            updatePlot(recreate = false) {
                let surface = {
                    x: this.surfaceX,
                    y: this.surfaceY,
                    z: this.surfaceZ,
                    type: 'surface',
                    opacity: this.showSurface ? 0.7 : 0,
                    showscale: false,
                    colorscale: [[0, 'rgb(128,255,128)'], [1, 'rgb(0,128,0)']],
                    contours: {
                        x: { highlight: false },
                        y: { highlight: false },
                        z: { highlight: false }
                    }
                };

                let path = Object.assign(this.steepestPath, {
                    type: 'scatter3d',
                    mode: 'lines+markers',
                    marker: {
                        size: 6,
                        color: 'yellow'
                    },
                    line: {
                        width: 3,
                        color: 'yellow'
                    }
                });

                let data = [surface, path];
                if (this.gradient) {
                    let gradientZ = this.getZ({x: this.gradient.baseX, y: this.gradient.baseY});
                    let gradientArrow = {
                        type: 'scatter3d',
                        mode: 'lines+markers',
                        x: [this.gradient.baseX, this.gradient.baseX + this.gradient.x],
                        y: [this.gradient.baseY, this.gradient.baseY + this.gradient.y],
                        z: [gradientZ, gradientZ],
                        marker: {
                            size: 2,
                            color: 'red'
                        },
                        line: {
                            width: 1,
                            color: 'red'
                        }
                    };
                    data.push(gradientArrow);
                }

                let layout = {
                    title: this.equation,
                    width: Math.min(window.outerWidth, 700),
                    height: Math.min(window.outerWidth, 700),
                    paper_bgcolor: 'black',
                    hovermode: false,
                    showlegend: false,
                    margin: {l: 0, r: 0, b: 0, t: 20},
                    font: {
                        family: "Courier New, monospace",
                        size: 8,
                        color: "white"
                    },
                };

                if (!this.plotEl || recreate) {
                    if (this.plotEl) {
                        Plotly.purge(this.plotEl);
                    }

                    this.plotEl = this.$refs.plot;

                    Plotly.newPlot(this.plotEl, data, layout);
                }
                else {
                    Plotly.update(this.plotEl, data, layout);
                }

            },
            getGradient({x, y}) {
                let xDerivative = math.derivative(this.equation, 'x');
                let yDerivative = math.derivative(this.equation, 'y');
                return {
                    x: xDerivative.evaluate({x, y}),
                    y: yDerivative.evaluate({x, y}),
                    baseX: x,
                    baseY: y,
                };
            },
            getAntiGradient({x, y}) {
                let grad = this.getGradient({x, y});
                return {
                    x: -grad.x,
                    y: -grad.y,
                    baseX: grad.baseX,
                    baseY: grad.baseY,
                }
            },
            updateGradient() {
                this.gradient = this.getAntiGradient(this.currentPoint);
                this.updatePlot(true);
            },
            getNextXY( currentPoint, gradient, step ) {
                let dx = step * gradient.x;
                let dy = step * gradient.y;

                return {
                    x: currentPoint.x + dx,
                    y: currentPoint.y + dy
                }
            },
            texEquation(equation) {
                let tex = math.parse(equation).toTex();
                let escapedTex = tex.replace(/\\/g, '\\');

                return `$${escapedTex}$`;
            },
            getZ({x, y}) {
                if (typeof(x) !== 'number' || typeof(y) !== 'number') {
                    return false;
                }

                return math.evaluate(this.equation, {x, y});
            },
            makeStep() {
                if (!this.gradient) {
                    this.updateGradient();
                }

                let nextPoint = this.getNextXY(this.currentPoint, this.gradient, this.step);
                this.steepestPath.x.push(nextPoint.x);
                this.steepestPath.y.push(nextPoint.y);
                this.steepestPath.z.push( this.getZ(nextPoint) );

                this.currentPoint = nextPoint;

                this.updatePlot();
            },
            goHome() {
                this.$refs.settings.classList.remove('show');
                this.currentPoint = {x: this.startPoint.x, y: this.startPoint.y};
                this.resetPath();
                this.gradient = false;
                this.updatePlot(true);
            },
            resetPath() {
                this.steepestPath = {
                    x: [this.currentPoint.x],
                    y: [this.currentPoint.y],
                    z: [this.getZ(this.currentPoint)],
                };
            }
        },
        computed: {
            isMobile() {
                return window.outerWidth < 760;
            },
            surfaceX() {
                return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
            },
            surfaceY() {
                return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
            },
            surfaceZ() {
                let f = math.compile(this.equation);
                return this.surfaceX.map((y) => {
                    return this.surfaceY.map( x => f.evaluate({x, y}) );
                });
            },
            equationCorrect() {
                try {
                    let f = math.compile(this.equation);
                    return Boolean(f);
                }
                catch(e) {
                    return false;
                }
            },
            warning() {
                let pathZ = this.steepestPath.z;
                if (pathZ.length >= 2) {
                    let lastZ = pathZ[pathZ.length - 1];
                    let prevZ = pathZ[pathZ.length - 2];

                    if (lastZ > prevZ) {
                        return {
                            type: 'alert-danger',
                            message: 'Функция начала возрастать, пора пересчитать градиент'
                        }
                    }
                    else if (prevZ - lastZ <= this.error) {
                        return {
                            type: 'alert-success',
                            message: `Разница между высотой z шагов меньше ${this.error}. Минимум тут!`
                        }
                    }
                }

                return false;
            }
        }
    }
</script>

<style>
    body {background: #000; color: white;}
    .mobile .modebar {
        display: none !important;
    }
</style>