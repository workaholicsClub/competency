function getSkillLevels() {
    return ['Сведения', 'Основы', 'Уверенный', 'Глубокий'];
}

function addSkill(skillName, skillLevel, autoSearch) {
    let selectedSkills = getSelectedSkillNames();
    let isSelected = selectedSkills.indexOf(skillName) !== -1;
    let skillLevelDefined = (typeof (skillLevel) === "string" || typeof (skillLevel) === "number") && skillLevel !== "Текущий уровень";
    let colorClass = skillLevelDefined ? "alert-primary" : "alert-danger";

    if (isSelected) {
        return;
    }

    let skillHTML = "<div class=\"alert " + colorClass + " d-flex justify-content-between skillBlock\" role=\"alert\" data-name=\""+skillName+"\">\n" +
        "    <div class=\"levelHeaderContainer\">\n" +
        "       <h4 class=\"alert-heading\">"+skillName+"</h4>\n" +
        "       <button type=\"button\" class=\"close align-self-start\" data-dismiss=\"alert\">×</button>\n" +
        "    </div>\n" +
        "    <select class=\"custom-select skillSlider\">\n" +
        "       <option "+(skillLevelDefined?"":"selected")+">Текущий уровень</option>\n" +
                getSkillLevels().map(function (skillText, index) {
                    let isSelected = skillLevel === index.toString();
                    return "       <option value="+index+" "+(isSelected?"selected":"")+">"+skillText+"</option>\n";
                }).join("\n") +
        "    </select>\n" +
        "</div>\n";

    $('.skillContainer').prepend(skillHTML);

    if (autoSearch !== false) {
        toggleAdditionalSkills();
        toggleUpdatableSkills();
        updateSkillLists();
        search();
    }
}

function clearVacanciesList() {
    $('.vacancyList').html('');
}

function getSkillsFilter() {
    let filterContainer = isMobile() ? "#filterCollapse" : "#filterDesktop";
    let skillsData = {};

    $(filterContainer + ' .skillBlock').each(function () {
        let skillName = $(this).find('h4').text();
        let skillLevel = parseInt( $(this).find('select').val() ) || 0;

        skillsData[skillName] = skillLevel;
    });

    return skillsData;
}

function getCheckedValues(code) {
    return $("[data-code='"+code+"']:checked")
        .map(function () {
            return $(this).val();
        })
        .get();
}

function getBooleanCheckedValues(code) {
    return $("[data-code='"+code+"']:checked")
        .map(function () {
            return $(this).val() === 'true';
        })
        .get();
}

function getBooleanValue(code) {
    return getBooleanCheckedValues(code)[0] || false;
}

function getVacanciesFilter() {
    let fieldIndex = isMobile() ? "0" : "1";

    return {
        skills: getSkillsFilter(),
        salaryFrom: parseInt($('#from_' + fieldIndex).val()) || 0,
        salaryTo: parseInt($('#to_' + fieldIndex).val()) || 0,
        city: getCheckedValues('city'),
        fullTime: getBooleanValue('fullTime'),
        flexibleSchedule: getBooleanValue('flexibleSchedule'),
        probation: getBooleanValue('probation'),
        officialEmployment: getBooleanValue('officialEmployment'),
        canBeRemote: getBooleanValue('canBeRemote'),
        training: getBooleanValue('training'),
        food: getBooleanValue('food'),
        insurance: getBooleanValue('insurance'),
        sportAndFitness: getBooleanValue('sportAndFitness'),
        communicationsCompensation: getBooleanValue('communicationsCompensation'),
        sickLeaveCompensation: getBooleanValue('sickLeaveCompensation'),
        vacationCompensation: getBooleanValue('vacationCompensation'),
        dressCode: getBooleanValue('dressCode'),
        relocationHelp: getBooleanValue('relocationHelp')
    };
}

function getSelectedSkillNames() {
    return Object.keys(getSkillsFilter());
}

function getVacancySkillLevel(vacancy, skillName) {
    return vacancy.skills.reduce(function (level, skillData) {
        if (skillData.title === skillName) {
            level = skillData.level;
        }

        return level;
    }, false);
}

function intersectArrays(array1, array2) {
    return array1.filter(value => -1 !== array2.indexOf(value));
}

function matchVacancySkills(vacancy, filter) {
    let isSkillMatching = true;
    let vacancySkillNames = getVacancySkillNames(vacancy);
    let skillsFilterEmpty = Object.keys(filter.skills).length === 0;

    if (skillsFilterEmpty) {
        return false;
    }

    vacancySkillNames.forEach(function (skillName) {
        let isInFilter = typeof filter.skills[skillName] !== 'undefined';
        let levelMatches = isInFilter && getVacancySkillLevel(vacancy, skillName) <= filter.skills[skillName];
        isSkillMatching = isSkillMatching && levelMatches;
    });

    return isSkillMatching;
}

function matchVacancy(vacancy, filter) {
    let filteredEnumProps = ['fullTime', 'flexibleSchedule', 'probation', 'officialEmployment', 'canBeRemote', 'training', 'food', 'insurance', 'sportAndFitness', 'communicationsCompensation', 'sickLeaveCompensation', 'vacationCompensation', 'dressCode', 'relocationHelp'];

    let propsMatch = filteredEnumProps.reduce(function (prevPropsMatch, propName) {
        let filterValues = filter[propName];
        let vacancyValue = vacancy[propName];
        let propMatches;

        if (vacancyValue instanceof Array) {
            propMatches = intersectArrays(filterValues, vacancyValue).length > 0;
        }
        else {
            propMatches = (filterValues === true && vacancyValue === true) || filterValues === false;
        }

        return prevPropsMatch && propMatches;
    }, true);

    let salaryFromMatches = (vacancy.salary.from > 0 && filter.salaryFrom <= vacancy.salary.from) || vacancy.salary.from == 0;
    let salaryToMatches = (vacancy.salary.to > 0 && filter.salaryTo >= vacancy.salary.to) || vacancy.salary.to == 0;
    let salaryMatches = salaryFromMatches && salaryToMatches;

    let cityMatches = filter.city.length === 0 || filter.city.reduce(function (matches, city) {
        return matches || vacancy.city.indexOf(city) !== -1;
    }, false);

    let vacancyMatches = propsMatch && salaryMatches && cityMatches;

    return vacancyMatches;
}

function softMatchVacancy(vacancy, filter) {
    let matchingSkills = getMatchingSkills(vacancy, filter);
    let isMatching = matchingSkills.length > 0;

    return isMatching;
}

function getMatchingSkills(vacancy, filter) {
    let vacancySkillNames = getVacancySkillNames(vacancy);
    let matchingSkills = [];

    vacancySkillNames.forEach(function (skillName) {
        let isInFilter = typeof filter[skillName] !== 'undefined';
        let levelMatches = isInFilter && getVacancySkillLevel(vacancy, skillName) <= filter[skillName];

        if (levelMatches) {
            matchingSkills.push(skillName);
        }
    });

    return matchingSkills;
}

function getUnmatchingSkills(vacancy, filter) {
    let vacancySkillNames = getVacancySkillNames(vacancy);
    let unmatchingSkills = [];

    vacancySkillNames.forEach(function (skillName) {
        let isInFilter = typeof filter[skillName] !== 'undefined';
        let levelNotMatches = isInFilter && getVacancySkillLevel(vacancy, skillName) > filter[skillName];

        if (levelNotMatches) {
            unmatchingSkills.push(skillName);
        }
    });

    return unmatchingSkills;
}

function getUndefinedSkills(vacancy, filter) {
    let vacancySkillNames = getVacancySkillNames(vacancy);
    let undefinedSkills = [];

    vacancySkillNames.forEach(function (skillName) {
        let isNotInFilter = typeof filter[skillName] === 'undefined';

        if (isNotInFilter) {
            undefinedSkills.push(skillName);
        }
    });

    return undefinedSkills;
}

function getMatchRating(vacancy, filter) {
    let vacancySkillNames = getVacancySkillNames(vacancy);
    let matchingSkillsCount = getMatchingSkills(vacancy, filter).length;
    let unmatchingSkillsCount = getUnmatchingSkills(vacancy, filter).length;
    let skillsCount = vacancySkillNames.length;

    //return (matchingSkillsCount - unmatchingSkillsCount * 0.5) / skillsCount;
    return matchingSkillsCount * 100000 - unmatchingSkillsCount * 10000 + 100/skillsCount;
}

function findVacancies(filter) {
    return getVacanciesList()
        .filter(function (vacancy) {
            return matchVacancy(vacancy, filter) && matchVacancySkills(vacancy, filter);
        });
}

function findSoftVacancies(filter) {
    return getVacanciesList()
        .filter(function (vacancy) {
            return softMatchVacancy(vacancy, filter);
        });
}

function findParticialMacth(filter) {
    let vacanices = JSON.parse( JSON.stringify(getVacanciesList()) ).map(function (vacancy) {
        vacancy.rating = getMatchRating(vacancy, filter);
        return vacancy;
    });

    return vacanices
        .filter(function (vacancy) {
            return matchVacancy(vacancy, filter);
        })
        .filter(function (vacancy) {
            let isNotInRecommendedList = !matchVacancySkills(vacancy, filter);
            return isNotInRecommendedList;
        })
        .sort(function (vacancyA, vacancyB) {
            let ratingA = vacancyA.rating;
            let ratingB = vacancyB.rating;

            if (ratingA > ratingB) {
                return -1;
            }

            if (ratingA < ratingB) {
                return 1;
            }

            return 0;
        });
}

function search() {
    updateSlider();
    toggleSkillsResult();
    clearVacanciesList();

    let recommendedVacancies = findVacancies(getVacanciesFilter());

    if (recommendedVacancies.length > 0) {
        $('.noRecommendedVacancies').hide();
        recommendedVacancies
            .forEach(function (vacancy, index) {
                addVacancy(vacancy, index, '.vacancyList', true);
            });
    }
    else {
        $('.noRecommendedVacancies').show();
    }


    findParticialMacth(getVacanciesFilter())
        .forEach(function (vacancy, index) {
            addVacancy(vacancy, index, '#desktopList', false);
            addVacancy(vacancy, index, '#mobileList', false, 'm');
        });

    $('.searchResults').css('opacity', '0.3');
    setTimeout(function () {
        $('.searchResults').attr('style', '');
        updateSlider();
    }, 2000);
}

function toggleSkillsResult() {
    let areVacanciesFound = findParticialMacth(getVacanciesFilter()).length > 0;

    if (areVacanciesFound) {
        $('.noVacanciesFound').hide();
        $('.searchResults').show();
    }
    else {
        $('.noVacanciesFound').show();
        $('.searchResults').hide();
    }
    toggleAdditionalSkills();
}

function toggleUpdatableSkills() {
    if (hasUpdatableSkills()) {
        updateUpdatableSkills();
        $('.updateSkills').show();
    }
    else {
        $('.updateSkills').hide();
    }
}

function hasUpdatableSkills() {
    return getUpdatableSkillList().length > 0;
}

function removeSkills(allSkills, removedSkills) {
    if (!allSkills) {
        return allSkills;
    }

    let filteredSkills = allSkills.filter(function (skillName) {
        return removedSkills.indexOf(skillName) === -1;
    });
    return filteredSkills;
}

function removeSelectedSkills(allSkills) {
    return removeSkills(allSkills, getSelectedSkillNames());
}

function updateUpdatableSkills() {
    let updatableSkills = getUpdatableSkillList();

    $('.updateSkillsContainer').html('');

    if (updatableSkills.length === 0) {
        return;
    }

    updatableSkills.forEach(function (skillName) {
        $('.updateSkillsContainer').append('<span data-skill="'+skillName+'">'+skillName+'</span>');
    });
}

function updateAdditionalSkills(additionalSkills) {
    let shownAdditionalSkills = removeSelectedSkills(additionalSkills);

    $('.addSkillsContainer').html('');

    if (!shownAdditionalSkills ) {
        return;
    }

    if (shownAdditionalSkills.length === 0) {
        return;
    }

    shownAdditionalSkills.forEach(function (skillName) {
        $('.addSkillsContainer').append('<span data-skill="'+skillName+'">'+skillName+'</span>');
    });
}

function updateAllSkills() {
    let filteredSkills = removeSelectedSkills( getSkills(getVacanciesList()) );

    $('#allSkills').html('');
    if (filteredSkills && filteredSkills.length === 0) {
        return;
    }

    addAllSkills( filteredSkills );
}

function getMinNeededSkills() {
    return removeSelectedSkills( getNeededSkills(getVacanciesList(), 1) );
}

function hasSkillsWithoutLevels() {
    return $('.skillContainer .alert-danger.skillBlock').length > 0;
}

function updateStartSkills() {
    let filteredSkills = getMinNeededSkills();
    $('#startSkills').html('');

    if (filteredSkills.length === 0) {
        let neededVacancies = 2;
        let neededSkills = removeSelectedSkills( getNeededSkills(getVacanciesList(), neededVacancies) );
        let hasNoNeededSkills = neededSkills.length === 0;
        if (hasNoNeededSkills) {
            neededVacancies++;
            neededSkills = removeSelectedSkills( getNeededSkills(getVacanciesList(), neededVacancies) );
        }

        let $textContainer = $('#startSkills').closest(".col-md-8").find('p');
        $textContainer.text('Пожалуйста, укажите уровень владения выбранными навыками');


        if (hasSkillsWithoutLevels()) {
            $('#startSearch:visible').hide();
            $('#startSkills').hide();
        }
        else {
            $('#startSkills').show();
        }


        addNeededSkills( neededSkills );
        addStartSkills( neededSkills );
    }
    else {
        addStartSkills( filteredSkills );
    }
}

function updateMinSkills() {
    let minSkills = getMinNeededSkills();
    $('#minSkills').html('');

    if (minSkills.length === 0) {
        return;
    }

    addMinSkills( minSkills );
}

function updateSkillLists() {
    updateAllSkills();
    updateMinSkills();
    updateStartSkills();
    updateAdditionalSkills();
    updateUpdatableSkills();
}

function getAdditionalSkills() {
    let foundVacanciesCount = findVacancies(getVacanciesFilter()).length;
    let selectedSkills = getSelectedSkillNames();
    let neededSkills = getNeededSkills(getVacanciesList(), foundVacanciesCount + 1);

    let allAdditionalSkills = [];
    neededSkills.forEach(function (skillName) {
        let skillNotSelected = selectedSkills.indexOf(skillName) === -1;
        if (skillNotSelected) {
            allAdditionalSkills.push(skillName);
        }
    });

    return allAdditionalSkills;
}

function toggleAdditionalSkills(allAdditionalSkills) {
    if (!allAdditionalSkills) {
        allAdditionalSkills = getAdditionalSkills();
    }
    addSkillsToVacancyPopup(allAdditionalSkills);
}

function getVacancySkillNames(vacancy) {
    return vacancy.skills.reduce(function (skillNames, skillData) {
        skillNames.push(skillData.title);
        return skillNames;
    }, []);
}

function getMinimalSkills(vacancies) {
    let skillMinLevelData = {};

    vacancies.forEach(function (vacancy) {
        let skillNames = getVacancySkillNames(vacancy);
        skillNames.forEach(function (skillName) {
            let isNotSet = typeof skillMinLevelData[skillName] === 'undefined';
            let isLevelHigher = skillMinLevelData[skillName] > getVacancySkillLevel(vacancy, skillName);

            if (isNotSet || isLevelHigher) {
                skillMinLevelData[skillName] = getVacancySkillLevel(vacancy, skillName);
            }
        });
    });

    return skillMinLevelData;
}

function countAdditionalVacanciesOnSkillUpdate(vacancies, filter, testSkillName) {
    let maximumLevel = 3;
    let currentLevel = filter[testSkillName];
    let maxFilter = $.extend({}, filter);
    Object.keys(maxFilter.skills).forEach(function (skillName) {
        maxFilter.skills[skillName] = maximumLevel;
    });

    let currentVacancies = findVacancies(filter);
    let currentCount = currentVacancies.length;
    let maxVacancies = findVacancies(maxFilter);
    let maxCount = maxVacancies.length;

    let additionalVacancies = maxVacancies.filter(function (maxVacancy) {
        let notFoundInCurrent = currentVacancies.reduce(function (found, currentVacancy) {
            return found && maxVacancy.id !== currentVacancy.id;
        }, true);

        return notFoundInCurrent;
    });

    let minSkills = getMinimalSkills(additionalVacancies);

    let levelLowerMin = currentLevel < minSkills[testSkillName];

    if (currentCount < maxCount && levelLowerMin) {
        return maxCount - currentCount;
    }

    return 0;
}

function getUpdatableSkillList() {
    let filter = getVacanciesFilter();
    let vacancies = getVacanciesList();
    let updatableSkills = [];

    $('.skillBlock').each(function () {
        let skillName = $(this).find('h4').text();
        let additionalVacancies = countAdditionalVacanciesOnSkillUpdate(vacancies, filter, skillName);

        if (additionalVacancies > 0) {
            updatableSkills.push(skillName);
        }
    });

    return updatableSkills;
}

function addStartSkills(startSkills) {
    addSkillsToList(startSkills, '#startSkills');
}

function addNeededSkills(neededSkills) {
    addSkillsToList(neededSkills, '#updatedSkills');
}

function addSkillsToList(skillNames, selector) {
    let skillsHtml = [];

    skillNames.forEach(function (startSkill) {
        skillsHtml.push('<a href="#" class="dashedLink" data-skill="'+startSkill+'">'+startSkill+'</a>');
    });

    $(selector).html( skillsHtml.join(', ') );
}

function setupSlider() {
    let slider = new Swiper ('.swiper-container', {
        direction: 'horizontal',
        loop: false,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            type: 'fraction'
        },
        on: {
            init: function () {
                window.scrollTo(0,0);
            },
            slideChange: function () {
                let isFirst = this.isBeginning;
                let isLast = this.isEnd;

                $('.fraction-bullet').removeClass('active');

                if (isFirst && !isLast) {
                    $('.fraction-bullet').first().addClass('active');
                }

                if (isLast && !isFirst) {
                    $('.fraction-bullet').last().addClass('active');
                }

                if (!isFirst && !isLast) {
                    $('.fraction-bullet:eq(1)').addClass('active');
                }

                window.scrollTo(0,0);
            }
        }
    });

    return slider;
}

function updateSlider() {
    if (!window.slider) {
        return;
    }

    window.slider.update();
}

function sortSkillsByAlphabet(allSkills) {
    return allSkills.sort(function (first, second) {
        return first.localeCompare(second);
    })
}

function sortSkillsByCount(allSkills) {
    let skillsCount = getSkillCount(getVacanciesList());

    return allSkills.sort(function (first, second) {
        let firstCount = skillsCount[first];
        let secondCount = skillsCount[second];

        if (firstCount > secondCount) {
            return -1;
        }

        if (firstCount < secondCount) {
            return 1;
        }

        return 0;
    });
}

function addSkillToPopup(allSkills, selector) {
    let skillsHtml = [];
    let sortType = $('#sortSelect').val();
    let sortByCount = sortType === 'jobCount';
    let skillsCount = getSkillCount(getVacanciesList());
    let sortedSkills = sortByCount
        ? sortSkillsByCount(allSkills)
        : sortSkillsByAlphabet(allSkills);

    sortedSkills.forEach(function (skill, index) {
        let skillCount = skillsCount[skill] || 0;
        let vacanciesPercent = Math.round(skillCount/getVacanciesList().length * 100);
        let firstLetter = skill.slice(0,1).toLocaleUpperCase();
        let countText = sortByCount
            ? vacanciesPercent + '%'
            : firstLetter;

        let itemHTML =
            "<div class=\"list-group-item list-group-item-action\" data-name=\""+skill+"\">\n" +
            "    <form class=\"form-inline skill-form\">\n" +
            "        <div class=\"form-group col-1 mb-0\">\n" +
            "            <div class=\"form-check\">\n" +
            "                <input class=\"form-check-input\" type=\"checkbox\" value=\"\" id=\"check"+index+"\">\n" +
            "            </div>\n" +
            "        </div>\n" +
            "        <div class=\"form-group col-5 mb-0\">\n" +
            "            <label class=\"form-check-label\">\n" +
            "                "+skill+"\n" +
            "            </label>\n" +
            "        </div>\n" +
            "        <div class=\"form-group col-5 mb-0 px-0\">\n" +
            "        <select class=\"custom-select\">\n" +
            "           <option selected value=0>Сведения</option>\n" +
            "           <option value=1>Основы</option>\n" +
            "           <option value=2>Уверенный</option>\n" +
            "           <option value=3>Глубокий</option>\n" +
            "        </select>\n" +
            "        </div>\n" +
            "        <div class=\"form-group col-1 mb-0\">\n" +
            "            <span class=\"badge badge-primary\">"+countText+"</span>\n" +
            "        </div>\n" +
            "    </form>\n" +
            "</div>";

        skillsHtml.push(itemHTML);
    });

    $(selector).html( skillsHtml.join('') );
}

function getVacancyById(vacancyId) {
    return getVacanciesList().reduce(function (result, currentVacancy) {
        return vacancyId === currentVacancy.id
            ? currentVacancy
            : result;
    }, false);
}

function addSkillsToVacancyPopup(customSkills) {
    let skillsHtml = [];

    customSkills.forEach(function (skill, index) {
        let itemHTML =
            "<div class=\"list-group-item list-group-item-action\" data-name=\""+skill+"\">\n" +
            "    <form class=\"form-inline skill-form\">\n" +
            "        <div class=\"form-group col-7 mb-0\">\n" +
            "            <label class=\"form-check-label\" for=\"check"+index+"\">\n" +
            "                "+skill+"\n" +
            "            </label>\n" +
            "        </div>\n" +
            "        <div class=\"form-group col-5 mb-0 px-0\">\n" +
            "        <select class=\"custom-select\">\n" +
            "           <option selected value=0>Сведения</option>\n" +
            "           <option value=1>Основы</option>\n" +
            "           <option value=2>Уверенный</option>\n" +
            "           <option value=3>Глубокий</option>\n" +
            "        </select>\n" +
            "        </div>\n" +
            "    </form>\n" +
            "</div>";

        skillsHtml.push(itemHTML);
    });

    $("#selectedVacancySkills").html( skillsHtml.join('') );
}

function addAllSkills(allSkills) {
    addSkillToPopup(allSkills, '#allSkills');
}

function addMinSkills(allSkills) {
    addSkillToPopup(allSkills, '#minSkills');
}

function getSalaryHtml(vacancy) {
    if (vacancy.salary) {
        if (vacancy.salary.from && vacancy.salary.to) {
            return "от " + vacancy.salary.from + " до " + vacancy.salary.to + " руб";
        }

        if (!vacancy.salary.from) {
            if (vacancy.salary.to) {
                return "до " + vacancy.salary.to + " руб";
            }
            else {
                return 'заработная плата не указана';
            }
        }
        else {
            return "от " + vacancy.salary.from + " руб";
        }
    }

    return 'Заработная плата<br>не указана';
}

function isForNewbies(vacancy) {
    let vacancies = getVacanciesList();
    let skillsCount = vacancy.skills.length;

    let minSkillsCount = vacancies.reduce(function (count, enumVacancy) {
        if (enumVacancy.skills.length < count) {
            return enumVacancy.skills.length;
        }

        return count;
    }, skillsCount);

    let maxLevel = vacancy.skills.reduce(function (maxLevel, skillData) {
        if (skillData.level > maxLevel) {
            return skillData.level;
        }

        return maxLevel;
    }, 0);

    return (skillsCount - minSkillsCount <= 2) && (maxLevel <= 1);
}

function getAttributesHtml(vacancy) {
    let attributes = [
        vacancy.city,
    ];
    
    if (isForNewbies(vacancy)) {
        attributes.push('Для новичков');
    }

    let attrData = {
        fullTime: 'Полный день',
        flexibleSchedule: 'Гибкий график',
        probation: 'Испытательный срок',
        officialEmployment: 'Соблюдение ТК',
        canBeRemote: 'Возможна удаленка',
        training: 'Обучение',
        food: 'Питание',
        insurance: 'ДМС',
        sportAndFitness: 'Спорт',
        communicationsCompensation: 'Оплата связи',
        sickLeaveCompensation: 'Оплата больничных',
        vacationCompensation: 'Оплата отпуска',
        dressCode: 'Дресс-код',
        relocationHelp: 'Помощь с релокацией'
    };

    Object.keys(attrData).forEach(function (attrName) {
        if (vacancy[attrName] === true) {
            attributes.push(attrData[attrName]);
        }
    });

    return attributes.join(" • ");
}

function getSkillsHtml(vacancy) {
    let filter = getSkillsFilter();
    let matchingSkills = getMatchingSkills(vacancy, filter);
    let undefinedSkills = getUndefinedSkills(vacancy, filter);
    let unmatchingSkills = getUnmatchingSkills(vacancy, filter);

    let matchingSkillsHtml = matchingSkills.map(function (skillName) {
        return '<span class="badge badge-success" data-toggle="tooltip" title="Подходит под требования">'+skillName+'</span>';
    });

    let unmatchingSkillsHtml = unmatchingSkills.map(function (skillName) {
        return '<span class="badge badge-danger" data-toggle="tooltip" title="Не соответствует требованиям">'+skillName+'</span>';
    });

    let undefinedSkillsHtml = undefinedSkills.map(function (skillName) {
        return '<a href="#" class="badge badge-secondary" data-skill="'+skillName+'" data-toggle="tooltip" title="Текущий уровень не определен">'+skillName+'</a>';
    });

    return matchingSkillsHtml.join("\n") + "\n" + unmatchingSkillsHtml.join("\n") + "\n" + undefinedSkillsHtml.join("\n");
}

function addVacancy(vacancy, index, selector, isRecommended, suffix) {
    let desciptionHtml = vacancy.description.replace(/\n/g, '<br>');
    let additionalClass = isRecommended ? 'alert-warning' : '';
    let hasNoUndefinedSkills = getUndefinedSkills(vacancy, getSkillsFilter()).length === 0;
    let canSendResume = isRecommended || hasNoUndefinedSkills;
    let company = vacancy.company && vacancy.company !== '-' ? vacancy.company : 'Работодатель не указан';

    let buttonHtml = canSendResume
        ? "<a href=\"" + vacancy.url + "\" target=\"_blank\" class=\"btn btn-primary btn-block go-to-vacancy\" data-vacancy-id=\""+vacancy.id+"\"><i class=\"fas fa-external-link-square-alt\"></i>&nbsp;Отправить резюме</a>"
        : "<a href=\"#\" class=\"btn btn-primary d-flex justify-content-center addVacancySkillsButton\" data-toggle=\"modal\" data-target=\"#addVacancySkillsModal\">Указать навыки, чтобы откликнуться</a>\n";

    let outdateWarning = "<div class=\"alert alert-danger\">Вакансия устарела</div>";
    let recommendMessage = "<div class=\"alert bg-warning\">Подходит для вас</div>";

    let outdateDate = new Date(vacancy.dateCreate);
    outdateDate.setMonth( outdateDate.getMonth() + 1 );
    let now = new Date;

    let isOutdated = now > outdateDate;

    let visitButtonHTML = "<a href=\"" + vacancy.url + "\" target=\"_blank\" class=\"btn btn-primary btn-block go-to-vacancy mt-1\" data-vacancy-id=\""+vacancy.id+"\"><i class=\"fas fa-external-link-square-alt\"></i>&nbsp;Перейти на страницу вакансии</a>";

    let vacancyHtml = "<div class=\"swiper-slide vacancy-card\" data-vacancy-id='"+vacancy.id+"'>"+
        "   <div class=\"card-body "+additionalClass+"\">\n" +
                (isOutdated ? outdateWarning : "") +
                (isRecommended ? recommendMessage : "") +
        "       <h4>"+vacancy.title+"</h4>\n" +
        "       <h6 class=\"text-muted\">" +getSalaryHtml(vacancy)+ "</h6>\n" +
        "       <h6 class=\"text-muted\">"+company+"</h6>\n" +
        "       <p>"+getAttributesHtml(vacancy)+"</p>\n" +
                (vacancy.candidatesPerPlace ? "<p>Конкурс: ~"+vacancy.candidatesPerPlace+" чел/место</p>\n" : "") +
        "       <p class=\"mb-0\">Требования:</p>\n" +
        "       <p>"+getSkillsHtml(vacancy)+"</p>\n" +
        "       <button class=\"btn btn-outline-secondary btn-block dropdown-toggle mb-3\" data-toggle=\"collapse\" data-target=\"#description" + index + suffix +"\" aria-expanded=\"true\" aria-controls=\"description" + index + suffix +"\">\n" +
        "           Описание вакансии\n" +
        "       </button>\n" +
        "       <p id=\"description" + index + suffix + "\" class=\"collapse\">\n" + desciptionHtml + "</p>\n" +
        buttonHtml +
        "   </div>"+
        "</div>";

    $(selector).append(vacancyHtml);
}

function findVacanciesBySkillNames(vacancies, skillNames) {
    let foundVacancies = vacancies.filter(function (vacancy) {
        let vacancySkills = getVacancySkillNames(vacancy);

        let missingSkills = vacancySkills.filter(function (skillName) {
            return skillNames.indexOf(skillName) === -1;
        });

        return missingSkills.length === 0;
    });

    return foundVacancies;
}

function getSkills(vacancies) {
    return vacancies.reduce(function (allSkills, vacancy) {
        let skillNames = getVacancySkillNames(vacancy);

        skillNames.forEach(function (skillName) {
            if (allSkills.indexOf(skillName) === -1) {
                allSkills.push(skillName);
            }
        });

        return allSkills;
    }, []);
}

function getSkillCount(vacancies) {
    let skillCountData = {};

    vacancies.forEach(function (vacancy) {
        let skillNames = getVacancySkillNames(vacancy);
        skillNames.forEach(function (skillName) {
            if (typeof skillCountData[skillName] === 'undefined') {
                skillCountData[skillName] = 0;
            }

            skillCountData[skillName] += 1;
        });
    });

    return skillCountData;
}

function getAverageSkillWeight(vacancies, vacancy) {
    let totalWeight = 0;
    let skillNames = getVacancySkillNames(vacancy);
    let skillCount = getSkillCount(vacancies);

    skillNames.forEach(function (skillName) {
        totalWeight += skillCount[skillName];
    });

    return totalWeight / skillNames.length;
}

function getNeededSkills(vacancies, minimumVacancies) {
    let vacanciesSortedByAverageSkillWeight = vacancies.sort(function (first, second) {
        let firstWeight = getAverageSkillWeight(vacancies, first);
        let secondWeight = getAverageSkillWeight(vacancies, second);

        if (firstWeight > secondWeight) {
            return -1;
        }

        if (firstWeight < secondWeight) {
            return 1;
        }

        return 0;
    });

    let neededSkills = [];

    vacanciesSortedByAverageSkillWeight.forEach(function (vacancy) {
        let foundVacancies = findVacanciesBySkillNames(vacancies, neededSkills);
        if (foundVacancies.length >= minimumVacancies) {
            return;
        }

        let vacancySkillNames = getVacancySkillNames(vacancy);
        vacancySkillNames.forEach(function (vacancySkillName) {
            if (neededSkills.indexOf(vacancySkillName) === -1) {
                neededSkills.push(vacancySkillName);
            }
        });
    });

    return neededSkills;
}

function getVacanciesSalaryRange(vacancies) {
    return vacancies.reduce(function (range, vacancy) {
        if (vacancy.salary) {
            let newMin = false;
            let newMax = false;

            if (vacancy.salary.from && vacancy.salary.to) {
                newMin = vacancy.salary.from;
                newMax = vacancy.salary.to;
            }
            else if (vacancy.salary.from) {
                newMin = vacancy.salary.from;
            }
            else {
                newMax = vacancy.salary.to;
            }

            if ( (newMin && newMin < range.min) || range.min === false ) {
                range.min = newMin;
            }

            if ( (newMax && newMax > range.max) || range.max === false ) {
                range.max = newMax;
            }
        }

        return range;
    }, {min: false, max: false});
}

function updateVacancyFromTo() {
    let salaryRange = getVacanciesSalaryRange(getVacanciesList());
    $('#from')
        .attr('min', salaryRange.min)
        .attr('max', salaryRange.max)
        .attr('value', salaryRange.min);

    $('#to')
        .attr('min', salaryRange.min)
        .attr('max', salaryRange.max)
        .attr('value', salaryRange.max);
}

function scrollToTop() {
    window.scroll({top: 0});
}

function updatePageTitle() {
    let pageCode = location.pathname.split('/')[1];
    let titles = {
        'php-developer': 'Разработчик PHP',
        'hr-manager': 'HR менеджер',
        'pr-specialist': 'PR специалист',
        'python-developer': 'Разработчик Python',
        'golang-developer': 'Разработчик Golang',
        'javascript-developer': 'Разработчик JavaScript',
        'ui-ux-designer': 'UI/UX дизайнер',
        'ios-developer': 'Разработчик iOS',
        'android-developer': 'Разработчик Android',
        'internet-marketologist': 'Интернет-маркетолог',
        'qa-tester': 'Тестировщик',
        'devops': 'DevOps специалист',
        'data-scientist': 'Data Scientist',
        'game-designer': 'Гейм-дизайнер',
        'project-manager': 'Менеджер интернет-проектов',
        'game-artist-2d': 'Игровой художник 2D',
        'game-artist-3d': 'Игровой художник 3D'
    };

    let pageTitle = titles[pageCode] || '';
    $('h1 small').html(pageTitle);
}

function updateFieldsAndLabelIds(html, index) {
    return html
        .replace(/id=["'](.*?)["']/g, 'id="$1_'+index+'"')
        .replace(/for=["'](.*?)["']/g, 'for="$1_'+index+'"');
}

function drawFilter() {
    let filterHTML = $('.take-filter-from-here').html();
    $('.place-filter-here').each(function (index) {
        $(this).html(updateFieldsAndLabelIds(filterHTML, index));
    });
}

function isMobile() {
    return $('.visible-sm-flex').is(':visible');
}

function updateFilterCounter() {
    let filter = getVacanciesFilter();
    let salaryRange = getVacanciesSalaryRange(getVacanciesList());
    let filterPriceRange = {
        salaryFrom: salaryRange.min,
        salaryTo: salaryRange.max
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

        if (typeof filterValue === "boolean") {
            attrHasValue = filterValue === true;
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

function ucfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getVacanciesInRange(vacancies) {
    let salaryMinMax = getVacanciesSalaryRange(vacancies);

    let vacanciesInRange = vacancies.filter(function (vacancy) {
        let vacancySalary = {
            from: vacancy.salary.from ? vacancy.salary.from : 0,
            to: vacancy.salary.to ? vacancy.salary.to : salaryMinMax.max
        };

        let vacancySalaryIsInRange = !( vacancySalary.from > to || vacancySalary.to < from );

        return vacancySalaryIsInRange;
    });

    return vacanciesInRange;
}

function getSkillsForSalaryRange(from, to, vacancies) {
    if (!vacancies) {
        vacancies = getVacanciesList();
    }

    let vacanciesInRange = getVacanciesInRange(vacancies);

    let rangeSkills = {};
    vacanciesInRange.forEach(function (vacancy) {
        vacancy.skills.map(function (skillData) {
            if (typeof rangeSkills[skillData.title] === "undefined" && skillData.mandatory === true) {
                rangeSkills[skillData.title] = skillData.level;
            }

            if (rangeSkills[skillData.title] > skillData.level) {
                rangeSkills[skillData.title] = skillData.level;
            }
        });
    });

    return rangeSkills;
}