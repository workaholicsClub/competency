function addSkill(skillName) {
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
        "</div>\n";

    $('.skillContainer').append(skillHTML);
    toggleAdditionalSkills();
    search();
}

function addCourse(course) {
    let descriptionHTML = course.description || "";
    let price = course.price == 0 ? 'Бесплатно' : course.price + ' руб';
    let skillsHTML = "";

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
        "        <span class=\"badge badge-secondary priceBadge\">" + price + "</span>\n" +
        "        <h4><a class=\"courseLink\" href=\"" + course.url + "\" target=\"_blank\">" + course.title + "<i class=\"fas fa-external-link-square-alt\"></i></a></h4>\n" +
        "        <h6 class=\"text-muted\">" +course.platform+ "</h6>\n" +
        "        <p class=\"mt-1 mb-0\">" + skillsHTML + "</p>\n" +
        "        <p>Требования: Нет</p>\n" +
        "        <p>" + attributesHTML + "</p>\n" +
        "        <button class=\"btn btn-outline-secondary\" data-toggle=\"collapse\" data-target=\"#description"+course.id+"\" aria-expanded=\"true\" aria-controls=\"description"+course.id+"\">\n" +
        "            Описание курса\n" +
        "        </button>\n" +
        "        <p id=\"description"+course.id+"\" class=\"collapse mt-3\">\n" +
        descriptionHTML +
        "        </p>\n" +
        "    </div>\n" +
        "</div>";

    $('.searchResults').append(courseHTML);
}

function findCourses(filter) {
    return getCoursesList();
}

function getCoursesFilter() {
    return {}
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

$(function () {
    updateStartSkills();
    updateMinSkills();
    updateAllSkills();

    $('#coursesCount').text( getCoursesList().length );

    $(document).on('click', '[data-skill]', function () {
        let skillName = $(this).attr('data-skill');
        addSkill(skillName);
        toggleSkillsResult();
    });

    $(document).on('change', '.skillSelect', function () {
        let skillName = $(this).val();
        if (skillName) {
            addSkill(skillName);
            toggleNoSkillsResult();
        }
    });

    $(document).on('click', '#startSearch', function (event) {
        event.preventDefault();

        let minimalSkills = getNeededSkills(getVacanciesList(), 1);
        minimalSkills.forEach(function (skillName) {
            addSkill(skillName);
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
            addSkill(skillName);
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
});
