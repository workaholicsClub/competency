# API
Все взаимодействие с сервисом происходит через API. 

## Отправка регистрационного письма
[http://127.0.0.1:8080/api/user/token/ap@mailinator.com](http://127.0.0.1:8080/api/user/token/ap@mailinator.com)

Для тестовых целей в mailgunе добавлен только адрес ap@mailinator.com.  
Смотреть можно тут: [https://www.mailinator.com/v2/inbox.jsp?zone=public&query=ap](https://www.mailinator.com/v2/inbox.jsp?zone=public&query=ap)

## Информация о пользователе по токену
[http://127.0.0.1:8080/api/user?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJtYXRyaXgiLCJpYXQiOjE1MTM3MDAwMDAsImV4cCI6MTUxMzcxMDgwMCwiZW1haWwiOiJhcEBtYWlsaW5hdG9yLmNvbSJ9.oW5Ym4MT-HmKQlXIPd1u7bJBdJRyWU6B6wzJN7pNh90](http://127.0.0.1:8080/api/user?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJtYXRyaXgiLCJpYXQiOjE1MTM3MDAwMDAsImV4cCI6MTUxMzcxMDgwMCwiZW1haWwiOiJhcEBtYWlsaW5hdG9yLmNvbSJ9.oW5Ym4MT-HmKQlXIPd1u7bJBdJRyWU6B6wzJN7pNh90)

## Информация по профессиям и доступным для них компетенциям
[http://127.0.0.1:8080/api/profession](http://127.0.0.1:8080/api/profession)

В выводе куча служебных полей, но полагаю, что для MVP это не страшно

## Рекомендации по курсам
[http://127.0.0.1:8080/api/courses/recommend?competency[probabiltyBasics]=0.5](http://127.0.0.1:8080/api/courses/recommend?competency[probabiltyBasics]=0.5)

В массиве `competency` - компетенции с рейтингами, по которым будут даваться рекомендации. Рекомендации по курсам отдаются в порядке уменьшения возможного прироста компетенций (`totalIncrement`).

## Поиск курсов
[http://127.0.0.1:8080/api/courses/search?modeOfStudy=selfStudy&courseForm=video&certificate=1&skills[354]=knowledge&skills[380]=skill&requirements[361]=knowledge](http://127.0.0.1:8080/api/courses/search?modeOfStudy=selfStudy&courseForm=video&certificate=1&skills[354]=knowledge&skills[380]=skill&requirements[361]=knowledge)

В массивах `skills` и `requirements` - id навыков из таблицы `atomicSkills`.
В результатах курса будут те, у которых `skills` выше или равны запрошенным (т.е. они дают знаний столько же или больше, чем просит пользователь) и
и `requirements` меньше или равны запрошенным (т.е. знаний для них нужно меньше или столько же, чем есть у пользователя).
Возможные значения уровней по навыкам и требованиям перечислены в `api/Skill/Skill.php`, а доступные варианты по прочим полям фильтра
перечислены в `api/Course/Course.php`.

[http://127.0.0.1:8080/api/courses/search?modeOfStudy=selfStudy&courseForm=video&certificate=1&userSkills[354]=knowledge&userSkills[380]=skill](http://127.0.0.1:8080/api/courses/search?modeOfStudy=selfStudy&courseForm=video&certificate=1&userSkills[354]=knowledge&userSkills[380]=skill)
Если заполнен массив `userSkills`, то поиск осуществляется по указанным навыкам пользователя. Т.е. подбираются такие курсы,
которые дадут знаний больше чем есть, но требуют меньше, чем есть. Технически заполнение этого массива эквивалентно заполнению
массивов `skills` и `requirements` одинаковым набором навыков. 