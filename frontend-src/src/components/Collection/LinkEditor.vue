<template>
    <div class="link-editor p-4">
        <div class="form-group">
            <label>Ссылка</label>
            <input type="text" class="form-control" v-model="link" @input="emitInputAndFetchMetadataIfNeeded">
        </div>
        <div class="form-group">
            <label>Название</label>
            <input type="text" class="form-control" v-model="title" @input="emitInput">
        </div>
        <div class="form-group">
            <label>Описание</label>
            <textarea class="form-control" v-model="description" @input="emitInput"></textarea>
        </div>
        <div class="form-group">
            <label>Тип</label>
            <select class="form-control" v-model="typeSelect" @input="emitInput" @change="emitInput">
                <option v-for="linkType in linkTypes" :key="linkType">{{linkType}}</option>
            </select>
            <input type="text" class="form-control" v-model="typeText" @input="emitInput" v-if="useCustomTypeInput">
        </div>
        <div class="form-group">
            <label>Автор</label>
            <input type="text" class="form-control" v-model="author" @input="emitInput">
        </div>
        <div class="form-group" v-if="imageUrl">
            <label>Картинка</label>
            <div class="image-container">
                <img :src="imageUrl" class="preview-image">

                <button type="button" class="ml-2 mb-1 close" @click="imageUrl = null">
                    <span>&times;</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';

    const linkTypes = ['Курс', 'Видео', 'Книга', 'Статья', 'Задачи', 'Другое'];

    export default {
        name: "LinkEditor",
        props: ['value'],
        data() {
            let typeSelect = linkTypes.indexOf(this.value.type) !== -1 ? this.value.type : null;
            let typeText = linkTypes.indexOf(this.value.type) === -1 ? this.value.type : null;

            return {
                fetchedUrl: null,
                fetchedMetadata: null,
                linkTypes: linkTypes,

                link: this.value.link || null,
                title: this.value.title || null,
                description: this.value.description || null,
                typeSelect: typeSelect,
                typeText: typeText,
                author: this.value.author || null,
                imageUrl: this.value.imageUrl || null,
            }
        },
        methods: {
            emitInput() {
                let newValue = {
                    link: this.link,
                    title: this.title,
                    description: this.description,
                    type: this.useCustomTypeInput ? this.typeText : this.typeSelect,
                    author: this.author,
                }

                if (this.imageUrl) {
                    newValue.imageUrl = this.imageUrl;
                }

                this.$emit('input', newValue);
            },
            checkValidUrl(urlText) {
                try {
                    new URL(urlText);
                }
                catch (e) {
                    return false;
                }

                return true;
            },
            async getUrlMetadata(url) {
                let metadataResponse = null;

                try {
                    metadataResponse = await axios.get('/api/fetchPageMetadata.php', {params: {url: url}});
                } catch (exception) {
                    return false;
                }

                return metadataResponse.data;
            },

            async emitInputAndFetchMetadataIfNeeded() {
                this.emitInput();
                let newUrlValue = this.link;

                if (this.fetchedUrl === newUrlValue) {
                    return;
                }

                if (!this.checkValidUrl(newUrlValue)) {
                    return;
                }

                let metadata = await this.getUrlMetadata(newUrlValue);

                let metadataMappings = {
                    description: 'description',
                    title: 'title',
                    author: 'provider',
                    imageUrl: 'image'
                }

                Object.keys(metadataMappings).forEach( formField => {
                    let metadataField = metadataMappings[formField];

                    if (!this[formField]) {
                        this.$set(this, formField, metadata[metadataField]);
                    }
                });

                this.emitInput();

                this.fetchedMetadata = metadata;
                this.fetchedUrl = newUrlValue;
            }
        },
        computed: {
            useCustomTypeInput() {
                return this.typeSelect === 'Другое';
            }
        }
    }
</script>

<style scoped>
    .preview-image {
        max-width: 64px;
        max-height: 64px;
        margin: auto;
    }

    .image-container {
        position: relative;
        max-width: 64px;
        max-height: 64px;
    }

    .image-container .close {
        position: absolute;
        top: 0;
        right: 0;

        background-color: #eee!important;
        border-radius: 50%;
        width: 28px;
        height: 28px;
        margin-top: -14px;
        margin-right: -14px;

        font-size: 1.5rem;
        font-weight: 700;
        line-height: 1;
        color: #888;
        opacity: 1;
    }
</style>