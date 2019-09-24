export default {
    arrayToKeyValue(data) {
        let keyValueData = data;

        if (data instanceof Array) {
            keyValueData = data.reduce((data, item) => {
                data[item.name] = item.value;
                return data;
            }, {});
        }

        return keyValueData;
    },
    clone(data) {
        return JSON.parse( JSON.stringify(data) );
    }
}