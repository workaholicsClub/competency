let neededVacancies = 1;

function updateCitiesInFilter() {
    let citiesList = getVacanciesList().reduce(function (list, vacancy) {
        let vacanciesCities = vacancy.city.split(", ");
        vacanciesCities.forEach(function (city) {
            if (list.indexOf(vacancy.city) === -1) {
                list.push(vacancy.city);
            }
        });

        return list;
    }, []);

    let citiesHTML = citiesList.reduce(function (html, city, index) {
        let cityHTML = "<div class=\"form-check\">\n" +
            "    <input id=\"city_"+index+"\" class=\"form-check-input\"\n" +
            "            name=\"city_"+index+"\" type=\"checkbox\"\n" +
            "            data-type=\"multicheckbox\" data-code=\"city\"\n" +
            "            value=\""+city+"\">\n" +
            "    <label class=\"form-check-label\" for=\"city_"+index+"\">"+city+"</label>\n" +
            "</div>";

        return html + cityHTML;
    }, '');

    $('.city-group .form-check').remove();
    $('.city-group').append(citiesHTML);
}

$(function () {
    updateStartSkills();
    updateMinSkills();
    updateAllSkills();
    toggleAdditionalSkills();
    toggleUpdatableSkills();
    updateVacancyFromTo();
    updatePageTitle();
    updateCitiesInFilter();
    drawFilter();

    search();

    window.slider = setupSlider();

    $(document).on('click', '[data-skill]:not(#startSkills [data-skill], #updatedSkills [data-skill])', function () {
        let skillName = $(this).attr('data-skill');
        addSkill(skillName);
        toggleSkillsResult();
        updateFilterCounter();
    });

    $(document).on('click', '.skillContainer .close', function () {
        updateFilterCounter();
        updateSkillLists();
        scrollToTop();
        search();
    });

    $(document).on('change', '.skillSelect', function () {
        let skillName = $(this).val();

        if (skillName) {
            addSkill(skillName);
            toggleSkillsResult();
        }

        updateFilterCounter();
    });

    $(document).on('click', '.alert .close', function () {
        toggleSkillsResult();
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

    $(document).on('click', '#minSkills a', function () {
        $('#minSkills a').toggleClass('active');
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
        updateFilterCounter();
    });

    $(document).on('click', '#startSearch, #startSkills a', function (event) {
        event.preventDefault();

        let minimalSkills = getNeededSkills(getVacanciesList(), 1);
        minimalSkills.forEach(function (skillName) {
            addSkill(skillName);
        });

        $('#startSearch').hide();
        updateSkillLists();
        toggleSkillsResult();
    });

    $(document).on('click', '#addSearch, #updatedSkills a', function (event) {
        event.preventDefault();

        let minimalSkills = removeSelectedSkills( getNeededSkills(getVacanciesList(), neededVacancies) );
        minimalSkills.forEach(function (skillName) {
            addSkill(skillName);
        });

        updateSkillLists();
        toggleSkillsResult();
    });


    $(document).on('change input', '.skillSlider', function () {
        let $skillBlock = $(this).closest('.alert');
        $skillBlock.removeClass('alert-danger').addClass('alert-primary');
        search();
        toggleUpdatableSkills();
        toggleSkillsResult();
        updateStartSkills();
        updateUpdatableSkills();
        updateFilterCounter();
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

    $(document).on('change input click', 'input', function () {
        search();
        updateFilterCounter();
    });

    $(document).on('change', '#sortSelect', function () {
        updateAllSkills();
    });

    $(document).on('click', '.addSKillButton', function () {
        updateAllSkills();
        updateFilterCounter();
    });

    $(document).on('click', '.addVacancySkillsButton', function () {
        let vacancyId = parseInt( $(this).closest('.vacancy-card').data('vacancy-id') );
        let vacancy = getVacancyById(vacancyId);
        let skillsToAdd = removeSkills(getVacancySkillNames(vacancy), getSelectedSkillNames())
        addSkillsToVacancyPopup(skillsToAdd);
    });

    $(document).on('click', '.btn-recommend', function () {
        let neededVacancies = $(this).data('needed') || 1;
        let skillsNeededToRecommend = removeSelectedSkills( getNeededSkills(getVacanciesList(), neededVacancies) );

        addSkillsToVacancyPopup(skillsNeededToRecommend);
        updateFilterCounter();

        $(this).data('needed', neededVacancies+1);
        $('.btn-recommend').text('Подобрать еще');
    });

    $(document).on('click', '.confirmSkillsAddButton', function () {
        $('#allSkills .active').each(function () {
            let skillName = $(this).data('name');
            let skillLevel = $(this).find('select').val();
            addSkill(skillName, skillLevel, false);
            $(this).removeClass('active');
        });

        scrollToTop();
        updateFilterCounter();
        search();
    });

    $(document).on('click', '.confirmVacancySkillsAddButton', function () {
        $('#selectedVacancySkills .list-group-item').each(function () {
            let $skillElement = $(this);
            let skillName = $skillElement.data('name');
            let skillLevel = $skillElement.find('select').val();
            addSkill(skillName, skillLevel, false);
        });

        updateFilterCounter();
        scrollToTop();
        search();
    });
    
    $(document).on('click', '#addRecommendedSkills', function () {
        $('.addSkillsContainer [data-skill]').each(function () {
            let skillName = $(this).data('skill');
            addSkill(skillName);
        });

        updateFilterCounter();
        scrollToTop();
        search();
    });

    $(document).on('click', '.navbar-toggler', function () {
        $(this).toggleClass('active');
    });
});
