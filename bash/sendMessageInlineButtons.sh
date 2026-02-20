#!/bin/bash
URL=${URL:-http://localhost:11000}
ID=${ID:-213567634}
TEXT=${TEXT:-"Pilih tombol di bawah."}
PARSE_MODE=${PARSE_MODE:-Markdown}
API_KEY=${API_KEY:-}

BTN_CALLBACK_TEXT=${BTN_CALLBACK_TEXT:-"Callback"}
BTN_CALLBACK_DATA=${BTN_CALLBACK_DATA:-"cb_hello"}

BTN_URL_TEXT=${BTN_URL_TEXT:-"🎯 bangHasan"}
BTN_URL=${BTN_URL:-"https://banghasan.com"}

curl -X POST "$URL/sendMessage" \
  -H "Content-Type: application/json" \
  ${API_KEY:+-H "X-API-Key: $API_KEY"} \
  -d "{
    \"chat_id\": \"$ID\",
    \"text\": \"$TEXT\",
    \"parse_mode\": \"$PARSE_MODE\",
    \"reply_markup\": {
      \"inline_keyboard\": [
        [
          {\"text\": \"$BTN_CALLBACK_TEXT\", \"callback_data\": \"$BTN_CALLBACK_DATA\"},
          {\"text\": \"$BTN_URL_TEXT\", \"url\": \"$BTN_URL\", \"style\": \"primary\"}
        ]
      ]
    }
  }"
