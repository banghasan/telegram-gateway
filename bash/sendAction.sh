#!/bin/bash
URL=${URL:-http://localhost:11000}
ID=${ID:-213567634}
ACTION=${ACTION:-typing}

curl -X POST "$URL/sendChatAction" \
  -H "Content-Type: application/json" \
  -d "{
    \"chat_id\": \"$ID\",
    \"action\": \"$ACTION\"
  }"
