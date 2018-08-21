let eduPath = [];

function addCourseSkill(skillName) {
    let skillHTML = "<div class=\"alert alert-primary d-flex justify-content-between skillBlock\" role=\"alert\">\n" +
        "    <div class=\"levelHeaderContainer\">\n" +
        "       <h4 class=\"alert-heading\">"+skillName+"</h4>\n" +
        "       <button type=\"button\" class=\"close align-self-start\" data-dismiss=\"alert\">×</button>\n" +
        "    </div>\n" +
        "    <select class=\"custom-select skillSlider\">\n" +
        "       <option selected>Текущий уровень</option>\n" +
        "       <option value=0>Не владею</option>\n" +
        "       <option value=1>Основы</option>\n" +
        "       <option value=2>Уверенный</option>\n" +
        "       <option value=3>Глубокий</option>\n" +
        "    </select>\n" +
        "    <small>После обучения:<br><span class='afterLearn'>основы</span> (max. <span class='maxLearn'>глубокий</span>)</small>\n" +
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
        let badgeText = skillName + ':&nbsp;' + levelText;
        return '<span class="badge badge-success" data-toggle="tooltip" title="' + matchLabel + '">'+badgeText+'</span>';
    });

    let equalSkillsHtml = unchangedSkills.map(function (skillName) {
        let levelText = getLevelText(skills[skillName]);
        let badgeText = skillName + ':&nbsp;' + levelText;
        return '<span class="badge badge-warning" data-toggle="tooltip" title="' + equalLabel + '">'+badgeText+'</span>';
    });

    let unmatchingSkillsHtml = unmatchingSkills.map(function (skillName) {
        let levelText = getLevelText(skills[skillName]);
        let badgeText = skillName + ':&nbsp;' + levelText;
        return '<span class="badge badge-danger" data-toggle="tooltip" title="' + unmatchLabel + '">'+badgeText+'</span>';
    });

    let undefinedSkillsHtml = undefinedSkills.map(function (skillName) {
        let levelText = getLevelText(skills[skillName]);
        let badgeText = skillName + ':&nbsp;' + levelText;
        return '<a href="#" class="badge badge-secondary" data-skill="'+skillName+'" data-toggle="tooltip" title="Навык не указан в списке развиваемых">'+badgeText+'</a>';
    });

    return matchingSkillsHtml.join("\n") + "\n" +
        (isRequirements ? "" : equalSkillsHtml.join("\n") + "\n") +
        unmatchingSkillsHtml.join("\n") + "\n" +
        undefinedSkillsHtml.join("\n");
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

function addCourse(course) {
    let descriptionHTML = course.description || "";
    let price = course.price == 0 ? 'Бесплатно' : course.price + ' руб';
    let percentText = '+' + getCourseSkillPercent(course) + '% навыков';
    let filter = getCoursesFilter();
    let skillsFilter = applyEduPathSkills(filter.skills);
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

    let courseHTML = "<div class=\"card m-1\">\n" +
        "    <div class=\"card-body\">\n" +
        "        <span class=\"badge badge-secondary priceBadge\">" + price + "<br>" + percentText + "</span>\n" +
        "        <h4><a class=\"courseLink\" href=\"" + course.url + "\" target=\"_blank\">" + course.title + "&nbsp;<i class=\"fas fa-external-link-square-alt\"></i></a></h4>\n" +
        "        <h6 class=\"text-muted\">" +course.platform+ "</h6>\n" +
        "        <p class=\"mt-1 mb-0\">Навыки, которые вы приобретёте:</p>\n" +
        "        <p>" + skillsHTML + "</p>\n" +
        "        <p class=\"mt-1\">Требования: " + requirementsHTML + "</p>\n" +
        "        <p>" + attributesHTML + "</p>\n" +
        "        <button class=\"btn btn-outline-secondary\" data-toggle=\"collapse\" data-target=\"#description"+course.id+"\" aria-expanded=\"true\" aria-controls=\"description"+course.id+"\">\n" +
        "            Описание курса\n" +
        "        </button>\n" +
        "        <p id=\"description"+course.id+"\" class=\"collapse mt-3\">\n" +
        descriptionHTML +
        "        </p>\n" +
        "        <a href=\"#\" class=\"btn btn-primar" +
        "y d-flex justify-content-center add-to-plan mt-1\" data-course-id=\""+course.id+"\">Добавить в план</a>\n" +
        "    </div>\n" +
        "</div>";

    $('.searchResults').append(courseHTML);
}

function getCourseMatchRating(course, filter) {
    let skillsFilter = filter.skills;
    let matchedSkillsCount = getMatchingCourseSkills(course.skills, skillsFilter, false).length;
    let unmatchedSkillsCount = getUnmatchingCourseSkills(course.skills, skillsFilter, false).length;
    let matchingRequirementsCount = getMatchingCourseSkills(course.requirements, skillsFilter, true).length;
    let unmatchingRequirementsCount = getUnmatchingCourseSkills(course.requirements, skillsFilter, true).length;
    let totalSkillsAndRequirements = Object.keys(course.skills).length + Object.keys(course.requirements).length;

    return (matchedSkillsCount - 0.5 * unmatchedSkillsCount)/totalSkillsAndRequirements +
        (matchingRequirementsCount - 0.5 * unmatchingRequirementsCount)/totalSkillsAndRequirements;
}

function applyEduPathSkills(currentSkills) {
    let skillsAfterLearn = JSON.parse(JSON.stringify(currentSkills));

    eduPath.forEach(function (course) {
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

    return getCoursesList()
        .filter(function (course) {
            let matchedSkillsCount = getMatchingCourseSkills(course.skills, skillsFilter, false).length;
            let hasMatchedSkills = matchedSkillsCount > 0;
            return hasMatchedSkills;
        })
        .sort(function (courseA, courseB) {
            let ratingA = getCourseMatchRating(courseA, filter);
            let ratingB = getCourseMatchRating(courseB, filter);

            if (ratingA > ratingB) {
                return -1;
            }

            if (ratingA < ratingB) {
                return 1;
            }

            return 0;
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

    $('.searchResults').css('opacity', '0.3');
    setTimeout(function () {
        $('.searchResults').html('');

        let courses = findCourses( getCoursesFilter() );
        courses.forEach(function (course) {
            addCourse(course);
        });

        $('.searchResults').attr('style', '');
    }, 2000)
}

function toggleNoSkillsResult() {
    if (hasSkills()) {
        $('.noSkillsDefined').hide();
        $('.searchResults').show();
        toggleAdditionalSkills();
    }
    else {
        $('.noSkillsDefined').show();
        $('.searchResults').hide();
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

function setProgress(percent) {
    let $count = $(('#count'));
    let numberFrom = parseInt($count.text().replace('%', ''));
    let numberTo = percent;
    let animateMs = 1000*Math.abs(numberTo-numberFrom)/100;
    let emptyColor = "#6c757d";
    let notEnoughColor = "#ffc107";
    let almostThereColor = "#28a745";

    $({ currentText: numberFrom }).animate({ currentText: numberTo }, {
        duration: animateMs,
        easing: 'linear',
        step: function () {
            $count.text(Math.floor(this.currentText)+ "%");
        }
    });

    setTimeout(function () {
        $count.text(numberTo+ "%");
    }, animateMs + 10);

    let s = Snap('#animated');
    let progress = s.select('#progress');
    let background = $('circle');

    if (percent === 0) {
        background.attr({'fill': emptyColor});
    }

    if (percent > 0) {
        background.attr({'fill': notEnoughColor});
    }

    if (percent >= 90) {
        background.attr({'fill': almostThereColor});
    }

    let progressLength = 251.2;
    let startPoint = progressLength * numberFrom/100;
    let endPoint = progressLength * numberTo/100;

    progress.attr({strokeDasharray: '0, 251.2'});
    Snap.animate(startPoint, endPoint, function( value ) {
        progress.attr({ 'stroke-dasharray': value+',251.2'});
    }, animateMs);
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
    let title = "Курс №"+index;
    let skillsCount = '+' + getSkillLevelUps(course, true);
    let percentText = '+' + getCourseSkillPercent(course) + '%';
    let tooltipHTML = "<b>"+course.title+"</b><br><br>" + getMatchingListHTML(course);

    let tooltipAttrs = "data-toggle=\"tooltip\" data-html=\"true\" data-placement=\"left\" title=\"" + tooltipHTML + "\"";
    return "<li class=\"course-item list-group-item\""+tooltipAttrs+">" +
        "<h4>"+title+"</h4>" +
        skillsCount+"<br><small>навыков</small>"+
        "</li>";
}

function redrawPath() {
    $('.course-items').html('');
    eduPath.forEach(function (course, index) {
        $('.course-items').append(getCoursePathHTML(course, index+1));
    });

    enableTooltips();
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

function getMaxLevelsCount() {
    let filter = getCoursesFilter();
    let skillsFilter = filter.skills;

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

    let skillLevelsSumm = summSkills(maxLevels);

    return skillLevelsSumm;
}

function addCourseToPath(course) {
    eduPath.push(course);
    redrawPath();

    let newPrecentage = Math.round(getFilterLevelsCount()/getMaxLevelsCount() * 100);
    setProgress(newPrecentage);
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

    $(document).on('change input', '.skillSlider', function () {
        /*let skillLevels = ['Не знаю', 'Знаю', 'Умею применять', 'Владею в совершенстве'];
        let newText = skillLevels[$(this).val()];
        $(this).closest('.skillBlock').find('.skillText').text(newText);*/
        search();
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
