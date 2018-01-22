module.exports = function (ms) {
    var startTime = new Date();
    var currentTime = new Date();

    while(currentTime - startTime < ms) {
        currentTime = new Date();
    }
}