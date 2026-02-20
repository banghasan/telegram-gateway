# Telegram Gateway (Bun + ElysiaJS + grammY)

Gateway REST API untuk meneruskan request ke Telegram Bot API (atau base URL lokal) menggunakan grammY.

**Fitur**
- Meneruskan `POST /:method` ke `${TELEGRAM_BASE_URL}/bot${TELEGRAM_BOT_TOKEN}/:method`
- Mendukung semua method Bot API Telegram (contoh `sendMessage`, `sendChatAction`, dll.)
- Konfigurasi lewat `.env`

**Prasyarat**
- Bun

**Konfigurasi**
- Salin `.env.example` menjadi `.env` lalu isi nilainya

Variabel lingkungan yang digunakan:
- `HOST` default `localhost`
- `PORT` default `11000`
- `TELEGRAM_BASE_URL` default `http://localhost:8081`
- `TELEGRAM_BOT_TOKEN` wajib diisi
- `TIMEZONE` default `Asia/Jakarta` (format timestamp log)
- `APP_NAME` default `Telegram Gateway`
- `API_KEY` opsional, jika diisi maka wajib kirim header `X-API-Key`
- `TELEGRAM_ALLOWED_METHODS` opsional, daftar method Telegram yang diizinkan (dipisah koma). Jika kosong/tidak diisi, semua method diizinkan.

**Endpoint**
- `GET /` informasi aplikasi dan versi
- `GET /health` status sederhana
- `POST /:method` meneruskan request ke Telegram Bot API

**Menjalankan**
```bash
bun install
bun run dev
```

**Script**
- `bun run dev` untuk mode watch
- `bun run start` untuk run biasa
- `bun run lint` untuk lint
- `bun run format` untuk format
- `bun run test` untuk unit test
- `bun run version` untuk bump versi (interaktif)
- `bun run version patch|minor|major` untuk bump versi tanpa prompt

**Penjelasan Bump Versi**
- `patch` perbaikan kecil/bugfix, tanpa perubahan besar
- `minor` fitur baru, tetap kompatibel
- `major` perubahan besar, tidak kompatibel

**Contoh cURL**
Mengirim `sendMessage`:
```bash
curl -X POST "http://localhost:11000/sendMessage" \
  -H "Content-Type: application/json" \
  -d '{
    "chat_id": "213567634",
    "text": "**Halo!**\nIni baris kedua.\nDan ini baris ketiga.",
    "parse_mode": "Markdown"
  }'
```

Jika `API_KEY` diisi, tambahkan header berikut pada semua request:
```bash
-H "X-API-Key: <API_KEY_ANDA>"
```

Mengirim `sendChatAction`:
```bash
curl -X POST "http://localhost:11000/sendChatAction" \
  -H "Content-Type: application/json" \
  -d '{
    "chat_id": "<ID_CHAT_ANDA>",
    "action": "typing"
  }'
```

**Contoh Bash Script (`/bash`)**
- `bash/sendMessage.sh`
- `bash/sendMessageInlineButtons.sh`
- `bash/sendLocation.sh`
- `bash/sendAction.sh`
- `bash/sendPhoto.sh`
- `bash/sendVenue.sh`

Semua script bisa menerima `API_KEY` (opsional), contoh:
```bash
API_KEY=secret bash bash/sendMessage.sh
```

**Catatan**
- Gateway akan meneruskan request ke `TELEGRAM_BASE_URL` + `/bot` + `TELEGRAM_BOT_TOKEN` + `/:method`
- Respon dari Telegram akan diteruskan apa adanya ke client
