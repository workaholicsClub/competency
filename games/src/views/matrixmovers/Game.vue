<template>
    <div>
        <b-row class="align-content-center justify-content-center mb-4 w-100">
            <b-col cols="12" sm="4" class="description">
                <p><b>Надо расставить мебель по местам</b></p>
                <p>Но мы тут умничаем, поэтому делаем это силой мозга. Как Джин Грей из Людей Х. Только наш телекинез
                    работает, если сфокусировать его матрицей. Поэтому.</p>
                <p>На каждом уровне есть матрица с координатами точек шкафов, тумб, или что мы там двигаем. И матрица
                телекинеза (трансформационная, по-математически), куда мы вбиваем умные коэффициенты. Если сложить или
                умножить эти две матрицы, результат заполняется новыми координатами точек, а тумба перелетает в новое
                место. Если она перелетела туда, куда нужно, то уровень пройден.</p>
                <p>В некоторых уровнях нужно сделать несколько перемещений. Сделав первое, нажми кнопку "Запомнить новое
                положение" и двигай дальше. Для некоторых - особо хитрых - перемещений, нужно передвинуть точку начала
                координат. Да, оси можно двигать!</p>
            </b-col>
            <b-col cols="12" sm="8">
                <b-card footer-class="p-2">
                    <b-card-text class="text-center" ref="fieldContainer">
                        <field
                            :width="fieldWidth"
                            :height="fieldHeight"
                            :dots-horizontal="dotsInGrid"
                            :dots-vertical="dotsInGrid"
                            :zero="zero"
                            :shapes="objects"
                            :snap="true"
                            @zeroposition="setZero"
                        ></field>
                    </b-card-text>
                    <template #footer>
                        <div class="d-flex align-items-center">
                            <matrix v-model="from.graphPoints" :header="true"></matrix>
                            <span v-if="fixedOperation" v-html="operation === '*' ? '&times;' : '&plus;'"></span>
                            <b-form-select v-model="operation" :options="operations" style="width: 60px" v-else></b-form-select>
                            <matrix v-model="transformMatrix" :edit="true" :header="false"></matrix>
                            <b-button variant="success" @click="computeResult">=</b-button>
                            <matrix v-model="moving.graphPoints" :header="true"></matrix>
                        </div>
                        <b-button @click="remember" class="mr-2">Запомнить новое положение</b-button>
                        <b-button variant="outlined-primary">Сбросить</b-button>
                    </template>
                </b-card>
            </b-col>
        </b-row>
        <b-modal id="successModal" title="Уровень пройден!" centered
            header-text-variant="light"
            header-bg-variant="success"
        >
            <p class="my-4">Снимаю шляпу, это было круто!</p>
            <template #modal-footer="{ ok }">
                <b-button variant="success" @click="nextLevel() && ok()">Следующий уровень</b-button>
            </template>
        </b-modal>
        <b-modal id="gameFinishedModal" title="Игра закончена!" centered
            header-bg-variant="warning"
            body-bg-variant="warning"
            footer-bg-variant="warning"
        >
            <p class="my-4">Вот это да! Достигнуты уровни "бог", "гуру" и "брахма"! Все сразу!</p>
            <p class="my-4">Но, к сожалению, игра закончилась и больше уровней нет</p>
            <template #modal-footer="{ ok }">
                <b-button variant="primary" @click="ok()">Окей:(</b-button>
            </template>
        </b-modal>
    </div>
</template>

<script>
import Field from "./Field";
import Matrix from "./Matrix";
import {roundToPrecision} from "./round";
import clone from "lodash.clonedeep";

export default {
    components: {Field, Matrix},
    data() {
        let zero = {x: 10.5, y: 10.5};
        let dotsInGrid = 21;

        return {
            dotsInGrid,
            zero,
            baseZero: clone(zero),
            objects: [],
            from: null,
            to: null,
            moving: null,
            transformMatrix: null,
            currentLevel: 1,
            levels: [
                {
                    level: 1,
                    operation: '+',
                    from: {
                        name: 'Шкаф',
                        points: [{x: -2, y: 1}, {x: -2, y: 5}, {x: 2, y: 5}, {x: 2, y: 1}],
                    },
                    to: {
                        name: 'Шкаф\nсюда',
                        points: [{x: 6, y: 1}, {x: 6, y: 5}, {x: 10, y: 5}, {x: 10, y: 1}],
                    }
                },
                {
                    level: 2,
                    operation: '+',
                    from: {
                        name: 'Тумба',
                        points: [{x: -9, y: 9}, {x: -7, y: 9}, {x: -7, y: 4}, {x: -9, y: 4}],
                    },
                    to: {
                        name: 'Тумба\nсюда',
                        points: [{x: 8, y: 0}, {x: 10, y: 0}, {x: 10, y: -5}, {x: 8, y: -5}],
                    }
                },
                {
                    level: 3,
                    operation: '*',
                    from: {
                        name: 'Стол',
                        points: [{x: -4, y: 0}, {x: -4, y: 4}, {x: 0, y: 4}, {x: 0, y: 2}, {x: -2, y: 2}, {x: -2, y: 0}],
                    },
                    to: {
                        name: 'Стол\nсюда',
                        points: [{x: 6, y: -10}, {x: 6, y: -8}, {x: 8, y: -8}, {x: 8, y: -6}, {x: 10, y: -6}, {x: 10, y: -10}],
                    }
                },
                {
                    level: 4,
                    operation: '*',
                    from: {
                        name: 'Ковер',
                        points: [{x: -7, y: 7}, {x: -7, y: 9}, {x: -5, y: 9}, {x: -5, y: 7}],
                    },
                    to: {
                        name: 'Ковер\nсюда',
                        points: [{x: -5, y: -3}, {x: -5, y: 3}, {x: 1, y: 3}, {x: 1, y: -3}],
                    }
                },
                {
                    level: 5,
                    from: {
                        name: 'Стул',
                        points: [{x: -3, y: 7}, {x: -3, y: 9}, {x: -2, y: 8}, {x: -1, y: 9}, {x: -1, y: 7}],
                    },
                    to: {
                        name: 'Стул\nсюда',
                        points: [{x: -3, y: -10}, {x: -3, y: -8}, {x: -1, y: -8}, {x: -2, y: -9}, {x: -1, y: -10}],
                    }
                }
            ],
            operation: '+',
            fixedOperation: false,
            operations: [{value: '*', html: '&times;'}, {value: '+', html: '&plus;'}],
            operationOnMatrix: true,
            operationResult: [{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}],
            maxWidth: 400,
            maxHeight: 400,
            containerWidth: 0,
            containerHeight: 0,
            distanceThreshold: 1e-3,
        }
    },
    created() {
        window.addEventListener("resize", this.updateContainerSize);

        this.gotoLevel(this.currentLevel);
        this.initTransformMatrixAndResult();
    },
    mounted() {
        this.updateContainerSize();
    },
    destroyed() {
        window.removeEventListener("resize", this.updateContainerSize);
    },

    watch: {
        operation() {
            this.initTransformMatrixAndResult();
        }
    },
    methods: {
        setZero(newZero) {
            this.zero = newZero;
            this.rebaseObjectCoordsToNewZero();
        },
        resetZero() {
            this.setZero(this.baseZero);
        },
        initTransformMatrixAndResult() {
            let pointsCount = this.from.points.length;

            let mulTransform = [
                {a: 0, b: 0},
                {a: 0, b: 0},
            ];

            let addTransform = Array(pointsCount).fill(0).map(() => ({x: 0, y: 0}));
            let result = clone(addTransform);

            if (this.operation === '*') {
                this.transformMatrix = mulTransform;
            }
            else {
                this.transformMatrix = addTransform;
            }

            this.operationResult = result;
        },
        localXYToGlobal({x: localX, y: localY}, zero = null, dotsInGrid = null) {
            if (!zero) {
                zero = this.zero;
            }

            if (!dotsInGrid) {
                dotsInGrid = this.dotsInGrid;
            }

            let globalX = localX/(dotsInGrid-1) * dotsInGrid + zero.x;
            let globalY = zero.y - localY/(dotsInGrid-1) * dotsInGrid;

            return {
                x: roundToPrecision(globalX, 5),
                y: roundToPrecision(globalY, 5),
            }
        },
        globalXYToLocal({x: globalX, y: globalY}) {
            let zero = this.zero;
            let dotsInGrid = this.dotsInGrid;

            let localX = (globalX-zero.x)/dotsInGrid * (dotsInGrid-1);
            let localY = (zero.y - globalY)/dotsInGrid * (dotsInGrid-1);

            return {
                x: roundToPrecision(localX, 5),
                y: roundToPrecision(localY, 5)
            }
        },
        rebaseObjectCoordsToNewZero() {
            this.objects = this.objects.map(object => {
                object.graphPoints = object.points.map(this.globalXYToLocal);
                return object;
            });
        },
        gotoLevel(levelNumber) {
            let level = this.levels.find(level => level.level === levelNumber);

            this.resetZero();

            let fromObject = clone(level.from);
            fromObject.type = 'dashed';
            fromObject.graphPoints = clone(fromObject.points);
            fromObject.points = fromObject.points.map((point) => this.localXYToGlobal(point))

            let toObject = clone(level.to);
            toObject.type = 'dashed';
            toObject.graphPoints = clone(toObject.points);
            toObject.points = toObject.points.map((point) => this.localXYToGlobal(point))

            let movingObject = clone(fromObject);
            movingObject.type = 'solid';

            fromObject.name = fromObject.name+'\nтут';

            this.from = fromObject;
            this.moving = movingObject;
            this.to = toObject;

            this.objects = this.objects.filter(shape => shape.type === 'solid');
            this.objects.push(fromObject);
            this.objects.push(toObject);
            this.objects.push(movingObject);

            this.currentLevel = levelNumber;
            if (level.operation) {
                this.fixedOperation = true;
                this.operation = level.operation;
            }
            else {
                this.fixedOperation = false;
            }

            this.initTransformMatrixAndResult();
        },
        nextLevel() {
            this.gotoLevel(this.currentLevel+1);
            return true;
        },
        computeResult() {
            let result = [];
            if (this.operation === '+') {
                for (let rowIndex in this.transformMatrix) {
                    let transformRow = this.transformMatrix[rowIndex];
                    let pointsRow = this.from.graphPoints[rowIndex];
                    let resultRow = {};
                    for (let key in pointsRow) {
                        resultRow[key] = transformRow[key] + pointsRow[key];
                    }

                    result.push(resultRow);
                }
            }

            if (this.operation === '*') {
                let tm = this.transformMatrix;
                for (let rowIndex in this.from.graphPoints) {
                    let pointsRow = this.from.graphPoints[rowIndex];

                    let newX = pointsRow.x*tm[0].a + pointsRow.y*tm[1].a;
                    let newY = pointsRow.x*tm[0].b + pointsRow.y*tm[1].b;
                    result.push({x: newX, y: newY});
                }
            }

            this.operationResult = result;
            this.moving.graphPoints = result;
            this.moving.points = result.map(point => this.localXYToGlobal(point));

            this.tryToFinishLevel();
        },
        remember() {
            this.from = clone(this.moving);
        },
        reset() {
            this.gotoLevel(this.currentLevel);
        },
        showSuccessMessage() {
            this.$bvModal.show('successModal');
        },
        showFinishMessage() {
            this.$bvModal.show('gameFinishedModal');
        },
        distance(p1, p2) {
            return Math.sqrt( Math.pow(p1.x-p2.x, 2) + Math.pow(p1.y-p2.y, 2) );
        },
        findClosestPointIndex(point, targetPoints) {
            let distances = targetPoints.map(targetPoint => this.distance(point, targetPoint));
            let minDistance = Math.min.apply(Math, distances);
            return distances.indexOf(minDistance);
        },
        tryToFinishLevel() {
            let currentPoints = this.moving.points;
            let targetPoints = clone(this.to.points);

            let targetPointsInSameOrderAsCurrent = [];
            for (let point of currentPoints) {
                let targetIndex = this.findClosestPointIndex(point, targetPoints);
                let cutoutPoints = targetPoints.splice(targetIndex, 1);
                let targetPoint = cutoutPoints[0];
                targetPointsInSameOrderAsCurrent.push(targetPoint);
            }

            let distances = targetPointsInSameOrderAsCurrent.map((targetPoint, index) => this.distance(currentPoints[index], targetPoint));
            let totalDistance = distances.reduce((total, distance) => total+distance, 0);

            let shapesInSameLocation = totalDistance <= this.distanceThreshold;
            if (shapesInSameLocation) {
                if (this.isLastLevel) {
                    this.showFinishMessage();
                }
                else {
                    this.showSuccessMessage();
                }
                return true;
            }

            return false;
        },
        updateContainerSize() {
            let {width, height} = this.$refs.fieldContainer.getBoundingClientRect();
            this.containerWidth = width;
            this.containerHeight = height;
        },
    },
    computed: {
        fieldWidth() {
            return Math.min(this.maxWidth, this.containerWidth);
        },
        fieldHeight() {
            return this.fieldWidth;
        },
        isLastLevel() {
            return this.currentLevel === this.levels.length;
        }
    }
}
</script>

<style scoped>
    .description {
        font-size: 0.75em;
    }
</style>