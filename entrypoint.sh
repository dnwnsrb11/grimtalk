#!/bin/sh
export $(grep -v "^#" /usr/share/nginx/frontend.env | xargs)
exec "$@"