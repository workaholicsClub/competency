export default {
    declensionUnits(number, unitsName) {
        let declensionVariants = {
            'ак. час': ['ак. час', 'ак. часа', 'ак. часов'],
            'день': ['день', 'дня', 'дней'],
            'час': ['час', 'часа', 'часов'],
            'урок': ['урок', 'урока', 'уроков'],
            'модуль': ['модуль', 'модуля', 'модулей'],
            'минута': ['минута', 'минуты', 'минут'],
            'месяц': ['месяц', 'месяца', 'месяцев'],
            'неделя': ['неделя', 'недели', 'недель'],
            'год': ['год', 'года', 'лет'],
            'вакансий': ['вакансии', 'вакансий', 'вакансий'],
            'вакансия': ['вакансии', 'вакансиям', 'вакансиям'],
            'час в день': ['час в день', 'часа в день', 'часов в день'],
            'час в неделю': ['час в неделю', 'часа в неделю', 'часов в неделю'],
            'день в неделю': ['день в неделю', 'дня в неделю', 'дней в неделю'],
        };

        if (typeof declensionVariants[unitsName] == 'undefined') {
            return unitsName;
        }

        let unitVariants = declensionVariants[unitsName];
        let lastDigit = parseInt(number.toString().substr(-1));

        if (number <= 10 || number >= 20) {
            if (lastDigit === 1) {
                return unitVariants[0];
            }

            if (lastDigit < 5 && lastDigit > 1) {
                return unitVariants[1];
            }

            if (lastDigit >= 5 || lastDigit === 0) {
                return unitVariants[2];
            }
        }
        else {
            return unitVariants[2];
        }
    },
    getTimeInHours(duration, durationUnits) {
        let activeHoursInDay = 8;
        let activeDaysInWeek = 5;
        let activeDaysInMonth = 20;
        let time = duration;
        let units = durationUnits;
        let hoursCoefficient = {
            'ак. час': 45/60,
            'день': activeHoursInDay,
            'час': 1,
            'урок': 1,
            'модуль': 4,
            'минута': 1/60,
            'месяц': activeHoursInDay*activeDaysInMonth,
            'неделя': activeHoursInDay*activeDaysInWeek
        };

        let timeInHours = time * hoursCoefficient[units];

        return timeInHours;
    },
    getTimeInDays(duration, durationUnits) {
        let activeHoursInDay = 8;
        return this.getTimeInHours(duration, durationUnits) / activeHoursInDay;
    },
    getTimeWithUnitsString(time, units) {
        return Math.ceil(time) + ' ' + this.declensionUnits(Math.ceil(time), units);
    },
    getHumanReadableTime(duration, durationUnits) {
        let activeDaysInWeek = 5;
        let activeDaysInMonth = 20;

        let timeInHours = this.getTimeInHours(duration, durationUnits);
        let timeInDays = this.getTimeInDays(duration, durationUnits);
        let timeInWeeks = timeInDays / activeDaysInWeek;
        let timeInMonths = timeInDays / activeDaysInMonth;
        let timeInYears = timeInMonths / 12;
        let humanReadable = this.getTimeWithUnitsString(timeInHours, 'час');

        if (timeInHours < 1) {
            humanReadable = 'менее 1 часа';
        }

        if (timeInDays >= 1) {
            humanReadable = this.getTimeWithUnitsString(timeInDays, 'день');
        }

        if (timeInWeeks >= 1) {
            humanReadable = this.getTimeWithUnitsString(timeInWeeks, 'неделя');
        }

        if (timeInMonths >= 1) {
            humanReadable = this.getTimeWithUnitsString(timeInMonths, 'месяц');
        }

        if (timeInYears >= 1) {
            humanReadable = this.getTimeWithUnitsString(timeInYears, 'год');
        }

        return humanReadable;
    },
    formatNumber(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "&nbsp;");
    },
    lcfirst(string) {
        return string.charAt(0).toLowerCase() + string.slice(1);
    },
    lcfirstJoin(array, separator) {
        let lcArray = array.map( (item, index) => index === 0 ? item : this.lcfirst(item) );
        return lcArray.join(separator);
    }
}