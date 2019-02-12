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