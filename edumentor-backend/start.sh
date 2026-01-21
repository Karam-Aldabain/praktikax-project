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

sed -i 's|^listen = .*|listen = 127.0.0.1:9000|' /usr/local/etc/php-fpm.d/www.conf
sed -i 's|^;listen.allowed_clients = .*|listen.allowed_clients = 127.0.0.1|' /usr/local/etc/php-fpm.d/www.conf

php-fpm -D
nginx -g 'daemon off;'
