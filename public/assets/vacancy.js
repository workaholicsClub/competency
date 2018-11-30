let neededVacancies = 1;

$(function () {
    updateStartSkills();
    updateMinSkills();
    updateAllSkills();
    toggleAdditionalSkills();
    toggleUpdatableSkills();
    updateVacancyFromTo();
    updatePageTitle();
    search();

    $(document).on('click', '[data-skill]:not(#startSkills [data-skill], #updatedSkills [data-skill])', function () {
        let skillName = $(this).attr('data-skill');
        addSkill(skillName);
        toggleSkillsResult();
    });

    $(document).on('change', '.skillSelect', function () {
        let skillName = $(this).val();

        if (skillName) {
            addSkill(skillName);
            toggleSkillsResult();
        }
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

    $(document).on('change', '#sortSelect', function () {
        updateAllSkills();
    });

    $(document).on('click', '.addSKillButton', function () {
        updateAllSkills();
    });

    $(document).on('click', '.addVacancySkillsButton', function () {
        let vacancyId = parseInt( $(this).closest('.card').data('vacancy-id') );
        let vacancy = getVacancyById(vacancyId);
        let skillsToAdd = removeSkills(getVacancySkillNames(vacancy), getSelectedSkillNames())
        addSkillsToVacancyPopup(skillsToAdd);
    });

    $(document).on('click', '.confirmSkillsAddButton', function () {
        $('#selectedSkills .list-group-item').each(function () {
            let $skillElement = $(this);
            let skillName = $skillElement.data('name');
            let skillLevel = $skillElement.find('select').val();
            addSkill(skillName, skillLevel);
        });

        scrollToTop();
        search();
    });
    
    $(document).on('click', '#addRecommendedSkills', function () {
        $('.addSkillsContainer [data-skill]').each(function () {
            let skillName = $(this).data('skill');
            addSkill(skillName);
        });

        scrollToTop();
        search();
    })
});
