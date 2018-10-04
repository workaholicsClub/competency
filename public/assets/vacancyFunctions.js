function getSkillLevels() {
    return ['Не владею', 'Основы', 'Уверенный', 'Глубокий'];
}

function addSkill(skillName, skillLevel) {
    let selectedSkills = getSelectedSkillNames();
    let isSelected = selectedSkills.indexOf(skillName) !== -1;
    let skillLevelDefined = (typeof (skillLevel) === "string" || typeof (skillLevel) === "number") && skillLevel !== "Определите уровень";
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
        "       <option "+(skillLevelDefined?"":"selected")+">Определите уровень</option>\n" +
                getSkillLevels().map(function (skillText, index) {
                    let isSelected = skillLevel === index.toString();
                    return "       <option value="+index+" "+(isSelected?"selected":"")+">"+skillText+"</option>\n";
                }).join("\n") +
        "    </select>\n" +
        "</div>\n";

    $('.skillContainer').prepend(skillHTML);
    toggleAdditionalSkills();
    toggleUpdatableSkills();
    updateSkillLists();
    search();
}

function clearVacanciesList() {
    $('#vacancyList').html('');
    $('#notMatchedVacancyList').html('');
}

function getSkillsFilter() {
    let skillsData = {};

    $('.skillBlock').each(function () {
        let skillName = $(this).find('h4').text();
        let skillLevel = parseInt( $(this).find('select').val() ) || 0;

        skillsData[skillName] = skillLevel;
    });

    return skillsData;
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

function matchVacancy(vacancy, filter) {
    let isMatching = true;
    let vacancySkillNames = getVacancySkillNames(vacancy);

    vacancySkillNames.forEach(function (skillName) {
        let isInFilter = typeof filter[skillName] !== 'undefined';
        let levelMatches = isInFilter && getVacancySkillLevel(vacancy, skillName) <= filter[skillName];
        isMatching = isMatching && levelMatches;
    });

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
            return matchVacancy(vacancy, filter);
        });
}

function findParticialMacth(filter) {
    return getVacanciesList()
        .filter(function (vacancy) {
            let isNotInRecommendedList = !matchVacancy(vacancy, filter);
            return isNotInRecommendedList;
        })
        .sort(function (vacancyA, vacancyB) {
            let ratingA = getMatchRating(vacancyA, filter);
            let ratingB = getMatchRating(vacancyB, filter);

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
    toggleSkillsResult();
    clearVacanciesList();

    let recommendedVacancies = findVacancies(getSkillsFilter());

    if (recommendedVacancies.length > 0) {
        $('.noRecommendedVacancies').hide();
        recommendedVacancies
            .forEach(function (vacancy, index) {
                addVacancy(vacancy, index, '#vacancyList');
            });
    }
    else {
        $('.noRecommendedVacancies').show();
    }


    findParticialMacth(getSkillsFilter())
        .forEach(function (vacancy, index) {
            addVacancy(vacancy, index, '#notMatchedVacancyList');
        });

    $('.searchResults').css('opacity', '0.3');
    setTimeout(function () {
        $('.searchResults').attr('style', '');
    }, 2000);
}

function toggleSkillsResult() {
    let areVacanciesFound = findParticialMacth(getSkillsFilter()).length > 0;

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

function hasEnoughSkills() {
    return $('.skillBlock').length > 0 && findParticialMacth(getSkillsFilter()).length > 0;
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

function toggleAdditionalSkills() {
    let foundVacanciesCount = findVacancies(getSkillsFilter()).length;
    let selectedSkills = getSelectedSkillNames();
    let neededSkills = getNeededSkills(getVacanciesList(), foundVacanciesCount+1);

    let allAdditionalSkills = [];
    neededSkills.forEach(function (skillName) {
        let skillNotSelected = selectedSkills.indexOf(skillName) === -1;
        if (skillNotSelected) {
            allAdditionalSkills.push(skillName);
        }
    });

    let shownAdditionalSkills = removeSelectedSkills(allAdditionalSkills);
    let hasAdditionalSkills = shownAdditionalSkills.length > 0;

    updateAdditionalSkills(allAdditionalSkills);

    if (hasAdditionalSkills) {
        $('.additionalSkills').show();
    }
    else {
        $('.additionalSkills').hide();
    }
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
    Object.keys(maxFilter).forEach(function (skillName) {
        maxFilter[skillName] = maximumLevel;
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
    let filter = getSkillsFilter();
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
            "        <div class=\"form-group col-1\">\n" +
            "            <div class=\"form-check\">\n" +
            "                <input class=\"form-check-input\" type=\"checkbox\" value=\"\" id=\"check"+index+"\">\n" +
            "            </div>\n" +
            "        </div>\n" +
            "        <div class=\"form-group col-5\">\n" +
            "            <label class=\"form-check-label\">\n" +
            "                "+skill+"\n" +
            "            </label>\n" +
            "        </div>\n" +
            "        <div class=\"form-group col-5\">\n" +
            "        <select class=\"custom-select\">\n" +
            "           <option selected>Определите уровень</option>\n" +
            "           <option value=0>Не владею</option>\n" +
            "           <option value=1>Основы</option>\n" +
            "           <option value=2>Уверенный</option>\n" +
            "           <option value=3>Глубокий</option>\n" +
            "        </select>\n" +
            "        </div>\n" +
            "        <div class=\"form-group col-1\">\n" +
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
            "        <div class=\"form-group col-7\">\n" +
            "            <label class=\"form-check-label\" for=\"check"+index+"\">\n" +
            "                "+skill+"\n" +
            "            </label>\n" +
            "        </div>\n" +
            "        <div class=\"form-group col-5\">\n" +
            "        <select class=\"custom-select\">\n" +
            "           <option selected>Определите уровень</option>\n" +
            "           <option value=0>Не владею</option>\n" +
            "           <option value=1>Основы</option>\n" +
            "           <option value=2>Уверенный</option>\n" +
            "           <option value=3>Глубокий</option>\n" +
            "        </select>\n" +
            "        </div>\n" +
            "    </form>\n" +
            "</div>";

        skillsHtml.push(itemHTML);
    });

    $("#selectedSkills").html( skillsHtml.join('') );
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
            return "От " + vacancy.salary.from + "<br>до " + vacancy.salary.to + " руб";
        }

        if (!vacancy.salary.from) {
            return "До " + vacancy.salary.to + " руб";
        }
        else {
            return "От " + vacancy.salary.from + " руб";
        }
    }

    return 'Заработная плата<br>не указана';
}

function getAttributesHtml(vacancy) {
    let attributes = [
        vacancy.location,
        vacancy.schedule
    ];

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

function addVacancy(vacancy, index, selector) {
    let desciptionHtml = vacancy.description.replace(/\n/g, '<br>');
    let isRecommended = selector === '#vacancyList';
    let additionalClass = isRecommended ? 'bg-warning' : '';
    let hasNoUndefinedSkills = getUndefinedSkills(vacancy, getSkillsFilter()).length === 0;
    let canSendResume = isRecommended || hasNoUndefinedSkills;


    let buttonHtml = canSendResume
        ? "<a href=\"#\" class=\"btn btn-primary d-flex justify-content-center\">Отправить резюме</a>\n"
        : "<a href=\"#\" class=\"btn btn-secondary disabled d-flex justify-content-center mb-2\" disabled=\"disabled\">Отправить резюме</a>\n" +
          "<a href=\"#\" class=\"btn btn-primary d-flex justify-content-center addVacancySkillsButton\" data-toggle=\"modal\" data-target=\"#addVacancySkillsModal\">Оценить требования, чтобы отправить резюме</a>\n";

    let vacancyHtml = "<div class=\"card m-1\" data-vacancy-id='"+vacancy.id+"'>"+
        "   <div class=\"card-body "+additionalClass+"\">\n" +
        "       <span class=\"badge badge-secondary priceBadge\">" +getSalaryHtml(vacancy)+ "</span>\n" +
        "       <h4>"+vacancy.title+"</h4>\n" +
        "       <h6 class=\"text-muted\">"+vacancy.company+"</h6>\n" +
        "       <p>"+getAttributesHtml(vacancy)+"</p>\n" +
        "       <p>Требования:</p>\n" +
        "       <p>"+getSkillsHtml(vacancy)+"</p>\n" +
        "       <button class=\"btn btn-outline-secondary mb-3\" data-toggle=\"collapse\" data-target=\"#description" + index + "\" aria-expanded=\"true\" aria-controls=\"description1\">\n" +
        "           Описание вакансии\n" +
        "       </button>\n" +
        "       <p id=\"description" + index + "\" class=\"collapse\">\n" + desciptionHtml + "</p>\n" +
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