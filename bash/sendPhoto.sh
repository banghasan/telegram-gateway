#!/bin/bash
URL=${URL:-http://localhost:11000}
ID=${ID:-213567634}
PHOTO=${PHOTO:-"https://avatars.githubusercontent.com/u/5436959?v=1"}
CAPTION=${CAPTION:-"Foto bangHasan"}
PARSE_MODE=${PARSE_MODE:-Markdown}

curl -X POST "$URL/sendPhoto" \
  -H "Content-Type: application/json" \
  -d "{
    \"chat_id\": \"$ID\",
    \"photo\": \"$PHOTO\",
    \"caption\": \"$CAPTION\",
    \"parse_mode\": \"$PARSE_MODE\"
  }"
