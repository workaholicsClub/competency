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

function isFilterEmpty() {
    let skillsFilter = getSkillsFilter();
    return Object.keys(skillsFilter).length === 0;
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
    let truncateUndefined = !isRequirements && !isFilterEmpty();
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

function getCourseTotalLevels(course) {
    return summSkills(course.skills);
}

function getCourseMaxLevels() {
    let maxLevel = getCoursesList().reduce(function (prevMaxLevels, course) {
        let courseLevels = getCourseTotalLevels(course);
        if (courseLevels > prevMaxLevels) {
            return courseLevels;
        }

        return prevMaxLevels;
    }, 0);

    return maxLevel;
}

function getCourseHardness(course, level) {
    let skillsFilter = applyEduPathSkills(getCoursesFilter().skills, level);
    let userLevels = summSkills(skillsFilter);
    let userUpgradeLevels = getCourseTotalLevels(course)-userLevels;
    let maxLevels = getCourseMaxLevels();

    return Math.round(userUpgradeLevels/maxLevels * 100);
}

function getCourseHardnessHTML(course, level) {
    let hardnessPercent = getCourseHardness(course, level);

    if (hardnessPercent <= 10) {
        return "<span class='badge badge-success'>легкий</span>";
    }

    if (hardnessPercent > 50) {
        return "<span class='badge badge-danger'>трудный</span>";
    }

    return "<span class='badge badge-warning'>средний</span>";
}

function getCourseDataHTML(course, skipButton, index) {
    let descriptionHTML = course.description || "";
    let price = course.price === 0 ? 'Бесплатно' : course.price + ' руб';
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
        : "<a href=\"#\" class=\"btn btn-primary d-flex justify-content-center add-to-plan mt-1\" data-course-id=\""+course.id+"\">Выбрать курс</a>";

    let eduPathIndex = eduPath.length;
    let difficultyText = eduPathIndex === 0
        ? 'Сложность курса для вас'
        : 'Сложность курса с учетом предыдуших шагов';

    return "<span class=\"badge badge-secondary priceBadge\">" + price + (isFilterEmpty() ? "" : "<br>" + percentText) + "</span>\n" +
        "<h4><a class=\"courseLink\" href=\"" + course.url + "\" target=\"_blank\">" + course.title + "&nbsp;<i class=\"fas fa-external-link-square-alt\"></i></a></h4>\n" +
        "<h6 class=\"text-muted\">" +course.platform+ "</h6>\n" +
        "<p class='mt-1'>" + difficultyText + ": " + getCourseHardnessHTML(course, index) + "</p>\n" +
        "<p class=\"mt-1 mb-0\">Навыки, которые вы приобретёте:</p>\n" +
        "<p>" + skillsHTML + "</p>\n" +
        "<p class=\"mb-0\">Требования:</p>\n" +
        "<p>" + requirementsHTML + "</p>\n" +
        "<p class=\"mt-1\">" + attributesHTML + "</p>\n" +
        "<button class=\"btn btn-outline-secondary\" data-toggle=\"collapse\" data-target=\"#description"+course.id+"\" aria-expanded=\"true\" aria-controls=\"description"+course.id+"\">\n" +
        "    Посмотреть описание курса\n" +
        "</button>\n" +
        "<p id=\"description"+course.id+"\" class=\"collapse mt-3\">\n" +
            descriptionHTML +
        "</p>\n" +
        buttonHTML;
}

function getCourseCardHTML(course, skipButton, index) {
    let courseHTML = "<div class=\"inner-card m-1\">\n" +
        "    <div class=\"card-body\">\n" +
            getCourseDataHTML(course, skipButton, index) +
        "    </div>\n" +
        "</div>";

    return courseHTML;
}

function addCourse(course) {
    let courseHTML = getCourseCardHTML(course);

    $('#coursesList').append(courseHTML);
}

function applyEduPathSkills(currentSkills, level) {
    let skillsAfterLearn = JSON.parse(JSON.stringify(currentSkills));
    let coursesToApply = typeof (level) === 'number'
        ? eduPath.slice(0, level)
        : eduPath;

    coursesToApply.forEach(function (course) {
        Object.keys(course.skills).forEach(function (skillName) {
            let isSkillInFilter = typeof skillsAfterLearn[skillName] !== 'undefined';
            let isSkillWeaker = isSkillInFilter && skillsAfterLearn[skillName] < course.skills[skillName];

            if (isSkillWeaker || !isSkillInFilter) {
                skillsAfterLearn[skillName] = course.skills[skillName];
            }
        });
    });

    return skillsAfterLearn;
}

function getNormalizedValue(item, items, callback) {
    let maximum = items.reduce(function (prevMax, currentItem) {
        let currentValue = callback(currentItem);
        if (currentValue > prevMax || currentValue === false) {
            return currentValue;
        }
        return prevMax;
    }, false);

    let itemValue = callback(item);

    return itemValue / maximum;
}

function getWeightenedSkillsCount(course) {
    let skillsCount = getSkillCount(getVacanciesList());
    let maxCount = Object.keys(skillsCount).reduce(function (prevMaxCount, skillName) {
        let skillCount = skillsCount[skillName];
        if (skillCount > prevMaxCount) {
            return skillCount;
        }

        return prevMaxCount;
    }, 0);

    let skillWeights = Object.keys(skillsCount).reduce(function (weightAggregator, skillName) {
        weightAggregator[skillName] = skillsCount[skillName] / maxCount;
        return weightAggregator;
    }, {});

    let weightenedCount = Object.keys(course.skills).reduce(function (countAggregator, skillName) {
        let skillWeight = skillWeights[skillName];
        return countAggregator + skillWeight;
    }, 0);

    return weightenedCount;
}

function findCourses(filter) {
    let skillsFilter = applyEduPathSkills(filter.skills);
    let courses = getCoursesList();

    let getCoursePrice = function (course) { return course.price };
    let getCourseRequirementsCount = function (course) { return Object.keys(course.requirements).length };
    let getCourseSortIndex = function (course, courses) {
        let price = getNormalizedValue(course, courses, getCoursePrice);
        let weightenedSkills = 1-getNormalizedValue(course, courses, getWeightenedSkillsCount);
        let requirements = getNormalizedValue(course, courses, getCourseRequirementsCount);
        let hardness = getNormalizedValue(course, courses, getCourseHardness);

        return Math.round(price * 10000000) + Math.round(weightenedSkills * 100000) + Math.round(hardness * 1000) + Math.round(requirements * 10);
    };

    return courses
        .filter(function (course) {
            let matchedSkillsCount = getMatchingCourseSkills(course.skills, skillsFilter, false).length;
            let hasMatchedSkills = matchedSkillsCount > 0;
            let isFilterEmpty = Object.keys(skillsFilter).length === 0;
            return hasMatchedSkills || isFilterEmpty;
        })
        .sort(function (courseA, courseB) {
            let ratingA = getCourseSortIndex(courseA, courses);
            let ratingB = getCourseSortIndex(courseB, courses);

            if (ratingA > ratingB) {
                return 1;
            }

            if (ratingA < ratingB) {
                return -1;
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

function summSkills(skills) {
    let skillLevelsSumm = Object.keys(skills).reduce(function (accumulator, skillName) {
        let skillLevel = skills[skillName];
        return accumulator + skillLevel;
    }, 0);

    return skillLevelsSumm;
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

function addCourseDataToLevel(course, levelIndex) {
    let $levelContainer = $('#levelsAccordion>.card:eq('+levelIndex+')');
    $levelContainer
        .find('.card-header .collapse-button')
        .text(course.title);

    $levelContainer
        .find('.collapse')
        .append(getCourseCardHTML(course, true, levelIndex));

    let successBadgeHTML = "<span class='badge badge-success float-right'><i class=\"fas fa-check\"></i></span>";
    $levelContainer
        .find('.card-header h4')
        .append(successBadgeHTML);
}

function moveSearchResultsToLevel(newLevelIndex) {
    let $card = $('#levelsAccordion>.card:eq('+newLevelIndex+')');
    let $nextLevelContainer = $card.find('.collapse');
    let $searchResults = $('.searchResults');
    $searchResults.appendTo($nextLevelContainer);

    let $levelContainer = $('#levelsAccordion>.card:eq('+newLevelIndex+')');
    $card.removeClass('inactive');

    $levelContainer
        .find('.card-header .collapse-button')
        .show();
}

function collapseAllLevels() {
    $('#levelsAccordion>.card').removeClass('current');
    $('#levelsAccordion>.card>.collapse.show').removeClass('show');
}

function showLevel(levelIndex) {
    $('#levelsAccordion>.card:eq('+levelIndex+')').addClass('current');
    $('#levelsAccordion>.card>.collapse:eq('+levelIndex+')').addClass('show');
}

function hasNoCoursesForNextStep() {
    let nextStepCourses = findCourses( getCoursesFilter() );
    return nextStepCourses.length === 0;
}

function addCourseToPath(course) {
    eduPath.push(course);
    let newLevelIndex = eduPath.length;
    let oldLevelIndex = newLevelIndex-1;

    collapseAllLevels();
    addCourseDataToLevel(course, oldLevelIndex);
    updateSkillCards();

    if (hasNoCoursesForNextStep()) {
        showSuccess();
    }
    else {
        moveSearchResultsToLevel(newLevelIndex);
        showLevel(newLevelIndex);
    }
}

function showSuccess() {
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
    search();

    $('#coursesCount').text( getCoursesList().length );

    $(document).on('click', '[data-skill]', function () {
        let skillName = $(this).attr('data-skill');
        addCourseSkill(skillName);
    });

    $(document).on('change', '.skillSelect', function () {
        let skillName = $(this).val();
        if (skillName) {
            addCourseSkill(skillName);
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
    });

    $(document).on('click', '.skillList a', function () {
        $(this).toggleClass('active');
    });

    $(document).on('change', '#sortSelect', function () {
        updateAllSkills();
    });

    $(document).on('click', '.skillList .list-group-item', function (event) {
        let isCheckboxClicked = event.target.nodeName == 'INPUT';
        let isLevelSelectClicked = event.target.nodeName == 'SELECT' || event.target.nodeName == 'OPTION';
        let isItemActive = $(this).hasClass('active');

        if (isLevelSelectClicked) {
            return;
        }

        let newActiveState = isCheckboxClicked
            ? $(event.target).prop('checked')
            : !isItemActive;

        if (newActiveState) {
            $(this).addClass('active');
        }
        else {
            $(this).removeClass('active');
        }

        if (!isCheckboxClicked) {
            let $input = $(this).find('input');
            $input.prop('checked', newActiveState);
        }
    });

    $(document).on('click', '.confirmSkillsAddButton', function () {
        $('.skillList .active').each(function () {
            let skillName = $(this).data('name');
            let skillLevel = $(this).find('select').val();
            addSkill(skillName, skillLevel);
            $(this).removeClass('active');
        });
        toggleSkillsResult();
        scrollToTop();
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

    $(document).on('click', '.finish-button', function () {
        collapseAllLevels();
        showSuccess();
    });

    $(document).on('click', '.collapse-button', function () {
        let $card = $(this).closest('.card');
        $card.toggleClass('current');
        $('.searchSuccess').hide();
    });
});
