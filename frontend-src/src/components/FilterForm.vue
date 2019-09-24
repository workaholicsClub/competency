<template>
    <section class="filter-panel" :class="{'sliding-panel': mobile}">
        <div class="margin-wrapper m-4" v-if="mobile">
            <div class="flex-row d-flex align-items-center justify-content-center mb-4 section-title">
                <label class="flex-fill text-center mb-0">Фильтры</label>
                <a class="close-panel-btn" href="#" @click="$emit('close')">&times;</a>
            </div>

            <filter-input v-for="field in fields" v-model="filter[field.code]" :field="field" :mobile="true" :key="field.code+value[field.code]"></filter-input>
        </div>
        <div class="d-flex flex-row flex-wrap margin-wrapper m-4" v-else>
            <filter-input v-for="field in fieldsBeforeSplit" v-model="filter[field.code]" :field="field" :mobile="false" :key="field.code+value[field.code]"></filter-input>

            <div class="d-flex flex-row more-group" v-if="!expanded">
                <label class="more-label" v-if="hasActiveAfterSplit" @click="expanded = true">Еще фильтры (активно: {{activeAfterSplitCount}})</label>
                <label class="more-label" v-else @click="expanded = true">Еще фильтры</label>
            </div>

            <filter-input v-for="field in fieldsAfterSplit" v-model="filter[field.code]" :field="field" :mobile="false" :key="field.code+value[field.code]"></filter-input>

            <div class="d-flex flex-row more-group" v-if="expanded">
                <label class="more-label" @click="expanded = false">Меньше фильтров</label>
            </div>
        </div>
    </section>
</template>
<script>
    import FilterFields from "../unsorted/FilterFields";
    import FilterInput from './FilterInput.vue';

    export default {
        name: 'FilterForm',
        props: ['value', 'mobile', 'split-at'],
        components: {
            FilterInput
        },
        data() {
            return {
                fields: FilterFields.fields,
                filter: this.value,
                expanded: false
            }
        },
        watch: {
            filter: {
                handler() {
                    this.$emit('input', this.filter);
                },
                deep: true
            },
            value: {
                handler() {
                    this.filter = this.value;
                },
                deep: true
            }
        },
        computed: {
            fieldsBeforeSplit() {
                if (!this.splitAt) {
                    return this.fields;
                }

                let fieldFound = false;
                return this.fields.filter( field => {
                    fieldFound = fieldFound || field.code === this.splitAt;

                    return fieldFound === false;
                });
            },
            fieldsAfterSplit() {
                if (!this.splitAt) {
                    return [];
                }

                let fieldFound = false;
                return this.fields.filter( field => {
                    fieldFound = fieldFound || field.code === this.splitAt;

                    return fieldFound === true;
                });
            },
            activeAfterSplit() {
                return this.fieldsAfterSplit.filter( (currentField) => {
                    let fieldValue = this.value[currentField.code];
                    let isDefined = typeof(fieldValue) !== 'undefined';
                    let isArray = isDefined && fieldValue instanceof Array;
                    let isNotEmptyArray = isArray && fieldValue.length > 0;
                    let hasNonArrayValue = !isArray && Boolean(fieldValue);

                    let hasValue = isDefined && ( isNotEmptyArray || hasNonArrayValue );

                    return hasValue;
                });
            },
            activeAfterSplitCount() {
                return this.activeAfterSplit.length;
            },
            hasActiveAfterSplit() {
                return this.activeAfterSplit.length > 0;
            }
        }
    }
</script>