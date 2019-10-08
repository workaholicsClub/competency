export default {
    getAllUrlParams(url) {
        if (!url) {
            url = window.location.search;
        }

        let params={};

        url.replace(/[?&]+([^=&]+)=([^&]*)/gi, (str, key, value) => {
            key = decodeURIComponent(key);
            value = decodeURIComponent(value.replace(/\+/g, ' '));

            let paramExists = typeof(params[key]) !== 'undefined';
            let paramConvertedToArray = paramExists && params[key] instanceof Array;

            if (paramExists) {
                if (!paramConvertedToArray) {
                    params[key] = [ params[key] ];
                }

                params[key].push(value);
            }
            else {
                let paramIsArray = key.indexOf('[') > 0 && key.indexOf(']') > 0;

                params[key] = paramIsArray ? [value] : value;
            }
        });

        return params;
    },
    getParameterByName(name, url) {
        if (!url) {
            url = window.location.search;
        }

        let allParams = this.getAllUrlParams(url);
        let paramExists = typeof (allParams[name]) !== 'undefined';

        return paramExists ? allParams[name] : null;
    },
    getRequestValuesFromURL() {
        let who = this.getParameterByName('who') || false;
        let experience = this.getParameterByName('experience') || false;
        let wish = this.getParameterByName('wish') || false;
        let isRequestNotEmpty = Boolean(who) && Boolean(experience) && Boolean(wish);

        return isRequestNotEmpty ? {who: who, exp: experience, want: wish} : false;
    },
    addRequestParamsToUrl(url, request) {
        let currentUrl = new URL(url);
        currentUrl.searchParams.set('who', request.who);
        currentUrl.searchParams.set('experience', request.exp);
        currentUrl.searchParams.set('wish', request.want);

        return currentUrl.pathname+currentUrl.search;
    },
    setRequestValuesInURL(request) {
        let newUrl = this.addRequestParamsToUrl(location.href, request);
        let newState = {request: request};
        let newTitle = document.title;

        history.pushState(newState, newTitle, newUrl);
    },
    getProfessionCodeFromUrl(paramName) {
        if (!paramName) {
            paramName = 'professionCode';
        }
        let professionCode = this.getParameterByName(paramName);

        if (!professionCode) {
            professionCode = location.pathname.split('/')[1];
        }

        return professionCode || 'qa-tester';
    },
    getItemIdFromUrl() {
        let matches = location.pathname.match(/[a-z0-9]+$/);
        return matches[0] || false;
    },
    makeItemUrl(item) {
        let type = item.type || 'item';
        return `/catalog/${type}/${item._id}`;
    }
}