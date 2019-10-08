<template>
    <div>
        <div class="view-on-desktop d-none d-sm-block d-md-block">
            <header class="">
                <div class="container wide-container d-flex align-items-center px-3 mb-3">
                    <a href="/"><img src="/assets/images/itcher.png" class="mr-2"></a>
                    <section class="data flex-fill">
                        <div class="input-group">
                            <request-form ref="request" v-model="request" :request-values="requestValues" :is-request-shown="isRequestShown"></request-form>
                        </div>
                    </section>
                    <section class="fav-auth d-flex align-items-center">
                        <div class="d-flex align-items-center dropdown dropleft">
                            <button id="desktop-fav-btn" class="btn btn-favourites-list d-flex align-items-center justify-content-center mr-4" @click="toggleFavourites">
                                <label class="fav-text">Моя&nbsp;подборка</label>
                                <i class="fas fa-bookmark mx-2"></i>
                                <span class="fav-count">{{countFavourites}}</span>
                            </button>
                            <div class="dropdown-menu favourite-list p-4" aria-labelledby="desktop-fav-btn" :class="{'show': isFavouritesShown}">
                                <favourite-card v-for="item in favourites" :item="item" @remove="$emit('remove-favourite', item)" :key="item._id"></favourite-card>
                            </div>
                            <div class="dropdown-backdrop" @click="toggleFavourites"></div>
                        </div>
                        <img src="/assets/images/avatar.svg" class="avatar-holder" @click="$emit('login')" v-if="!user">
                        <img :src="user.picture" class="avatar-holder custom-avatar" v-else>
                        <a href="javascript:0;" class="btn btn-link" @click="$emit('login')" v-if="!user">Войти</a>
                        <a href="javascript:0;" class="btn btn-link" @click="$emit('logout')" v-else>Выйти</a>
                    </section>
                </div>
            </header>
            <header class="scroll">
                <div class="container wide-container d-flex align-items-center px-3">
                    <a class="" href="/"><img src="/assets/images/itcher-float.png" class="mr-2"></a>
                    <section class="data flex-fill">
                        <div class="input-group">
                            <request-form v-model="request" :request-values="requestValues" :is-request-shown="isRequestShown"></request-form>
                        </div>
                    </section>
                    <section class="fav-auth d-flex align-items-center">
                        <div class="d-flex align-items-center dropdown dropleft">
                            <button id="desktop-fav-btn" class="btn btn-favourites-list d-flex align-items-center justify-content-center mr-4" @click="toggleFavourites">
                                <label class="fav-text">Моя подборка</label>
                                <i class="fas fa-bookmark mx-2"></i>
                                <span class="fav-count">{{countFavourites}}</span>
                            </button>
                            <div class="dropdown-menu favourite-list p-4" aria-labelledby="desktop-fav-btn" :class="{'show': isFavouritesShown}">
                                <favourite-card v-for="item in favourites" :item="item" @remove="$emit('remove-favourite', item)" :key="item._id"></favourite-card>
                            </div>
                            <div class="dropdown-backdrop" @click="toggleFavourites"></div>
                        </div>
                        <img src="/assets/images/avatar.svg" class="avatar-holder" @click="$emit('login')" v-if="!user">
                        <img :src="user.picture" class="avatar-holder custom-avatar" v-else>
                        <a href="javascript:0;" class="btn btn-link" @click="$emit('login')" v-if="!user">Войти</a>
                        <a href="javascript:0;" class="btn btn-link" @click="$emit('logout')" v-else>Выйти</a>
                    </section>
                </div>
            </header>
        </div>
        <div class="view-on-mobile d-block d-sm-none d-md-none">
            <header class="avatar d-flex flex-column card p-4 top-drawer" :class="{'expanded': headerExpanded}">
                <h5>
                    <a href="javascript:0;" class="user-name" @click="$emit('login')" v-if="!user">Неопознанный Итчер</a>
                    <a href="javascript:0;" class="user-name" v-else>{{user.name}}</a>
                </h5>
                <div v-if="showSalary">
                    <div class="d-flex flex-row justify-content-between align-items-start">
                        <div class="d-flex flex-row h-100 ">
                            <section class="data d-flex flex-column align-items-start h-100 flex-fill mr-2">
                                <div class="input-group">
                                    <request-form v-model="request" :request-values="requestValues" :is-request-shown="isRequestShown"></request-form>
                                </div>

                                <button class="btn btn-outline-info btn-block mt-4 btn-choose-skills">Выбрать навыки</button>

                                <div class="input-group salary-input-group">
                                    <label class="">Желаемая зарплата:</label>
                                    <a href="#" class="editable-toggle salary-input-display" v-if="salaryLoaded" @click="$emit('open-skills')"><span v-html="salaryRangeReadable"></span></a>
                                    <a href="#" class="editable-toggle salary-input-display" v-else>...</a>
                                </div>
                            </section>
                            <section class="logo">
                                <img src="/assets/images/avatar.svg" @click="$emit('login')" v-if="!user">
                                <img :src="user.picture" class="custom-avatar" v-else>
                            </section>
                        </div>
                    </div>
                    <salary-input v-model="salary" :histogram="histogram" width="260" height="51" v-if="histogram"></salary-input>
                    <div class="profile-handle" @click="headerExpanded = !headerExpanded"></div>
                </div>
                <div v-else>
                    <div class="d-flex flex-row justify-content-between align-items-start">
                        <div class="d-flex flex-row h-100 ">
                            <section class="data d-flex flex-column align-items-start h-100 flex-fill mr-2">
                                <div class="input-group">
                                    <request-form v-model="request" :request-values="requestValues" :is-request-shown="isRequestShown"></request-form>
                                </div>
                            </section>
                            <section class="logo">
                                <img src="/assets/images/avatar.svg" @click="$emit('login')" v-if="!user">
                                <img :src="user.picture" class="custom-avatar" v-else>
                            </section>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    </div>
</template>

<script>
    import RequestForm from './RequestForm.vue';
    import FavouriteCard from './Cards/Favourite.vue';
    import SalaryInput from './SalaryInput.vue';

    export default {
        name: 'PageHeader',
        components: {
            SalaryInput,
            FavouriteCard,
            RequestForm,
        },
        props: ['value', 'requestValues', 'user', 'favourites', 'countFavourites', 'showSalary', 'salary', 'salaryRangeReadable', 'salaryLoaded', 'histogram'],
        data() {
            return {
                isFavouritesShown: false,
                headerExpanded: false,
                request: false,
                isRequestShown: {
                    who: false,
                    exp: false,
                    want: false,
                },
            }
        },
        created() {
            if (!this.request) {
                this.request = this.value;
            }
        },
        watch: {
            value: {
                handler() {
                    this.request = this.value;
                },
                deep: true
            },
            request: {
                handler() {
                    this.$emit('input', this.request);
                },
                deep: true
            }
        },
        methods: {
            toggleFavourites() {
                this.isFavouritesShown = !this.isFavouritesShown;
            },
        },
    }
</script>