#!/bin/bash
URL=${URL:-http://localhost:11000}
ID=${ID:-213567634}
TEXT=${TEXT:-"*Halo!*\\nIni baris kedua.\\nDan ini baris ketiga."}
PARSE_MODE=${PARSE_MODE:-Markdown}

curl -X POST "$URL/sendMessage" \
  -H "Content-Type: application/json" \
  -d "{
    \"chat_id\": \"$ID\",
    \"text\": \"$TEXT\",
    \"parse_mode\": \"$PARSE_MODE\"
  }"
