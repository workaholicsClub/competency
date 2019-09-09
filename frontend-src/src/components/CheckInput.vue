<template>
    <div class="check-pills-list">
        <div v-for="item in itemsEnum" class="form-check form-check-inline" :key="item.code">
            <label class="btn btn-outline-primary btn-filter-apply" :class="{'active': isSelected(item.code)}">
                {{item.title}}
                <input type="checkbox" class="form-check-input" v-model="selectedItems" :value="item.code">
            </label>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'CheckInput',
        props: ['value', 'items-enum'],
        data() {
            return {
                selectedItems: this.value || []
            }
        },
        watch: {
            selectedItems() {
                this.$emit('input', this.selectedItems);
            }
        },
        methods: {
            isSelected(itemCode) {
                return this.selectedItems.indexOf(itemCode) !== -1;
            }
        }
    }
</script>

<style>
    .check-pills-list {
        margin-bottom: 1.5em;
    }
</style>