#!/bin/bash
URL=${URL:-http://localhost:11000}
ID=${ID:-213567634}
TEXT=${TEXT:-"*Halo!*\\nIni baris kedua.\\nDan ini baris ketiga."}
PARSE_MODE=${PARSE_MODE:-Markdown}
API_KEY=${API_KEY:-}

curl -X POST "$URL/sendMessage" \
  -H "Content-Type: application/json" \
  ${API_KEY:+-H "X-API-Key: $API_KEY"} \
  -d "{
    \"chat_id\": \"$ID\",
    \"text\": \"$TEXT\",
    \"parse_mode\": \"$PARSE_MODE\"
  }"
