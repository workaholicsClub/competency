let eduPath = [];

function addCourseSkill(skillName) {
    let skillsFilter = {};
    skillsFilter[skillName] = 0;

    let maxLevels = getMaxCourseLevels(skillsFilter);
    let maxLevel = getLevelText(maxLevels[skillName]);

    let skillHTML = "<div class=\"alert alert-primary d-flex justify-content-between skillBlock\" role=\"alert\">\n" +
        "    <div class=\"levelHeaderContainer\">\n" +
        "       <h4 class=\"alert-heading\">"+skillName+"</h4>\n" +
        "       <button type=\"button\" class=\"close align-self-start\" data-dismiss=\"alert\">×</button>\n" +
        "    </div>\n" +
        "    <div class='row'>\n" +
        "        <div class='col-6'>\n" +
        "            <h6>До обучения</h6>\n" +
        "            <select class=\"custom-select skillSlider\">\n" +
        "               <option value=0 selected>Не владею</option>\n" +
        "               <option value=1>Основы</option>\n" +
        "               <option value=2>Уверенный</option>\n" +
        "               <option value=3>Глубокий</option>\n" +
        "            </select>\n" +
        "        </div>\n" +
        "        <div class='col-6 afterLearnContainer'>\n" +
        "            <h6>Максимальный уровень курсов</h6>" +
        "            <span class='maxLearn'>" + maxLevel + "</span>\n" +
        "        </div>\n" +
        "    </div>\n" +
        "    <div class='row'>\n" +
        "        <div class='col-12'>\n" +
        "            <div class=\"progress mt-3\">\n" +
        "                <div class=\"progress-bar\" role=\"progressbar\" style=\"width: 0%\" aria-valuenow=\"0\" aria-valuemin=\"0\" aria-valuemax=\"100\">" +
        "            </div>\n" +
        "        </div>\n" +
        "    </div>\n" +
        "</div>\n";

    $('.skillContainer').append(skillHTML);
    toggleAdditionalSkills();
    search();
}

function getMatchingCourseSkills(skills, filter, isRequirements) {
    let courseSkillNames = Object.keys(skills);
    let matchingSkills = [];

    courseSkillNames.forEach(function (skillName) {
        let isInFilter = typeof filter[skillName] !== 'undefined';
        let levelMatches = isRequirements
            ? isInFilter && skills[skillName] < filter[skillName]
            : isInFilter && skills[skillName] > filter[skillName];

        if (levelMatches) {
            matchingSkills.push(skillName);
        }
    });

    return matchingSkills;
}

function getUnmatchingCourseSkills(skills, filter, isRequirements) {
    let courseSkillNames = Object.keys(skills);
    let unmatchingSkills = [];

    courseSkillNames.forEach(function (skillName) {
        let isInFilter = typeof filter[skillName] !== 'undefined';
        let levelNotMatches = isRequirements
            ? isInFilter && skills[skillName] > filter[skillName]
            : isInFilter && skills[skillName] < filter[skillName];

        if (levelNotMatches) {
            unmatchingSkills.push(skillName);
        }
    });

    return unmatchingSkills;
}

function getUnchangedCourseSkills(skills, filter) {
    let courseSkillNames = Object.keys(skills);
    let equalSkills = [];

    courseSkillNames.forEach(function (skillName) {
        let isInFilter = typeof filter[skillName] !== 'undefined';
        let levelEqual = isInFilter && skills[skillName] === filter[skillName];

        if (levelEqual) {
            equalSkills.push(skillName);
        }
    });

    return equalSkills;
}

function getUndefinedCourseSkills(skills, filter) {
    let courseSkillNames = Object.keys(skills);
    let undefinedSkills = [];

    courseSkillNames.forEach(function (skillName) {
        let isNotInFilter = typeof filter[skillName] === 'undefined';

        if (isNotInFilter) {
            undefinedSkills.push(skillName);
        }
    });

    return undefinedSkills;
}

function getSkillsPropHTML(skills, filter, isRequirements) {
    let matchingSkills = getMatchingCourseSkills(skills, filter, isRequirements);
    let unchangedSkills = getUnchangedCourseSkills(skills, filter);
    let undefinedSkills = getUndefinedCourseSkills(skills, filter);
    let unmatchingSkills = getUnmatchingCourseSkills(skills, filter, isRequirements);

    let matchLabel = isRequirements
        ? 'Текущее владение навыком подходит под требования'
        : 'Пройдя курс, вы улучшите этот навык';

    let equalLabel = "Пройдя этот курс вы можете систематизировать ваши знания";

    let unmatchLabel = isRequirements
        ? 'Текущего владения навыком недостаточно для прохождения курса'
        : 'Пройдя курс, вы вряд-ли получите дополнительные знания';

    let matchingSkillsHtml = matchingSkills.map(function (skillName) {
        let levelText = getLevelText(skills[skillName]);
        let badgeText = isRequirements
            ? skillName + ':&nbsp; ' + levelText
            : skillName + ':&nbsp; улучшение до ' + levelText;
        return '<span class="badge badge-success" data-toggle="tooltip" title="' + matchLabel + '">'+badgeText+'</span>';
    });

    let equalSkillsHtml = unchangedSkills.map(function (skillName) {
        let levelText = getLevelText(skills[skillName]);
        let badgeText = isRequirements
            ? skillName + ':&nbsp;' + levelText
            : skillName + ':&nbsp;без&nbsp;изменений';
        return '<span class="badge badge-warning" data-toggle="tooltip" title="' + equalLabel + '">'+badgeText+'</span>';
    });

    let unmatchingSkillsHtml = unmatchingSkills.map(function (skillName) {
        let levelText = getLevelText(skills[skillName]);
        let badgeText = isRequirements
            ? skillName + ':&nbsp;' + levelText
            : skillName + ':&nbsp;ваш&nbsp;уровень&nbsp;выше';
        return '<span class="badge badge-danger" data-toggle="tooltip" title="' + unmatchLabel + '">'+badgeText+'</span>';
    });

    let undefinedSkillsHtml = undefinedSkills.map(function (skillName) {
        let levelText = getLevelText(skills[skillName]);
        let badgeText = skillName + ':&nbsp;' + levelText;
        return '<a href="#" class="badge badge-secondary" data-skill="'+skillName+'" data-toggle="tooltip" title="Навык не указан в списке развиваемых">'+badgeText+'</a>';
    });

    let hasUndefinedSkills = undefinedSkills.length > 0;
    let truncateUndefined = !isRequirements;
    let undefinedSkillsTruncatedHTML = '<a href=\"#\" class=\"badge badge-secondary undefinedSkillsTrigger\" data-toggle=\"tooltip\" title=\"+'+undefinedSkills.length+
        ' навыков, не указанных в фильтре\">+'+undefinedSkills.length+' навыков...</a>\n' +
        "<span class=\"hiddenSkills\" style=\"display: none;\">" +
        undefinedSkillsHtml.join("\n") +
        "</span>";
    let undefinedSkillsPlainHTML = undefinedSkillsHtml.join("\n");


    return matchingSkillsHtml.join("\n") + "\n" +
        (isRequirements ? "" : equalSkillsHtml.join("\n") + "\n") +
        unmatchingSkillsHtml.join("\n") + "\n" +
        (hasUndefinedSkills
            ? (truncateUndefined ? undefinedSkillsTruncatedHTML : undefinedSkillsPlainHTML)
            : "");
}

function getSkillsHTML(course, filter) {
    return getSkillsPropHTML(course.skills, filter, false);
}

function getRequirementsHTML(course, filter) {
    return getSkillsPropHTML(course.requirements, filter, true);
}

function getCourseSkillPercent(course) {
    return Math.round(getSkillLevelUps(course)/getMaxLevelsCount() * 100);
}

function getCourseDataHTML(course, skipButton, index) {
    let descriptionHTML = course.description || "";
    let price = course.price == 0 ? 'Бесплатно' : course.price + ' руб';
    let percentText = '+' + getCourseSkillPercent(course) + '% навыков';
    let filter = getCoursesFilter();
    let skillsFilter = applyEduPathSkills(filter.skills, index);
    let skillsHTML = getSkillsHTML(course, skillsFilter);
    let hasRequirements = Object.keys(course.requirements).length > 0;
    let requirementsHTML = hasRequirements
        ? getRequirementsHTML(course, skillsFilter)
        : "нет";

    let attributes = [
        course.format,
        course.hasTeacher ? 'С преподавателем' : 'Без преподавателя',
        course.hasPractice ? 'С практикой' : 'Без практики',
        'Сертификат: ' + course.certificate,
        'Длительность: ' + course.duration + ' ' + course.durationUnits
    ];

    let attributesHTML = attributes.join('&nbsp;&bull;&nbsp;\n');
    let buttonHTML = skipButton
        ? ""
        : "<a href=\"#\" class=\"btn btn-primary d-flex justify-content-center add-to-plan mt-1\" data-course-id=\""+course.id+"\">Добавить в план</a>";

    return "<span class=\"badge badge-secondary priceBadge\">" + price + "<br>" + percentText + "</span>\n" +
        "<h4><a class=\"courseLink\" href=\"" + course.url + "\" target=\"_blank\">" + course.title + "&nbsp;<i class=\"fas fa-external-link-square-alt\"></i></a></h4>\n" +
        "<h6 class=\"text-muted\">" +course.platform+ "</h6>\n" +
        "<p class=\"mt-1 mb-0\">Навыки, которые вы приобретёте:</p>\n" +
        "<p>" + skillsHTML + "</p>\n" +
        "<p class=\"mt-1\">Требования: " + requirementsHTML + "</p>\n" +
        "<p>" + attributesHTML + "</p>\n" +
        "<button class=\"btn btn-outline-secondary\" data-toggle=\"collapse\" data-target=\"#description"+course.id+"\" aria-expanded=\"true\" aria-controls=\"description"+course.id+"\">\n" +
        "    Описание курса\n" +
        "</button>\n" +
        "<p id=\"description"+course.id+"\" class=\"collapse mt-3\">\n" +
            descriptionHTML +
        "</p>\n" +
        buttonHTML;
}

function getCourseCardHTML(course) {
    let courseHTML = "<div class=\"card m-1\">\n" +
        "    <div class=\"card-body\">\n" +
            getCourseDataHTML(course) +
        "    </div>\n" +
        "</div>";

    return courseHTML;
}

function addCourse(course) {
    let courseHTML = getCourseCardHTML(course);

    $('#coursesList').append(courseHTML);
}

function getCourseMatchRating(course, filter) {
    let skillsFilter = filter.skills;
    let matchedSkillsCount = getMatchingCourseSkills(course.skills, skillsFilter, false).length;
    let unmatchedSkillsCount = getUnmatchingCourseSkills(course.skills, skillsFilter, false).length;
    let matchingRequirementsCount = getMatchingCourseSkills(course.requirements, skillsFilter, true).length;
    let unmatchingRequirementsCount = getUnmatchingCourseSkills(course.requirements, skillsFilter, true).length;
    let totalSkillsAndRequirements = Object.keys(course.skills).length + Object.keys(course.requirements).length;

    return (matchedSkillsCount - 0.5 * unmatchedSkillsCount)/totalSkillsAndRequirements +
        (matchingRequirementsCount - 2 * unmatchingRequirementsCount)/totalSkillsAndRequirements;
}

function applyEduPathSkills(currentSkills, level) {
    let skillsAfterLearn = JSON.parse(JSON.stringify(currentSkills));
    let coursesToApply = typeof (level) === 'number'
        ? eduPath.slice(0, level)
        : eduPath;

    coursesToApply.forEach(function (course) {
        Object.keys(course.skills).forEach(function (skillName) {
            if (typeof skillsAfterLearn[skillName] !== 'undefined' && skillsAfterLearn[skillName] < course.skills[skillName]) {
                skillsAfterLearn[skillName] = course.skills[skillName];
            }
        });
    });

    return skillsAfterLearn;
}

function findCourses(filter) {
    let skillsFilter = applyEduPathSkills(filter.skills);

    let compareRating = function (ratingA, ratingB) {
        if (ratingA > ratingB) {
            return -1;
        }

        if (ratingA < ratingB) {
            return 1;
        }

        return 0;
    };

    let compareSkillsAndRating = function (skillsA, skillsB, ratingA, ratingB) {
        if (skillsA > skillsB) {
            return -1;
        }

        if (skillsA < skillsB) {
            return 1;
        }

        return compareRating(ratingA, ratingB);
    };

    let comparePriceSkillsAndRating = function (priceA, priceB, skillsA, skillsB, ratingA, ratingB) {
        if (priceA > priceB) {
            return 1;
        }

        if (priceA < priceB) {
            return -1;
        }

        return compareSkillsAndRating(skillsA, skillsB, ratingA, ratingB);
    };


    return getCoursesList()
        .filter(function (course) {
            let matchedSkillsCount = getMatchingCourseSkills(course.skills, skillsFilter, false).length;
            let hasMatchedSkills = matchedSkillsCount > 0;
            return hasMatchedSkills;
        })
        .sort(function (courseA, courseB) {
            let ratingA = getCourseMatchRating(courseA, filter);
            let ratingB = getCourseMatchRating(courseB, filter);
            let priceA = courseA.price;
            let priceB = courseB.price;
            let skillsA = getCourseSkillPercent(courseA);
            let skillsB = getCourseSkillPercent(courseB);
            let priceForSkillA = priceA/skillsA;
            let priceForSkillB = priceB/skillsB;
            let unmatchingA = getUnmatchingCourseSkills(courseA.requirements, skillsFilter, true).length;
            let unmatchingB = getUnmatchingCourseSkills(courseB.requirements, skillsFilter, true).length;

            if (unmatchingA > unmatchingB) {
                return 1;
            }

            if (unmatchingA < unmatchingB) {
                return -1;
            }

            return comparePriceSkillsAndRating(priceForSkillA, priceForSkillB, skillsA, skillsB, ratingA, ratingB);
        });
}

function getCoursesFilter() {
    let onlyFree = $('#cf').is(':checked');

    return {
        skills: getSkillsFilter(),
        priceFrom: onlyFree ? 0 : parseInt( $('#from').val() ),
        priceTo: onlyFree ? 0 : parseInt( $('#to').val() )
    }
}

function search() {
    if (!hasSkills()) {
        return;
    }

    $('#coursesList').css('opacity', '0.3');
    setTimeout(function () {
        $('#coursesList').html('');

        let courses = findCourses( getCoursesFilter() );
        courses.forEach(function (course) {
            addCourse(course);
        });

        if (courses.length > 0) {
            $('#coursesList').attr('style', '');
        }
    }, 2000)
}

function toggleNoSkillsResult() {
    if (hasSkills()) {
        $('.noSkillsDefined').hide();
        $('.searchResultsContainer').show();
        toggleAdditionalSkills();
    }
    else {
        $('.noSkillsDefined').show();
        $('.searchResultsContainer').hide();
        toggleAdditionalSkills();
    }
}

function hasSkills() {
    return $('.skillBlock').length > 0;
}

function toggleAdditionalSkills() {
    let allAdditionalSkills = ['HTML', 'CSS', 'Верстка'];
    let selectedSkills = $('.skillBlock h4').map(function () { return $(this).text(); }).toArray();
    let shownAdditionalSkills = allAdditionalSkills.filter(function (skillName) {
        return selectedSkills.indexOf(skillName) === -1;
    });
    let hasAdditionalSkills = shownAdditionalSkills.length > 0;

    $('.addSkillsContainer').html('');
    shownAdditionalSkills.forEach(function (skillName) {
        $('.addSkillsContainer').append('<a href="#" class="dashedLink" data-skill="'+skillName+'">'+skillName+'</a><span></span>');
    });

    if (hasSkills() && hasAdditionalSkills) {
        $('.additionalSkills').show();
    }
    else {
        $('.additionalSkills').hide();
    }
}

function setProgress(percent, $progressbar, progressColor) {
    let numberTo = percent;
    let emptyColor = "";
    let notEnoughColor = "bg-warning";
    let almostThereColor = "bg-success";

    if (!$progressbar) {
        $progressbar = $('#coursesPlanContainer .progress-bar')
    }

    if (!progressColor) {
        progressColor = emptyColor;

        if (percent > 0) {
            progressColor = notEnoughColor;
        }

        if (percent >= 90) {
            progressColor = almostThereColor;
        }
    }

    $progressbar
        .css({width: numberTo+'%'})
        .removeClass('bg-warning bg-success')
        .addClass(progressColor);
}

function updateStartCourseSkills() {
    let filteredSkills = removeSelectedSkills( getSkills(getVacanciesList()) );
    let top5 = sortSkillsByCount(filteredSkills).slice(0,5);

    $('#startSkills').html('');

    addStartSkills( top5 );
}

function getSkillLevelUps(course, skipFilter) {
    let filter = getCoursesFilter();
    let skillsFilter = skipFilter ? filter.skills : applyEduPathSkills(filter.skills);
    let matchedSkillNames = getMatchingCourseSkills(course.skills, skillsFilter, false);
    let levelUps = matchedSkillNames.reduce(function (accumulator, skillName) {
        let skillLevelsIncrease = course.skills[skillName] - skillsFilter[skillName];
        let userKnowsMore = skillLevelsIncrease < 0;
        if (userKnowsMore) {
            skillLevelsIncrease = 0;
        }
        return accumulator + skillLevelsIncrease;
    }, 0);

    return levelUps;
}

function getLevelText(levelNumber) {
    let levelNames = ["не владею", "основы", "уверенный", "глубокий"];
    return levelNames[levelNumber];
}

function getMatchingListHTML(course) {
    let skillsFilter = getCoursesFilter().skills;
    let matchedSkillNames = getMatchingCourseSkills(course.skills, skillsFilter, false);
    let listHTML = matchedSkillNames.reduce(function (HTML, skillName) {
        let levelText = getLevelText( course.skills[skillName] );
        return HTML + skillName + ":&nbsp;" + levelText + "<br>";
    }, "");

    return listHTML;
}

function getCoursePathHTML(course, index) {
    let pathLevel = index-1;
    let courseHTML = getCourseDataHTML(course, true, pathLevel);

    return "<div class=\"input-group\">\n" +
        "    <div class=\"input-group-prepend\">\n" +
        "        <span class=\"input-group-text\">" + index + "</span>\n" +
        "    </div>\n" +
        "    <li class=\"list-group-item\" id=\"heading" + index + "\">\n" +
        "        <button class=\"btn btn-link\" type=\"button\" data-toggle=\"collapse\" data-target=\"#collapse" + index + "\" aria-expanded=\"true\" aria-controls=\"collapse" + index + "\">\n" +
        "            " + course.title + "\n" +
        "        </button>\n" +
        "    </li>\n" +
        "</div>\n" +
        "<li class=\"list-group-item collapse\" id=\"collapse" + index + "\" aria-labelledby=\"heading" + index + "\" data-parent=\"#coursesPlan\">" + courseHTML + "</li>\n";
}

function redrawPath() {
    $('#coursesPlan').html('');
    eduPath.forEach(function (course, index) {
        $('#coursesPlan').append(getCoursePathHTML(course, index+1));
    });
}

function summSkills(skills) {
    let skillLevelsSumm = Object.keys(skills).reduce(function (accumulator, skillName) {
        let skillLevel = skills[skillName];
        return accumulator + skillLevel;
    }, 0);

    return skillLevelsSumm;
}

function getFilterLevelsCount() {
    let filter = getCoursesFilter();
    let skillsFilter = applyEduPathSkills(filter.skills);

    return summSkills(skillsFilter);
}

function getMaxCourseLevels(skillsFilter) {
    if (!skillsFilter) {
        let filter = getCoursesFilter();
        skillsFilter = filter.skills;
    }

    let maxLevels = Object.keys(skillsFilter).reduce(function (maxLevelsAcc, skillName) {
        if (typeof maxLevelsAcc[skillName] === 'undefined') {
            maxLevelsAcc[skillName] = 0;
        }

        getCoursesList().forEach(function (course) {
            if (typeof course.skills[skillName] !== 'undefined') {
                if (course.skills[skillName] > maxLevelsAcc[skillName]) {
                    maxLevelsAcc[skillName] = course.skills[skillName];
                }
            }
        });

        return maxLevelsAcc;
    }, {});

    return maxLevels;
}

function getMaxLevelsCount() {
    let maxCourseLevels = getMaxCourseLevels();
    let filterLevels = applyEduPathSkills(getCoursesFilter().skills);
    let skillNames = Object.keys(filterLevels);
    let maxCourseAndFilterLevels = skillNames.reduce(function (accumulator, skillName) {
        accumulator[skillName] = filterLevels[skillName] > maxCourseLevels[skillName]
            ? filterLevels[skillName]
            : maxCourseLevels[skillName];

        return accumulator;
    }, {});

    return summSkills(maxCourseAndFilterLevels);
}

function addCourseToPath(course) {
    eduPath.push(course);
    redrawPath();

    let newPrecentage = Math.round(getFilterLevelsCount()/getMaxLevelsCount() * 100);
    setProgress(newPrecentage);
    updateSkillCards();
    updateTotals();

    if (newPrecentage === 100) {
        showSuccess();
    }
}

function showSuccess() {
    $('.noSkillsDefined, .searchResults').hide();
    $('.searchSuccess').show();
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

function enableTooltips() {
    $('[data-toggle="tooltip"]').tooltip();
}

function isPathNotEmpty() {
    return eduPath.length > 0;
}

function updateSkillCards() {
    if (isPathNotEmpty()) {
        $('.skillContainer').addClass('pathEnabled');
    }
    else {
        $('.skillContainer').removeClass('pathEnabled');
    }

    let maxSkills = getMaxCourseLevels();
    let baseSkills = getCoursesFilter().skills;
    let currentSkills = applyEduPathSkills( baseSkills );

    $('.skillBlock').each(function (index, card) {
        let skillName = $(card).find('h4').text();
        let baseLevel = baseSkills[skillName];
        let currentLevel = currentSkills[skillName];
        let maxLevel = maxSkills[skillName];

        let currentLevelText = getLevelText(currentLevel);
        let maxLevelText = getLevelText(maxLevel);

        let colorClass = 'alert-primary';
        let progressColor = ' ';

        if (baseLevel < maxLevel) {
            if (currentLevel > baseLevel) {
                colorClass = 'alert-warning';
                progressColor = 'bg-warning';
            }

            if (currentLevel >= maxLevel) {
                colorClass = 'alert-success';
                progressColor = 'bg-success';
            }
        }

        $(card).find('.afterLearn').text(currentLevelText);
        $(card).find('.maxLearn').text(maxLevelText);
        let $progress = $(card).find('.progress-bar');

        $(card).removeClass('alert-primary alert-warning alert-success');
        $(card).addClass(colorClass);

        let percent = Math.round(currentLevel/maxLevel * 100);
        if (currentLevel > maxLevel) {
            percent = 100;
        }

        setProgress(percent, $progress, progressColor);
    });
}

function getTimeInDays(course) {
    let time = course.duration;
    let units = course.durationUnits;
    let daysCoefficient = {
        'ак. час': 45/1440,
        'день': 1,
        'час': 1/24,
        'урок': 1/24,
        'минута': 1/1440,
        'месяц': 30,
        'неделя': 7
    };

    let timeInDays = time * daysCoefficient[units];

    return timeInDays;
}

function updateTotals() {
    if (isPathNotEmpty()) {
        $('#courseBar').addClass('pathEnabled');
    }
    else {
        $('#courseBar').removeClass('pathEnabled');
    }

    let totalCourses = 0;
    let totalPrice = 0;
    let totalDays = 0;
    let skillsAfterLearn = applyEduPathSkills(getCoursesFilter().skills);
    let vacanciesCount = findParticialMacth(skillsAfterLearn).length;
    let vacanciesPercent = Math.round( vacanciesCount / getVacanciesList().length * 100 );

    eduPath.forEach(function (course) {
        totalCourses++;
        totalPrice += course.price;
        totalDays += getTimeInDays(course);
    });

    $('.totalCourses').text(totalCourses + ' курсов');
    $('.totalTime').text(Math.round(totalDays) + ' дней');
    $('.totalPrice').text(totalPrice + ' руб');
    $('.percentVacancies').text(vacanciesPercent + '% вакансий');
}

$(function () {
    enableTooltips();

    updateStartCourseSkills();
    updateMinSkills();
    updateAllSkills();

    $('#coursesCount').text( getCoursesList().length );

    $(document).on('click', '[data-skill]', function () {
        let skillName = $(this).attr('data-skill');
        addCourseSkill(skillName);
        toggleSkillsResult();
    });

    $(document).on('change', '.skillSelect', function () {
        let skillName = $(this).val();
        if (skillName) {
            addCourseSkill(skillName);
            toggleNoSkillsResult();
        }
    });

    $(document).on('click', '#startSearch', function (event) {
        event.preventDefault();

        let minimalSkills = getNeededSkills(getVacanciesList(), 1);
        minimalSkills.forEach(function (skillName) {
            addCourseSkill(skillName);
        });

        $('#startSearch').hide();
        updateAllSkills();
        toggleNoSkillsResult();
    });

    $(document).on('click', '.alert .close', function () {
        toggleNoSkillsResult();
    });

    $(document).on('click', '.skillList a', function () {
        $(this).toggleClass('active');
    });

    $(document).on('click', '.confirmSkillsAddButton', function () {
        $('.skillList a.active').each(function () {
            let skillName = $(this).attr('data-name');
            addCourseSkill(skillName);
            $(this).removeClass('active');
        });
        toggleNoSkillsResult();
        search();
    });

    $(document).on('click', '.undefinedSkillsTrigger', function () {
        event.preventDefault();
        $(this).hide();
        $(this).closest('.card-body').find('.hiddenSkills').show();
    });

    $(document).on('change input', '.skillSlider', function () {
        /*let skillLevels = ['Не знаю', 'Знаю', 'Умею применять', 'Владею в совершенстве'];
        let newText = skillLevels[$(this).val()];
        $(this).closest('.skillBlock').find('.skillText').text(newText);*/
        search();
        updateSkillCards();
    });

    $(document).on('change input', '#from, #to', function () {
        let inputId = $(this).attr('id');
        let textId = inputId+'-text';
        let value = parseInt($(this).val());

        $('#'+textId).text(value);

        if (inputId === 'from') {
            $('#to').attr('min', value);
            if (parseInt($('#to').val()) <= value) {
                $('#to').val(value).trigger('input');
            }
        }
    });

    $(document).on('change input click', 'input', function () {
        search();
    });

    $(document).on('click', '.add-to-plan', function () {
        let courseId = parseInt( $(this).data('course-id') );
        let course = getCourseById(courseId);
        addCourseToPath(course);
        search();
    });
});
