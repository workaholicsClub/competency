<template>
    <div>
        <nav class="navbar navbar-light bg-light d-md-none">
            <a href="javascript:0;" class="navbar-brand" @click="login" v-if="!user">
                <img src="/assets/images/avatar.svg">
            </a>
            <span class="navbar-brand avatar" v-else>
                <img :src="user.picture" class="custom-avatar">
            </span>

            <button class="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbar"
                    aria-controls="navbar"
                    aria-expanded="false"
            >
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbar">
                <view-mode-menu v-if="viewMode"
                        :user-logged-in="Boolean(user)"
                        :bookmarks-mode="showBookmarks"
                >
                </view-mode-menu>
                <edit-mode-menu v-else
                        :preview-mode="previewMode"
                        :collection-changed="collectionChanged"
                        :user-logged-in="Boolean(user)"
                ></edit-mode-menu>

                <div class="form-group pt-4" v-if="!viewMode && collection.id">
                    <a class="btn btn-link" :href="'/collection/view/'+collection.id" target="_blank">
                        Ссылка на эту подборку
                        <i class="fas fa-external-link-alt"></i>
                    </a>
                </div>

                <div class="alert alert-warning" role="alert" v-if="!user">
                    {{ viewMode
                    ? 'Войдите, чтобы смотреть закладки'
                    : 'Войдите, чтобы сохранить подборку в общем доступе'}}
                </div>

                <div>
                    Контакты: <a href="https://ttttt.me/skill_itch">чат</a>, <a href="https://ttttt.me/reflexum">автор сайта</a>
                </div>
            </div>
        </nav>

        <div class="container container-fluid">
            <div class="row">
                <div class="col col-12 col-md-3 pt-4 bg-light d-none d-md-flex">
                    <div class="side-menu">
                        <div class="avatar d-flex flex-column align-items-center">
                            <img src="/assets/images/avatar.svg" @click="login" v-if="!user">
                            <img :src="user.picture" class="custom-avatar" v-else>
                            <a href="javascript:0;" class="user-name" @click="login" v-if="!user">Неопознанный Итчер</a>
                            <span class="user-name" v-else>{{user.name}}</span>
                        </div>

                        <view-mode-menu v-if="viewMode"
                                :user-logged-in="Boolean(user)"
                                :bookmarks-mode="showBookmarks"
                        >
                        </view-mode-menu>
                        <edit-mode-menu v-else
                                :preview-mode="previewMode"
                                :collection-changed="collectionChanged"
                                :user-logged-in="Boolean(user)"
                        ></edit-mode-menu>

                        <div class="form-group pt-4" v-if="!viewMode && collection.id">
                            <a class="btn btn-link" :href="'/collection/view/'+collection.id" target="_blank">
                                Ссылка на эту подборку
                                <i class="fas fa-external-link-alt"></i>
                            </a>
                        </div>

                        <div class="alert alert-warning" role="alert" v-if="!user">
                            {{ viewMode
                                ? 'Войдите, чтобы смотреть закладки'
                                : 'Войдите, чтобы сохранить подборку в общем доступе'}}
                        </div>

                        <div>
                            Контакты: <a href="https://ttttt.me/skill_itch">чат</a>, <a href="https://ttttt.me/reflexum">автор сайта</a>
                        </div>
                    </div>
                </div>
                <div class="col col-12 col-md-9 px-0 mx-0" v-if="loading">
                    <div class="progress">
                        <div class="progress-bar progress-bar-striped progress-bar-animated"
                                style="width: 100%"></div>
                    </div>
                </div>
                <div class="col col-12 col-md-9 pt-4" v-else-if="showBookmarks">
                    <link-viewer v-for="bookmark in bookmarks"
                            :link="bookmark.data"
                            :link-id="bookmark.id"
                            :metadata="findMetadataByItemId(bookmark.id)"
                            :key="bookmark.id"
                    ></link-viewer>
                </div>
                <div class="col col-12 col-md-9 pt-4" v-else-if="viewMode">
                    <collection-viewer :collection="collection" :metadata="userMetadata" :key="collectionUid('view')"></collection-viewer>
                </div>
                <div class="col col-12 col-md-9 pt-4" v-else>
                    <h4 v-if="editMode">Редактирование подборки</h4>
                    <h4 v-else>Добавление подборки</h4>


                    <collection-viewer :collection="collection" :metadata="userMetadata" v-if="previewMode" :key="collectionUid('view')"></collection-viewer>
                    <collection-editor v-model="collection" v-else :key="collectionUid('edit')"></collection-editor>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import CollectionEditor from "./components/Collection/CollectionEditor";
    import CollectionViewer from "./components/Collection/CollectionViewer";
    import LinkViewer from './components/Collection/LinkViewer';
    import EditModeMenu from "./components/Collection/EditModeMenu";
    import ViewModeMenu from "./components/Collection/ViewModeMenu";

    import {findMetadataByItemId, shallowClone} from "./components/Collection/Helpers";
    import axios from "axios";
    import {checkSession, getSavedProfileData, initAuth, isAuthenticated, login, logout} from "./unsorted/Auth";

    const newCollection = {
        title: '',
        description: '',
        items: []
    }

    export default {
        name: "CollectionPage",
        components: {
            CollectionEditor,
            CollectionViewer,
            LinkViewer,
            EditModeMenu,
            ViewModeMenu
        },
        data() {
            return {
                user: false,
                collection: newCollection,
                loading: true,
                previewMode: false,
                showBookmarks: false,
                userMetadata: [],
                bookmarks: [],
                collectionChanged: false,
                error: false,
                metadataId: false,
            }
        },
        async created() {
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

            this.loadMetadata();
            let requestedCollectionId = this.getCollectionIdFromUrl();
            let loadedCollection = await this.loadCollection(requestedCollectionId);

            if (loadedCollection) {
                this.collection = loadedCollection;
            }

            this.loading = false;

            this.$root.$on('metadataChange', this.updateMetadata);
            this.$root.$on('previewMode', this.togglePreview);
            this.$root.$on('saveCollection', this.saveCollection);
            this.$root.$on('login', this.login);
            this.$root.$on('logout', this.logout);
            this.$root.$on('clear', this.clearLocalCollection);
            this.$root.$on('bookmarks', this.toggleBookmarks);
        },
        beforeDestroy() {
            this.$root.$off('metadataChange', this.updateMetadata);
            this.$root.$off('previewMode', this.togglePreview)
            this.$root.$off('saveCollection', this.saveCollection);
            this.$root.$off('login', this.login);
            this.$root.$off('logout', this.logout);
            this.$root.$off('clear', this.clearLocalCollection);
            this.$root.$off('bookmarks', this.toggleBookmarks);
        },
        watch: {
            collection: {
                deep: true,
                handler() {
                    this.collectionChanged = true;
                }
            }
        },
        computed: {
            editMode() {
                return this.collection ? Boolean(this.collection._id) : false;
            },
            mode() {
                return this.parseUrl().mode;
            },
            userCanEdit() {
                let isUserAuthorized = Boolean(this.user);

                return isUserAuthorized && this.collection.user && this.collection.user.sub === this.user.sub;
            },
            viewMode() {
                let isViewMode = this.mode === 'view';
                let isEditMode = !isViewMode;
                let collectionRequested = Boolean(this.getCollectionIdFromUrl());
                let isIllegalEdit = collectionRequested && isEditMode && !this.userCanEdit;

                return isViewMode || isIllegalEdit;
            }
        },
        methods: {
            login() {
                login();
            },

            logout() {
                logout();
            },

            togglePreview(newValue) {
                this.previewMode = newValue;
            },

            async loadItemBackend(collectionName, filter) {
                let url = '/api/loadItem.php';

                try {
                    let result = await axios.post(url, {collectionName, filter});
                    if (result.data.error) {
                        this.error = result.data.error;
                        return false;
                    }

                    return result.data.data;
                }
                catch (e) {
                    this.error = e.toString();
                }

                return false;
            },
            loadItemLocal(itemName) {
                let loadedItem = false;

                try {
                    loadedItem = JSON.parse( localStorage.getItem(itemName) );
                }
                catch (e) {
                    loadedItem = false;
                }

                return loadedItem;
            },

            async saveItemBackend(collectionName, item) {
                let url = '/api/saveItem.php';

                try {
                    let result = await axios.post(url, {collectionName, item});
                    if (result.data.error) {
                        this.error = result.data.error;
                        return false;
                    }

                    return result.data.data;
                }
                catch (e) {
                    this.error = e.toString();
                }

                return false;
            },
            saveItemLocal(itemName, item) {
                localStorage.setItem(itemName, JSON.stringify(item));
                return item;
            },

            parseUrl() {
                let [,,mode,collectionId] = location.pathname.split('/');
                return {mode, collectionId};
            },

            getCollectionIdFromUrl() {
                return this.parseUrl().collectionId;
            },

            async loadCollection(collectionId) {
                if (collectionId) {
                    return this.loadItemBackend('collections', {id: collectionId});
                }

                return this.loadItemLocal('collection');
            },
            async saveCollection() {
                let result = false;

                if (this.user) {
                    if (!this.collection.user) {
                        this.collection.user = this.user;
                    }

                    result = await this.saveItemBackend('collections', this.collection)
                }
                else {
                    result = this.saveItemLocal('collection', this.collection);
                }

                if (result) {
                    this.collection = result;
                    this.collectionChanged = false;

                    if (!this.getCollectionIdFromUrl() && this.mode === 'edit') {
                        history.pushState({}, document.title, '/collection/edit/'+this.collection.id);
                        localStorage.removeItem('collection');
                    }
                }
            },

            async loadMetadata() {
                let loadedMetadata = false;

                if (this.user) {
                    let metadataStruct = await this.loadItemBackend('metadata', {userId: this.user.sub});
                    this.metadataId = metadataStruct._id;
                    loadedMetadata = metadataStruct.items;
                }

                if (!loadedMetadata) {
                    loadedMetadata = this.loadItemLocal('user-metadata');
                }

                this.userMetadata = loadedMetadata || [];

                return this.userMetadata;
            },
            async saveMetadata() {
                let result = false;
                let metadata = this.userMetadata;

                if (this.user) {
                    metadata = {
                        userId: this.user.sub,
                        items: this.userMetadata,
                    };

                    if (this.metadataId) {
                        metadata['_id'] = this.metadataId;
                    }

                    result = await this.saveItemBackend('metadata', metadata)
                }
                else {
                    result = this.saveItemLocal('user-metadata', metadata);
                }

                return result;
            },

            async toggleBookmarks() {
                this.showBookmarks = !this.showBookmarks;

                if (this.showBookmarks) {
                    this.loading = true;
                    this.bookmarks = await this.loadBookmarks();
                    this.loading = false;
                }
            },

            async loadBookmarks() {
                if (!this.user) {
                    return [];
                }

                let url = '/api/loadCollectionBookmarks.php';

                try {
                    let result = await axios.get(url, {params: {
                            userId: this.user.sub
                        }});

                    if (result.data.error) {
                        this.error = result.data.error;
                        return [];
                    }

                    return result.data.items;
                }
                catch (e) {
                    this.error = e.toString();
                }

                return [];
            },

            findMetadataByItemId(searchedId) {
                return findMetadataByItemId(this.userMetadata, searchedId);
            },

            clearLocalCollection() {
                this.collection = shallowClone(newCollection);
                localStorage.removeItem('collection');

                if (this.getCollectionIdFromUrl() && this.mode === 'edit') {
                    history.pushState({}, document.title, '/collection/edit');
                }
            },

            updateMetadata(itemId, field, newValue) {
                let metadataItem = this.findMetadataByItemId(itemId);
                let itemIndex = this.userMetadata.indexOf(metadataItem);

                if (!metadataItem) {
                    metadataItem = {
                        itemId: itemId
                    }

                    itemIndex = this.userMetadata.length;
                    this.$set(this.userMetadata, itemIndex, metadataItem);
                }

                this.$set(metadataItem, field, newValue);
                this.saveMetadata();
            },
            collectionUid(suffix) {
                return this.collection
                    ? this.collection._id+'_'+this.collection.id+'_'+suffix
                    : suffix;
            }
        }
    }
</script>

<style scoped>
</style>

<style>
    @font-face {
        font-family: Gilroy;
        src: url("/assets/font/Gilroy-Light.otf") format("opentype");
    }
    @font-face {
        font-family: Gilroy;
        font-weight: bold;
        src: url("/assets/font/Gilroy-ExtraBold.otf") format("opentype");
    }
    @font-face {
        font-family: 'GoogleSans';
        font-style: normal;
        font-weight: normal;
        src: local('GoogleSans'), url('/assets/fonts/ProductSans-Regular.woff') format('woff');
    }
    @font-face {
        font-family: 'GoogleSans';
        font-style: normal;
        font-weight: bold;
        src: local('GoogleSans'), url('/assets/fonts/ProductSans-Bold.woff') format('woff');
    }

    body {
        font-family: GoogleSans, sans-serif;
    }

    .collection-item .text-editor {
        min-height: 300px;
        position: relative;
    }

    .close {
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

    .swiper-button-next, .swiper-button-prev {
        height: 55px;
        width: 55px;
        border-radius: 50%;
        background-color: #fff;
        border: 1px solid rgba(0,0,0,.125);
    }

    .swiper-button-next {
        right: -25px;
    }

    .swiper-button-prev {
        left: -25px;
    }

    .swiper-button-disabled {
        display: none;
    }

    .swiper-add-button {
        position: absolute;
        z-index:100;
    }

    .side-menu {
        width: 100%;
        position: sticky;
        top: 1.5rem;
    }

    .container {
        min-height: 100vh;
    }

    .avatar img {
        width: 64px;
        height: 64px;
        background: white;
        cursor: pointer;
    }

    .navbar .avatar img {
        width: 32px;
        height: 32px;
    }

    img.custom-avatar {
        border-radius: 50%;
        border: solid 2px #cfd7de;
    }

    .navbar {
        position: sticky;
        top: 0;
        z-index: 1000;
    }

    .progress, progress-bar {
        border-radius: 0;
    }

    @media (min-width: 768px) {
        .swiper-wrapper .swiper-slide {
            width: 85%;
        }
    }
</style>