<template>
    <div class="code-run">
        <prism-editor v-model="code[lang]" :code="code" :language="prismLangCode" :line-numbers="true" :auto-style-line-numbers="true"></prism-editor>

        <div class="d-flex flex-wrap mt-2">
            <button class="btn btn-outline-info mr-2 mt-2 disabled" disabled="disabled" v-if="executing">...Запускается</button>
            <button class="btn btn-outline-info mr-2 mt-2" @click="runCode" v-else><i class="fas fa-play"></i> Запустить</button>
            <span class="flex-fill"></span>
            <button class="btn btn-outline-info mr-2 mt-2" @click="addExample">Начать с примера</button>
            <button class="btn btn-outline-info mt-2 disabled" disabled="disabled" v-if="saved">Сохранено</button>
            <button class="btn btn-outline-info mt-2" @click="save" v-else>Сохранить</button>
        </div>

        <label class="mt-4" v-if="execError">Ошибка</label>
        <label class="mt-4" v-else>Результат</label>

        <div class="codeError mt-1 p-2" v-if="execError">{{execError}}</div>
        <div class="codeResult mt-1 p-2" v-else>{{execStdOut}}</div>
    </div>
</template>
<script>
    import Enums from "../unsorted/Enums";
    import Prism from 'prismjs';
    import PrismEditor from 'vue-prism-editor';
    import ApiClient from '../unsorted/ApiClient.js';

    import "prismjs/themes/prism.css";

    export default {
        name: 'CoreRun',
        props: ['lang', 'height', 'id'],
        components: {
            PrismEditor
        },
        created() {
            Prism.highlightAll();
            this.load();
        },
        watch: {
            lang() {
                this.execStdOut = '';
                this.execError = false;
            },
            code: {
                handler() {
                    this.saved = false;
                },
                deep: true
            },
        },
        data() {
            return {
                defaultLang: Enums.homework.defaultLang,
                langs: Enums.homework.lang,
                examples: Enums.homework.examples,
                code: {
                    python: '',
                    javascript: '',
                    java: '',
                    php: "<?php\n\n",
                    golang: '',
                    swift: '',
                    kotlin: '',
                    cpp: ''
                },
                executing: false,
                saved: true,
                execStdOut: '',
                execError: false,
            };
        },
        methods: {
            detectLang() {
                return this.defaultLang;
            },
            async runCode() {
                this.executing = true;
                this.execError = false;
                let execResult = await ApiClient.runCodeOnGlot(this.code[this.lang], this.glotLangCode);

                this.execStdOut = execResult.stdout;

                if (execResult.error || execResult.stderr) {
                    this.execError = execResult.stderr ? execResult.stderr : execResult.error;
                }
                this.executing = false;
            },
            addExample() {
                this.code[this.lang] = this.examples[this.lang];
            },
            load() {
                let savedData = localStorage.getItem(this.localStorageItem);
                if (savedData) {
                    try {
                        let code = JSON.parse(savedData);
                        this.code = code;
                    }
                    catch (exception) {
                    }
                }
            },
            save() {
                let codeData = JSON.stringify(this.code);
                localStorage.setItem(this.localStorageItem, codeData);
                this.saved = true;
            }
        },
        computed: {
            localStorageItem() {
                return 'saved_code_'+this.id;
            },
            langData() {
                let foundLangs = this.langs.filter( iteratedLang => iteratedLang.code === this.lang);
                return foundLangs.length > 0 ? foundLangs[0] : false;
            },
            prismCodes() {
                return this.langs.map( lang => lang.prismCode );
            },
            glotLangCode() {
                if (this.langData !== false) {
                    return this.langData.glotCode;
                }

                return false;
            },
            prismLangCode() {
                if (this.langData !== false) {
                    return this.langData.prismCode;
                }

                return false;
            }
        }
    }
</script>
<style>
    .codeResult {
        background: #333;
        color: #fff;
        font-family: monospace;
        min-height: 3rem;
        white-space: pre-wrap;
    }

    .codeError {
        background: #dc3545;
        color: #fff;
        font-family: monospace;
        white-space: pre-wrap;
    }

    .prism-editor-wrapper pre {
        /*min-height: 300px;*/
    }
</style>