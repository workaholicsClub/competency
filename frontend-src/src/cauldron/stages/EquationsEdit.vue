<template>
    <div>
        <system-of-equations :equation-system="displaySystem"></system-of-equations>

        <balance
                :scale-factor="scaleFactor"
                :items="currentRule"
                button-title="Дальше"
                :skip-potion-img="true"
                @input="updateSelected"
                @next="nextRule"
        ></balance>
    </div>
</template>

<script>
    import Balance from "./Balance";
    import SystemOfEquations from "./SystemOfEquations";

    export default {
        name: "EquationsEdit",
        props: ['editRules', 'value', 'scaleFactor'],
        components: {SystemOfEquations, Balance},
        data() {
            return {
                displaySystem: this.value,
                editSystem: this.value,
                editIndex: 0,
            }
        },
        beforeMount() {
            this.highlight();
        },
        watch: {
            value() {
                this.displaySystem = this.value;
                this.editSystem = this.value;
                this.highlight();
            }
        },
        methods: {
            makeRegex(str) {
                return new RegExp( str
                    .replace(/\\/g,'\\\\')
                    .replace(/\*/g, '(.+?)')
                    .replace(/\^/g, '\\^')
                , 'g' );
            },
            makeReplaceTo(str) {
                return str.replace(/\*/g, '$1')
            },
            updateSelected(eqn, rightPart) {
                let fromRegex = this.makeRegex(this.currentRule.left[0].formula);
                let toResult = this.makeReplaceTo(rightPart);

                this.replaceSystem(fromRegex, toResult);
            },
            highlight() {
                let fromTo = this.currentRule.left[0].formula;
                let fromRegex = this.makeRegex(fromTo);
                let toResult = this.makeReplaceTo(fromTo);

                this.replaceSystem(fromRegex, toResult);
            },
            replaceSystem(fromRegex, toResult) {
                this.displaySystem = this.replace(fromRegex, toResult);
                this.editSystem = this.replace(fromRegex, toResult, false);
            },
            replace(fromRegex, toResult, highlight = true) {
                let newSystem = [];
                let effectiveToResult = highlight
                    ? "\\color{red}{"+toResult+"}"
                    : toResult;

                for (let eqnIndex in this.value) {
                    let equation = this.value[eqnIndex];


                    let replaced = equation.replace(fromRegex, effectiveToResult);
                    newSystem.push(replaced);
                }

                return newSystem;
            },
            nextRule() {
                this.$emit('input', this.editSystem);
                if (this.editIndex < this.editRules.length - 1) {
                    this.editIndex++;
                    this.highlight();
                }
                else {
                    this.$emit('finish');
                }
            }
        },
        computed: {
            currentRule() {
                return this.editRules[this.editIndex];
            },
            systemOfEquations() {
                return `\\begin{cases} ${this.displaySystem[0]} \\\\ ${this.displaySystem[1]} \\\\ ${this.displaySystem[2]} \\end{cases}`;
            },

        }
    }
</script>

<style scoped>

</style>