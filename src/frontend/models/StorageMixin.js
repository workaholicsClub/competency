let StorageMixin = {
    initStorage: function (storage) {
        this.storage = storage;
    },

    /**
     * @param {Event} event*
     */
    saveData: function (event) {
        if (this.storage) {
            this.storage.save(this.getProps());
        }
    },

    loadData: function () {
        if (this.storage) {
            let savedAnswers = this.storage.load();

            if (savedAnswers) {
                this.setPropsWithoutEvent(savedAnswers);
            }
        }
    }
};

module.exports = StorageMixin;