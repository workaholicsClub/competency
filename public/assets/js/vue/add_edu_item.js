function declensionUnits(number, unitsName) {
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
}
function getTimeInHours(duration, durationUnits) {
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
}
function getTimeInDays(duration, durationUnits) {
    let activeHoursInDay = 8;
    return getTimeInHours(duration, durationUnits) / activeHoursInDay;
}
function getTimeWithUnitsString(time, units) {
    return Math.ceil(time) + ' ' + declensionUnits(Math.ceil(time), units);
}
function getHumanReadableTime(duration, durationUnits) {
    let activeDaysInWeek = 5;
    let activeDaysInMonth = 20;

    let timeInHours = getTimeInHours(duration, durationUnits);
    let timeInDays = getTimeInDays(duration, durationUnits);
    let timeInWeeks = timeInDays / activeDaysInWeek;
    let timeInMonths = timeInDays / activeDaysInMonth;
    let timeInYears = timeInMonths / 12;
    let humanReadable = getTimeWithUnitsString(timeInHours, 'час');

    if (timeInHours < 1) {
        humanReadable = 'менее 1 часа';
    }

    if (timeInDays >= 1) {
        humanReadable = getTimeWithUnitsString(timeInDays, 'день');
    }

    if (timeInWeeks >= 1) {
        humanReadable = getTimeWithUnitsString(timeInWeeks, 'неделя');
    }

    if (timeInMonths >= 1) {
        humanReadable = getTimeWithUnitsString(timeInMonths, 'месяц');
    }

    if (timeInYears >= 1) {
        humanReadable = getTimeWithUnitsString(timeInYears, 'год');
    }

    return humanReadable;
}
function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "&nbsp;");
}
function lcfirst(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}
function lcfirstJoin(array, separator) {
    let lcArray = array.map( (item, index) => index === 0 ? item : lcfirst(item) );
    return lcArray.join(separator);
}
function loadApiData(url, data) {
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
}
function loadSkills() {
    return loadApiData('/api/skills.php', {format: 'jsonList'});
}

Vue.component('course-form', {
    template: '#course-form-template',
    props: ['course', 'enums', 'skills', 'mobile'],
    methods: {
        save() {
            console.log(this.course);
        }
    },
    computed: {
        needsCity() {
            return this.course.form && this.course.form.indexOf('offline') !== -1;
        }
    }
});

Vue.component('skill-input', {
    template: '#skill-input-template',
    props: ['value', 'skills'],
    data() {
        return {
            selectedSkills: [],
            allSkills: this.value || [],
        }
    },
    watch: {
        selectedSkills() {
            this.$emit('input', this.selectedSkills);
        }
    },
    methods: {
        searchSkill(input) {
            if (input.length < 1) {
                return []
            }

            return this.skillNames.filter( (skillName) => skillName.toLowerCase().indexOf(input.toLowerCase()) !== -1 );
        },
        isSelected(skill) {
            return this.selectedSkills.indexOf(skill) !== -1;
        },
        addSkill(selectedSkill) {
            this.selectedSkills.push(selectedSkill);
            this.allSkills.push(selectedSkill);
            this.$refs.autocomplete.setValue('');
            this.$emit('input', this.selectedSkills);
        },
    },
    computed: {
        skillNames() {
            return this.skills.map( (skill) => skill.name );
        }
    }
});

Vue.component('check-input', {
    template: '#check-input-template',
    props: ['value', 'items-enum'],
    data() {
        return {
            selectedItems: this.value || []
        }
    },
    watch: {
        selectedItems() {
            this.$emit('input', this.selectedItems);
        }
    },
    methods: {
        isSelected(itemCode) {
            return this.selectedItems.indexOf(itemCode) !== -1;
        }
    }
});

Vue.component('units-select', {
    template: '#units-select-template',
    props: ['value', 'items-enum']
});

Vue.component('skill-list', {
    template: '#skill-list-template',
    props: ['skills']
});

Vue.component('course-card', {
    template: '#course-card-template',
    props: ['course', 'filter-skills', 'enums', 'mobile'],
    data() {
        return {
            isFavourited: false,
            additionalSkillsShown: false,
            hiddenDescriptionShown: false,
        }
    },
    computed: {
        redirectUrl() {
            return this.course.url || false;
        },
        pageUrl() {
            return "/course.html?id="+this.course.id || false;
        },
        hasPartnerUrl() {
            return Boolean(this.course.partnerUrl);
        },
        originalDuration() {
            if (!this.course.duration) {
                return false;
            }

            let readableDuration = this.getReadableValue(this.course.durationUnits, 'durationUnits');
            return this.course.duration + ' ' + declensionUnits(this.course.duration, readableDuration);
        },
        humanDuration() {
            if (!this.course.duration) {
                return false;
            }

            let readableDuration = this.getReadableValue(this.course.durationUnits, 'durationUnits');
            return getHumanReadableTime(this.course.duration, readableDuration);
        },
        originalLoad() {
            if (!this.course.load) {
                return false;
            }

            if (this.course.loadUnits === 'self') {
                return 'Свободный график';
            }

            let readableLoad = this.getReadableValue(this.course.loadUnits, 'loadUnits');

            return this.course.load + ' ' + declensionUnits(this.course.load, readableLoad);
        },
        originalFormAndTime() {
            if (!this.course.form) {
                return false;
            }

            let readableForms = this.course.form.map( (form) => this.getReadableValue(form, 'forms') );
            let formAndMaybeTime = lcfirstJoin(readableForms,'/');

            if (this.course.time) {
                let readableTime = this.course.time.map( (time) => this.getReadableValue(time, 'times') );
                formAndMaybeTime += ', ' + lcfirstJoin(readableTime, '/');
            }

            return formAndMaybeTime;
        },
        humanPrice() {
            if ( typeof(this.course.price) !== 'number') {
                return 'Бесплатно';
            }

            let formattedPrice = formatNumber(this.course.price) + '&nbsp;&#8381;';

            if (this.course.priceType === 'lesson') {
                formattedPrice += '/урок';
            }

            if (this.course.priceType === 'module') {
                formattedPrice += '/модуль';
            }

            if (this.course.priceType === 'month') {
                formattedPrice += '/месяц';
            }

            return this.course.price > 0 ? formattedPrice : 'Бесплатно';
        },
        filteredSkills() {
            let isFilterSkillsDefined = this.filterSkills instanceof Array && this.filterSkills.length > 0;

            if ( !isFilterSkillsDefined ) {
                return false;
            }

            return [];
        },
        additionalSkills() {
            if (!this.filteredSkills) {
                return false;
            }

            return [];
        },
        allSkills() {
            return this.skillsToObjectList(this.course.skills);
        },
        allRequirements() {
            return this.skillsToObjectList(this.course.requirements);
        },
        attributesLine() {
            let certificateShortNames = {
                'Нет': 'Без сертификата',
                'Собственный': 'Собственный',
                'Гос. образца': 'Государственный',
                'Международный': 'Международный'
            };
            let noCertificate = certificateShortNames['Нет'];

            let attributes = [];

            if (this.course.audience && this.course.audience.length > 0) {
                let readableAudience = this.course.audience.map( (audience) => this.getReadableValue(audience, 'audience') );
                attributes.push( lcfirstJoin(readableAudience, '/') );
            }

            if (this.course.format && this.course.format.length > 0) {
                let readableFormats = this.course.format.map( (format) => this.getReadableValue(format, 'formats') );
                attributes.push( lcfirstJoin(readableFormats, '/') );
            }

            attributes.push( this.course.hasTeacher ? 'С преподавателем' : 'Без преподавателя' );
            attributes.push( this.course.hasPractice ? 'С практикой' : 'Без практики' );

            if (this.course.jobPlacement) {
                attributes.push('Помощь в трудоустройстве');
            }

            if (this.course.forKids) {
                attributes.push('Подходит детям и школьникам');
            }

            if (this.course.certificate && this.course.certificate.length > 0) {
                let certificateNames = this.course.certificate.map( (certificate) => {
                    return certificateShortNames[ this.getReadableValue(certificate, 'certificates') ];
                });
                attributes.push( lcfirstJoin(certificateNames, '/') + ' сертификат' );
            }
            else {
                attributes.push(noCertificate);
            }

            return attributes;
        },
        splitDescription() {
            if (!this.course.description) {
                return {
                    visible: false,
                    hidden: false
                };
            }

            let wordLimit = 25;
            let words = this.course.description.split(" ");
            let visible = this.course.description;
            let hidden = false;

            if (words.length > wordLimit) {
                visible = words.slice(0, wordLimit).join(" ");
                hidden = words.slice(wordLimit).join(" ");
            }

            return {
                visible: visible,
                hidden: hidden
            };
        }
    },
    methods: {
        toggleFavourite() {
            this.isFavourited = !this.isFavourited;
        },
        toggleAdditionalSkills() {
            this.additionalSkillsShown = !this.additionalSkillsShown;
        },
        toggleHiddenDescription() {
            this.hiddenDescriptionShown = !this.hiddenDescriptionShown;
        },
        getReadableValue(value, type) {
            if (!this.enums[type]) {
                return value;
            }

            return this.enums[type].reduce( (previousValue, enumValue) => {
                if (enumValue.code === value) {
                    return enumValue.title;
                }

                return previousValue;
            }, value);
        },
        skillsToObjectList(maybeKeyValueObjectOrStringList) {
            let isList = maybeKeyValueObjectOrStringList instanceof Array;
            let isObjectList = isList && maybeKeyValueObjectOrStringList[0] instanceof Object;
            let isStringList = isList && typeof(maybeKeyValueObjectOrStringList[0]) === 'string';

            if (!isList) {
                return false;
            }

            if (isObjectList) {
                return maybeKeyValueObjectOrStringList;
            }

            if (isStringList) {
                return maybeKeyValueObjectOrStringList.map( (skillName) => {
                    return {
                        name: skillName,
                        level: 0
                    };
                });
            }

            return Object.keys(maybeKeyValueObjectOrStringList, (skillName) => {
                let skillLevel = maybeKeyValueObjectOrStringList[skillName];

                return {
                    name: skillName,
                    level: skillLevel,
                }
            });
        }
    }
});

let vueInstance = new Vue({
    el: '#app',
    data: {
        tabs: [
            {code: 'course', title: 'Курс'},
            {code: 'book', title: 'Книга'},
            {code: 'project', title: 'Проект'},
            {code: 'explain', title: 'Объяснение'},
            {code: 'motivation', title: 'Мотивация'},
            {code: 'internship', title: 'Стажировка'},
        ],
        enums: {
            course: {
                forms: [
                    {code: 'online', title: 'Онлайн'},
                    {code: 'offline', title: 'Очный'},
                ],
                formats: [
                    {code: 'video', title: 'Видео'},
                    {code: 'webinar', title: 'Вебинар'},
                    {code: 'chat', title: 'Чат'},
                    {code: 'intensive', title: 'Интенсив'},
                    {code: 'interactive', title: 'Интерактивный'},
                    {code: 'textbook', title: 'Электронный учебник'},
                ],
                times: [
                    {code: 'day', title: 'Днем'},
                    {code: 'evening', title: 'Вечером'},
                    {code: 'dayoffs', title: 'По выходным'},
                ],
                certificates: [
                    {code: 'self', title: 'Собственный'},
                    {code: 'state', title: 'Гос. образца'},
                    {code: 'international', title: 'Международный'},
                ],
                priceTypes: [
                    {code: 'total', title: 'За весь курс'},
                    {code: 'lesson', title: 'За занятие'},
                    {code: 'module', title: 'За модуль'},
                    {code: 'month', title: 'В месяц'},
                ],
                durationUnits: [
                    {code: 'minute', title: 'минута'},
                    {code: 'hour', title: 'час'},
                    {code: 'academic-hour', title: 'ак. час'},
                    {code: 'day', title: 'день'},
                    {code: 'week', title: 'неделя'},
                    {code: 'month', title: 'месяц'},
                    {code: 'lesson', title: 'урок'},
                    {code: 'module', title: 'модуль'}
                ],
                loadUnits: [
                    {code: 'hour-per-day', title: 'час в день'},
                    {code: 'hour-per-week', title: 'час в неделю'},
                    {code: 'day-per-week', title: 'день в неделю'},
                    {code: 'self', title: 'самостоятельно'},
                ],
                audience: [
                    {code: 'junior', title: 'Для начинающих'},
                    {code: 'middle', title: 'Средний уровень'},
                    {code: 'senior', title: 'Для профессионалов'},
                ]
            }
        },
        currentTabCode: 'course',
        allSkills: false,
        course: {
            type: 'course',
            priceType: 'total',
            durationUnits: 'minute',
            loadUnits: 'hour-per-day'
        },
        book: {
            type: 'book'
        },
        window: {
            width: 0,
            height: 0
        }
    },
    created() {
        window.addEventListener('resize', this.handleResize);

        this.handleResize();
        this.loadAllSkills();
    },
    destroyed() {
        window.removeEventListener('resize', this.handleResize)
    },
    methods: {
        async loadAllSkills() {
            this.allSkills = await loadSkills();
        },
        handleResize() {
            this.window.width = window.innerWidth;
            this.window.height = window.innerHeight;
        }
    },
    computed: {
        isMobile() {
            let bootstrapBreakPoints = {
                sm: 576,
                md: 768,
                lg: 992,
                xl: 1200,
            };

            return this.window.width <= bootstrapBreakPoints.md;
        },
        isDesktop() {
            return !this.isMobile;
        }
    }
});

