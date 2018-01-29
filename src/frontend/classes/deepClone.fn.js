module.exports = function (source) {
    //TODO eval is evil
    return JSON.parse(JSON.stringify(source));
};