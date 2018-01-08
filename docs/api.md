# API
Все взаимодействие с сервисом происходит через API. 

## Отправка регистрационного письма
[http://127.0.0.1:8080/user/token/ap@mailinator.com](http://127.0.0.1:8080/user/token/ap@mailinator.com)

Для тестовых целей в mailgunе добавлен только адрес ap@mailinator.com.  
Смотреть можно тут: [https://www.mailinator.com/v2/inbox.jsp?zone=public&query=ap](https://www.mailinator.com/v2/inbox.jsp?zone=public&query=ap)

## Информация о пользователе по токену
[http://127.0.0.1:8080/user?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJtYXRyaXgiLCJpYXQiOjE1MTM3MDAwMDAsImV4cCI6MTUxMzcxMDgwMCwiZW1haWwiOiJhcEBtYWlsaW5hdG9yLmNvbSJ9.oW5Ym4MT-HmKQlXIPd1u7bJBdJRyWU6B6wzJN7pNh90](http://127.0.0.1:8080/user?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJtYXRyaXgiLCJpYXQiOjE1MTM3MDAwMDAsImV4cCI6MTUxMzcxMDgwMCwiZW1haWwiOiJhcEBtYWlsaW5hdG9yLmNvbSJ9.oW5Ym4MT-HmKQlXIPd1u7bJBdJRyWU6B6wzJN7pNh90)

## Информация по профессиям и доступным для них компетенциям
[http://127.0.0.1:8080/profession](http://127.0.0.1:8080/profession)

В выводе куча служебных полей, но полагаю, что для MVP это не страшно
