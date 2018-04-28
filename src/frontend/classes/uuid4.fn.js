/*
 * https://gist.github.com/kaizhu256/2853704
 */

/**
 * @returns {string}
 */
function uuid4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, _uuid4);
}

function _uuid4 (cc) {
    let rr = Math.random() * 16 | 0; return (cc === 'x' ? rr : (rr & 0x3 | 0x8)).toString(16);
}

module.exports = uuid4;