//https://gist.github.com/maxwells/8251275

function convertHexToRgb(hex) {
    let match = hex.replace(/#/,'').match(/.{1,2}/g);
    return new Color({
        r: parseInt(match[0], 16),
        g: parseInt(match[1], 16),
        b: parseInt(match[2], 16)
    });
}

function Color(hexOrObject) {
    let obj;

    if (hexOrObject instanceof Object) {
        obj = hexOrObject;
    }
    else {
        obj = convertHexToRgb(hexOrObject);
    }

    this.r = obj.r;
    this.g = obj.g;
    this.b = obj.b;
}

Color.prototype.asRgbCss = function() {
    return "rgb("+this.r+", "+this.g+", "+this.b+")";
}

function findColorBetween(left, right, fraction = 0.5) {
    let newColor = {};
    const components = ["r", "g", "b"];

    for (const c of components) {
        newColor[c] = Math.round(left[c] + (right[c] - left[c]) * fraction);
    }

    return new Color(newColor);
}

export {Color, findColorBetween};