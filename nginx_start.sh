#!/bin/bash
set -e

cp nginx.conf /etc/nginx/conf.d
nginx
