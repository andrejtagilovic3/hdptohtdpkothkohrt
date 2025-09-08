# Environment Variables для NFT Battle Arena

# Порт сервера
PORT=3000

# URL фронтенда
FRONTEND_URL=http://localhost:3000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/nft-battle-arena
# Для MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nft-battle-arena?retryWrites=true&w=majority

# Telegram Bot
TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN_HERE
TELEGRAM_WEBHOOK_URL=https://your-app.vercel.app/api/telegram-webhook

# Telegram Payments
TELEGRAM_PAYMENTS_TOKEN=YOUR_PAYMENTS_TOKEN_HERE

# TON (для будущей интеграции NFT)
TON_RPC_ENDPOINT=https://toncenter.com/api/v2/jsonRPC
TON_WALLET_MNEMONIC=your wallet mnemonic here
TON_WALLET_ADDRESS=your_ton_wallet_address

# Security
JWT_SECRET=your_jwt_secret_here_minimum_32_characters
API_SECRET=your_api_secret_here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Environment
NODE_ENV=development

# Logging
LOG_LEVEL=info

# CORS
CORS_ORIGIN=*