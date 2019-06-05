function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

Survey.Survey.cssType = "bootstrap";
Survey.surveyLocalization.locales["ru"]['completingSurvey'] = 'Спасибо за отзыв! Он поможет другим!';

let surveyJSON = {"locale":"ru","pages":[{"name":"page1","elements":[{"type":"rating","name":"started","title":{"ru":"Мне удалось начать обучение"},"isRequired":true,"rateValues":[{"value":"1","text":{"ru":"Да"}},{"value":"-1","text":{"ru":"Нет"}},{"value":"0","text":{"ru":"Сложно сказать"}}]},{"type":"rating","name":"finished","visibleIf":"{started} = \"1\"","title":{"ru":"Мне удалось завершить обучение"},"isRequired":true,"rateValues":[{"value":"1","text":{"ru":"Да"}},{"value":"-1","text":{"ru":"Нет"}},{"value":"0","text":{"ru":"Сложно сказать"}}]},{"type":"rating","name":"professional","visibleIf":"{started} = \"1\"","title":{"ru":"В целом курс организован профессионально"},"isRequired":true,"rateValues":[{"value":"1","text":{"ru":"Да"}},{"value":"-1","text":{"ru":"Нет"}},{"value":"0","text":{"ru":"Сложно сказать"}}]},{"type":"rating","name":"question11","title":{"ru":"Мне понравился формат курса"},"rateValues":[{"value":"1","text":{"ru":"Да"}},{"value":"-1","text":{"ru":"Нет"}},{"value":"0","text":{"ru":"Сложно сказать"}}]},{"type":"rating","name":"teacher","visibleIf":"{started} = \"1\"","title":{"ru":"На курсе есть преподаватель"},"isRequired":true,"rateValues":[{"value":"1","text":{"ru":"Да"}},{"value":"-1","text":{"ru":"Нет"}},{"value":"0","text":{"ru":"Сложно сказать"}}]},{"type":"rating","name":"question4","visibleIf":"{started} = \"1\" and {teacher} = \"1\"","title":{"ru":"Преподаватель имеет опыт работы по направлению курса"},"rateValues":[{"value":"1","text":{"ru":"Да"}},{"value":"-1","text":{"ru":"Нет"}},{"value":"0","text":{"ru":"Сложно сказать"}}]},{"type":"rating","name":"question2","visibleIf":"{started} = \"1\" and {teacher} = \"1\"","title":{"ru":"Преподаватель хорошо организовал работу группы"},"rateValues":[{"value":"1","text":{"ru":"Да"}},{"value":"-1","text":{"ru":"Нет"}},{"value":"0","text":{"ru":"Сложно сказать"}}]},{"type":"rating","name":"question3","visibleIf":"{started} = \"1\" and {teacher} = \"1\"","title":{"ru":"Преподаватель грамотно отвечал на вопросы"},"rateValues":[{"value":"1","text":{"ru":"Да"}},{"value":"-1","text":{"ru":"Нет"}},{"value":"0","text":{"ru":"Сложно сказать"}}]},{"type":"rating","name":"practice","visibleIf":"{started} = \"1\"","title":{"ru":"На курсе есть практика"},"isRequired":true,"rateValues":[{"value":"1","text":{"ru":"Да"}},{"value":"-1","text":{"ru":"Нет"}},{"value":"0","text":{"ru":"Сложно сказать"}}]},{"type":"rating","name":"question7","visibleIf":"{started} = \"1\" and {practice} = \"1\"","title":{"ru":"Практические задания были полезными"},"rateValues":[{"value":"1","text":{"ru":"Да"}},{"value":"-1","text":{"ru":"Нет"}},{"value":"0","text":{"ru":"Сложно сказать"}}]},{"type":"rating","name":"question8","visibleIf":"{started} = \"1\" and {teacher} = \"1\" and {practice} = \"1\"","title":{"ru":"Преподаватель помогал выполнять задания"},"rateValues":[{"value":"1","text":{"ru":"Да"}},{"value":"-1","text":{"ru":"Нет"}},{"value":"0","text":{"ru":"Сложно сказать"}}]},{"type":"rating","name":"working","title":{"ru":"Я уже работаю по направлению курса"},"rateValues":[{"value":"1","text":{"ru":"Да"}},{"value":"-1","text":{"ru":"Нет"}},{"value":"0","text":{"ru":"Сложно сказать"}}]},{"type":"rating","name":"actual","title":{"ru":"Программа курса актуальна для меня"},"isRequired":true,"rateValues":[{"value":"1","text":{"ru":"Да"}},{"value":"-1","text":{"ru":"Нет"}},{"value":"0","text":{"ru":"Сложно сказать"}}]},{"type":"rating","name":"question1","visibleIf":"{started} = \"1\" and {actual} = \"1\"","title":{"ru":"Мне удалось применить полученные знания"},"rateValues":[{"value":"1","text":{"ru":"Да"}},{"value":"-1","text":{"ru":"Нет"}},{"value":"0","text":{"ru":"Сложно сказать"}}]},{"type":"rating","name":"question5","visibleIf":"{started} = \"1\"","title":{"ru":"Материалов курса достаточно, чтобы разобраться"},"rateValues":[{"value":"1","text":{"ru":"Да"}},{"value":"-1","text":{"ru":"Нет"}},{"value":"0","text":{"ru":"Сложно сказать"}}]},{"type":"rating","name":"question6","visibleIf":"{started} = \"1\"","title":{"ru":"Материалы курса изложены четко"},"rateValues":[{"value":"1","text":{"ru":"Да"}},{"value":"-1","text":{"ru":"Нет"}},{"value":"0","text":{"ru":"Сложно сказать"}}]},{"type":"rating","name":"question10","title":{"ru":"Стоимость курса мне подходит"},"rateValues":[{"value":"1","text":{"ru":"Да"}},{"value":"-1","text":{"ru":"Нет"}},{"value":"0","text":{"ru":"Сложно сказать"}}]},{"type":"rating","name":"question9","visibleIf":"{started} = \"1\" and {finished} = \"1\"","title":{"ru":"Курс превзошел мои ожидания"},"rateValues":[{"value":"1","text":{"ru":"Да"}},{"value":"-1","text":{"ru":"Нет"}},{"value":"0","text":{"ru":"Сложно сказать"}}]},{"type":"comment","name":"question12","title":{"ru":"Вы можете дополнить свой ответ"}}]}]}

function sendFeedbackToServer(survey) {
    let databaseRecords = Object.keys(survey.data).reduce(function (processed, code) {
        let value = survey.data[code];
        let question = survey.getQuestionByValueName(code);
        let title = question.title;
        let courseId = survey.courseId;
        let userId = getSavedProfileData().sub;

        processed.push({
            userId: userId,
            courseId: courseId,
            question: title,
            answer: value,
        });

        return processed;
    }, []);

    return saveReview(databaseRecords);
}

function startSurveyForCourse(courseId) {
    if (isAuthenticated()) {
        let survey = new Survey.Model(surveyJSON);
        survey.courseId = courseId;

        $(".survey-data").Survey({
            model: survey,
            onComplete: sendFeedbackToServer
        });
    }
}

$(function () {
    $(document).on('click', '.btn-feedback', function () {
        let courseId = parseInt( $(this).closest('[data-id]').data('id') );
        startSurveyForCourse(courseId);
    });
});

