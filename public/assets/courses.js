let manualAddedSkills = {};
let manualDeletedSkills = [];
let manualChangedSkills = {};

function addCourseSkill(skillName, skillLevel) {
    let wasDeleted = manualDeletedSkills.indexOf(skillName) !== -1;
    if (wasDeleted) {
        let skillIndex = manualDeletedSkills.indexOf(skillName);
        manualDeletedSkills.splice(skillIndex, 1);
    }

    manualAddedSkills[skillName] = skillLevel;
    search();
}

function deleteCourseSkill(skillName) {
    if (manualDeletedSkills.indexOf(skillName) === -1) {
        manualDeletedSkills.push(skillName);
    }

    if (typeof (manualAddedSkills[skillName]) !== 'undefined') {
        delete manualAddedSkills[skillName];
    }
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

function getAllSkillsExceptMatching(skills, filter, isRequirements) {
    let matchingSkills = getMatchingCourseSkills(skills, filter, isRequirements);
    let courseSkillNames = Object.keys(skills);
    let resultSkills = [];

    courseSkillNames.forEach(function (skillName) {
        if (matchingSkills.indexOf(skillName) === -1) {
            resultSkills.push(skillName);
        }
    });

    return resultSkills;
}

function hasMatchingSkills(skills, filter, isRequirements) {
    let matchingSkills = getMatchingCourseSkills(skills, filter, isRequirements);
    return matchingSkills.length > 0;
}

function getMatchingSkillsHTML(skills, filter, isRequirements) {
    let matchingSkills = getMatchingCourseSkills(skills, filter, isRequirements);
    let matchingSkillsHtml = matchingSkills.map(function (skillName) {
        let skillLevel = skills[skillName];
        return getSkillHTML(skillName, skillLevel);
    });

    return matchingSkillsHtml.join("\n") + "\n";
}

function getSkillsPropHTML(skills, filter, isRequirements) {
    let skillNames = Object.keys(skills);
    let skillsHTML = skillNames.map(function (skillName) {
        let skillLevel = skills[skillName];
        return getSkillHTML(skillName, skillLevel);
    });

    return skillsHTML.join("\n");
}

function getSkillsHTML(course, filter) {
    return getSkillsPropHTML(course.skills, filter, false);
}

function getAdditionalSkillsHTML(course, filter) {
    let skills = course.skills;
    let additionalSkillNames = getAllSkillsExceptMatching(course.skills, filter, false);

    let skillsHTML = additionalSkillNames.map(function (skillName) {
        let skillLevel = skills[skillName];
        return getSkillHTML(skillName, skillLevel);
    });

    return skillsHTML.join("\n");
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

function getCourseHardness(course, level, skipUserLevels) {
    let skillsFilter = applyBackpackSkills(getCoursesFilter().skills, level);
    let userLevels = summSkills(skillsFilter);
    let userUpgradeLevels = getCourseTotalLevels(course)-userLevels;
    let maxLevels = getCourseMaxLevels();

    return Math.round(userUpgradeLevels/maxLevels * 100);
}

function useBackpackSkills() {
    return $('#useBackpackSkills').is(':checked');
}

function getCourseDataHTML(course, skipButton, index) {
    let descriptionHTML = course.description || "";
    let price = getCoursePriceText(course.price);
    let filter = getCoursesFilter();
    let skillsFilter = applyBackpackSkills( applySalaryRangeSkills( filter.skills ), index);
    let showMatchingSkills = useBackpackSkills() && hasMatchingSkills(course.skills, skillsFilter, false);
    let matchingSkillsHTML = getMatchingSkillsHTML(course.skills, skillsFilter, false);
    let additionalSkillsHTML = getAdditionalSkillsHTML(course, skillsFilter);
    let additionalSkills = getAllSkillsExceptMatching(course.skills, skillsFilter, false);
    let hasAdditionalSkills = additionalSkills.length > 0;
    let hasRequirements = Object.keys(course.requirements).length > 0;
    let courseToSalary = aimPrettifyNumber( getCourseSalary(course) );
    let requirementsHTML = hasRequirements
        ? getRequirementsHTML(course, skillsFilter)
        : "нет";

    let considerLabel = course.hasPartnerUrl;

    let priceBadgeHTML = "        <span class=\"badge badge-secondary priceBadge\">" + price + "</span>\n";
    let considerLabelHTML = considerLabel ? "        <span class=\"badge badge-warning mt-1\">Обратите<br>внимание</span>\n" : "";
    if (course.coupon) {
        let discountPrice = getCoursePriceText(course.price * (1-course.couponDiscount/100));
        priceBadgeHTML = "        <span class=\"badge badge-secondary priceBadge\"><del>" + price + "</del><br>" + discountPrice + "</span>\n";
        considerLabelHTML = "        <span class=\"badge badge-warning mt-1\">-"+course.couponDiscount+"% по коду<br>"+course.coupon+"</span>\n"
    }

    let attributesHTML = getCourseAttributesHTML(course, index);
    let buttonHTML = skipButton
        ? ""
        : "<a href=\"#\" class=\"btn btn-primary btn-block d-flex justify-content-center add-to-backpack mt-1\" data-course-id=\""+course.id+"\">" +
          "  <i class=\"fas fa-heart\"></i> Сохранить (+" + courseToSalary + " к ЗП)" +
          "</a>";

    let visitButtonHTML = "<a href=\"" + course.url + "\" target=\"_blank\" class=\"btn btn-primary btn-block go-to-course mt-1\" data-course-id=\""+course.id+"\">Сайт курса&nbsp;<i class=\"fas fa-external-link-square-alt\"></i></a>";

    return "<h5 class=\"d-flex align-items-start justify-content-between\">" +
        "    <a class='course-title' href='"+getCoursePageUrl(course)+"' target=\"_blank\">" + course.title + "</a>" +
        "    <div class=\"badges ml-2\">\n" +
                 priceBadgeHTML +
                 considerLabelHTML +
        "    </div>\n" +
        "</h5>\n" +
        "<h6 class=\"text-muted\">" +course.platform+ "</h6>\n" +
        "<p class=\"mt-1 text-info\">" + attributesHTML + "</p>\n" +
        (
            showMatchingSkills
                ? (
                    "<p class=\"mt-1 mb-0\">Подходящие навыки курса:</p>\n" +
                    "<p>" + matchingSkillsHTML + "</p>\n" +
                    (hasAdditionalSkills ? "<p class=\"mt-1 mb-0\">Прочие навыки:</p>\n" +
                    "<p>" + additionalSkillsHTML + "</p>\n" : "")
                )
                : (hasAdditionalSkills ?
                    "<p class=\"mt-1 mb-0\">Дополнительные навыки курса:</p>\n" +
                    "<p>" + additionalSkillsHTML + "</p>\n" : ""
                )
        ) + "\n" +
        "<p class=\"mt-1 visible-sm\"><a href=\"#\" class=\"toggle-skills dashedLink\">Какие еще навыки нужны?</a></p>\n" +
        (
            hasRequirements
            ? (
                    "<p class=\"mb-0\">Нужно знать:</p>\n" +
                    "<p>" + requirementsHTML + "</p>\n"
            ) : ''
        ) + "\n" +
        "<button class=\"btn btn-outline-secondary btn-block dropdown-toggle mb-3\" data-toggle=\"collapse\" data-target=\"#description"+course.id+"\" aria-expanded=\"true\" aria-controls=\"description"+course.id+"\">\n" +
        "    Описание курса\n" +
        "</button>\n" +
        "<p id=\"description"+course.id+"\" class=\"collapse\">\n" +
            descriptionHTML +
        "</p>\n" +
        buttonHTML +
        visitButtonHTML;
}

function getCourseCardHTML(course, skipButton, index) {
    let courseHTML = "<div class=\"swiper-slide\">\n" +
        "    <div class='card bg-white'><div class=\"card-body\" data-id='"+course.id+"' data-sort='"+course.sortIndex+"'>\n" +
            getCourseDataHTML(course, skipButton, index) +
        "    </div></div>\n" +
        "</div>";

    return courseHTML;
}

function getBackpackCourseDataHTML(course) {
    let price = getCoursePriceText(course.price);
    let attributesHTML = getCourseAttributesHTML(course);

    return "<h4 class=\"d-flex align-items-start\">" +
        "    <a class=\"courseLink\" href=\"" + getCoursePageUrl(course) + "\" target=\"_blank\">" + course.title + "</a>" +
        "    <span class=\"badge badge-secondary priceBadge\">" + price + "</span>\n" +
        "</h4>\n" +
        "<h6 class=\"text-muted\">" +course.platform+ "</h6>\n" +
        "<p class=\"mt-1\">" + attributesHTML + "</p>\n";
}

function getCourseBackpackCardHTML(course) {
    let courseHTML = "<div class=\"list-group-item list-group-item-action flex-column align-items-start\">\n" +
            getBackpackCourseDataHTML(course) +
        "</div>";
    
    return courseHTML;
}

function updateCollapseFieldIds(HTML, suffix) {
    return HTML.replace(/description(\d+)/g, 'description$1_'+suffix);
}

function addCourse(course) {
    let courseHTML = getCourseCardHTML(course);
    let mobileCourseHTML = updateCollapseFieldIds(courseHTML, 'm');

    $('#mobileList').append(mobileCourseHTML);
    $('#desktopList').append(courseHTML);
}

function getBackpackSkills() {
    let backpackSkills = {};

    getBackpack().forEach(function (course) {
        Object.keys(course.skills).forEach(function (skillName) {
            let isSkillInFilter = typeof backpackSkills[skillName] !== 'undefined';
            let isSkillWeaker = isSkillInFilter && backpackSkills[skillName] < course.skills[skillName];

            if (isSkillWeaker || !isSkillInFilter) {
                backpackSkills[skillName] = course.skills[skillName];
            }
        });
    });

    return backpackSkills;
}

function applyBackpackSkills(currentSkills, level) {
    if (!useBackpackSkills()) {
        return currentSkills;
    }

    let skillsAfterLearn = clone(currentSkills);
    let coursesToApply = typeof (level) === 'number'
        ? getBackpack().slice(0, level)
        : getBackpack();

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

function applySalaryRangeSkills(filterSkills) {
    let from = getAimFromTo().from;
    let to = getAimFromTo().to;
    let vacancies = getVacanciesList();

    let takeMinVacancy = true;
    let skipMinVacancy = !takeMinVacancy;
    let neededSkills = getSkillsForSalaryRange(from, to, vacancies, takeMinVacancy);
    let currentSkills = from > 0
        ? getSkillsForSalaryRange(0, from, vacancies, skipMinVacancy)
        : {};

    let skillsWithSalarySkills = joinSkillLevels(filterSkills, currentSkills);

    Object.keys(neededSkills).forEach(function (skillName) {
        let isSkillInFilter = typeof skillsWithSalarySkills[skillName] !== 'undefined';

        if (!isSkillInFilter) {
            skillsWithSalarySkills[skillName] = 0;
        }
    });

    return skillsWithSalarySkills;
}

function getCurrentProfessionSkills() {
    let professionName = getCurrentProfessionName();
    return getSkillsList()[professionName];
}

function getBaseProfessionSkillNames() {
    return getCurrentProfessionSkills().reduce(function (result, currentSkill) {
        if (currentSkill.isBase) {
            result.push(currentSkill.name);
        }

        return result;
    }, []);
}

function getMaximumValue(items, callback) {
    let maximum = items.reduce(function (prevMax, currentItem) {
        let currentValue = callback(currentItem);
        if (currentValue > prevMax || prevMax === false) {
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

function getWeightenedSkillsCount(course, skillsCount) {
    if (!skillsCount) {
        skillsCount = getSkillCount(getVacanciesList());
    }

    let maxCount = Object.keys(skillsCount).reduce(function (prevMaxCount, skillName) {
        let skillCount = skillsCount[skillName] || 0;
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
        let skillWeight = skillWeights[skillName] || 0;
        return countAggregator + skillWeight;
    }, 0);

    return weightenedCount;
}

function getWeightenedSkillsCountStep(course) {
    let step = 1;
    let skillsCount = getWeightenedSkillsCount(course);
    let steppedCount = Math.round(skillsCount / step) * step;
    if (steppedCount === 0) {
        steppedCount = 1;
    }

    return steppedCount;
}

function getBaseSkillsCount(course) {
    let baseSkills = getBaseProfessionSkillNames();
    return Object.keys(course.skills).reduce(function (count, currentSkillName) {
        let isBaseSkill = baseSkills.indexOf(currentSkillName) !== -1;
        return isBaseSkill ? count+1 : count;
    }, 0);
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
    let baseSkillsMaximum = getMaximumValue(clonedList, getBaseSkillsCount);

    let getCourseSortIndex = function (course, courses) {
        let price = 1-getNormalizedValue(course, courses, getCoursePrice, priceMaximum);
        let weightenedSkills = getNormalizedValue(course, courses, getWeightenedSkillsCountStep, weightenedSkillsMaximum);
        let requirements = 1-getNormalizedValue(course, courses, getCourseRequirementsCount, requirementsMaximum);
        let hardness = 1-getNormalizedValue(course, courses, getCourseHardness, hardnessMaximum);
        let matchedSkillsCount = matchedSkillsMaximum ? getNormalizedValue(course, courses, getMatchedSkillsCount, matchedSkillsMaximum) : 0;
        let baseSkillsCount = baseSkillsMaximum ? getNormalizedValue(course, courses, getBaseSkillsCount, baseSkillsMaximum) : 0;

        return Math.round(matchedSkillsCount * 1000000) +
            Math.round(price * 100000) +
            Math.round(baseSkillsCount * 10000) +
            Math.round(weightenedSkills * 1000) +
            Math.round(hardness * 100) +
            Math.round(requirements * 10);
    };

    let listWithSortIndex = clonedList.map(function (course) {
        course.sortIndex = getCourseSortIndex(course, clonedList);
        course.hardness = getHardnessIndex(course);
        return course;
    });

    return listWithSortIndex;
}

function courseMatchesSkills(course, skillsFilter) {
    let matchedSkillsCount = getMatchingCourseSkills(course.skills, skillsFilter, false).length;
    let hasMatchedSkills = matchedSkillsCount > 0;
    let isFilterEmpty = Object.keys(skillsFilter).length === 0;
    return hasMatchedSkills || isFilterEmpty;
}

function courseMatchesFilterParameters(course) {
    let filter = getCoursesFilter();
    let filteredEnumProps = ['format', 'hardness', 'certificate', 'hasTeacher', 'hasPractice', 'jobPlacement', 'forKids'];

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

function skipBackpackCourses(course) {
    if (!getBackpack()) {
        return true;
    }

    let backpackCourseIds = getBackpack().reduce(function (result, course) {
        result.push(course.id);
        return result;
    }, []);

    let courseIsNotInBackpack = backpackCourseIds.indexOf(course.id) === -1;
    let showCourse = courseIsNotInBackpack;

    return showCourse;
}

function findCourses(filter) {
    let skillsFilter = applyBackpackSkills( applySalaryRangeSkills( filter.skills ) );
    let courses = getCoursesListWithHardnessAndSortIndex();

    return courses
        .filter(function (course) {
            return courseMatchesSkills(course, skillsFilter);
        })
        .filter(courseMatchesFilterParameters)
        .filter(skipBackpackCourses)
        .sort(function (courseA, courseB) {
            let moveAUp = -1;
            let moveBUp = 1;

            let ratingA = courseA.sortIndex;
            let ratingB = courseB.sortIndex;
            let aSkills = Object.keys(courseA.skills);
            let bSkills = Object.keys(courseB.skills);
            let aRequirements = Object.keys(courseA.requirements) || [];
            let bRequirements = Object.keys(courseB.requirements) || [];
            let aHasRequirementsAndBNot = aRequirements.length > 0 && bRequirements.length === 0;
            let bHasRequirementsAndANot = bRequirements.length > 0 && aRequirements.length === 0;
            let aForKidsAndBNot = courseA.forKids && !courseB.forKids;
            let bForKidsAndANot = courseB.forKids && !courseA.forKids;

            let aSkillsHaveBrequirements = aSkills.reduce(function (result, aSkillName) {
                return result || bRequirements.indexOf(aSkillName) !== -1;
            }, false);

            let bSkillsHaveArequirements = bSkills.reduce(function (result, bSkillName) {
                return result || aRequirements.indexOf(bSkillName) !== -1;
            }, false);

            if (bForKidsAndANot) {
                return moveAUp;
            }

            if (aForKidsAndBNot) {
                return moveBUp;
            }

            if (aSkillsHaveBrequirements) {
                return moveAUp;
            }

            if (bSkillsHaveArequirements) {
                return moveBUp;
            }

            if (bHasRequirementsAndANot) {
                return moveAUp;
            }

            if (aHasRequirementsAndBNot) {
                return moveBUp;
            }

            if (ratingA > ratingB) {
                return moveAUp;
            }

            if (ratingA < ratingB) {
                return moveBUp;
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
    let minPrice = Math.floor(priceRange.min / 1000) * 1000;
    let maxPrice = Math.ceil(priceRange.max / 1000) * 1000;

    $('[id^=from]')
        .attr('value', minPrice);

    $('[id^=to]')
        .attr('value', maxPrice);

    $('.from-to-slider').ionRangeSlider({
        skin: "round",
        type: "double",
        min: minPrice,
        max: maxPrice,
        from: minPrice,
        to: maxPrice,
        step: 1000,
        grid: true,
        onChange: function (data) {
            let fieldIndex = isMobile() ? "0" : "1";
            $('#from_'+fieldIndex).val(data.from);
            $('#to_'+fieldIndex).val(data.to);
        }
    });
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
        hasPractice: getBooleanCheckedValues('hasPractice'),
        jobPlacement: getBooleanCheckedValues('jobPlacement'),
        forKids: getBooleanCheckedValues('forKids')
    }
}

function isSuccessShown() {
    return $('.searchSuccess').is(':visible');
}

function updateResumeSalary() {
    let neededSalary = getAimFromTo().to;
    $('.resume .salary').text(neededSalary + ' руб');
}

function getResumeSkillBadgeHTML(skillName, backpackSkills, neededSkills) {
    let currentLevel = typeof (backpackSkills[skillName]) !== 'undefined' ? backpackSkills[skillName] : 0;
    let neededLevel = typeof (neededSkills[skillName]) !== 'undefined' ? neededSkills[skillName] : 1;
    let isComplete = currentLevel >= neededLevel;
    let isStarted = currentLevel > 0;

    let levelText = getLevelText(neededLevel);
    let badgeText = skillName + ':&nbsp; ' + levelText;
    let completenessClass = isComplete
        ? "complete"
        : (isStarted ? "started" : "");

    return "<span class=\"resumeSkill "+completenessClass+"\" data-skill='"+skillName+"'>" +
        "    <span>"+badgeText+"</span>" +
        //"    <i class=\"fas fa-pencil-alt\"></i>" + //TODO: тут предполагаю редактирование текущего уровня навыка
        "    <i class=\"fas fa-trash-alt\"></i>" +
        "</span>";
}

function filterByWeightMargin(skillNames, minWeight, reverseFilter) {
    let skillWeights = getSkillWeights(getVacanciesList());

    return skillNames.filter(function (skillName) {
        let skillWeight = typeof (skillWeights[skillName]) !== 'undefined' ? skillWeights[skillName] : 0;
        if (reverseFilter === true) {
            return skillWeight < minWeight;
        }
        else {
            return skillWeight >= minWeight;
        }
    });
}

function includeBaseSkills(skillNames) {
    let baseSkills = getBaseProfessionSkillNames();
    let resultSkillNames = clone(skillNames);
    baseSkills.forEach(function (baseSkillName) {
        if (resultSkillNames.indexOf(baseSkillName) === -1) {
            resultSkillNames.push(baseSkillName);
        }
    });

    return resultSkillNames;
}

function excludeFromSkills(currentSkillNames, excludedSkillNames) {
    let resultSkillNames = [];
    currentSkillNames.forEach(function (skillName) {
        if (excludedSkillNames.indexOf(skillName) === -1) {
            resultSkillNames.push(skillName);
        }
    });

    return resultSkillNames;
}

function excludeBaseSkills(currentSkillNames) {
    let baseSkills = getBaseProfessionSkillNames();
    return excludeFromSkills(currentSkillNames, baseSkills);
}

function excludeDeletedSkills(currentSkillNames) {
    return excludeFromSkills(currentSkillNames, manualDeletedSkills);
}

function addManualSkills(currentSkillNames) {
    let resultSkillNames = clone(currentSkillNames);

    Object.keys(manualAddedSkills).forEach(function (manualSkillName) {
        let skillIndex = currentSkillNames.indexOf(manualSkillName);
        if (skillIndex !== -1) {
            resultSkillNames.splice(skillIndex, 1);
        }

        resultSkillNames.push(manualSkillName);
    });

    return resultSkillNames;
}

function excludeManualAddedSkills(currentSkillNames) {
    return excludeFromSkills(currentSkillNames, Object.keys(manualAddedSkills));
}

function countCompleted(skillNames, backpackSkills, neededSkills) {
    return skillNames.reduce(function (counter, skillName) {
        let currentLevel = typeof (backpackSkills[skillName]) !== 'undefined' ? backpackSkills[skillName] : 0;
        let neededLevel = typeof (neededSkills[skillName]) !== 'undefined' ? neededSkills[skillName] : 1;
        let isComplete = currentLevel >= neededLevel;

        if (isComplete) {
            counter++;
        }

        return counter;
    }, 0);
}

function updateResumeSkills() {
    let from = getAimFromTo().from;
    let to = getAimFromTo().to;
    let currentSkillsTo = from;
    let vacancies = getVacanciesList();
    let takeMinVacancy = true;
    let skipMinVacancy = !takeMinVacancy;

    let neededSkills = getSkillsForSalaryRange(from, to, vacancies, takeMinVacancy);
    neededSkills = overwriteSkillLevels(neededSkills, manualAddedSkills);

    let currentSkills = currentSkillsTo > 0
                            ? getSkillsForSalaryRange(0, currentSkillsTo, vacancies, skipMinVacancy)
                            : {};

    let mainSkillNames = filterByWeightMargin(Object.keys(neededSkills), 0.6);
    mainSkillNames = includeBaseSkills(mainSkillNames);
    mainSkillNames = excludeDeletedSkills(mainSkillNames);
    mainSkillNames = sortSkillsByCount(mainSkillNames);
    mainSkillNames = addManualSkills(mainSkillNames);

    let reverseFilter = true;
    let otherSkillNames = filterByWeightMargin(Object.keys(neededSkills), 0.6, reverseFilter);
    otherSkillNames = excludeBaseSkills(otherSkillNames);
    otherSkillNames = excludeDeletedSkills(otherSkillNames);
    otherSkillNames = excludeManualAddedSkills(otherSkillNames);
    otherSkillNames = sortSkillsByCount(otherSkillNames);

    let backpackSkills = getBackpackSkills();
    currentSkills = joinSkillLevels(currentSkills, backpackSkills);

    let mainSkillsHTML = mainSkillNames.map(function (skillName) {
        return getResumeSkillBadgeHTML(skillName, currentSkills, neededSkills);
    }).join("\n");

    let otherSkillsHTML = otherSkillNames.map(function (skillName) {
        return getResumeSkillBadgeHTML(skillName, currentSkills, neededSkills);
    }).join("\n");

    let totalMainSkills = mainSkillNames.length;
    let completedMainSkills = countCompleted(mainSkillNames, currentSkills, neededSkills);
    let incompletedMainSkills = totalMainSkills - completedMainSkills;

    let totalOtherSkills = otherSkillNames.length;
    let completedOtherSkills = countCompleted(otherSkillNames, currentSkills, neededSkills);
    let incompletedOtherSkills = totalOtherSkills - completedOtherSkills;

    $('.mainSkills').html( mainSkillsHTML );
    $('.otherSkills').html( otherSkillsHTML );

    $('.main-incomplete-count').text(incompletedMainSkills);
    $('.main-complete-count').text(completedMainSkills);
    $('.other-incomplete-count').text(incompletedOtherSkills);
    $('.other-complete-count').text(completedOtherSkills);
}

function search() {
    updateSlider();
    if (isSuccessShown()) {
        return;
    }

    $('.coursesList').css('opacity', '0.3');
    $('.coursesList').html('');

    let courses = findCourses( getCoursesFilter() );
    courses.forEach(function (course) {
        addCourse(course);
    });

    if (courses.length === 0) {
        $('.coursesList').append(
            "<div class='notFound-wrapper'><p class=\"h4 py-2\">Подходящие курсы не найдены</p>" +
            "<p class='mt-4'><button class='btn btn-primary search-finish'>Завершить подбор</button></p></div>"
        );
    }

    setTimeout(function () {
        $('.coursesList').attr('style', '');
    }, 200);

    updateSlider();
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

function getCourseLevelText(levelNumber) {
    let levelNames = ["сведения", "основы", "уверенный", "глубокий"];
    return levelNames[levelNumber];
}

function getLevelText(levelNumber) {
    let levelNames = ["не знаю", "основы", "уверенный", "глубокий"];
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
    let courseCount = getBackpack().length;
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

    getBackpack().forEach(function (course) {
        let courseHTML = getCourseBackpackCardHTML(course);
        $('#backpackPopupList, #backpackCollapseList').append(courseHTML);
    });

    updateBackpackCounters();
}

function addCourseToBackpack(course) {
    if (course) {
        pushToBackpack(course);
    }

    redrawBackpack();
    updateSkillCards();
    if (getBackpack().length > 0) {
        showBackpackSkillsAlert();
    }
    updateProgress();
    updateResumeSkills();
}

function initBackpack() {
    addCourseToBackpack(false);
}

function updateBackpackData() {
    let vacancies = findSoftVacancies(applyBackpackSkills(getSkillsFilter()));
    let allVacancies = getVacanciesList();
    let vacanciesPercent = Math.round(vacancies.length / allVacancies.length * 100);

    let totalPrice = getBackpack().reduce(function (prevPrice, course) {
        return prevPrice + course.price;
    }, 0);

    let totalDuration = getBackpack().reduce(function (prevDuration, course) {
        return prevDuration + getTimeInDays(course);
    }, 0);
    totalDuration = Math.ceil(totalDuration);

    $('.totalCount').text(getBackpack().length);
    $('.totalDuration').text(totalDuration);
    $('.totalCost').text(totalPrice);
    $('.vacanciesPercent').text(vacanciesPercent);
}

function hideBackpackSkillsAlert() {
    $('.navbar-alert').hide();
    $('.backpackSkillsLabel').hide();
}

function showBackpackSkillsAlert() {
    if ( useBackpackSkills() ) {
        $('.navbar-alert').show();
        $('.backpackSkillsLabel').show();
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

    getBackpack().map(function (course) {
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

function enableTooltips() {
    $('[data-toggle="tooltip"]').tooltip();
}

function isBackpackNotEmpty() {
    return getBackpack().length > 0;
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

function addCourseSkillsToFilter(courseId) {
    let course = getCourseById(courseId);
    if (!course) {
        return;
    }

    Object.keys(course.skills).forEach(function (skillName) {
        addCourseSkill(skillName);
    });

    updateResumeSkills();
}

function getGradeLabel(salary) {
    let salaryRange = getVacanciesSalaryRange(getVacanciesList());
    let juniorBorder = salaryRange.max/3;
    let seniorBorder = salaryRange.max*2/3;

    if (salary == 0) {
        return "с нуля";
    }

    if (salary < juniorBorder) {
        return "младший";
    }

    if (salary > seniorBorder) {
        return "старший";
    }

    return "средний";
}

function updateAimLabelsPosition($slider) {
    $('#handlePositionFrom, #handlePositionTo').remove();

    let $fromLabel = $slider.find('.irs-from');
    let $toLabel = $slider.find('.irs-to');
    let $singleLabel = $slider.find('.irs-single');

    let barWidth = $slider.find('.irs').outerWidth();
    let handleWidth = $slider.find('.irs-handle').outerWidth();
    let triangleWidth = 6;

    let sliderLeft = $slider.offset().left - handleWidth/2;
    let fromHandleLeft = $slider.find('.irs-handle.from').offset().left;
    let toHandleLeft = $slider.find('.irs-handle.to').offset().left;
    let magicShiftPx = 2;

    let fromLabelLeft = fromHandleLeft - $fromLabel.width()/2 - handleWidth/2 - sliderLeft + magicShiftPx;
    let toLabelLeft = toHandleLeft - $toLabel.width()/2 - handleWidth/2 - sliderLeft + magicShiftPx;

    let fromLabelLeftPercent = fromLabelLeft/barWidth * 100;
    let toLabelLeftPercent = toLabelLeft/barWidth * 100;

    if (fromLabelLeft < 0) {
        let triangleLeft = fromHandleLeft - triangleWidth/2 - sliderLeft + magicShiftPx;
        $(document.body).append('<style id="handlePositionFrom">.irs-from:before{left: ' + triangleLeft + 'px!important;}</style>');

        fromLabelLeft = 0;
        fromLabelLeftPercent = 0;
    }

    if (toLabelLeft + $toLabel.width() > window.outerWidth) {
        let triangleLeft = $toLabel.width() - magicShiftPx;
        $(document.body).append('<style id="handlePositionTo">.irs-to:before{left: ' + triangleLeft + 'px!important;}</style>');

        toLabelLeft = toHandleLeft - $toLabel.width();
        toLabelLeftPercent = toLabelLeft/barWidth * 100;
    }

    let fromLabelRight = fromLabelLeft + $fromLabel.width();

    if (fromLabelRight > toLabelLeft) {
        $fromLabel.css('visibility', 'hidden');
        $toLabel.css('visibility', 'hidden');
        $singleLabel.css('visibility', 'visible');
    } else
    {
        $fromLabel.css('visibility', 'visible');
        $toLabel.css('visibility', 'visible');
        $singleLabel.css('visibility', 'hidden');
    }

    $fromLabel.css('left', fromLabelLeftPercent+'%');
    $toLabel.css('left', toLabelLeftPercent+'%');
}

function updateLabels(from, to, $slider) {
    let $fromLabel = $slider.find('.irs-from');
    let $toLabel = $slider.find('.irs-to');
    let $singleLabel = $slider.find('.irs-single');
    let fromText = getGradeLabel(from);
    let toText = getGradeLabel(to);
    let singleText = ucfirst(fromText) + ' → ' + toText;

    if (fromText === toText) {
        singleText = ucfirst(fromText) + ' +' + aimPrettifyNumber(to - from) + ' к ЗП';
    }

    if (from === 0) {
        $fromLabel.text(ucfirst(fromText));
    } else {
        $fromLabel.text('Сейчас: ' + fromText);
    }
    $toLabel.text('В планах: '+toText);
    $singleLabel.text(singleText);

    updateAimLabelsPosition($slider);
}

function addCourseProgress() {
    let progressHTML = "<div class=\"progress aim-progress\">\n" +
        "  <div class=\"progress-bar bg-danger\" role=\"progressbar\" style=\"width: 0%\" aria-valuenow=\"0\" aria-valuemin=\"0\" aria-valuemax=\"100\">" +
        "    <span class='progress-label'>ЗП: 0 ₽</span>\n" +
        "  </div>\n" +
        "</div>";

    $('.aim-wrapper .irs-bar').append(progressHTML);
}

function aimPrettifyNumber(number) {
    if (number === 0) {
        return "ЗП: 0 ₽";
    }

    return Math.round(number/1000) + " тыс.";
}

function getAim() {
    let aimSelector = isMobile() ? '.mobile-aim' : '.desktop-aim';

    return $(aimSelector);
}

function getAimFromTo() {
    return {
        from: parseInt( getAim().val().split(';')[0] ),
        to: parseInt( getAim().val().split(';')[1] )
    }
}

function updateProgress(from, to) {
    let $label = $('.aim-wrapper .progress-label');
    let $progress = $('.aim-wrapper .progress-bar');

    if (!from) {
        from = getAimFromTo().from;
    }

    if (!to) {
        to = getAimFromTo().to;
    }

    let selectedCoursesSalary = getBackpack().reduce(function (total, selectedCourse) {
        return total + getCourseSalary(selectedCourse);
    }, 0);

    let maxIncrease = to - from;
    let percent = (selectedCoursesSalary / maxIncrease) * 100;

    if (percent > 100) {
        percent = 100;
        selectedCoursesSalary = maxIncrease;
    }

    $progress.css('width', percent+'%');
    $label.css('left', percent+'%');
    $label.text( aimPrettifyNumber(from + selectedCoursesSalary) );
}

function initAimSlider() {
    let salary = getVacanciesSalaryRange(getVacanciesList());

    let juniorMaxSalary = Math.floor(salary.max / 3000 ) * 1000;
    let toPosition = juniorMaxSalary - 1000;

    $('.aim').ionRangeSlider({
        skin: "round",
        type: "double",
        grid: true,
        min: 0,
        max: salary.max,
        from: 0,
        to: toPosition,
        step: 1000,
        prettify: aimPrettifyNumber,
        onChange: function (data) {
            updateLabels(data.from, data.to, $(data.slider));
            updateProgress(data.from, data.to);
            $('.progress-label').text('...');
        },
        onFinish: processInputChanges
    });

    updateLabels(0, toPosition, getAim().data('ionRangeSlider').result.slider);
    addCourseProgress();

    updateResumeSalary();
    updateResumeSkills();
}

function getSkillWeights(vacancies) {
    let skillsCount = getSkillCount(vacancies);

    let maxCount = Object.keys(skillsCount).reduce(function (prevMaxCount, skillName) {
        let skillCount = skillsCount[skillName] || 0;
        if (skillCount > prevMaxCount) {
            return skillCount;
        }

        return prevMaxCount;
    }, 0);

    let skillWeights = Object.keys(skillsCount).reduce(function (weightAggregator, skillName) {
        weightAggregator[skillName] = skillsCount[skillName] / maxCount;
        return weightAggregator;
    }, {});

    return skillWeights;
}

function getWeightenedSkillsCountForSalary(skills, vacancies) {
    let skillWeights = getSkillWeights(vacancies);

    let weightenedCount = Object.keys(skills).reduce(function (countAggregator, skillName) {
        let skillWeight = skillWeights[skillName] || 0;
        return countAggregator + skillWeight;
    }, 0);

    return weightenedCount;
}

function getCourseSalary(course, from, to, vacancies) {
    if (!from) {
        from = getAimFromTo().from;
    }

    if (!to) {
        to = getAimFromTo().to;
    }

    if (!vacancies) {
        vacancies = getVacanciesList();
    }

    let takeMinVacancy = true;
    let skillsForRange = getSkillsForSalaryRange(from, to, vacancies, takeMinVacancy);

    let vacanciesInRange = getVacanciesInRange(from, to, vacancies, takeMinVacancy);
    let neededSkillsCount = getWeightenedSkillsCountForSalary(skillsForRange, vacanciesInRange);
    let courseSkillsCount = getWeightenedSkillsCountForSalary(course.skills, vacanciesInRange);

    return courseSkillsCount/neededSkillsCount * (to-from);
}

function processInputChanges() {
    updateFilterCounter();
    updateProgress();
    updateResumeSalary();
    updateResumeSkills();
    search();
}

function highlightTopNavButtons(clickedButton) {
    let $button = $(clickedButton);
    $button.addClass('active');

    if ($button.data('class') === "secondary") {
        $button
            .toggleClass('btn-secondary')
            .toggleClass('btn-outline-secondary');
    }
    else {
        $button
            .toggleClass('btn-primary')
            .toggleClass('btn-success');
    }
}

function showSkillList() {
    $('.resume-btn').trigger('click');
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
    initAimSlider();
    initBackpack();

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
            if (getBackpack().length > 0) {
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

    $(document).on('click', '[data-skill]:not(.resumeSkill)', function () {
        let skillName = $(this).attr('data-skill');
        addCourseSkill(skillName);
        updateFilterCounter();
        updateResumeSkills();
    });

    $(document).on('change', '.skillSelect', function () {
        let skillName = $(this).val();
        if (skillName) {
            addCourseSkill(skillName);
        }

        updateResumeSkills();
    });

    $(document).on('click', '.resumeSkill .fa-trash-alt', function () {
        let $trigger = $(this).closest('.resumeSkill');
        let skillName = $trigger.data('skill');

        deleteCourseSkill(skillName);
        updateFilterCounter();
        updateResumeSkills();
        search();
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
        updateResumeSkills();
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
    });

    $(document).on('change input click', 'input:not(#allSkills input, #emailField, .aim)', function () {
        $('.filter-btn').removeClass('btn-outline-secondary').addClass('btn-primary');
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

    $(document).on('click', '.navbar .btn:not(.filter-btn, .resume-btn)', function () {
        highlightTopNavButtons(this);
    });

    $(document).on('click', '.filter-btn, .resume-btn', function () {
        let $button = $(this);
        let isFilterButtonClicked = $button.hasClass('filter-btn');
        let $filterPanel = $('#filterCollapse');
        let panelNeedsCollapse = $button.hasClass('active');

        highlightTopNavButtons(this);

        $filterPanel.collapse('show');
        if (isFilterButtonClicked) {
            $('.resume-btn')
                .removeClass('active')
                .removeClass('btn-success')
                .addClass('btn-primary');
            $('#resumeCollapse_0').collapse('hide');
            $('#filterFieldsCollapse_0').collapse('show');
        }
        else {
            $('.filter-btn')
                .removeClass('active')
                .removeClass('btn-secondary')
                .addClass('btn-outline-secondary');
            $('#resumeCollapse_0').collapse('show');
            $('#filterFieldsCollapse_0').collapse('hide');
        }

        if (panelNeedsCollapse) {
            $filterPanel.collapse('hide');
            $('.navbar .btn').removeClass('active');
            $('.resume-btn').removeClass('btn-success').addClass('btn-primary');
            $('.filter-btn').removeClass('btn-secondary').addClass('btn-outline-secondary');
        }
    });

    $(document).on('click', '.toggle-skills', showSkillList);

    $(document).on('click', '.filter-apply', function (event) {
        event.preventDefault();
        processInputChanges();
        $('.filter-btn').removeClass('btn-primary').addClass('btn-outline-secondary');
    });

    $(document).on('click', '.editable-text', function () {
        let $trigger = $(this);
        let $container = $trigger.closest('.editable-wrapper');
        let $input = $container.find('input, select');
        let $text = $container.find('.editable-text');
        let currentValue = $text.text();

        if ($text.hasClass('salary')) {
            currentValue = parseInt(currentValue);
        }

        if ($text.hasClass('exp')) {
            if (currentValue === "менее 1 года") {
                currentValue = 0;
            }
            else {
                currentValue = parseInt(currentValue);
            }
        }

        $input.val(currentValue);
        $container.addClass('editing');
    });

    $(document).on('click', '.editable-wrapper button', function () {
        let $button = $(this);
        let $container = $button.closest('.editable-wrapper');
        let $input = $container.find('input, select');
        let $text = $container.find('.editable-text');
        let newValue = $input.val();

        if ($text.hasClass('salary')) {
            let slider = getAim().data('ionRangeSlider');
            slider.update({to: newValue});
            let aimData = getAimFromTo();
            updateLabels(aimData.from, aimData.to, $(slider.result.slider));
            updateProgress(aimData.from, aimData.to);
            processInputChanges();
            newValue += ' руб';
        }

        if ($text.hasClass('exp')) {
            if (newValue === "0") {
                newValue = "менее 1 года";
            }
            else {
                newValue += " " + declensionUnits(newValue, 'год');
            }
        }

        $text.text(newValue);
        $container.removeClass('editing');
    });
});
