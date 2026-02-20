#!/bin/bash
URL=${URL:-http://localhost:11000}
ID=${ID:-213567634}
LAT=${LAT:-"-6.200000"}
LON=${LON:-"106.816666"}
API_KEY=${API_KEY:-}

curl -X POST "$URL/sendLocation" \
  -H "Content-Type: application/json" \
  ${API_KEY:+-H "X-API-Key: $API_KEY"} \
  -d "{
    \"chat_id\": \"$ID\",
    \"latitude\": $LAT,
    \"longitude\": $LON
  }"
