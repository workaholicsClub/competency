let idToken;
let accessToken;
let expiresAt;
let webAuth;
let userProfile;

function bindAuthEvents() {
    $(document).on('click', '.auth-trigger', function () {
        let loginUrl = location.origin + '/login.html?return_url=' + encodeURIComponent(location.href);
        location.href = loginUrl;
    });
}

function initAuth() {
    webAuth = new auth0.WebAuth({
        domain: 'skill-itch.eu.auth0.com',
        clientID: '6f2BVSYLZQlmbtVWdI8JCL4gt8R12sZg',
        responseType: 'token id_token',
        scope: 'openid profile',
        redirectUri: window.location.origin + '/login.html'
    });

    bindAuthEvents();
}

function processAuthInfo() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        return renewTokens();
    }
    else {
        return handleAuthentication();
    }
}

function launchAuth() {
    webAuth.authorize();
}

function afterLogin() {
}

function afterLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user_profile');
}

function handleAuthentication() {
    let authPromise = new Promise((resolve, reject) => {
        webAuth.parseHash((err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                window.location.hash = '';
                localLogin(authResult);
                return resolve();
            }
            else if (err) {
                return  reject(err);
            }
            return resolve();
        });
    });

    return authPromise
        .then(afterLogin)
        .catch(showAuthError);
}

function localLogin(authResult) {
    localStorage.setItem('isLoggedIn', 'true');
    expiresAt = JSON.stringify(
        authResult.expiresIn * 1000 + new Date().getTime()
    );
    accessToken = authResult.accessToken;
    idToken = authResult.idToken;
}

function showAuthError(err) {
    console.log('Error: ' + err.error + '. Check the console for further details.');
}

function checkSession() {
    return renewTokens();
}
function renewTokens() {
    let renewPromise = new Promise((resolve, reject) => {
        webAuth.checkSession({}, (err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                localLogin(authResult);
                return resolve();
            }
            else if (err) {
                logout();
                return reject(err);
            }
            return resolve();
        });
    });

    return renewPromise
        .then(afterLogin)
        .catch(showAuthError);
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    accessToken = '';
    idToken = '';
    expiresAt = 0;
    afterLogout();
}

function isAuthenticated() {
    let expiration = parseInt(expiresAt) || 0;
    return localStorage.getItem('isLoggedIn') === 'true' && new Date().getTime() < expiration;
}

function getProfile() {
    let profilePromise = new Promise((resolve, reject) => {
        if (!userProfile) {
            if (!accessToken) {
                return reject('Access Token must exist to fetch profile');
            }

            webAuth.client.userInfo(accessToken, function(err, profile) {
                if (profile) {
                    userProfile = profile;
                    return resolve(userProfile);
                }
            });
        }
        else {
            return resolve(userProfile);
        }
    });

    return profilePromise;
}

function saveProfileData(profile) {
    if (profile) {
        localStorage.setItem('user_profile', JSON.stringify(profile));
        return true;
    }
    return false;
}

function getSavedProfileData() {
    if (!isAuthenticated()) {
        return false;
    }

    let data = localStorage.getItem('user_profile');
    if (data) {
        return JSON.parse(data);
    }

    return false;
}