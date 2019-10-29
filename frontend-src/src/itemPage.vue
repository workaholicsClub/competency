<template>
    <div class="item-page">
        <page-header
                v-model="request"
                :request-values="requestValues"
                :user="user"
                :favourites="favourites"
                :count-favourites="countFavourites"
                :show-salary="false"

                @login="login"
                @logout="logout"
                @remove-favourite="removeFavourite"
        >
        </page-header>
        <div class="view-on-desktop d-none d-sm-block d-md-block pb-4">
            <main class="container wide-container course-data">
                <autodetect-card
                        :item="item"
                        :mobile="false"
                        :show-full="true"
                        :is-favourite="isFavourite(item)"
                        @favourite="toggleFavourite(item)"
                ></autodetect-card>
            </main>
        </div>
        <div class="view-on-mobile d-block d-sm-none d-md-none pt-4 pb-4">
            <main class="container wide-container course-data">
                <autodetect-card
                        :item="item"
                        :mobile="true"
                        :show-full="true"
                        :is-favourite="isFavourite(item)"
                        @favourite="toggleFavourite(item)"
                ></autodetect-card>
            </main>
        </div>

        <div class="view-on-mobile d-block">
            <h5 class="text-center">Похожие материалы</h5>
            <main>
                <section class="pagination d-flex flex-row justify-content-center align-items-center no-result-hide">
                    <div class="swiper-button-prev"></div>
                    <div class="swiper-pagination"></div>
                    <div class="swiper-button-next"></div>
                </section>
                <swiper :options="swiperOptions" class="course-list">
                    <autodetect-card
                            v-for="item in similar"
                            :item="item"
                            :mobile="true"
                            :show-full="false"
                            :key="item._id"
                            :is-favourite="isFavourite(item)"
                            @favourite="toggleFavourite(item)"
                    ></autodetect-card>
                </swiper>
            </main>
        </div>
    </div>
</template>
<script>
    import AutodetectCard from './components/Cards/AutodetectCard.vue';
    import PageHeader from './components/PageHeader.vue';
    import Enums from './unsorted/Enums';
    import {initAuth, login, logout, isAuthenticated, checkSession, getSavedProfileData} from "./unsorted/Auth";
    import ApiClient from "./unsorted/ApiClient";
    import UrlFunctions from "./unsorted/UrlFunctions";
    import Favourites from "./unsorted/Favourites";

    export default {
        name: 'ItemPage',
        components: {
            AutodetectCard,
            PageHeader
        },
        props: [],
        data() {
            return {
                request: {
                    who: 'новичок',
                    exp: 'без опыта работы',
                    want: 'стать тестировщиком'
                },
                user: false,
                favourites: Favourites.loadFavourites(),
                item: false,
                similar: [],
                swiperOptions: {
                    slidesPerView: 'auto',
                    initialSlide: 1,
                    centeredSlides: true,
                    spaceBetween: 12,
                    pagination: {
                        el: '.swiper-pagination',
                        type: 'fraction',
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                }
            }
        },
        async created() {
            await this.loadItemData();
            this.loadSimilarItems();

            initAuth();

            try {
                await checkSession();
                if (isAuthenticated()) {
                    this.user = getSavedProfileData();
                }
                else {
                    this.user = false;
                }
            }
            catch (error) {
                this.user = false;
            }
        },
        watch: {
            favourites: {
                handler() {
                    Favourites.saveFavourites(this.favourites);
                },
                deep: true
            },
            request: {
                handler() {
                    this.redirectToCatalog();
                },
                deep: true
            }
        },
        methods: {
            async loadItemData() {
                let itemId = UrlFunctions.getItemIdFromUrl();
                if (itemId) {
                    this.item = await ApiClient.loadItem(itemId);
                }
            },
            async loadSimilarItems() {
                let filter = {
                    'filter[skills]': this.item.skills
                };

                this.similar = await ApiClient.loadCoursesDebounced(filter);

                return this.similar;
            },
            findProfessionCodeFromConfig(config, selectedText) {
                let codeFound = Object.keys(config).reduce( (found, currentCode) => {
                    let currentText = config[currentCode];
                    if (currentText === selectedText) {
                        return currentCode;
                    }

                    return found;
                }, false );

                return codeFound;
            },
            getProfessionCodeFromRequest() {
                let professionValuesEnum = Enums.requestValues;

                let codeFromWho = this.findProfessionCodeFromConfig( professionValuesEnum.who, this.request.who );
                let codeFromWant = this.findProfessionCodeFromConfig( professionValuesEnum.want, this.request.want );

                return codeFromWho
                    ? codeFromWho
                    : (codeFromWant ? codeFromWant : false);
            },
            redirectToCatalog() {
                let professionCode = this.getProfessionCodeFromRequest();
                if (professionCode) {
                    let redirectUrl = UrlFunctions.addRequestParamsToUrl(`${location.origin}/${professionCode}/catalog`, this.request);
                    window.location.href = redirectUrl;
                }
            },
            login() {
                login();
            },
            logout() {
                logout();
            },
            isFavourite(item) {
                return Favourites.findFavouriteIndex(item, this.favourites) !== -1;
            },
            addFavourite(item) {
                this.favourites = Favourites.addFavourite(item, this.favourites);
            },
            removeFavourite(item) {
                this.favourites = Favourites.removeFavourite(item, this.favourites);
            },
            toggleFavourite(item) {
                if (this.isFavourite(item)) {
                    this.removeFavourite(item);
                }
                else {
                    this.addFavourite(item);
                }
            },
            flattenValues(object) {
                let values = Object.values(object);
                return values.reduce((aggregator, value) => {
                    if (value instanceof Array) {
                        aggregator = aggregator.concat(value);
                    }
                    else {
                        aggregator.push(value);
                    }

                    return aggregator;
                }, []);
            }
        },
        computed: {
            requestValues() {
                let professionValuesEnum = Enums.requestValues;

                return {
                    who: this.flattenValues(professionValuesEnum.who),
                    exp: professionValuesEnum.exp,
                    want: this.flattenValues(professionValuesEnum.want)
                }
            },
            countFavourites() {
                return this.favourites.length;
            }
        }
    }
</script>

<style>
    .swiper-wrapper {
        width: 1000000px;
        display: flex;
        align-items: flex-start;
    }
    .swiper-wrapper .swiper-slide {
        max-width: 400px;
        width: 85vw;
        display: inline-block;
    }
</style>