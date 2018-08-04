let neededVacancies = 1;

$(function () {
    updateStartSkills();
    updateMinSkills();
    updateAllSkills();

    $('#vacanciesCount').text( getVacanciesList().length );

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

    $(document).on('click', '#allSkills a', function () {
        $(this).toggleClass('active');
    });

    $(document).on('click', '#minSkills a', function () {
        $('#minSkills a').toggleClass('active');
    });

    $(document).on('click', '.confirmSkillsAddButton', function () {
        $('.skillList a.active').each(function () {
            let skillName = $(this).data('name');
            addSkill(skillName);
            $(this).removeClass('active');
        });
        toggleSkillsResult();
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
});
