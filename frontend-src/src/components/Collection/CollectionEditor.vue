<template>
        <div class="collection-editor">

            <div class="form-group">
                <label for="titleInput">Название подборки</label>
                <input type="text" class="form-control" id="titleInput" v-model="collection.title" @input="emitCollectionInput">
            </div>
            <div class="form-group">
                <label for="descriptionInput">Краткое описание</label>
                <textarea class="form-control" id="descriptionInput" v-model="collection.description" @input="emitCollectionInput"></textarea>
            </div>

            <div class="card collection-item" v-for="(item, index) in collectionItems" :key="item.id">

                <text-editor v-if="item.type === 'text'"
                        v-model="item.text"
                        @input="emitCollectionInput"
                ></text-editor>

                <link-editor v-if="item.type === 'link'"
                        v-model="item.data"
                        @input="emitCollectionInput"
                ></link-editor>

                <many-links-editor v-if="item.type === 'manyLinks'"
                        v-model="item.items"
                        @input="emitCollectionInput"
                ></many-links-editor>

                <button type="button" class="ml-2 mb-1 close" @click="deleteItem(item, index)">
                    <span>&times;</span>
                </button>
            </div>
        </div>
</template>

<script>
    import TextEditor from "./TextEditor";
    import LinkEditor from "./LinkEditor";
    import ManyLinksEditor from "./ManyLinksEditor";

    import shortid from "shortid";
    import {shallowClone} from "./Helpers";

    export default {
        name: "CollectionEditor",
        props: ['value'],
        components: {
            TextEditor,
            LinkEditor,
            ManyLinksEditor
        },
        data() {
            return {
                collection: this.value,
                collectionItems: this.value.items || []
            }
        },
        methods: {
            addTextItem() {
                let defaultTextItem = {
                    id: shortid.generate(),
                    type: 'text',
                    text: ''
                }

                this.collectionItems.push(defaultTextItem);
                this.emitCollectionInput();
            },
            addLinkItem() {
                let defaultLinkItem = {
                    id: shortid.generate(),
                    type: 'link',
                    data: {}
                }

                this.collectionItems.push(defaultLinkItem);
                this.emitCollectionInput();
            },
            addManyLinksItem() {
                let defaultManyLinksItem = {
                    type: 'manyLinks',
                    items: [
                        {
                            id: shortid.generate(),
                            type: 'link',
                            data: {}
                        },
                        {
                            id: shortid.generate(),
                            type: 'link',
                            data: {}
                        }
                    ]
                }

                this.collectionItems.push(defaultManyLinksItem);
                this.emitCollectionInput();
            },
            deleteItem(item, index) {
                this.collectionItems.splice(index, 1);
                this.emitCollectionInput();
            },
            emitCollectionInput() {
                let updatedCollection = shallowClone(this.collection);
                updatedCollection['id'] = this.value.id || shortid.generate();
                updatedCollection['title'] = this.collection.title;
                updatedCollection['description'] = this.collection.description;
                updatedCollection['items'] = this.collectionItems;

                this.$emit('input', updatedCollection);
            },
        },
        mounted() {
            this.$root.$on('addTextItem', this.addTextItem);
            this.$root.$on('addLinkItem', this.addLinkItem);
            this.$root.$on('addManyLinksItem', this.addManyLinksItem);
        },
        beforeDestroy() {
            this.$root.$off('addTextItem', this.addTextItem);
            this.$root.$off('addLinkItem', this.addLinkItem);
            this.$root.$off('addManyLinksItem', this.addManyLinksItem);
        }
    }
</script>

<style scoped>
    .collection-item {
        margin-bottom: 1rem;
    }
</style>