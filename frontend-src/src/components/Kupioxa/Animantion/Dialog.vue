<template>
    <div class="w-100 dialog">
        <div class="speech-bubble" v-for="(phrase, index) in dialog" :key="phrase + index"
                :class="{'my': phrase.my}"
                v-html="phrase.text"
        ></div>
    </div>
</template>

<script>
    import {pause} from "../Helpers";

    export default {
        name: "Dialog",
        props: ['stdout', 'test', 'success', 'reset', 'testIndex', 'runIndex', 'inputPersonLines', 'inputKupioxaLines', 'startPerson', 'saveDialog', 'stdoutKupioxaOnly'],
        data() {
            return {
                lastStdout: null,
                speaking: false,
                dialog: [],
                pauseMs: 2000,
            }
        },
        watch: {
            stdout() {
                let isFirstTimeExecute = this.lastStdout === null;
                let isStdoutReset = this.stdout === false;
                let isStdoutUnchanged = this.lastStdout === this.stdout;

                let doNotStart = isFirstTimeExecute || isStdoutReset || isStdoutUnchanged;

                this.lastStdout = this.stdout;

                if (doNotStart) {
                    this.finish();
                    return;
                }

                return this.startDialog();
            },
            reset() {
                if (this.saveDialog) {
                    this.resetDialog();
                }

                this.finish();
            },
            runIndex() {
                if (!this.speaking) {
                    this.finish();
                }
            },
            success() {
                this.finish();
            }
        },
        methods: {
            resetDialog() {
                this.dialog = [];
                this.lastStdout = null;
            },

            finish() {
                this.$emit('finish');
            },

            async startDialog() {
                this.speaking = true;
                if (!this.saveDialog) {
                    this.resetDialog();
                }

                for (let index = 0; index < this.kupioxaLines.length; index++) {
                    if (this.startPerson) {
                        this.dialog.push({text: this.personLines[index], my: false});
                        await pause(this.pauseMs);
                        this.dialog.push({text: this.kupioxaLines[index], my: true});
                        await pause(this.pauseMs);
                    }
                    else {
                        this.dialog.push({text: this.kupioxaLines[index], my: true});
                        await pause(this.pauseMs);
                        this.dialog.push({text: this.personLines[index], my: false});
                        await pause(this.pauseMs);
                    }
                }

                if (this.kupioxaLines.length == 0 && this.startPerson && this.personLines.length > 0) {
                    this.dialog.push({text: this.personLines[0], my: false});
                }

                this.speaking = false;
                this.finish();
            }
        },
        computed: {
            stdoutLines() {
                return this.stdout.split("\n").filter(line => line !== "");
            },
            kupioxaLines() {
                if (this.inputKupioxaLines) {
                    return this.inputKupioxaLines[this.testIndex];
                }

                return this.stdoutKupioxaOnly
                    ? this.stdoutLines
                    : this.stdoutLines.filter( (line, index) => index % 2 === 0 );
            },
            personLines() {
                if (this.inputPersonLines) {
                    return this.inputPersonLines[this.testIndex];
                }

                return this.stdoutKupioxaOnly
                    ? Array(this.stdoutLines.length).fill('К сожалению, не знаю')
                    : this.stdoutLines.filter( (line, index) => index % 2 === 1 );
            },
        }
    }
</script>

<style scoped>
    .dialog {
        position: relative;
        display: flex;
        flex-direction: column;
        background: #aaa;
        height: 100%;
        padding: 1em;
        padding-left: 2em;
    }

    .speech-bubble {
        background: #ffffff;
        border-radius: .4em;
        padding: 10px;
        position: relative;
        width: 60%;
        margin-bottom: 1em;
    }

    .speech-bubble:not(.my) {
        left: 0;
    }

    .speech-bubble.my {
        background: #0e7fe1;
        color: white;
        align-self: flex-end;
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

    .speech-bubble.my:after {
        border-right-color: #0e7fe1;
    }


</style>