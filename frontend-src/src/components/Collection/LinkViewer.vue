<template>
    <div>
        <div class="link d-flex flex-row my-4">
            <item-toolbar
                :metadata="metadata"

                @complete="sendMetadataChange('complete', ...arguments)"
                @like="sendMetadataChange('like', ...arguments)"
                @bookmark="sendMetadataChange('bookmark', ...arguments)"
            ></item-toolbar>
            <div class="media card flex-column flex-md-row flex-fill p-4"
                :class="{'border-success': metadata.complete}"
            >
                <a class="mr-3 mb-3" :href="link.link" target="_blank">
                    <img :src="link.imageUrl" class="mr-3 align-self-start" v-if="link.imageUrl">
                </a>
                <div class="media-body">
                    <h5 class="mt-0">
                        <a :href="link.link" target="_blank">{{link.title}}</a>
                    </h5>

                    <div v-html="link.description"></div>

                    <div class="media-footer" v-if="link.type">{{link.type}} от {{link.author}}</div>
                    <div class="media-footer" v-else>{{link.author}}</div>
                    <div class="media-footer"><i class="fas fa-link mr-2"></i><a :href="link.link" target="_blank" class="text-truncate">{{link.link}}</a></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import ItemToolbar from "./ItemToolbar";

    export default {
        name: "LinkViewer",
        props: ['link', 'metadata', 'linkId'],
        components: {
            ItemToolbar
        },
        methods: {
            sendMetadataChange(field, newState) {
                this.$root.$emit('metadataChange', this.linkId, field, newState);
            }
        }
    }
</script>

<style scoped>
    .media img {
        max-width: 64px;
    }

    .media-footer {
        color: #6c757d!important;
        font-size: 80%;
        font-weight: 400;
        text-align: right!important;
    }

    h5 a {
        text-decoration: none;
        color: #212529;
    }

    .media-footer .text-truncate {
        display: inline-block;
        max-width: 132px;
    }

    @media (min-width: 576px) {
        .media-footer .text-truncate {
            max-width: 312px;
        }
    }

    @media (min-width: 768px) {
        .media-footer .text-truncate {
            max-width: 312px;
        }
    }

    @media (min-width: 992px) {
        .media-footer .text-truncate {
            max-width: 492px;
        }
    }

    @media (min-width: 1200px) {
        .media-footer .text-truncate {
            max-width: 622px;
        }
    }

</style>