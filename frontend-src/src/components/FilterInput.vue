<template>
    <div class="filter-field">
        <div v-if="mobile">
            <div class="input-group">
                <label class="group-title-label">{{field.title}}</label>
                <div class="checkbox-group">
                    <label class="btn btn-outline-primary btn-filter-apply"
                            :class="{'active': isSelected(valueItem.code)}"
                            v-for="valueItem in field.values"
                            :key="valueItem.code"
                    >
                        {{valueItem.title}}
                        <input type="checkbox" :value="valueItem.code" :name="field.code + '[]'" v-model="selectedItems">
                    </label>
                </div>
            </div>
        </div>
        <div v-else>
            <div class="d-flex flex-row flex-wrap mr-4">
                <label class="d-inline mr-2 group-title-label">{{field.title}}</label>

                <label class="btn btn-outline-primary btn-filter-apply"
                        :class="{'active': isSelected(valueItem.code)}"
                        v-for="valueItem in field.values"
                        :key="valueItem.code"
                >
                    {{valueItem.title}}
                    <input type="checkbox" :value="valueItem.code" :name="field.code + '[]'" v-model="selectedItems">
                </label>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'FilterInput',
        props: ['field', 'value', 'mobile'],
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