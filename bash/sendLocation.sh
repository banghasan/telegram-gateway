#!/bin/bash
URL=${URL:-http://localhost:11000}
ID=${ID:-213567634}
LAT=${LAT:-"-6.200000"}
LON=${LON:-"106.816666"}

curl -X POST "$URL/sendLocation" \
  -H "Content-Type: application/json" \
  -d "{
    \"chat_id\": \"$ID\",
    \"latitude\": $LAT,
    \"longitude\": $LON
  }"
