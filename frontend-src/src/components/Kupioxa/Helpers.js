function pause(msec) {
    return new Promise(resolve => {
        setTimeout(resolve, msec);
    });
}

export {pause};
