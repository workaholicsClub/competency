function macheps() {
    let e = 1.0;

    while ((1.0 + e / 2.0) > 1.0) {
        e /= 2.0;
    }

    return e;
}

function cloneArray(x) {
    return x.slice();
}

function getNumericGrad(func, xVec) {
    let gradValues = [];
    let eps = macheps();

    for (const xIndex in xVec) {
        const x = xVec[xIndex];
        let h = x * Math.sqrt(eps);

        let xGrad = cloneArray(xVec);

        xGrad[xIndex] = x + h;
        let f1 = func(xGrad);

        xGrad[xIndex] = x - h;
        let f2 = func(xGrad);

        gradValues[xIndex] = (f1 - f2)/(2*h);
    }

    return gradValues;
}

function getNumericAntiGrad(func, xVec) {
    return getNumericGrad(func, xVec).map( x => -x );
}

function getExtremum(inpFunc, x0Vec, findMax, eps = 1e-7, step = 1, stepTry = 0) {
    let func = findMax
        ? (x) => -inpFunc(x)
        : inpFunc;

    let iterations = 0;
    let maxIterations = 8000;
    let maxStepTry = 10;

    let xCurrent = cloneArray(x0Vec);
    let calcEps = 0;
    let yPrev = false;
    let yCurrent = func(xCurrent);

    do {
        iterations++;
        let grad = getNumericAntiGrad(func, xCurrent);
        let dx = xCurrent.map( (x, index) => step * grad[index] );
        xCurrent = xCurrent.map( (x, index) => x + dx[index] );

        yCurrent = func(xCurrent);
        calcEps = Math.abs((yCurrent-yPrev)/yCurrent);
        yPrev = yCurrent;
    } while ( calcEps > eps && iterations < maxIterations );

    if (iterations >= maxIterations) {
        if (stepTry > maxStepTry) {
            return false;
        }

        let stepGuess = step * 2;
        return getExtremum(inpFunc, x0Vec, findMax, eps, stepGuess, ++stepTry);
    }
    else {
        return xCurrent;
    }
}

function getContrainedExtremum(valFn, extrFn,  constraints, stepSize = 1e-4) {
    let stepCount = Math.round( (constraints[1] - constraints[0])/stepSize );
    let flowVals = Array(stepCount).fill(0).map( (x, i) => constraints[0] + i * stepSize );

    let xlVals = flowVals.map( f1 => flowVals.map( f2 => valFn(f1, f2) ) );
    let minRows = xlVals.map( row => extrFn.apply(null, row) );
    let minVal = extrFn.apply(null, minRows);

    return minVal;
}

function getMaximum(func, x0Vec, eps) {
    return getExtremum(func, x0Vec, true, eps);
}

function getMinimum(func, x0Vec, eps) {
    return getExtremum(func, x0Vec, false, eps);
}

function getConstrainedMinimum(valFn, constraints, stepSize = 0.1) {
    return getContrainedExtremum(valFn, Math.min, constraints, stepSize);
}

function getConstrainedMaximum(valFn, constraints, stepSize = 0.1) {
    return getContrainedExtremum(valFn, Math.max, constraints, stepSize);
}

export {getMaximum, getMinimum, getConstrainedMinimum, getConstrainedMaximum};