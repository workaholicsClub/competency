<template>
    <div class="card course-card">
        <div class="card-body">
            <div class="d-flex flex-row course-card-header">
                <span class="badge badge-course-info">{{itemName}}</span>
                <h6 class="text-muted flex-fill" v-if="itemBy">{{itemBy}}</h6>
                <a href="#" class="top-favourite-remove" @click="$emit('remove', item)"><i class="fas fa-trash"></i></a>
            </div>
            <h5>{{item.title}}</h5>

            <p v-if="item.description" class="mb-4">
                <split-description :text="item.description" :use-html="true"></split-description>
            </p>

            <a :href="itemUrl" target="_blank" class="btn btn-outline-info btn-block btn-link" v-if="itemUrl">
                {{buttonTitle}}
            </a>
        </div>
    </div>
</template>
<script>
    import Enums from "../../unsorted/Enums";
    import SplitDescription from '../SplitDescription.vue'

    export default {
        name: 'BasicTextCard',
        components: {
            SplitDescription
        },
        props: ['item'],
        computed: {
            itemName() {
                return Enums.types[this.item.type];
            },
            itemBy() {
                if (this.item.type === 'course') {
                    return 'от '+this.item.platform;
                }

                if (this.item.author) {
                    return this.item.author;
                }

                return false;
            },
            itemUrl() {
                if (this.item.url) {
                    return this.item.url
                }

                return false;
            },
            buttonTitle() {
                if (this.item.type === 'course') {
                    return 'Записаться';
                }

                if (this.item.type === 'book') {
                    return this.item.price > 0 ? 'Купиить' : 'Скачать';
                }

                return 'Посмотреть';
            }
        }
    }
</script>