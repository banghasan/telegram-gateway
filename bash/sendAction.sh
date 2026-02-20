#!/bin/bash
URL=${URL:-http://localhost:11000}
ID=${ID:-213567634}
ACTION=${ACTION:-typing}
API_KEY=${API_KEY:-}

curl -X POST "$URL/sendChatAction" \
  -H "Content-Type: application/json" \
  ${API_KEY:+-H "X-API-Key: $API_KEY"} \
  -d "{
    \"chat_id\": \"$ID\",
    \"action\": \"$ACTION\"
  }"
