<template>
    <div class="item-toolbar d-flex flex-column align-items-center mr-3">
        <div class="btn-group-vertical">
            <button class="btn"
                    :class="{'btn-success': metadata.complete, 'btn-light': !metadata.complete}"
                    @click="$emit('complete', newCompleteState)"
            ><i class="fas fa-check"></i></button>
        </div>
        <div class="flex-fill"></div>

        <div class="btn-group-vertical">
            <button v-if="metadata.bookmark"
                    class="btn btn-warning text-white" @click="$emit('bookmark', newBookmarkState)"><i class="fas fa-bookmark"></i></button>
            <button v-else
                    class="btn btn-light" @click="$emit('bookmark', newBookmarkState)"><i class="far fa-bookmark"></i></button>


            <button v-if="metadata.like"
                    class="btn btn-danger text-white" @click="$emit('like', newLikeState)"><i class="fas fa-heart"></i></button>
            <button v-else
                    class="btn btn-light" @click="$emit('like', newLikeState)"><i class="far fa-heart"></i></button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ItemToolbar",
        props: ['metadata'],
        computed: {
            newCompleteState() {
                return !this.metadata.complete;
            },
            newLikeState() {
                return !this.metadata.like;
            },
            newBookmarkState() {
                return !this.metadata.bookmark;
            }
        }
    }
</script>

<style scoped>
    .item-toolbar .btn {
        padding: .375rem .475rem;
    }
</style>