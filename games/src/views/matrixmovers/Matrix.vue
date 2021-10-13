<template>
    <b-table-lite small :fields="fields" :items="matrix" borderless>
        <template #head()="" v-if="!header">
            <div v-html="'&nbsp;'"></div>
        </template>
        <template #cell()="data">
            <b-form-input
                v-model.number="data.item[data.field.key]"
                size="sm"
                :readonly="!edit"
                @input="emitChanges"
            ></b-form-input>
        </template>
        <template #cell(y)="data">
            <b-form-input
                v-model.number="data.item.y"
                size="sm"
                :readonly="!edit"
                @input="emitChanges"
            ></b-form-input>
        </template>
    </b-table-lite>
</template>

<script>
import clone from "lodash.clonedeep";

export default {
    props: ['value', 'edit', 'header'],
    data() {
        return {
            matrix: clone(this.value),
        }
    },
    watch: {
        value() {
            this.matrix = clone(this.value);
        }
    },
    methods: {
        emitChanges() {
            this.$emit('input', this.matrix);
        },
    },
    computed: {
        fields() {
            let firstRow = this.value[0];
            let keys = Object.keys(firstRow);

            return keys.map(key => ({key: key, label: key}));
        }
    }
}
</script>

<style lang="scss">
    .table-light {
        background-color: transparent;

        td, th, thead th {
            border-color: transparent;
        }
    }
</style>