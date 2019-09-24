<template>
    <label class="request">
        &mdash;&nbsp;Я
        <span v-for="block in requestBlocks" :key="block">
            {{block === 'want' ? 'хочу' : ''}}
            <span class="dropdown" >
                <a @click="toggleRequest(block)" class="editable-toggle mr-1" href="#">{{request[block]}}</a>
                <span :class="{'show': isRequestShown[block]}" class="dropdown-menu">
                    <a class="dropdown-item" href="#" v-for="value in requestValues[block]" @click="setBlockValue(block, value)" :key="block+value">{{value}}</a>
                </span>
            </span>
        </span>
        <button class="btn btn-outline-info apply-request" v-if="changed" @click="applyRequest" >Подобрать курсы</button>
    </label>
</template>
<script>
    export default {
        name: 'RequestForm',
        props: ['value', 'isRequestShown', 'requestValues'],
        components: {
        },
        data() {
            return {
                changed: false,
                request: false
            }
        },
        created() {
            if (!this.request) {
                this.setRequestFields(this.value);
            }
        },
        watch: {
            value: {
                handler() {
                    this.setRequestFields(this.value);
                },
                deep: true
            }
        },
        methods: {
            toggleRequest(block) {
                this.isRequestShown[block] = !this.isRequestShown[block];
                let otherBlocks = Object.keys(this.isRequestShown).filter(otherBlock => otherBlock !== block);
                otherBlocks.forEach(otherBlock => {
                    this.isRequestShown[otherBlock] = false;
                });
            },
            setRequestFields(value) {
                let isValueCorrect = value && value.who && value.exp && value.want;

                if (isValueCorrect) {
                    this.request = {
                        who: value.who,
                        exp: value.exp,
                        want: value.want
                    }
                }
            },
            setBlockValue(block, value) {
                this.request[block] = value;
                this.isRequestShown[block] = false;
                this.changed = true;
            },
            applyRequest() {
                this.$emit('input', this.request);
                this.changed = false;
            }
        },
        computed: {
            requestBlocks() {
                return Object.keys(this.requestValues);
            }
        }
    }
</script>