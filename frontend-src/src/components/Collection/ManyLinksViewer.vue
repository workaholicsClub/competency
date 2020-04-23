<template>
    <div class="many-links-viewer p-0 col col-12">
        <section class="pagination d-flex flex-row justify-content-center align-items-center no-result-hide">
            <div class="swiper-button-prev" :class="scopedClass('swiper-button-prev')"></div>
            <div class="swiper-pagination" :class="scopedClass('swiper-pagination')"></div>
            <div class="swiper-button-next" :class="scopedClass('swiper-button-next')"></div>
        </section>
        <swiper :options="swiperOptions">
            <div class="swiper-slide" v-for="item in links" :key="item.id">
                <link-viewer
                        :link="item.data"
                        :link-id="item.id"
                        :metadata="findMetadataByItemId(item.id)"
                ></link-viewer>
            </div>
        </swiper>

    </div>
</template>

<script>
    import LinkViewer from "./LinkViewer";
    import shortid from "shortid";
    import {findMetadataByItemId, stateKey} from "./Helpers";

    export default {
        name: "ManyLinksViewer",
        props: ['links', 'metadata'],
        components: {
            LinkViewer
        },
        data() {
            let id = shortid.generate();

            return {
                id: id,
                swiperOptions: {
                    slidesPerView: 'auto',
                    spaceBetween: 12,
                    pagination: {
                        el: this.scopedClass('.swiper-pagination', id),
                        type: 'fraction',
                    },
                    navigation: {
                        nextEl: this.scopedClass('.swiper-button-next', id),
                        prevEl: this.scopedClass('.swiper-button-prev', id)
                    },
                }
            }
        },
        methods: {
            scopedClass(baseClass, id) {
                return baseClass + '__' + (id ? id : this.id);
            },
            findMetadataByItemId(searchedId) {
                return findMetadataByItemId(this.metadata, searchedId);
            },
            stateKey(item) {
                return stateKey(this.metadata, item.id);
            }
        },

    }
</script>

<style scoped>
</style>