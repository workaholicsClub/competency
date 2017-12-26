# Установка
`composer install`  
`sudo apt-get docker.io install`  
`docker-compose up` - в интерактивном режиме  
`docker-compose up -d` - в фоновом режиме  

# БД
Дамп базы данных лежит в папке `etc/database/dump.sql`

#API
## Отправка регистрационного письма
http://127.0.0.1:8080/user/token/ap@mailinator.com
Для тестовых целей в mailgunе добавлен только адрес ap@mailinator.com. Смотреть можно тут: https://www.mailinator.com/v2/inbox.jsp?zone=public&query=ap

## Информация о пользователе по токену
http://127.0.0.1:8080/user?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJtYXRyaXgiLCJpYXQiOjE1MTM3MDAwMDAsImV4cCI6MTUxMzcxMDgwMCwiZW1haWwiOiJhcEBtYWlsaW5hdG9yLmNvbSJ9.oW5Ym4MT-HmKQlXIPd1u7bJBdJRyWU6B6wzJN7pNh90


