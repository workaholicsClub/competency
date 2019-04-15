function loadCourseData(courseId) {
    return loadApiData("/api/courseData.php", {id: courseId});
}

function changeTextOnly($elem, newText) {
    return $elem.contents()
                .filter(function() {
                    return this.nodeType === 3;
                })
                .first()
                .replaceWith(newText);
}

function getCoursePageHTML(courseData) {
    let hasRequirements = Object.keys(courseData.requirements).length > 0;
    let description = (courseData.description || "").replace("\n", "<br>");
    let savedIds = getCookie('backpack');
    let isCourseInBackpack = savedIds && savedIds.indexOf(courseData.id) !== -1;
    let otherCoursesUrl = '/'+getParameterByName('from')+'/courses/';

    let saveButton = isCourseInBackpack
        ? "<button class=\"btn btn-outline-success btn-lg btn-block disabled\" disabled='disabled'><i class=\"fas fa-check\"></i> Курс сохранен</button>\n"
        : "<button class=\"btn btn-outline-primary btn-lg btn-block add-to-backpack\" data-course-id=\""+courseData.id+"\"><i class=\"fas fa-bookmark\"></i> Сохранить</button>\n";

    let priceBadge = "<div class=\"price display-4\">"+getCoursePriceText(courseData.price)+"</div>\n";
    if (courseData.coupon) {
        let discountPrice = courseData.price * (1-courseData.couponDiscount/100);
        priceBadge = "<div class='discount'>Скидка <b>"+courseData.couponDiscount+"%</b> по промокоду <b>"+courseData.coupon+"</b></div><div class=\"price\">" +
            "<span class='display-4'>"+getCoursePriceText(discountPrice)+"</span>" +
            "<del>"+getCoursePriceText(courseData.price)+"</del>" +
            "</div>\n";
    }

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
        priceBadge +
        "<div class=\"duration h5\">&asymp; " + getHumanReadableTime(courseData) + "</div>\n" +
        "</p>\n" +
        "\n" +
        saveButton +
        "<a class=\"btn btn-primary btn-lg btn-block mb-4\" href=\"" + courseData.url + "\" target=\"_blank\">Сайт курса&nbsp;<i class=\"fas fa-external-link-square-alt\"></i></a>\n" +
        "<a class='btn btn-outline-secondary btn-lg btn-block' href='"+otherCoursesUrl+"'>Посмотреть другие курсы</a>"
}

function updatePageTitleAndLink() {
    let professionCode = getParameterByName('from');
    let pageTitle = getCurrentProfessionName(professionCode) || '';
    $('h1 small').html(pageTitle);
    $('.courses-list-link').attr('href', '/'+professionCode+'/courses');
}

function addToBackpackLite(courseId) {
    let savedIds = getCookie('backpack');
    if (!savedIds) {
        savedIds = [];
    }

    savedIds.push(courseId);
    setCookie('backpack', savedIds);
}

$(function () {
    let courseId = getParameterByName('id');

    updatePageTitleAndLink();

    loadCourseData(courseId)
        .then(function (courseData) {
            let courseHTML = getCoursePageHTML(courseData);
            $('.course-data').html(courseHTML);
        });

    $(document).on('click', '.add-to-backpack', function () {
        let $button = $(this);
        let courseId = $button.data('course-id');
        addToBackpackLite(courseId);

        $button
            .removeClass('btn-primary add-to-backpack')
            .addClass('btn-success disabled')
            .attr('disabled', 'disabled');
        changeTextOnly($button, ' Курс сохранен');

        $button.find('.fas')
            .removeClass('fa-heart')
            .addClass('fa-check');

    });
});