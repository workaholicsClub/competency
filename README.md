# Установка и запуск виртуалки на Docker
## Установка docker

```
sudo apt-get install docker.io
sudo usermod -aG docker $(whoami) # чтобы можно было работать с dockerом от текущего пользователя
sudo curl -L https://github.com/docker/compose/releases/download/1.18.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```
После установки нужно перелогинится

## Установка зависимостей
```
composer install
cp .env.sample .env
docker-compose build # или sudo docker-compose build, если текущий пользователь без прав доступа
```  
Затем нужно аменить в файле `.env` значение `HOST_IP` на свой IP-адрес (можно посмотреть в выводе `ifconfig -a`)

## Рутинный запуск
`docker-compose up` - в интерактивном режиме  
`docker-compose up -d` - в фоновом режиме

[Установка для Windows и MacOS](https://docs.docker.com/compose/install/#install-compose) (см. вкладки Windows/MacOS на странице по ссылке)   

# БД
Дамп базы данных лежит в папке `etc/database/dump.sql`

# Общее
Проект и правила работы с ним содержатся в этом репозитории. Если хочется что-то изменить или предложить, стоит начать с пулл-запроса. Пулл-запрос запрос это хорошее место обсуждений.

[Доска проекта в Trello](https://trello.com/b/TgQ4Ysc1/%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82-%D0%BC%D0%B0%D1%82%D1%80%D0%B8%D1%86%D1%8B)

# Страницы и функционал
Фронтенд предлагается делать как SPA.

[Описание API](https://github.com/workaholicsClub/competency/blob/master/docs/api.md)  
[Главная](https://github.com/workaholicsClub/competency/blob/master/docs/main.md)  
[Выполнение теста](https://github.com/workaholicsClub/competency/blob/master/docs/progress.md)  
[Результаты теста](https://github.com/workaholicsClub/competency/blob/master/docs/results.md)  

# Геймификация и игровая механика
[Идеи по игровым моментам](https://github.com/workaholicsClub/competency/blob/master/docs/game.md)