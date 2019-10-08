export default {
    saveFavourites(favourites) {
        localStorage.setItem('user_favourites', JSON.stringify(favourites));
    },
    loadFavourites() {
        let data = localStorage.getItem('user_favourites');
        if (data) {
            return  JSON.parse(data) || [];
        }

        return [];
    },
    findFavouriteIndex(item, favourites) {
        return favourites.reduce( (foundIndex, favourite, currentIndex) => {
            if (favourite._id === item._id) {
                return currentIndex;
            }
            else {
                return foundIndex;
            }
        }, -1);
    },
    addFavourite(item, favourites) {
        favourites.push(item);
        return favourites;
    },
    removeFavourite(item, favourites) {
        let itemIndex = this.findFavouriteIndex(item, favourites);
        if (itemIndex !== -1) {
            favourites.splice(itemIndex, 1);
            return favourites;
        }
        return favourites;
    },
}