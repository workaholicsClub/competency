<template>
    <div>
        <div class="row pt-4">
            <div class="col col-12 text-center">
                <h3>Панель управления Жулей</h3>
            </div>
        </div>
        <div class="row pt-4">
            <div class="col col-12 col-md-6 mb-4">
                <label>Читай задачу</label>
                <div v-html="chapter.text"></div>
                <div class="alert alert-info" v-html="chapter.formalText" v-if="chapter.formalText"></div>

                <button v-if="chapter.formalDescription"
                        class="btn btn-outline-primary btn-block mt-4" type="button" @click="showDetails = true">
                    Подробнее
                </button>
            </div>
            <div class="col col-12 col-md-6 d-flex flex-column">
                <label>Смотри картинку</label>
                <component v-if="chapter.visualComponent"
                    :is="chapter.visualComponent"
                    :stdout="execStdOut"
                    :test="currentTest"
                    :success="success"
                    :reset="resetAnimationFlag"
                    :testIndex="currentTestIndex"
                    :runIndex="runIndex"

                    v-bind="chapter.componentProps"

                    @finish="finishAnimationWait"
                ></component>
            </div>
        </div>
        <div class="row pt-4">
            <div class="col col-12 mb-4" :class="{'col-md-6': !chapter.wide}">
                <label>Пиши программу</label>
                <div class="alert alert-warning mt-4" v-if="resultError">{{resultError}}</div>
                <prism-editor v-if="hasTestCode"
                        :code="testPrefix"
                        language="python"
                        :line-numbers="true"
                        :auto-style-line-numbers="true"
                        :readonly="true"
                        class="hide-numbers prefix"
                ></prism-editor>

                <prism-editor v-if="hasPrefixCode"
                        :code="codePrefix"
                        language="python"
                        :line-numbers="true"
                        :auto-style-line-numbers="true"
                        :readonly="true"
                        class="hide-numbers prefix"
                        :class="{'has-prefix': hasTestCode}"
                ></prism-editor>

                <prism-editor
                        v-model="code"
                        :code="code"
                        language="python"
                        :line-numbers="true"
                        :auto-style-line-numbers="true"
                        :class="{'has-suffix': hasSuffixCode, 'has-prefix': hasPrefixCode || hasTestCode}"
                ></prism-editor>

                <prism-editor v-if="hasSuffixCode"
                        :code="codeSuffix"
                        language="python"
                        :line-numbers="true"
                        :auto-style-line-numbers="true"
                        :readonly="true"
                        class="hide-numbers suffix"
                ></prism-editor>

                <div class="d-flex flex-wrap mt-2">
                    <button class="btn btn-outline-info mr-2 mt-2 disabled" disabled="disabled" v-if="executing">...Запускается</button>
                    <button class="btn btn-outline-info mr-2 mt-2" :disabled="testing" @click="runCodeAndResetAnimation" v-else><i class="fas fa-play"></i> Запустить</button>
                    <button class="btn btn-primary mr-2 mt-2 disabled" disabled="disabled" v-if="!success && testing"  @click="validate">
                        ...Проверяю
                        <span v-if="chapter.tests.length > 1">({{currentTestIndex+1}} из {{chapter.tests.length}})</span>
                    </button>
                    <button class="btn btn-primary mr-2 mt-2" v-else-if="!testing" @click="validate">Готово, проверяйте</button>
                    <span class="flex-fill"></span>
                    <button class="btn btn-outline-info mt-2 disabled" disabled="disabled" v-if="saved">Сохранено</button>
                    <button class="btn btn-info mt-2" @click="save" v-else>Сохранить</button>
                </div>
            </div>
            <div class="col col-12" :class="{'col-md-6': !chapter.wide}">
                <label>Смотри что программа напечатала</label>
                <div class="codeError" v-if="execError">{{execError}}</div>
                <div class="codeResult" v-else>{{execStdOut || ''}}</div>
            </div>
        </div>
        <div class="row pt-4" v-if="success">
            <div class="col col-12 text-center">
                <button class="btn btn-success btn-lg btn-block" ref="successButton" @click="$emit('next')" v-html="chapter.nextChapterButtonText"></button>
            </div>
        </div>

        <div class="modal fade" :class="{'show': showDetails}" v-if="chapter.formalDescription">
            <div class="modal-dialog modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-body">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Закрыть" @click="showDetails = false">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <div v-html="chapter.formalDescription"></div>
                    </div>
                    <div class="modal-footer justify-content-center">
                        <button type="button" class="btn btn-success btn-lg" @click="showDetails = false">Закрыть</button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import Prism from 'prismjs';
    import PrismEditor from 'vue-prism-editor';
    import ApiClient from "../../unsorted/ApiClient";
    import {pause} from "./Helpers";

    export default {
        name: "TaskPage",
        props: ['chapter'],
        components: {
            PrismEditor
        },
        data() {
            return {
                code: this.chapter.starterCode || '',
                savedData: {},
                showDetails: false,
                executing: false,
                testing: false,
                saved: true,
                execStdOut: null,
                execError: false,
                success: false,
                resultError: false,
                resetAnimationFlag: false,
                resolveAnimationFinish: false,
                currentTestIndex: 0,
                runIndex: null,
            }
        },
        created() {
            Prism.highlightAll();
            this.load();
        },
        watch: {
            code: {
                handler() {
                    this.saved = false;
                    this.resultError = false;
                },
                deep: true
            },
        },
        methods: {
            finishAnimationWait() {
                if (this.resolveAnimationFinish) {
                    this.resolveAnimationFinish();
                    this.resolveAnimationFinish = false;
                }
            },
            scrollToSuccessButton() {
                this.$refs.successButton.scrollIntoView({block: "center", behavior: "smooth"});
            },
            async animationFinished() {
                return new Promise(resolve => {
                    this.resolveAnimationFinish = resolve;
                });
            },

            async resetAnimation() {
                this.resetAnimationFlag = true;
                await this.$nextTick();
                this.resetAnimationFlag = false;
                await pause(4000);
            },

            async runCodeAndResetAnimation() {
                if (this.chapter.resetAnimationOnStart) {
                    await this.resetAnimation();
                }

                await this.runCode();
                await this.animationFinished();

                if (!this.chapter.resetAnimationOnStart) {
                    await this.resetAnimation();
                }
            },

            async runCode() {
                this.executing = true;
                this.execError = false;
                this.execStdOut = false;
                await this.$nextTick();

                let codeWithPrefix = this.testPrefix + '\n' + this.codePrefix + '\n' + this.code;
                let execResult = await ApiClient.runCodeOnGlot(codeWithPrefix, 'python');

                this.execStdOut = execResult.stdout;

                if (execResult.error || execResult.stderr) {
                    this.execError = execResult.stderr ? execResult.stderr : execResult.error;
                }
                this.executing = false;
            },
            async validate() {
                let result = true;
                this.success = false;

                if (!this.chapter.validator) {
                    this.success = true;
                    return;
                }

                this.currentTestIndex = 0;
                this.runIndex = null;
                this.testing = true;
                await this.resetAnimation();

                for (let index = 0; index < this.chapter.tests.length; index++ ) {
                    let test = this.chapter.tests[index];
                    let lastIndex = index === this.chapter.tests.length - 1;

                    if (result) {
                        await this.runCode(true);
                        let whenFinished = this.animationFinished();
                        this.runIndex = index;
                        await whenFinished;

                        let testResult = this.chapter.validator(this.execStdOut, test);

                        if (testResult !== true) {
                            this.resultError = testResult;
                            this.success = false;
                            result = false;
                        }
                        else {
                            if (!lastIndex) {
                                whenFinished = this.animationFinished();
                                this.execStdOut = false;
                                this.currentTestIndex++;
                                await whenFinished;
                            }
                        }
                    }
                }

                this.testing = false;
                this.success = result;

                if (this.success) {
                    await this.$nextTick();
                    this.scrollToSuccessButton();
                }
            },
            load() {
                try {
                    let serializedData = localStorage.getItem('tasksCode');
                    this.savedData = JSON.parse(serializedData);
                    let savedCode = this.savedData[this.chapter.taskCode];
                    if (savedCode) {
                        this.code = savedCode;
                        this.$nextTick(() => {
                            this.saved = true;
                        });
                    }
                }
                catch (e) {
                    this.savedData = {};
                }
            },
            save() {
                this.savedData[this.chapter.taskCode] = this.code;
                let serializedData = JSON.stringify(this.savedData);
                localStorage.setItem('tasksCode', serializedData);
                this.saved = true;
            }
        },
        computed: {
            currentTest() {
                return this.chapter.tests[this.currentTestIndex];
            },
            testPrefix() {
                return this.currentTest.exec || '';
            },
            codePrefix() {
                return this.chapter.prefixCode || '';
            },
            codeSuffix() {
                return this.chapter.suffixCode || '';
            },
            hasTestCode() {
                return this.chapter.testIsPrefix;
            },
            hasPrefixCode() {
                return Boolean(this.chapter.prefixCode) ;
            },
            hasSuffixCode() {
                return Boolean(this.chapter.suffixCode);
            }

        }
    }
</script>

<style scoped>
    .codeResult {
        background: #333;
        color: #fff;
        font-family: monospace;
        min-height: 3rem;
        white-space: pre-wrap;
        padding: 1em;
    }

    .codeError {
        background: #dc3545;
        color: #fff;
        font-family: monospace;
        white-space: pre-wrap;
        padding: 1em;
    }

    label {
        font-weight: bold;
    }
</style>

<style>
    pre code, code pre {
        color: #e83e8c!important;
    }

    .prism-editor-wrapper {
        height: auto!important;
    }

    .suffix prism-editor__line-numbers,
    .suffix pre,
    .prefix prism-editor__line-numbers,
    .prefix pre {
        background-color: rgb(230, 230, 230)!important;
    }

    .prefix prism-editor__line-numbers,
    .prefix pre,
    .has-suffix pre {
        padding-bottom: 0!important;
    }

    .suffix prism-editor__line-numbers,
    .suffix pre,
    .has-prefix pre {
        padding-top: 0!important;
    }


    .hide-numbers .prism-editor__line-number {
        opacity: 0;
    }

    .hide-numbers pre {
        cursor: default;
    }

    .card-body p:last-child,
    .alert p:last-child {
        margin-bottom: 0;
    }

    .prefix .token.operator, .prefix .token.entity, .prefix .token.url, .prefix .language-css .token.string, .prefix .style .token.string {
        background: none!important;
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

    .modal-dialog {
    }

    @media (min-width: 576px) {
        .modal-dialog {
            max-width: 50%;
        }
    }
</style>