FROM php:8.2-fpm

RUN apt-get update \
  && apt-get install -y libzip-dev libpq-dev nginx \
  && docker-php-ext-install pdo pdo_mysql pdo_pgsql zip \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html
COPY . ./

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

CMD ["/usr/local/bin/start.sh"]
