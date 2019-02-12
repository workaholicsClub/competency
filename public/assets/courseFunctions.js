let backpack = false;

function getBackpack() {
    if (backpack === false) {
        loadBackpack();
    }

    return backpack;
}

function pushToBackpack(course) {
    backpack.push(course);
    saveBackpack();
}

function loadBackpack() {
    let savedIds = getCookie('backpack');
    backpack = [];

    if (savedIds) {
        savedIds.forEach(function (courseId) {
            let course = getCourseById(courseId);
            if (course !== false) {
                backpack.push(course);
            }
        });
    }
}

function getBackpackIds() {
    let courseIds = getBackpack().reduce(function (ids, course) {
        ids.push(course.id);
        return ids;
    }, []);

    return courseIds;
}

function saveBackpack() {
    setCookie('backpack', getBackpackIds());
}

function getCookie(name) {
    return Cookies.getJSON(name);
}

function setCookie(name, value) {
    Cookies.set(name, value);
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

function getCourseHardnessHTML(course, level) {
    let hardnessIndex = getHardnessIndex(course, level);

    if (hardnessIndex === 2) {
        return "Средней сложности";
    }

    if (hardnessIndex === 3) {
        return "Трудный";
    }

    return "Легкий";
}

function getCourseHardness(course) {
    let skillNames = Object.keys(course.skills);
    let maxSkillLevel = skillNames.reduce(function (maxLevel, skillName) {
        let skillLevel = course.skills[skillName];
        if (skillLevel > maxLevel) {
            return skillLevel;
        }

        return maxLevel;
    }, 0);

    return maxSkillLevel;
}

function getHardnessIndex(course, level) {
    let hardnessPercent = getCourseHardness(course, level);

    let hardnessIndex = 1;

    if (hardnessPercent >= 5) {
        hardnessIndex = 2;
    }

    if (hardnessPercent > 50) {
        hardnessIndex = 3;
    }

    return hardnessIndex;
}

function getCourseAttributesHTML(course, index) {
    let certificateShortNames = {
        'Нет': 'Без сертификата',
        'Собственный': 'Собственный сертификат',
        'Государственного образца': 'Государственный сертификат'
    };

    let attributes = [
        course.format,
        getCourseHardnessHTML(course, index),
        course.hasTeacher ? 'С преподавателем' : 'Без преподавателя',
        course.hasPractice ? 'С практикой' : 'Без практики'
    ];

    if (course.jobPlacement) {
        attributes.push('Помощь в трудоустройстве');
    }

    if (course.forKids) {
        attributes.push('Подходит детям и школьникам');
    }

    attributes.push(certificateShortNames[course.certificate]);
    attributes.push(course.duration + ' ' + declensionUnits(course.duration, course.durationUnits));

    return attributes.join('&nbsp;&bull;&nbsp;\n');
}

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
        'год': ['год', 'года', 'лет']
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

function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "&nbsp;");
}

function getSkillHTML(skillName, skillLevel) {
    return "<span class=\"skill\">" + skillName + " <span class=\"skill-strength level"+skillLevel+"\"><span></span><span></span><span></span><span></span></span></span>";
}

function getSkillsHTML(course) {
    let skillNames = Object.keys(course.skills);
    let skillsHTML = skillNames.map(function (skillName) {
        let skillLevel = course.skills[skillName];
        return getSkillHTML(skillName, skillLevel);
    });

    return skillsHTML.join("\n");
}

function getRequirementsHTML(course) {
    let requirementNames = Object.keys(course.requirements);
    let skillsHTML = requirementNames.map(function (requirementName) {
        let requirementLevel = course.requirements[requirementName];
        return getSkillHTML(requirementName, requirementLevel);
    });

    return skillsHTML.join("\n");
}

function getTimeInHours(course) {
    let activeHoursInDay = 8;
    let activeDaysInWeek = 5;
    let activeDaysInMonth = 20;
    let time = course.duration;
    let units = course.durationUnits;
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

function getTimeInDays(course) {
    let activeHoursInDay = 8;
    return getTimeInHours(course) / activeHoursInDay;
}

function getTimeWithUnitsString(time, units) {
    return Math.ceil(time) + ' ' + declensionUnits(Math.ceil(time), units);
}

function getHumanReadableTime(course) {
    let activeDaysInWeek = 5;
    let activeDaysInMonth = 20;

    let timeInHours = getTimeInHours(course);
    let timeInDays = getTimeInDays(course);
    let timeInWeeks = timeInDays / activeDaysInWeek;
    let timeInMonths = timeInDays / activeDaysInMonth;
    let timeInYears = timeInMonths / 12;
    let humanReadable = getTimeWithUnitsString(timeInHours, 'час');

    if (timeInHours < 1) {
        humanReadable = 'менее 1 часа';
    }

    if (timeInDays > 1) {
        humanReadable = getTimeWithUnitsString(timeInDays, 'день');
    }

    if (timeInWeeks > 1) {
        humanReadable = getTimeWithUnitsString(timeInWeeks, 'неделя');
    }

    if (timeInMonths > 1) {
        humanReadable = getTimeWithUnitsString(timeInMonths, 'месяц');
    }

    if (timeInYears > 1) {
        humanReadable = getTimeWithUnitsString(timeInYears, 'год');
    }

    return humanReadable;
}

function getCoursePriceText(price) {
    return price === 0 ? 'Бесплатно' : formatNumber(price) + '&nbsp;&#8381;';
}

function getCourseById(courseId) {
    let foundCourse = false;
    getCoursesList().forEach(function (course) {
        if (course.id === courseId) {
            foundCourse = course;
        }
    });

    return foundCourse;
}

function isCourseInBackpack(course) {
    let courseIds = getBackpackIds();
    return courseIds.indexOf(course.id) !== -1;
}

function getCoursePageUrl(course) {
    return "/course.html?id="+course.id+"&from="+getProfessionCodeFromUrl();
}

function getParameterByName(name, url) {
    if (!url) {
        url = window.location.href;
    }

    name = name.replace(/[\[\]]/g, '\\$&');
    let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    let results = regex.exec(url);
    if (!results) {
        return null;
    }

    if (!results[2]) {
        return '';
    }

    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}