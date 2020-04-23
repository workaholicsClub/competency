<template>
    <div class="collection-view">
        <h1>{{collection.title}}</h1>
        <p v-if="collection.description" v-html="collection.description" class="text-muted"></p>

        <div class="mt-4">
            <div class="collection-item d-flex flex-row" v-for="item in collection.items" :key="item.id">
                <div v-if="item.type === 'text'" v-html="item.text"></div>

                <link-viewer v-if="item.type === 'link'"
                        :link="item.data"
                        :link-id="item.id"
                        :metadata="findMetadataByItemId(item.id)"
                ></link-viewer>

                <many-links-viewer v-if="item.type === 'manyLinks'"
                        :links="item.items"
                        :metadata="metadata"
                ></many-links-viewer>
            </div>
        </div>

        <div class="comments my-4">
            <vue-disqus
                    shortname="skillitch"
                    :identifier="'collection_'+collection.id"
                    :url="itemUrl(collection.id)"
                    :title="collection.title"
                    language="ru"
            ></vue-disqus>
        </div>

    </div>
</template>

<script>
    import LinkViewer from "./LinkViewer";
    import ManyLinksViewer from "./ManyLinksViewer";
    import {findMetadataByItemId, stateKey} from "./Helpers";

    export default {
        name: "CollectionViewer",
        props: ['collection', 'metadata'],
        components: {
            ManyLinksViewer,
            LinkViewer
        },
        methods: {
            itemUrl(itemId) {
                let url = new URL(window.location.href);
                url.hash = itemId;
                return url.toString();
            },
            findMetadataByItemId(searchedId) {
                return findMetadataByItemId(this.metadata, searchedId);
            },
            stateKey(item) {
                return stateKey(this.metadata, item.id);
            }
        }

    }
</script>

<style scoped>

</style>