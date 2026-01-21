#!/bin/sh
set -e

if [ -z "$PORT" ]; then
  PORT=8080
fi

envsubst '$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

php-fpm -D
nginx -g 'daemon off;'
