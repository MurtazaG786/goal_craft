#!/bin/sh
set -e

API_URL_VALUE="${API_URL:-}"

cat <<EOF >/usr/share/nginx/html/config.js
window.__CONFIG__ = {
  API_URL: "${API_URL_VALUE}"
};
EOF

exec "$@"
