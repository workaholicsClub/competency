<template>
    <svg xmlns="http://www.w3.org/2000/svg" width="92.3125mm" height="92.3125mm" viewBox="0 0 92.3125 92.3125">
        <g transform="translate(-34.919643,-28.40476)">
            <rect width="87.3125" height="87.3125" x="37.419643" y="30.90476" ry="0.37265238" />
            <circle id="t"  cx="81.075897" cy="41.263809" r="4.0090427" :class="colors.t"  />
            <circle id="l"  cx="47.77869"  cy="74.561012" r="4.0090423" :class="colors.l"  />
            <circle id="tl" cx="47.573975" cy="41.223049" r="4.0090423" :class="colors.tl" />
            <circle id="b"  cx="81.075897" cy="107.85822" r="4.0090423" :class="colors.b"  />
            <circle id="r"  cx="114.37312" cy="74.561012" r="4.0090423" :class="colors.r"  />
            <circle id="tr" cx="114.37312" cy="41.223049" r="4.0090423" :class="colors.tr" />
            <circle id="br" cx="114.37312" cy="107.85822" r="4.0090423" :class="colors.br" />
            <circle id="bl" cx="47.573975" cy="107.85822" r="4.0090423" :class="colors.bl" />
        </g>
    </svg>
</template>

<script>
    import {pause} from "../Helpers";

    export default {
        name: "Corners",
        props: ['stdout', 'test', 'success', 'reset', 'runIndex'],
        watch: {
            async stdout() {
                if (this.stdout === false || this.stdout === null) {
                    this.selectedColor = '';
                    this.$emit('finish');
                    return ;
                }

                let stdoutToColor = [
                    {text: "тут сильнее всего", color: "red"},
                    {text: "сильно", color: "yellow" },
                    {text: "слабо", color: "blue" }
                ];

                let lcStdout = this.stdout ? this.stdout.trim().toLowerCase() : null;
                let colorConvert = stdoutToColor.find(item => item.text === lcStdout);
                let color = colorConvert ? colorConvert.color : 'unknown';

                this.selectedColor = color;
                await this.$nextTick();
                this.$emit('finish');
            },
            test() {
                this.selectedColor = '';
                this.$emit('finish');
            },
            success() {
                this.$emit('finish');
            },
            reset() {
                this.$emit('finish');
            },
            async runIndex() {
                await pause(2000);
                this.$emit('finish');
            }
        },
        data() {
            return {
                selectedColor: '',
            }
        },
        computed: {
            colors() {
                let testToCoordCode = [
                    {text: 'право', code: 'r'},
                    {text: 'лево', code: 'l'},
                    {text: 'верх', code: 't'},
                    {text: 'низ', code: 'b'},
                    {text: 'центр', code: ''},
                ];

                let coords = this.test.exec.split('\n').map( varb => varb.replace(/.="(.*?)"/, '$1').toLowerCase() );
                let codes = coords.map( coord => {
                    let codeItem = testToCoordCode.find( item => item.text === coord );
                    return codeItem ? codeItem.code : '';
                });

                let coordCode = codes.reverse().join('');
                let allDirs = ["t", "l", "tl", "b", "r", "tr", "br", "bl"];
                let cornerColors = allDirs.reduce( (colors, key) => {
                    colors[key] = key === coordCode ? this.selectedColor : '';
                    return colors;
                }, {});

                return cornerColors;
            }
        }
    }
</script>

<style scoped>
    rect {
        opacity:1;fill:none;fill-opacity:1;stroke:#00001a;stroke-width:5;stroke-linecap:square;stroke-miterlimit:15;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;
    }

    circle {
        opacity:1;fill:none;fill-opacity:1;stroke:#00001a;stroke-width:1;stroke-linecap:square;stroke-miterlimit:15;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1
    }

    circle.red {
        fill:#ff0000;
    }

    circle.yellow {
        fill:#ffff00;
    }

    circle.blue {
        fill:#00a3ff;
    }

    circle.unknown {
        fill:#aaaaaa;
    }
</style>