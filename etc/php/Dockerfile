FROM php:7.1-fpm

RUN apt-get update && apt-get -y install libsqlite3-dev libicu-dev && docker-php-ext-install mysqli pdo_mysql pdo_sqlite intl
#RUN yes | pecl install xdebug