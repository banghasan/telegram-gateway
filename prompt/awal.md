buatkan aplikasi menggunakan bun dan ElysiaJS

letakkan setingan di .env dan buatkan samplenya juga
selalu dokumentasikan di readme
dan buat samplenya menggunakan curl

aplikasi web api restfull
jika menerima POST yang akan diteruskan ke base url
default base url api local telegram adalah localhost:8081

pakai framework telegram grammY

jika saya kirim curl POST ke /sendMessage
maka akan mengirim sendMesage ke base url

method sendMessage, sendAction, dan lain-lain adalah yang sudah tersedia dia grammy (bot api telegram)

contoh:

curl -X POST "http://localhost/sendMessage" \
     -H "Content-Type: application/json" \
     -d '{
          "chat_id": "<ID_CHAT_ANDA>",
          "text": "**Halo!**\nIni baris kedua.\nDan ini baris ketiga.",
          "parse_mode": "Markdown"
         }'

maka akan diteruskan ke https://BASE_URL_TARGET/bot<TELEGRAM_TOKEN_BOT>/sendMessage
- BASE_URL_TARGET diambil dari .env 
- TELEGRAM_TOKEN_BOT diambil dari .env
- sendMessage adalah method yang diisi sesuai api telegram apa saja, dengan payload sesuai method tersebut

kemudian akan merespon sesuai hasilnya.

di .env ada setingan juga untuk binding host (default: localhost) dan port (default 11000) untuk servis web ini

buat agar menjalankan jadi bun task dev, start, atau sejenisnya.
ada juga format lint, dan unit test
