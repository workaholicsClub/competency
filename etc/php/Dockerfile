FROM php:7.3-fpm

RUN apt-get update && apt-get -y install libsqlite3-dev libicu-dev && docker-php-ext-install mysqli pdo_mysql pdo_sqlite intl
RUN pecl install mongodb \
    &&  echo "extension=mongodb.so" > /usr/local/etc/php/conf.d/mongo.ini
#RUN yes | pecl install xdebug