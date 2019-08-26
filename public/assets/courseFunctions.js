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

function removeFromBackpack(courseId) {
    let removedCourse = false;

    getBackpack().forEach(function (course, index) {
        if (course.id === courseId) {
            removedCourse = backpack.splice(index, 1);
        }
    });

    saveBackpack();

    return removedCourse;
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

function isInBackpack(courseId) {
    let backpackIds = getBackpackIds();
    return backpackIds.indexOf(courseId) !== -1;
}

function isBackbackEmpty() {
    if (!backpack) {
        return false;
    }

    return backpack.length === 0;
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

function getCourseHardnessHTML(course) {
    let hardnessIndex = getHardnessIndex(course);

    if (hardnessIndex === 2) {
        return "Средней сложности";
    }

    if (hardnessIndex === 3) {
        return "Продвинутый";
    }

    return "Для новичков";
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

function getHardnessIndex(course) {
    let requirementsCount = Object.keys(course.requirements).length;

    if (requirementsCount === 0) {
        return 1;
    }

    if (requirementsCount < 4) {
        return 2;
    }

    return 3;
}

function getCourseTime(course) {
    return course.duration + ' ' + declensionUnits(course.duration, course.durationUnits);
}

function getCourseAttributesHTML(course) {
    let certificateShortNames = {
        'Нет': 'Без сертификата',
        'Собственный': 'Собственный сертификат',
        'Государственного образца': 'Государственный сертификат'
    };

    let attributes = [
        getCourseHardnessHTML(course),
        course.format,
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
        'год': ['год', 'года', 'лет'],
        'вакансий': ['вакансии', 'вакансий', 'вакансий'],
        'вакансия': ['вакансии', 'вакансиям', 'вакансиям']
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

function getSkillHTML(skillName, level) {
    return `<span class="skill">
                ${skillName}
                <span class="skill-strength level${level}"><span></span><span></span><span></span><span></span></span>
            </span>`;
}

function getSkillsHTML(skills) {
    return Object.keys(skills).map(function (skillName, index) {
        let level = skills[skillName];
        return getSkillHTML(skillName, level);
    }).join("\n");
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

function getCourseUrl(course) {
    let isFree = course.price === 0 ? 1 : 0;
    let url = new URL(course.rawUrl);
    let site = url.hostname;
    return "/away.html?next_url="+encodeURIComponent(course.url)+"&title="+encodeURIComponent(course.title)+"&site="+encodeURIComponent(site)+"&free="+isFree;
}

function getCoursePageAbsoluteUrl(course) {
    let relativeUrl = getCoursePageUrl(course);
    return window.location.origin + relativeUrl;
}

function getParameterByName(name, url) {
    if (!url) {
        url = window.location.search;
    }

    let allParams = getAllUrlParams(url);
    let paramExists = typeof (allParams[name]) !== 'undefined';

    return paramExists ? allParams[name] : null;
}

function getAllUrlParams(url) {
    if (!url) {
        url = window.location.search;
    }

    let params={};

    url.replace(/[?&]+([^=&]+)=([^&]*)/gi, (str, key, value) => {
        key = decodeURIComponent(key);
        value = decodeURIComponent(value.replace(/\+/g, ' '));

        let paramExists = typeof(params[key]) !== 'undefined';
        let paramConvertedToArray = paramExists && params[key] instanceof Array;

        if (paramExists) {
            if (!paramConvertedToArray) {
                params[key] = [ params[key] ];
            }

            params[key].push(value);
        }
        else {
            let paramIsArray = key.indexOf('[') > 0 && key.indexOf(']') > 0;

            params[key] = paramIsArray ? [value] : value;
        }
    });

    return params;
}

function splitLongText(text, wordLimit) {
    if (!wordLimit) {
        wordLimit = 25;
    }

    let words = text.split(" ");
    let visible = text;
    let hidden = false;
    if (words.length > wordLimit) {
        visible = words.slice(0, wordLimit).join(" ");
        hidden = words.slice(wordLimit).join(" ");
    }

    return [visible, hidden];
}

function getCourseFavouriteHTML(course) {
    return `<div class="card course-card">
                <div class="card-body" data-id="${course.id}">
                    <div class="d-flex flex-row course-card-header">
                        <span class="badge badge-course-info">Курс</span>
                        <h6 class="text-muted flex-fill">от <a href="${course.url}">${course.platform}</a></h6>
                        <a href="#" class="top-favourite-remove"><i class="fas fa-trash"></i></a>
                    </div>
                    <h5>${course.title}</h5>

                    <p class="mt-0 mb-0 price">${getCoursePriceText(course.price)}</p>
                    <p class="mt-0 text-muted">${getCourseTime(course)} &asymp; ${getHumanReadableTime(course)}</p>

                <p class="mt-1 text-info">${getCourseAttributesHTML(course)}</p>

                <a href="${course.url}" target="_blank" class="btn btn-outline-info btn-block btn-link" data-course-id="${course.id}">
                    Записаться
                </a>
            </div>
        </div>`;
}

function showFooterIfNeeded() {
    let isNotFilterPanelActive = !isFilterPanelActive();

    if (isNotFilterPanelActive) {
        $('footer').css('visibility', '');
    }
}

function isFilterPanelActive() {
    return $('.filter-panel.sliding-panel').hasClass('show') || $('.skills-panel.sliding-panel').hasClass('show');
}

function updateFavourites() {
    let courses = getBackpack();
    if (courses && courses.length > 0) {

        $('.btn-favourites-list').addClass('active');
        $('.fav-count').text(courses.length);

        let favouriteListHTML = courses.map(function (course) {
            return getCourseFavouriteHTML(course);
        }).join("\n");

        $('.favourite-list').html(favouriteListHTML);
    }
    else {
        $('.favourite-list').html('');
        $('.btn-favourites-list').removeClass('active');
        $('.fav-count').text(0);
    }
}

function getRequestValuesFromDOM() {
    return $('.request:visible .editable-toggle').map(function () {
        return $(this).text();
    }).toArray();
}

function initCourseCards() {
    $(document).on('click', '.continue-toggle', function (event) {
        event.preventDefault();

        $(this).attr("style", "display: none!important");
        $(this).siblings('.continue-dots').hide();
        $(this).siblings('.continue').show();
    });

    $(document).on('click', '.btn-favourite, .top-favourite-add', function (event) {
        event.preventDefault();
        let $card = $(this).closest('.card-body');
        let courseId = $card.data('id');
        let course = getCourseById(courseId);

        if (!isInBackpack(courseId)) {
            pushToBackpack(course);
            enableCourseCardFavouriteState($card);
            updateFavourites();
        }
    });

    $(document).on('click', '.top-favourite-remove', function (event) {
        event.preventDefault();
        let courseId = $(this).closest('.card-body').data('id');
        let $card = $('.course-list:visible .card-body[data-id='+courseId+']');
        removeFromBackpack(courseId);
        disableCourseCardFavouriteState($card);
        updateFavourites();

        if (isBackbackEmpty()) {
            $('.favourite-panel').removeClass('show');
            showFooterIfNeeded();
        }
    });

    $(document).on('click', '.btn-share', function (event) {
        let $button = $(this);
        let $menu = $(this).find('.dropdown-menu');
        $menu.toggleClass('show');
        new Popper($button, $menu, {});
    });

    $(document).on('click', '.share-menu a', function (event) {
        event.preventDefault();
        event.stopPropagation();
        let $socialButton = $(this);
        let $shareButton = $socialButton.closest('.btn-share');
        let $menu = $socialButton.closest('.dropdown-menu');
        let courseId = $shareButton.data('course-id');
        let socialId = $socialButton.data('social');
        let course = getCourseById(courseId);
        let pageUrl = getCoursePageAbsoluteUrl(course);

        $menu.toggleClass('show');
        Share.popup(socialId, pageUrl, course.title, '', '');
    });
}

function initScroll() {
    $(window).scroll(function(event) {
        let scrollPosition = $(window).scrollTop();
        if (scrollPosition > 0) {
            $('body').addClass('scroll');
        }
        else {
            $('body').removeClass('scroll');
        }
    });
}

function showProfile() {
    let profile = getSavedProfileData();
    if (!profile) {
        return false;
    }

    $('.avatar img, img.avatar-holder').attr('src', profile.picture).addClass('custom-avatar');
    $('.avatar .user-name').text(profile.name);
    $('.auth-trigger').removeClass('auth-trigger');
    $('body').addClass('auth');
}

function enableCourseCardFavouriteState($card) {
    $card.find('.top-favourite-add .fa-bookmark').removeClass('far').addClass('fas');
    $card
        .find('.btn-favourite')
        .addClass('active')
        .attr('disabled', true)
        .html('<i class="fas fa-check"></i>');
}

function disableCourseCardFavouriteState($card) {
    $card.find('.top-favourite-add .fa-bookmark').removeClass('fas').addClass('far');
    $card
        .find('.btn-favourite')
        .removeClass('active')
        .attr('disabled', false)
        .html('<i class="far fa-bookmark"></i>');
}

function getProfessionCodeFromUrl(paramName) {
    if (!paramName) {
        paramName = 'professionCode';
    }
    let professionCode = getParameterByName(paramName);

    if (!professionCode) {
        professionCode = location.pathname.split('/')[1];
    }

    return professionCode || 'qa-tester';
}

function getCurrentProfessionName(pageCode, useTvPadezh) {
    if (!pageCode) {
        pageCode = getProfessionCodeFromUrl();
    }

    let professionNames = {
        'php-developer': 'разработчик PHP',
        'hr-manager': 'HR менеджер',
        'pr-specialist': 'PR специалист',
        'python-developer': 'разработчик Python',
        'golang-developer': 'разработчик Golang',
        'javascript-developer': 'разработчик JavaScript',
        'ui-ux-designer': 'UI/UX дизайнер',
        'ios-developer': 'разработчик iOS',
        'android-developer': 'разработчик Android',
        'internet-marketologist': 'интернет-маркетолог',
        'qa-tester': 'тестировщик',
        'devops': 'DevOps специалист',
        'data-scientist': 'Data Scientist',
        'game-designer': 'гейм-дизайнер',
        'project-manager': 'менеджер интернет-проектов',
        'game-artist-2d': 'игровой художник 2D',
        'game-artist-3d': 'игровой художник 3D'
    };
    let professionNamesTP = {
        'php-developer': 'разработчиком PHP',
        'hr-manager': 'HR менеджером',
        'pr-specialist': 'PR специалистом',
        'python-developer': 'разработчиком Python',
        'golang-developer': 'разработчиком Golang',
        'javascript-developer': 'разработчиком JavaScript',
        'ui-ux-designer': 'UI/UX дизайнером',
        'ios-developer': 'разработчиком iOS',
        'android-developer': 'разработчиком Android',
        'internet-marketologist': 'интернет-маркетологом',
        'qa-tester': 'тестировщиком',
        'devops': 'DevOps специалистом',
        'data-scientist': 'Data Scientist`ом',
        'game-designer': 'гейм-дизайнером',
        'project-manager': 'менеджером интернет-проектов',
        'game-artist-2d': 'игровым художником 2D',
        'game-artist-3d': 'игровым художником 3D'
    };

    return useTvPadezh
        ? professionNamesTP[pageCode] || false
        : professionNames[pageCode] || false;
}

