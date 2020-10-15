export default {
    methods: {
        smartRound(float) {
            return float
                .toFixed(2)
                .replace(/0+$/,'')
                .replace(/\.$/, '');
        },
    }
}