<template>
    <div class="many-links-editor p-4">
        <section class="pagination d-flex flex-row justify-content-center align-items-center no-result-hide">
            <div class="swiper-button-prev" :class="scopedClass('swiper-button-prev')"></div>
            <div class="swiper-pagination" :class="scopedClass('swiper-pagination')"></div>
            <div class="swiper-add-button">
                <button class="btn btn-light" @click="addItem">Добавить материал</button>
            </div>
            <div class="swiper-button-next" :class="scopedClass('swiper-button-next')"></div>
        </section>
        <swiper :options="swiperOptions" @slideChange="changeSlide" @ready="getSwiperInstance">
            <div class="swiper-slide card" v-for="(item, index) in items" :key="item.id">
                <link-editor
                        v-model="item.data"
                ></link-editor>

                <button type="button" class="ml-2 mb-1 close" @click="deleteItem(item, index)">
                    <span>&times;</span>
                </button>
            </div>
        </swiper>

    </div>
</template>

<script>
    import LinkEditor from "./LinkEditor";
    import shortid from "shortid";

    export default {
        name: "ManyLinksEditor",
        props: ['value'],
        components: {
            LinkEditor
        },
        data() {
            let id = shortid.generate();

            return {
                id: id,
                items: this.value,
                swiperInstance: null,
                activeSlideIndex: 0,
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
            addItem() {
                let defaultLinkItem = {
                    id: shortid.generate(),
                    type: 'link',
                    data: {}
                }

                let insertIndex = this.activeSlideIndex;

                this.items.splice(insertIndex, 0, defaultLinkItem);
                this.emitUpdate();
            },
            deleteItem(item, index) {
                this.items.splice(index, 1);
                this.emitUpdate();
            },
            getSwiperInstance(swiperInstance) {
                this.swiperInstance = swiperInstance;
            },
            changeSlide() {
                this.activeSlideIndex = this.swiperInstance.activeIndex;
            },
            emitUpdate() {
                this.$emit('input', this.items);
            }
        }
    }
</script>

<style scoped>
    .close {
        position: absolute;
        top: 0;
        right: 0;

        background-color: #fff!important;
        width: 28px;
        height: 28px;
        margin-top: 0px;
        margin-right: 0px;
    }
</style>