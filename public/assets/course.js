let backpack = [];

function addCourseSkill(skillName, skillLevel) {
    let skillsFilter = {};
    skillsFilter[skillName] = 0;

    let maxLevels = getMaxCourseLevels(skillsFilter);
    let maxLevel = getLevelText(maxLevels[skillName]);
    let skillLevelDefined = (typeof (skillLevel) === "string" || typeof (skillLevel) === "number") && skillLevel !== "Текущий уровень";
    if (!skillLevelDefined) {
        skillLevel = 0;
    }

    let skillLevelIndex = parseInt(skillLevel);
    let maxLevelIndex = maxLevels[skillName];

    let colorClass = 'alert-primary';
    let progressClass = '';
    let progressValue = 0;
    if (skillLevelDefined && skillLevelIndex >= maxLevelIndex) {
        colorClass = 'alert-success';
        progressClass = 'bg-success';
        progressValue = 100;
    }

    let skillHTML = "<div class=\"alert "+colorClass+" d-flex justify-content-between skillBlock\" role=\"alert\">\n" +
        "    <div class=\"levelHeaderContainer\">\n" +
        "       <h4 class=\"alert-heading\">"+skillName+"</h4>\n" +
        "       <button type=\"button\" class=\"close align-self-start\" data-dismiss=\"alert\">×</button>\n" +
        "    </div>\n" +
        "    <div class='row'>\n" +
        "        <div class='col-6'>\n" +
        "            <h6>До обучения</h6>\n" +
        "            <select class=\"custom-select skillSlider\">\n" +
                        getSkillLevels().map(function (skillText, index) {
                            let isSelected = skillLevel === index.toString();
                            return "       <option value="+index+" "+(isSelected?"selected":"")+">"+skillText+"</option>\n";
                        }).join("\n") +
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
        "                <div class=\"progress-bar "+progressClass+"\" role=\"progressbar\" style=\"width: "+progressValue+"%\" aria-valuenow=\""+progressValue+"\" aria-valuemin=\"0\" aria-valuemax=\"100\">" +
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

function hasMatchingSkills(skills, filter, isRequirements) {
    let matchingSkills = getMatchingCourseSkills(skills, filter, isRequirements);
    return matchingSkills.length > 0;
}

function getMatchingSkillsHTML(skills, filter, isRequirements) {
    let matchLabel = isRequirements
        ? 'Текущее владение навыком подходит под требования'
        : 'Пройдя курс, вы улучшите этот навык';

    let matchingSkills = getMatchingCourseSkills(skills, filter, isRequirements);
    let matchingSkillsHtml = matchingSkills.map(function (skillName) {
        let levelText = getLevelText(skills[skillName]);
        let badgeText = isRequirements
            ? skillName + ':&nbsp; ' + levelText
            : skillName + ':&nbsp; улучшение до ' + levelText;
        return '<span class="badge badge-success" data-toggle="tooltip" title="' + matchLabel + '">'+badgeText+'</span>';
    });

    return matchingSkillsHtml.join("\n") + "\n";
}

function getSkillsPropHTML(skills, filter, isRequirements) {
    let unchangedSkills = getUnchangedCourseSkills(skills, filter);
    let undefinedSkills = getUndefinedCourseSkills(skills, filter);
    let unmatchingSkills = getUnmatchingCourseSkills(skills, filter, isRequirements);
    let sortedUndefinedSkills = sortSkillsByCount(undefinedSkills);

    let equalLabel = "Пройдя этот курс вы можете систематизировать ваши знания";

    let unmatchLabel = isRequirements
        ? 'Текущего владения навыком недостаточно для прохождения курса'
        : 'Пройдя курс, вы вряд-ли получите дополнительные знания';

    let matchingSkillsHtml = isRequirements ? getMatchingSkillsHTML(skills, filter, isRequirements) : '';

    let equalSkillsHtml = unchangedSkills.map(function (skillName) {
        let levelText = getLevelText(skills[skillName]);
        let badgeText = skillName + ':&nbsp;' + levelText;
        return '<span class="badge badge-secondary" data-toggle="tooltip" title="' + equalLabel + '">'+badgeText+'</span>';
    });

    let unmatchingSkillsHtml = unmatchingSkills.map(function (skillName) {
        let levelText = getLevelText(skills[skillName]);
        let badgeText = skillName + ':&nbsp;' + levelText;
        return '<span class="badge badge-secondary" data-toggle="tooltip" title="' + unmatchLabel + '">'+badgeText+'</span>';
    });

    let allUndefinedSkillsHtml = sortedUndefinedSkills.map(function (skillName) {
        let levelText = getLevelText(skills[skillName]);
        let badgeText = skillName + ':&nbsp;' + levelText;
        return '<a href="#" class="badge badge-secondary" data-skill="'+skillName+'" data-toggle="tooltip" title="Навык не указан в списке развиваемых">'+badgeText+'</a>';
    });

    let hasUndefinedSkills = undefinedSkills.length > 0;
    let many = 6;
    let hasManyUndefinedSkills = allUndefinedSkillsHtml.length > many;
    let truncateUndefined = !isRequirements && !isFilterEmpty() && hasManyUndefinedSkills;

    let top3UndefinedSkillsHTML = allUndefinedSkillsHtml;
    let restUndefinedSkillsHTML = [];

    if (hasManyUndefinedSkills) {
        top3UndefinedSkillsHTML = allUndefinedSkillsHtml.slice(0, 3);
        restUndefinedSkillsHTML = allUndefinedSkillsHtml.slice(3, allUndefinedSkillsHtml.length);
    }

    let undefinedSkillsTruncatedHTML = top3UndefinedSkillsHTML.join("\n") + '<a href=\"#\" class=\"badge badge-secondary undefinedSkillsTrigger\" data-toggle=\"tooltip\" title=\"+'+restUndefinedSkillsHTML.length+
        ' навыков, не указанных в фильтре\">+'+restUndefinedSkillsHTML.length+' навыков...</a>\n' +
        "<span class=\"hiddenSkills\" style=\"display: none;\">" +
        restUndefinedSkillsHTML.join("\n") +
        "</span>";
    let undefinedSkillsPlainHTML = allUndefinedSkillsHtml.join("\n");

    return matchingSkillsHtml +
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
    let skillsFilter = applyBackpackSkills(getCoursesFilter().skills, level);
    let userLevels = summSkills(skillsFilter);
    let userUpgradeLevels = getCourseTotalLevels(course)-userLevels;
    let maxLevels = getCourseMaxLevels();

    return Math.round(userUpgradeLevels/maxLevels * 100);
}

function getHardnessIndex(course, level) {
    let hardnessPercent = getCourseHardness(course, level);

    let hardnessIndex = 1;

    if (hardnessPercent >= 10) {
        hardnessIndex = 2;
    }

    if (hardnessPercent > 50) {
        hardnessIndex = 3;
    }

    return hardnessIndex;
}

function getCourseHardnessHTML(course, level) {
    let hardnessIndex = getHardnessIndex(course, level);

    if (hardnessIndex === 2) {
        return "<span class='badge badge-warning'>средний</span>";
    }

    if (hardnessIndex === 3) {
        return "<span class='badge badge-danger'>трудный</span>";
    }

    return "<span class='badge badge-success'>легкий</span>";
}

function useBackpackSkills() {
    return $('#useBackpackSkills').is(':checked');
}

function getCourseAttributesHTML(course) {
    let certificateShortNames = {
        'Нет': 'Без сертификата',
        'Собственный': 'Собственый сертификат',
        'Государственного образца': 'Государственный сертификат'
    };

    let attributes = [
        course.format,
        course.hasTeacher ? 'С преподавателем' : 'Без преподавателя',
        course.hasPractice ? 'С практикой' : 'Без практики',
        certificateShortNames[course.certificate],
        course.duration + ' ' + course.durationUnits
    ];

    return attributes.join('&nbsp;&bull;&nbsp;\n');
}

function getCoursePriceText(course) {
    return course.price === 0 ? 'Бесплатно' : course.price + ' руб';
}

function getCourseDataHTML(course, skipButton, index) {
    let descriptionHTML = course.description || "";
    let price = getCoursePriceText(course);
    let filter = getCoursesFilter();
    let skillsFilter = applyBackpackSkills(filter.skills, index);
    let showMatchingSkills = useBackpackSkills() && hasMatchingSkills(course.skills, skillsFilter, false);
    let matchingSkillsHTML = getMatchingSkillsHTML(course.skills, skillsFilter, false);
    let skillsHTML = getSkillsHTML(course, skillsFilter);
    let hasRequirements = Object.keys(course.requirements).length > 0;
    let requirementsHTML = hasRequirements
        ? getRequirementsHTML(course, skillsFilter)
        : "нет";

    let attributesHTML = getCourseAttributesHTML(course);
    let buttonHTML = skipButton
        ? ""
        : "<a href=\"#\" class=\"btn btn-primary btn-block d-flex justify-content-center add-to-backpack mt-1\" data-course-id=\""+course.id+"\"><img src=\"/assets/images/backpack-white.svg\"></img>&nbsp;Добавить в портфель</a>";

    let visitButtonHTML = "<a href=\"" + course.url + "\" target=\"_blank\" class=\"btn btn-primary btn-block go-to-course mt-1\" data-course-id=\""+course.id+"\"><i class=\"fas fa-external-link-square-alt\"></i>&nbsp;Перейти к курсу</a>";

    let difficultyText = useBackpackSkills()
        ? 'Сложность курса с учетом портфеля'
        : 'Сложность курса для вас';

    return "<span class=\"badge badge-secondary priceBadge\">" + price + "</span>\n" +
        "<h4><a class=\"courseLink\" href=\"" + course.url + "\" target=\"_blank\">" + course.title + "&nbsp;<i class=\"fas fa-external-link-square-alt\"></i></a></h4>\n" +
        "<h6 class=\"text-muted\">" +course.platform+ "</h6>\n" +
        "<p class='mt-1'>" + difficultyText + ": " + getCourseHardnessHTML(course, index) + "</p>\n" +
        (
            showMatchingSkills
                ? (
                    "<p class=\"mt-1 mb-0\">Навыки, которые вы улучшите:</p>\n" +
                    "<p>" + matchingSkillsHTML + "</p>\n" +
                    "<p class=\"mt-1 mb-0\">Прочие навыки курса:</p>\n" +
                    "<p>" + skillsHTML + "</p>\n"
                )
                : (
                    "<p class=\"mt-1 mb-0\">Навыки курса:</p>\n" +
                    "<p>" + skillsHTML + "</p>\n"
                )
        ) + "\n" +
        "<p class=\"mb-0\">Требования:</p>\n" +
        "<p>" + requirementsHTML + "</p>\n" +
        "<p class=\"mt-1\">" + attributesHTML + "</p>\n" +
        "<button class=\"btn btn-outline-secondary btn-block mb-3\" data-toggle=\"collapse\" data-target=\"#description"+course.id+"\" aria-expanded=\"true\" aria-controls=\"description"+course.id+"\">\n" +
        "    Посмотреть описание курса\n" +
        "</button>\n" +
        "<p id=\"description"+course.id+"\" class=\"collapse\">\n" +
            descriptionHTML +
        "</p>\n" +
        buttonHTML +
        visitButtonHTML +
        "<button class=\"btn btn-outline-primary btn-block btn-similar\" data-course=\""+course.id+"\">\n" +
        "    Подобрать похожие курсы\n" +
        "</button>\n";
}

function getCourseCardHTML(course, skipButton, index) {
    let courseHTML = "<div class=\"swiper-slide\">\n" +
        "    <div class=\"card-body\">\n" +
            getCourseDataHTML(course, skipButton, index) +
        "    </div>\n" +
        "</div>";

    return courseHTML;
}

function getBackpackCourseDataHTML(course) {
    let price = getCoursePriceText(course);
    let attributesHTML = getCourseAttributesHTML(course);

    return "<span class=\"badge badge-secondary priceBadge\">" + price + "</span>\n" +
        "<h4><a class=\"courseLink\" href=\"" + course.url + "\" target=\"_blank\">" + course.title + "&nbsp;<i class=\"fas fa-external-link-square-alt\"></i></a></h4>\n" +
        "<h6 class=\"text-muted\">" +course.platform+ "</h6>\n" +
        "<p class=\"mt-1\">" + attributesHTML + "</p>\n";
}

function getCourseBackpackCardHTML(course) {
    let courseHTML = "<div class=\"list-group-item list-group-item-action flex-column align-items-start\">\n" +
            getBackpackCourseDataHTML(course) +
        "</div>";
    
    return courseHTML;
}

function addCourse(course) {
    let courseHTML = getCourseCardHTML(course);

    $('.coursesList').append(courseHTML);
}

function applyBackpackSkills(currentSkills, level) {
    if (!useBackpackSkills()) {
        return currentSkills;
    }

    let skillsAfterLearn = JSON.parse(JSON.stringify(currentSkills));
    let coursesToApply = typeof (level) === 'number'
        ? backpack.slice(0, level)
        : backpack;

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

function getMaximumValue(items, callback) {
    let maximum = items.reduce(function (prevMax, currentItem) {
        let currentValue = callback(currentItem);
        if (currentValue > prevMax || currentValue === false) {
            return currentValue;
        }
        return prevMax;
    }, false);

    return maximum
}

function getNormalizedValue(item, items, callback, maximum) {
    if (!maximum) {
        maximum = getMaximumValue(items, callback);
    }

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

function getWeightenedSkillsCountStep(course) {
    let step = 5;
    let skillsCount = getWeightenedSkillsCount(course);
    return Math.round(skillsCount / 5) * 5;
}

function courseMatchesFilterParameters(course) {
    let filter = getCoursesFilter();
    let filteredEnumProps = ['format', 'hardness', 'certificate', 'hasTeacher', 'hasPractice'];

    let propsMatch = filteredEnumProps.reduce(function (prevPropsMatch, propName) {
        let filterValues = filter[propName];
        let courseValue = course[propName];
        let propMatches;

        if (courseValue instanceof Array) {
            propMatches = intersectArrays(filterValues, courseValue).length > 0;
        }
        else {
            propMatches = filterValues.length === 0 || filterValues.indexOf(courseValue) !== -1;
        }

        return prevPropsMatch && propMatches;
    }, true);

    let priceMatches = filter.priceFrom <= course.price && filter.priceTo >= course.price;
    let courseMatches = propsMatch && priceMatches;

    return courseMatches;
}

function getCoursesListWithHardnessAndSortIndex() {
    let clonedList = JSON.parse( JSON.stringify( getCoursesList() ) );

    let skillsFilter = applyBackpackSkills(getCoursesFilter().skills);
    let isLocalFilterEmpty = Object.keys(skillsFilter).length === 0;
    let getCoursePrice = function (course) { return course.price };
    let getCourseRequirementsCount = function (course) { return Object.keys(course.requirements).length };
    let getMatchedSkillsCount = function (course) { return isLocalFilterEmpty ? 0 : getMatchingCourseSkills(course.skills, skillsFilter, false).length; }

    let priceMaximum = getMaximumValue(clonedList, getCoursePrice);
    let weightenedSkillsMaximum = getMaximumValue(clonedList, getWeightenedSkillsCountStep);
    let requirementsMaximum = getMaximumValue(clonedList, getCourseRequirementsCount);
    let hardnessMaximum = getMaximumValue(clonedList, getCourseHardness);
    let matchedSkillsMaximum = getMaximumValue(clonedList, getMatchedSkillsCount);

    let getCourseSortIndex = function (course, courses) {
        let price = getNormalizedValue(course, courses, getCoursePrice, priceMaximum);
        let weightenedSkills = 1-getNormalizedValue(course, courses, getWeightenedSkillsCountStep, weightenedSkillsMaximum);
        let requirements = getNormalizedValue(course, courses, getCourseRequirementsCount, requirementsMaximum);
        let hardness = getNormalizedValue(course, courses, getCourseHardness, hardnessMaximum);
        let matchedSkillsCount = matchedSkillsMaximum ? 1-getNormalizedValue(course, courses, getMatchedSkillsCount, matchedSkillsMaximum) : 0;

        return Math.round(matchedSkillsCount * 1000000000) +
            Math.round(price * 10000000) +
            Math.round(weightenedSkills * 100000) +
            Math.round(hardness * 1000) +
            Math.round(requirements * 10);
    };

    let listWithSortIndex = clonedList.map(function (course) {
        course.sortIndex = getCourseSortIndex(course, clonedList);
        course.hardness = getHardnessIndex(course);
        return course;
    });

    return listWithSortIndex;
}

function skipBackpackCourses(course) {
    if (!backpack) {
        return true;
    }

    let backpackCourseIds = backpack.reduce(function (result, course) {
        result.push(course.id);
        return result;
    }, []);

    let courseIsNotInBackpack = backpackCourseIds.indexOf(course.id) === -1;
    let showCourse = courseIsNotInBackpack;

    return showCourse;
}

function findCourses(filter) {
    let skillsFilter = applyBackpackSkills(filter.skills);
    let courses = getCoursesListWithHardnessAndSortIndex();

    return courses
        .filter(function (course) {
            let matchedSkillsCount = getMatchingCourseSkills(course.skills, skillsFilter, false).length;
            let hasMatchedSkills = matchedSkillsCount > 0;
            let isFilterEmpty = Object.keys(skillsFilter).length === 0;
            return hasMatchedSkills || isFilterEmpty;
        })
        .filter(courseMatchesFilterParameters)
        .filter(skipBackpackCourses)
        .sort(function (courseA, courseB) {
            let ratingA = courseA.sortIndex;
            let ratingB = courseB.sortIndex;
            let aSkills = Object.keys(courseA.skills);
            let bSkills = Object.keys(courseB.skills);
            let aRequirements = Object.keys(courseA.requirements) || [];
            let bRequirements = Object.keys(courseB.requirements) || [];

            let aHasBrequirements = aSkills.reduce(function (result, aSkillName) {
                return result || bRequirements.indexOf(aSkillName) !== -1;
            }, false);

            let bHasArequirements = bSkills.reduce(function (result, bSkillName) {
                return result || aRequirements.indexOf(bSkillName) !== -1;
            }, false);

            if (aHasBrequirements) {
                return -1;
            }

            if (bHasArequirements) {
                return 1;
            }

            if (ratingA > ratingB) {
                return 1;
            }

            if (ratingA < ratingB) {
                return -1;
            }

            return 0;
        });
}

function getCoursePriceRange(courses) {
    return courses.reduce(function (range, course) {
        if (course.price !== false) {
            if ( (course.price < range.min) || range.min === false ) {
                range.min = course.price;
            }

            if ( (course.price > range.max) || range.max === false ) {
                range.max = course.price;
            }
        }

        return range;
    }, {min: false, max: false});
}

function updateCourseFromTo() {
    let priceRange = getCoursePriceRange(getCoursesList());
    $('[id^=from]')
        .attr('min', priceRange.min)
        .attr('max', priceRange.max)
        .attr('value', priceRange.min);

    $('[id^=to]')
        .attr('min', priceRange.min)
        .attr('max', priceRange.max)
        .attr('value', priceRange.max);
}

function getCoursesFilter() {
    let fieldIndex = isMobile() ? "0" : "1";

    let onlyFree = $('#cf_'+fieldIndex).is(':checked');

    return {
        skills: getSkillsFilter(),
        priceFrom: onlyFree ? 0 : parseInt( $('#from_'+fieldIndex).val() ),
        priceTo: onlyFree ? 0 : parseInt( $('#to_'+fieldIndex).val() ),
        hardness: getCheckedValues('hardness').map(function (strValue) {
            return parseInt(strValue);
        }),
        format: getCheckedValues('format'),
        certificate: getCheckedValues('certificate'),
        hasTeacher: getBooleanCheckedValues('hasTeacher'),
        hasPractice: getBooleanCheckedValues('hasPractice')
    }
}

function isSuccessShown() {
    return $('.searchSuccess').is(':visible');
}

function search() {
    updateSlider();
    if (isSuccessShown()) {
        return;
    }

    $('.coursesList').css('opacity', '0.3');
    setTimeout(function () {
        $('.coursesList').html('');

        let courses = findCourses( getCoursesFilter() );
        courses.forEach(function (course) {
            addCourse(course);
        });

        $('.coursesList').attr('style', '');
        if (courses.length === 0) {
            $('.coursesList').append("<p class=\"h4 px-3 py-2\">Подходящие курсы не найдены</p>");
        }

        updateSlider();
    }, 200)
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

function collapseAllLevels() {
    $('#levelsAccordion>.card').removeClass('current');
    $('#levelsAccordion>.card>.collapse.show').removeClass('show');
}

function hasNoCoursesForNextStep() {
    let nextStepCourses = findCourses( getCoursesFilter() );
    return nextStepCourses.length === 0;
}

function updateBackpackCounters() {
    let courseCount = backpack.length;
    $('.backpackCount').html(courseCount);

    if (courseCount === 0) {
        $('.hidableCount').hide();
    }
    else {
        $('.hidableCount').show();
    }
}

function updateFilterCounter() {
    let filter = getCoursesFilter();
    let priceRange = getCoursePriceRange(getCoursesList());
    let filterPriceRange = {
        priceFrom: priceRange.min,
        priceTo: priceRange.max
    };

    let countFilterAttrs = Object.keys(filter).reduce(function (result, filterAttr) {
        let filterValue = filter[filterAttr];
        let attrHasValue = false;

        if (filterValue instanceof Array) {
            attrHasValue = filterValue.length > 0;
        }

        if (typeof filterValue === "number") {
            attrHasValue = filterPriceRange[filterAttr] !== parseInt(filterValue);
        }

        if (filterValue instanceof Object && !(filterValue instanceof Array)) {
            attrHasValue = Object.keys(filterValue).length > 0;
        }

        return result + (attrHasValue ? 1 : 0)
    }, 0);

    $('.filterCount').html(countFilterAttrs);
    if (countFilterAttrs === 0) {
        $('.filterCount').hide();
    }
    else {
        $('.filterCount').show();
    }
}

function redrawBackpack() {
    $('#backpackPopupList, #backpackCollapseList').html('');

    backpack.forEach(function (course) {
        let courseHTML = getCourseBackpackCardHTML(course);
        $('#backpackPopupList, #backpackCollapseList').append(courseHTML);
    });

    updateBackpackCounters();
}

function addCourseToBackpack(course) {
    backpack.push(course);

    redrawBackpack();
    updateSkillCards();
    showBackpackSkillsAlert();

    if (hasNoCoursesForNextStep()) {
        showSuccess();
    }
}

function updateBackpackData() {
    let vacancies = findSoftVacancies(applyBackpackSkills(getSkillsFilter()));
    let allVacancies = getVacanciesList();
    let vacanciesPercent = Math.round(vacancies.length / allVacancies.length * 100);

    let totalPrice = backpack.reduce(function (prevPrice, course) {
        return prevPrice + course.price;
    }, 0);

    let totalDuration = backpack.reduce(function (prevDuration, course) {
        return prevDuration + getTimeInDays(course);
    }, 0);
    totalDuration = Math.ceil(totalDuration);

    $('.totalCount').text(backpack.length);
    $('.totalDuration').text(totalDuration);
    $('.totalCost').text(totalPrice);
    $('.vacanciesPercent').text(vacanciesPercent);
}

function hideBackpackSkillsAlert() {
    $('.navbar-alert').hide();
}

function showBackpackSkillsAlert() {
    if ( useBackpackSkills() ) {
        $('.navbar-alert').show();
    }
}

function showSuccess() {
    updateBackpackData();
    hideBackpackSkillsAlert();
    $('.coursesList').hide();
    $('.swiper-button-prev, .swiper-button-next').hide();

    let searchSuccessText = hasNoCoursesForNextStep()
        ? "Выбранные курсы позволят вам получить максимальное доступное количество навыков!"
        : "Вы успешно составили план обучения и можете приступать к улучшению собственных навыков!";

    $('.searhSuccessText').html(searchSuccessText);
    $('.searchSuccess').show();
}

function sendBackpackToEmail() {
    let promise = $.Deferred();
    let formData = $('#emailPlanForm').serializeArray();

    backpack.map(function (course) {
        formData.push({name: 'courseId[]', value: course.id});
    });

    $.ajax({
        url: "/api/sendEmail.php",
        data: $.param(formData),
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

function isBackpackNotEmpty() {
    return backpack.length > 0;
}

function updateSkillCards() {
    if (isBackpackNotEmpty()) {
        $('.skillContainer').addClass('pathEnabled');
    }
    else {
        $('.skillContainer').removeClass('pathEnabled');
    }

    let maxSkills = getMaxCourseLevels();
    let baseSkills = getCoursesFilter().skills;
    let currentSkills = applyBackpackSkills( baseSkills );

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

function addCourseSkillsToFilter(courseId) {
    let course = getCourseById(courseId);
    if (!course) {
        return;
    }

    Object.keys(course.skills).forEach(function (skillName) {
        addCourseSkill(skillName);
    });
}

$(function () {
    enableTooltips();

    drawFilter();

    updateStartCourseSkills();
    updateMinSkills();
    updateAllSkills();
    updateCourseFromTo();
    updatePageTitle();
    updateFilterCounter();

    search();

    window.slider = setupSlider();

    $('#coursesCount').text( getCoursesList().length );

    $(document).on('click', '.skillContainer .close', function () {
        updateFilterCounter();
        updateAllSkills();
        search();
    });


    $(document).on('click', '.btn-turnoff', function () {
        $('[name=useBackpackSkills]').attr('checked', false);
        updateFilterCounter();
        search();
    });

    $(document).on('input change click', '#useBackpackSkills', function () {
        let isChecked = useBackpackSkills();
        if (isChecked) {
            if (backpack.length > 0) {
                showBackpackSkillsAlert();
            }
        }
        else {
            hideBackpackSkillsAlert();
        }
    });

    $(document).on('click', '.search-finish', function () {
        showSuccess();
    });

    $(document).on('click', '.btn-similar', function () {
        let courseId = parseInt( $(this).data('course') );
        addCourseSkillsToFilter(courseId);
        updateFilterCounter();
    });

    $(document).on('click', '[data-skill]', function () {
        let skillName = $(this).attr('data-skill');
        addCourseSkill(skillName);
        updateFilterCounter();
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
            addCourseSkill(skillName, skillLevel);
            $(this).removeClass('active');
        });
        toggleSkillsResult();
        updateFilterCounter();
        scrollToTop();
        search();
    });

    $(document).on('click', '.undefinedSkillsTrigger', function () {
        event.preventDefault();
        $(this).hide();
        $(this).closest('.card-body').find('.hiddenSkills').show();
    });

    $(document).on('change input', '.skillSlider', function () {
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

        updateFilterCounter();
    });

    $(document).on('change input click', 'input:not(#allSkills input, #emailField)', function () {
        updateFilterCounter();
        search();
    });

    $(document).on('click', '.skillBlock .close', function () {
        search();
    });

    $(document).on('click', '.add-to-backpack', function () {
        let courseId = parseInt( $(this).data('course-id') );
        let course = getCourseById(courseId);
        addCourseToBackpack(course);
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

    $('#emailPlanForm').on('submit', function (event) {
        event.preventDefault();

        $('.sendPlan').text('...Идет отправка...').attr('disabled', true);

        sendBackpackToEmail()
            .then(function () {
                $('.sendPlan').text('Успешно! Отправить еще раз').attr('disabled', false);
            })
            .catch(function () {
                $('.sendPlan').text('Ошибка! Отправить еще раз').attr('disabled', false);
            });

    });
});
