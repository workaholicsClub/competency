let currentCourse;

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

function getCoursePageHTML(course) {
    let description = splitLongText(course.description, 50);
    let allSkillsHTML = course.skills ? getSkillsHTML(course.skills) : false;
    let requirementsHTML = course.requirements ? getSkillsHTML(course.requirements) : false;
    let isFavourited = isInBackpack(course.id);

    return `
            <div class="card course-card">
                <div class="card-body" data-id="${course.id}">
                    <div class="d-flex flex-row justify-content-between align-items-start">
                        <span class="badge badge-course-info">Курс</span>
                        <div class="d-flex flex-row justify-content-end course-card-header">
                            <h6 class="text-muted">от <a href="${getCourseUrl(course)}">${course.platform}</a></h6>
                            <a href="#" class="top-favourite-add">
                                <i class="${isFavourited ? 'fas' : 'far'} fa-bookmark"></i>
                            </a>
                        </div>
                    </div>
                    <h5>${course.title}</h5>
                    <p class="mt-1">${getCourseTime(course)} &asymp; ${getHumanReadableTime(course)}</p>
                    <p class="mt-1 text-info">${getCourseAttributesHTML(course)}</p>
                    <label class="mt-1 mb-0">По окончании будете уметь</label><p>${allSkillsHTML}</p>
                    ${requirementsHTML ? '<label class="mt-1 mb-0">Нужно знать</label><p>' + requirementsHTML + '</p>' : ''}

                    <label class="mt-1 mb-0 d-block"><a href="#" class="add-info closed">Структура курса </a></label>
                    <div class="add-info-input" style="display: none">
                        <p class="mb-1"><textarea class="form-control" name="structure"></textarea></p>
                        <button class="btn btn-outline-info btn-add-info">Добавить информацию</button>
                    </div>

                    <label class="mt-1 mb-0 d-block"><a href="#" class="add-info closed">Начало занятий </a></label>
                    <div class="add-info-input" style="display: none">
                        <p class="mb-1"><textarea class="form-control" name="start"></textarea></p>
                        <button class="btn btn-outline-info btn-add-info">Добавить информацию</button>
                    </div>

                    <label class="mt-1 mb-0 d-block"><a href="#" class="add-info closed">Расписание занятий </a></label>
                    <div class="add-info-input" style="display: none">
                        <p class="mb-1"><textarea class="form-control" name="schedule"></textarea></p>
                        <button class="btn btn-outline-info btn-add-info">Добавить информацию</button>
                    </div>

                    <label class="mt-1 mb-0 d-block"><a href="#" class="add-info closed">Отзывы </a></label>
                    <div class="add-info-input" style="display: none">
                        <button class="btn btn-outline-info btn-feedback" data-toggle="modal" data-target="#surveyModal">Добавить отзыв</button>
                    </div>

                    <p id="description${course.id}" class="mt-4">
                        ${description}
                    </p>

                    <div class="row mt-4">
                        <div class="col price-duration-data">
                            <p class="mt-0 mb-0 price">${getCoursePriceText(course.price)}</p>
                        </div>
                        <div class="col course-buttons d-flex flex-row mt-1">
                            <button class="btn btn-outline-info d-flex flex-row btn-favourite mr-2 ${isFavourited ? 'active' : ''}" ${isFavourited ? 'disabled="disabled"' : '' }>
                                <i class="${isFavourited ? 'fas fa-check' : 'far fa-bookmark'}"></i>
                            </button>
                            <button class="btn btn-outline-info btn-feedback mr-2" data-toggle="modal" data-target="#surveyModal">
                                <i class="far fa-comment"></i>
                            </button>
                            <button class="btn btn-outline-info btn-share mr-2" data-course-id="${course.id}" id="share${course.id}">
                                <i class="fas fa-share-alt"></i>
                                <ul class="share-menu dropdown-menu" aria-labelledby="share${course.id}">
                                    <li class="dropdown-item"><a href="#" data-social="vkontakte">Вконтакте</a></li>
                                    <li class="dropdown-item"><a href="#" data-social="facebook">Facebook</a></li>
                                    <li class="dropdown-item"><a href="#" data-social="twitter">Twitter</a></li>
                                    <li class="dropdown-item"><a href="#" data-social="whatsapp">WhatsApp</a></li>
                                    <li class="dropdown-item"><a href="#" data-social="telegram">Telegram</a></li>
                                </ul>
                            </button>
                            <a href="${getCourseUrl(course)}" class="btn btn-outline-info flex-fill btn-link mr-2" data-course-id="${course.id}">
                                Записаться
                            </a>
                        </div>
                    </div>
                </div>
            </div>`;
}

function updatePageTitleAndLink() {
    updatePageTitle();
    let professionCode = getProfessionCodeFromUrl('from');
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

function getCourseById(courseId) {
    return courseId == currentCourse.id ? currentCourse : false;
}

function updatePageTitle() {
    let pageCode = getProfessionCodeFromUrl('from');
    $('.profession-title').text( getCurrentProfessionName(pageCode) );
    $('.profession-title-tp').text( getCurrentProfessionName(pageCode, true) );
}

function initHeaderForm() {
    $(document).on('click', '.request .dropdown-item', function () {
        let itemText = $(this).text();
        let $toggle = $(this).closest('.dropdown').find('.editable-toggle');
        let $allToggles = $('[data-menu="'+$toggle.data('menu')+'"');
        let $applyButtons = $('.apply-request');

        $allToggles.text(itemText);
        $applyButtons.show();
    });

    $(document).on('click', '.apply-request', function () {
        let request = getRequestValuesFromDOM();
        let pageCode = getProfessionCodeFromUrl('from');

        let newUrl = new URL(location.origin+'/'+pageCode+'/courses');
        newUrl.searchParams.set('who', request[0]);
        newUrl.searchParams.set('experience', request[1]);
        newUrl.searchParams.set('wish', request[2]);

        location.href = newUrl.toString();
    });
}

$(function () {
    let courseId = getParameterByName('id');

    initAuth();
    initHeaderForm();
    updatePageTitleAndLink();

    loadCourseData(courseId)
        .then(function (courseData) {
            currentCourse = courseData;
            let courseHTML = getCoursePageHTML(courseData);
            $('.course-data').html(courseHTML);
        })
        .then(updateFavourites);

    showProfile();
    initCourseCards();
    initScroll();

    checkSession()
        .then(showProfile);

    $(document).on('click', '.add-info', function () {
        let $button = $(this);
        let $input = $button.parent().next();
        $button.toggleClass('closed');
        $input.toggle();
    });

    $(document).on('click', '.btn-add-info', function () {
        let $container = $(this).closest('.add-info-input');
        let $input = $container.find('textarea');
        let courseId = parseInt( $(this).closest('[data-id]').data('id') );

        saveUpdate(courseId, $input.attr('name'), $input.val())
            .then(function () {
                $container.html(`<div class="alert alert-success" role="alert">Спасибо за дополнение! Мы дополним данные этой информацией</div>`)
            });
    });
});