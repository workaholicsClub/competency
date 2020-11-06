<template>
    <svg
            xmlns:dc="http://purl.org/dc/elements/1.1/"
            xmlns:cc="http://creativecommons.org/ns#"
            xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
            xmlns:svg="http://www.w3.org/2000/svg"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
            xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
            version="1.0"
            width="299.99649"
            height="225.92412"
            viewBox="0 0 85.704 64.542"
            id="Layer_1"
            xml:space="preserve"
            sodipodi:docname="Speech_bubble.svg"
            inkscape:version="0.92.4 (5da689c313, 2019-01-14)">
        <metadata id="metadata1048">
            <rdf:RDF>
                <cc:Work rdf:about="">
                    <dc:format>image/svg+xml</dc:format>
                    <dc:type
            rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                </cc:Work>
            </rdf:RDF>
        </metadata>
        <sodipodi:namedview
            pagecolor="#ffffff"
            bordercolor="#666666"
            borderopacity="1"
            objecttolerance="10"
            gridtolerance="10"
            guidetolerance="10"
            inkscape:pageopacity="0"
            inkscape:pageshadow="2"
            inkscape:window-width="1834"
            inkscape:window-height="1016"
            id="namedview1046"
            showgrid="false"
            inkscape:zoom="3.7711777"
            inkscape:cx="188.75394"
            inkscape:cy="112.96206"
            inkscape:window-x="86"
            inkscape:window-y="27"
            inkscape:window-maximized="1"
            inkscape:current-layer="Layer_1" />
        <defs id="defs8" />

        <g v-if="kupioxaSpeaking"
                transform="matrix(0.9486962,0,0,0.9486962,2.4834364,1.8361818)"
                id="g3">
            <path
                    d="M 45.673,0 C 67.781,0 85.703,12.475 85.703,27.862 C 85.703,43.249 67.781,55.724 45.673,55.724 C 38.742,55.724 32.224,54.497 26.539,52.34 C 15.319,56.564 0,64.542 0,64.542 C 0,64.542 9.989,58.887 14.107,52.021 C 15.159,50.266 15.775,48.426 16.128,46.659 C 9.618,41.704 5.643,35.106 5.643,27.862 C 5.643,12.475 23.565,0 45.673,0 M 45.673,2.22 C 24.824,2.22 7.862,13.723 7.862,27.863 C 7.862,34.129 11.275,40.177 17.472,44.893 L 18.576,45.734 L 18.305,47.094 C 17.86,49.324 17.088,51.366 16.011,53.163 C 15.67,53.73 15.294,54.29 14.891,54.837 C 18.516,53.191 22.312,51.561 25.757,50.264 L 26.542,49.968 L 27.327,50.266 C 32.911,52.385 39.255,53.505 45.673,53.505 C 66.522,53.505 83.484,42.002 83.484,27.862 C 83.484,13.722 66.522,2.22 45.673,2.22 L 45.673,2.22 z "
                    id="path5" />
        </g>
        <g v-if="juliaSpeaking"
                id="g893"
                transform="matrix(-0.9486962,0,0,0.9486962,83.789547,1.8361818)">
            <path
                    id="path891"
                    d="m 45.673,0 c 22.108,0 40.03,12.475 40.03,27.862 0,15.387 -17.922,27.862 -40.03,27.862 -6.931,0 -13.449,-1.227 -19.134,-3.384 C 15.319,56.564 0,64.542 0,64.542 c 0,0 9.989,-5.655 14.107,-12.521 1.052,-1.755 1.668,-3.595 2.021,-5.362 C 9.618,41.704 5.643,35.106 5.643,27.862 5.643,12.475 23.565,0 45.673,0 m 0,2.22 c -20.849,0 -37.811,11.503 -37.811,25.643 0,6.266 3.413,12.314 9.61,17.03 l 1.104,0.841 -0.271,1.36 c -0.445,2.23 -1.217,4.272 -2.294,6.069 -0.341,0.567 -0.717,1.127 -1.12,1.674 3.625,-1.646 7.421,-3.276 10.866,-4.573 l 0.785,-0.296 0.785,0.298 c 5.584,2.119 11.928,3.239 18.346,3.239 20.849,0 37.811,-11.503 37.811,-25.643 C 83.484,13.722 66.522,2.22 45.673,2.22 Z"
                    inkscape:connector-curvature="0" />
        </g>

        <text v-if="showTest"
                xml:space="preserve"
                style="font-style:normal;font-weight:normal;font-size:11.42733383px;line-height:125%;font-family:Sans;letter-spacing:0px;word-spacing:0px;fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.28568333px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
                x="18.105305"
                y="25.453102"
                id="text1052"><tspan
     sodipodi:role="line"
     id="tspan1050"
     x="18.105305"
     y="25.453102"
     style="font-size:5.33275557px;line-height:95.99999785%;stroke-width:0.28568333px">Батарейки за {{batteresPrice}} Р</tspan><tspan
                sodipodi:role="line"
                x="18.105305"
                y="39.73727"
                style="font-size:5.33275557px;stroke-width:0.28568333px"
                id="tspan1056" /></text>
        <text v-if="showTest"
                xml:space="preserve"
                style="font-style:normal;font-weight:normal;font-size:11.42733383px;line-height:125%;font-family:Sans;letter-spacing:0px;word-spacing:0px;fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.28568333px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
                x="19.393127"
                y="33.937599"
                id="text1174"><tspan
     sodipodi:role="line"
     id="tspan1172"
     x="19.393127"
     y="33.937599"
     style="font-size:5.33275557px;stroke-width:0.28568333px">Шоколадка за {{chocolatePrice}} Р</tspan></text>
        <text v-if="showTestIntro"
                xml:space="preserve"
                style="font-style:normal;font-weight:normal;font-size:11.42733383px;line-height:125%;font-family:Sans;letter-spacing:0px;word-spacing:0px;fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.28568333px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
                x="15.150881"
                y="26.665173"
                id="text877">
            <tspan
                 sodipodi:role="line"
                 id="tspan875"
                 x="15.150881"
                 y="26.665173"
                 style="font-size:9.14186668px;stroke-width:0.28568333px">
                Не хватает:(
            </tspan>
        </text>
        <text v-if="showTestIntro"
                xml:space="preserve"
                style="font-style:normal;font-weight:normal;font-size:11.42733383px;line-height:125%;font-family:Sans;letter-spacing:0px;word-spacing:0px;fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.28568333px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
                x="16.287195"
                y="34.089104"
                id="text881">
            <tspan
                 sodipodi:role="line"
                 id="tspan879"
                 x="16.287195"
                 y="34.089104"
                 style="font-size:5.33275557px;stroke-width:0.28568333px">
                Так. А если другие...
            </tspan>
        </text>
        <text v-if="showResult"
                xml:space="preserve"
                style="font-style:normal;font-weight:normal;font-size:11.42733383px;line-height:125%;font-family:Sans;letter-spacing:0px;word-spacing:0px;fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.28568333px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
                x="27.650362"
                y="32.346756"
                id="text885">
            <tspan
                 sodipodi:role="line"
                 id="tspan883"
                 x="27.650362"
                 y="32.346756"
                 style="stroke-width:0.28568333px">
                {{stdout.trim()}} Р
            </tspan>
        </text>
        <text v-if="showSuccess"
                xml:space="preserve"
                style="font-style:normal;font-weight:normal;font-size:11.42733383px;line-height:125%;font-family:Sans;letter-spacing:0px;word-spacing:0px;fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.28568333px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
                x="19.468882"
                y="31.740721"
                id="text889">
            <tspan
                 sodipodi:role="line"
                 id="tspan887"
                 x="19.468882"
                 y="31.740721"
                 style="stroke-width:0.28568333px;fill:#00ff00">
                Хватает!
            </tspan>
        </text>
    </svg>
</template>

<script>
    import {pause} from "../Helpers";

    export default {
        name: "Vars",
        props: ['stdout', 'test', 'success', 'reset', 'runIndex'],
        data() {
            return {
                isFirstTest: true,
                showTest: true,
                showTestIntro: false,
                showResult: false,
                showSuccess: false,

                resultChanged: false,
                testChanged: true,
                testIntro: false,
                animating: false,

                pauseMs: 4000,
            }
        },
        watch: {
            reset() {
                if (this.reset) {
                    this.isFirstTest = true;
                    this.resetVars();
                }
            },
            runIndex() {
                if (!this.animating) {
                    this.$emit('finish');
                }
            },
            async stdout() {
                if (!this.stdout) {
                    this.$emit('finish');
                    return;
                }

                await this.playAnimation();
                this.isFirstTest = false;
                this.$emit('finish');
            },
            async success() {
                this.showTest = false;
                this.showTestIntro = false;
                this.showResult = false;
                this.showSuccess = true;
                await this.$nextTick();
                await pause(this.pauseMs);
                this.$emit('finish');
            }
        },
        methods: {
            resetVars() {
                this.showTest = true;
                this.showTestIntro = false;
                this.showResult = false;
                this.showSuccess = false;
            },
            async playAnimation() {
                this.animating = true;

                if (!this.isFirstTest) {
                    this.showTest = false;
                    this.showTestIntro = true;
                    this.showResult = false;
                    await this.$nextTick();
                    await pause(this.pauseMs);
                }

                if (!this.showTest) {
                    this.showTest = true;
                    this.showTestIntro = false;
                    this.showResult = false;
                    await this.$nextTick();
                    await pause(this.pauseMs);
                }

                this.showTest = false;
                this.showTestIntro = false;
                this.showResult = true;
                await this.$nextTick();
                await pause(this.pauseMs);

                this.animating = false;
            }
        },
        computed: {
            parsedPrices() {
                let result;
                try {
                    result = this.test.exec.match(/([\d.]+)/g).map(num => parseFloat(num));
                }
                catch (e) {
                    result = false;
                }

                return result;
            },
            batteresPrice() {
                return this.parsedPrices ? this.parsedPrices[0] : false;
            },
            chocolatePrice() {
                return this.parsedPrices ? this.parsedPrices[1] : false;
            },
            juliaSpeaking() {
                return this.showResult;
            },
            kupioxaSpeaking() {
                return !this.juliaSpeaking;
            }
        }
    }
</script>

<style scoped>

</style>