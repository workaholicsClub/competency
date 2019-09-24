import axios from 'axios'

function debounce(func, wait, immediate) {
    //https://frontender.info/essential-javascript-functions/
    let timeout;
    return function() {
        let context = this, args = arguments;
        let later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        let callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

let loadSkillsDataDebounced = debounce(async function (salaryFrom, salaryTo, filterRate, professionCode, resolve) {
    let result = this.loadSkillsData(salaryFrom, salaryTo, filterRate, professionCode);
    resolve(result);
}, 300);

let loadCoursesDebounced = debounce(async function (filter, resolve) {
    let result = this.loadCourses(filter);
    resolve(result);
}, 300);

export default {
    async loadApiData(url, data) {
        let result = await axios.get(url, {
            params: data
        });

        return result.data
    },
    loadSkills() {
        return this.loadApiData('/api/skills.php', {format: 'jsonList'});
    },
    loadHistogramData(professionCode) {
        return this.loadApiData('/api/histogramData.php', {professionCode: professionCode});
    },
    async loadProfessionSkills(professionName) {
        let allSkillsGrouppedByProfession = await this.loadApiData('/api/skills.php', {format: 'json'});
        let ucProfessionName = professionName[0].toUpperCase() + professionName.slice(1);

        return allSkillsGrouppedByProfession[ucProfessionName];
    },
    loadCourses(filter) {
        filter['responseFormat'] = 'json';

        return this.loadApiData('/api/coursesList.php', filter);
    },
    loadCoursesDebounced(filter) {
        return new Promise( resolve => {
            loadCoursesDebounced.call(this, filter, resolve);
        });
    },
    loadSkillsData(salaryFrom, salaryTo, filterRate, professionCode) {
        return this.loadApiData('/api/vacancySkillsBySalary.php', {
            professionCode: professionCode,
            salaryFrom: salaryFrom,
            salaryTo: salaryTo,
            filterRate: filterRate
        });
    },
    loadSkillsDataDebounced(salaryFrom, salaryTo, filterRate, professionCode){
        return new Promise( resolve => {
            loadSkillsDataDebounced.call(this, salaryFrom, salaryTo, filterRate, professionCode, resolve);
        });
    },
    async saveItem(item) {
        let isNewItem = typeof (item['_id']) !== 'string';
        let url = '/api/saveEduItem.php';

        let result = await axios.post(url, item);
        return result.data;
    }
}