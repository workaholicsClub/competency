function loadCourseData(courseId) {
    return loadApiData("/api/courseData.php", {id: courseId});
}

function getCoursePageHTML(courseData) {
    let hasRequirements = Object.keys(courseData.requirements).length > 0;
    let description = (courseData.description || "").replace("\n", "<br>");

    return "<h1>" + courseData.title + "</h1>\n" +
        "<p class='text-secondary'>от " + courseData.platform + "</p>\n" +
        "<p class='text-info'>" + getCourseAttributesHTML(courseData) + "</p>\n" +
        "<h5>Навыки курса:</h5>\n" +
        "<p>\n" +
            getSkillsHTML(courseData) + "\n" +
         "</p>\n" +
        "\n" +
        (hasRequirements
            ? ("<h5>Нужно знать:</h5>\n" +
                 "<p>" + getRequirementsHTML(courseData) + "</p>\n")
            : ("<h5 class='mb-4'>Не требует начальных знаний</h5>\n")
        ) +
        "<h5>Описание:</h5>\n" +
        "<p>" + description + "</p>\n" +
        "\n" +
        "<p>\n" +
        "<div class=\"price display-4\">"+getCoursePriceText(courseData)+"</div>\n" +
        "<div class=\"duration h5\">&asymp; " + getHumanReadableTime(courseData) + "</div>\n" +
        "</p>\n" +
        "\n" +
        "<button class=\"btn btn-primary btn-lg btn-block add-to-backpack\" data-course-id=\""+courseData.id+"\"><i class=\"fas fa-heart\"></i> Сохранить</button>\n" +
        "<a class=\"btn btn-outline-secondary btn-lg btn-block mb-4\" href=\"" + courseData.url + "\" target=\"_blank\">Сайт курса&nbsp;<i class=\"fas fa-external-link-square-alt\"></i></a>\n"
}

function updatePageTitleAndLink() {
    let professionCode = getParameterByName('from');
    let pageTitle = getCurrentProfessionName(professionCode) || '';
    $('h1 small').html(pageTitle);
    $('.courses-list-link').attr('href', '/'+professionCode+'/courses');
}

$(function () {
    let courseId = getParameterByName('id');

    updatePageTitleAndLink();

    loadCourseData(courseId)
        .then(function (courseData) {
            let courseHTML = getCoursePageHTML(courseData);
            $('.course-data').html(courseHTML);
        });
});