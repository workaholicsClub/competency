function roundToPrecision(num, precision = 2) {
    return +(Math.round(num + `e+${precision}`)  + `e-${precision}`);
}

export {roundToPrecision};