#!/bin/sh
set -e

if [ -z "$PORT" ]; then
  PORT=8080
fi

if [ -z "$CORS_ORIGIN" ]; then
  CORS_ORIGIN="*"
fi

envsubst '$PORT $CORS_ORIGIN' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

echo "Using PORT=$PORT"
nginx -t

sed -i 's|^listen = .*|listen = /var/run/php-fpm.sock|' /usr/local/etc/php-fpm.d/www.conf
sed -i 's|^;listen.allowed_clients = .*|;listen.allowed_clients = 127.0.0.1|' /usr/local/etc/php-fpm.d/www.conf
sed -i 's|^;listen.owner = .*|listen.owner = www-data|' /usr/local/etc/php-fpm.d/www.conf
sed -i 's|^;listen.group = .*|listen.group = www-data|' /usr/local/etc/php-fpm.d/www.conf
sed -i 's|^;listen.mode = .*|listen.mode = 0660|' /usr/local/etc/php-fpm.d/www.conf

mkdir -p /var/run

php-fpm -D
nginx -g 'daemon off;'
