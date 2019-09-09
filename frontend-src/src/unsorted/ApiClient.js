export default {
    loadApiData(url, data) {
        let promise = $.Deferred();

        $.ajax({
            url: url,
            data: data,
            dataType: 'json',
            success: function (result) {
                promise.resolve(result);
            },
            error: function (result) {
                if (result && result.status === 200) {
                    promise.resolve(result.responseText);
                }
                else {
                    promise.reject(result);
                }
            }
        });

        return promise;
    },
    loadSkills() {
        return this.loadApiData('/api/skills.php', {format: 'jsonList'});
    }
}