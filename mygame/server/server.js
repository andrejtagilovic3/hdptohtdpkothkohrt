// NFT Battle Arena - Node.js Backend
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

// Инициализация Express приложения
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 100, // лимит запросов с IP
    message: 'Слишком много запросов, попробуйте позже'
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// Подключение к MongoDB
let db;
const mongoClient = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/nft-battle-arena');

async function connectToDatabase() {
    try {
        await mongoClient.connect();
        db = mongoClient.db();
        console.log('✅ Подключение к MongoDB успешно');
        
        // Создаём индексы
        await db.collection('users').createIndex({ telegramId: 1 }, { unique: true });
        await db.collection('battles').createIndex({ createdAt: 1 });
        
    } catch (error) {
        console.error('❌ Ошибка подключения к MongoDB:', error);
        process.exit(1);
    }
}

// Middleware для валидации Telegram пользователя
function validateTelegramUser(req, res, next) {
    const { telegramId, username } = req.body;
    
    if (!telegramId) {
        return res.status(400).json({ error: 'Telegram ID обязателен' });
    }
    
    req.user = { telegramId: String(telegramId), username };
    next();
}

// Middleware для получения пользователя из БД
async function getUser(req, res, next) {
    try {
        const user = await db.collection('users').findOne({ 
            telegramId: req.user.telegramId 
        });
        
        if (!user) {
            // Создаём нового пользователя
            const newUser = {
                telegramId: req.user.telegramId,
                username: req.user.username,
                stars: 100,
                collection: [],
                activeBattleNft: null,
                totalBattles: 0,
                wins: 0,
                losses: 0,
                createdAt: new Date(),
                lastActive: new Date()
            };
            
            const result = await db.collection('users').insertOne(newUser);
            req.user = { ...newUser, _id: result.insertedId };
        } else {
            // Обновляем время последней активности
            await db.collection('users').updateOne(
                { _id: user._id },
                { $set: { lastActive: new Date() } }
            );
            req.user = user;
        }
        
        next();
    } catch (error) {
        console.error('Ошибка получения пользователя:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
}

// API Routes

// Получение данных пользователя
app.post('/api/user/profile', validateTelegramUser, getUser, (req, res) => {
    const { stars, collection, activeBattleNft, totalBattles, wins, losses } = req.user;
    
    res.json({
        success: true,
        data: {
            stars,
            collection,
            activeBattleNft,
            stats: {
                totalBattles,
                wins,
                losses,
                winRate: totalBattles > 0 ? Math.round((wins / totalBattles) * 100) : 0
            }
        }
    });
});

// Обновление звёзд пользователя
app.post('/api/user/update-stars', validateTelegramUser, getUser, async (req, res) => {
    try {
        const { stars } = req.body;
        
        if (typeof stars !== 'number' || stars < 0) {
            return res.status(400).json({ error: 'Некорректное количество звёзд' });
        }
        
        await db.collection('users').updateOne(
            { _id: req.user._id },
            { $set: { stars } }
        );
        
        res.json({ success: true, stars });
    } catch (error) {
        console.error('Ошибка обновления звёзд:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Покупка NFT
app.post('/api/nft/buy', validateTelegramUser, getUser, async (req, res) => {
    try {
        const { nftData, price } = req.body;
        
        if (!nftData || !price || typeof price !== 'number') {
            return res.status(400).json({ error: 'Некорректные данные NFT' });
        }
        
        if (req.user.stars < price) {
            return res.status(400).json({ error: 'Недостаточно звёзд' });
        }
        
        const newNft = {
            ...nftData,
            buyPrice: price,
            buyDate: new Date(),
            id: new ObjectId().toString()
        };
        
        const newStars = req.user.stars - price;
        const newCollection = [...req.user.collection, newNft];
        
        await db.collection('users').updateOne(
            { _id: req.user._id },
            { 
                $set: { 
                    stars: newStars,
                    collection: newCollection 
                }
            }
        );
        
        res.json({ 
            success: true, 
            stars: newStars,
            nft: newNft
        });
    } catch (error) {
        console.error('Ошибка покупки NFT:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Продажа NFT
app.post('/api/nft/sell', validateTelegramUser, getUser, async (req, res) => {
    try {
        const { nftId } = req.body;
        
        const nft = req.user.collection.find(n => n.id === nftId);
        if (!nft) {
            return res.status(404).json({ error: 'NFT не найден' });
        }
        
        if (nft.wonInBattle) {
            return res.status(400).json({ error: 'Выигранные NFT нельзя продать' });
        }
        
        const sellPrice = Math.floor(nft.buyPrice * 0.8);
        const newStars = req.user.stars + sellPrice;
        const newCollection = req.user.collection.filter(n => n.id !== nftId);
        
        // Убираем из активного NFT, если продаём его
        let activeBattleNft = req.user.activeBattleNft;
        if (activeBattleNft && activeBattleNft.id === nftId) {
            activeBattleNft = null;
        }
        
        await db.collection('users').updateOne(
            { _id: req.user._id },
            { 
                $set: { 
                    stars: newStars,
                    collection: newCollection,
                    activeBattleNft
                }
            }
        );
        
        res.json({ 
            success: true, 
            stars: newStars,
            sellPrice
        });
    } catch (error) {
        console.error('Ошибка продажи NFT:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Установка активного NFT для битвы
app.post('/api/battle/set-nft', validateTelegramUser, getUser, async (req, res) => {
    try {
        const { nftId } = req.body;
        
        let activeBattleNft = null;
        if (nftId) {
            activeBattleNft = req.user.collection.find(n => n.id === nftId);
            if (!activeBattleNft) {
                return res.status(404).json({ error: 'NFT не найден в коллекции' });
            }
        }
        
        await db.collection('users').updateOne(
            { _id: req.user._id },
            { $set: { activeBattleNft } }
        );
        
        res.json({ 
            success: true, 
            activeBattleNft
        });
    } catch (error) {
        console.error('Ошибка установки активного NFT:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Начало битвы
app.post('/api/battle/start', validateTelegramUser, getUser, async (req, res) => {
    try {
        const { playerNft } = req.body;
        
        if (!req.user.activeBattleNft) {
            return res.status(400).json({ error: 'Не выбран NFT для битвы' });
        }
        
        if (req.user.stars < 10) {
            return res.status(400).json({ error: 'Недостаточно звёзд для битвы' });
        }
        
        // Генерируем случайного противника
        const nftTemplates = [
            { name: 'Календарь Бота', img: 'assets/nft/calendar.gif' },
            { name: 'Doge Воин', img: 'assets/nft/doge.gif' },
            { name: 'Pepe Мастер', img: 'assets/nft/pepe.gif' },
            { name: 'Мистик NFT', img: 'assets/nft/other.gif' }
        ];
        
        const enemyNft = nftTemplates[Math.floor(Math.random() * nftTemplates.length)];
        enemyNft.id = new ObjectId().toString();
        
        // Создаём запись битвы
        const battle = {
            playerId: req.user._id,
            playerTelegramId: req.user.telegramId,
            playerNft: req.user.activeBattleNft,
            enemyNft,
            status: 'started',
            createdAt: new Date()
        };
        
        const battleResult = await db.collection('battles').insertOne(battle);
        
        // Списываем звёзды за битву
        await db.collection('users').updateOne(
            { _id: req.user._id },
            { 
                $inc: { 
                    stars: -10,
                    totalBattles: 1 
                }
            }
        );
        
        res.json({
            success: true,
            battleId: battleResult.insertedId,
            enemyNft,
            remainingStars: req.user.stars - 10
        });
    } catch (error) {
        console.error('Ошибка начала битвы:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Завершение битвы
app.post('/api/battle/finish', validateTelegramUser, getUser, async (req, res) => {
    try {
        const { battleId, playerWon, enemyNft } = req.body;
        
        if (!ObjectId.isValid(battleId)) {
            return res.status(400).json({ error: 'Некорректный ID битвы' });
        }
        
        const battle = await db.collection('battles').findOne({
            _id: new ObjectId(battleId),
            playerId: req.user._id
        });
        
        if (!battle) {
            return res.status(404).json({ error: 'Битва не найдена' });
        }
        
        if (battle.status !== 'started') {
            return res.status(400).json({ error: 'Битва уже завершена' });
        }
        
        // Обновляем статус битвы
        await db.collection('battles').updateOne(
            { _id: new ObjectId(battleId) },
            {
                $set: {
                    status: 'finished',
                    playerWon,
                    finishedAt: new Date()
                }
            }
        );
        
        let updateData = {};
        let wonNft = null;
        
        if (playerWon) {
            // Добавляем выигранный NFT в коллекцию
            wonNft = {
                ...enemyNft,
                buyPrice: 0,
                wonInBattle: true,
                wonDate: new Date(),
                id: new ObjectId().toString()
            };
            
            updateData = {
                $inc: { wins: 1 },
                $push: { collection: wonNft }
            };
        } else {
            updateData = {
                $inc: { losses: 1 }
            };
        }
        
        await db.collection('users').updateOne(
            { _id: req.user._id },
            updateData
        );
        
        res.json({
            success: true,
            playerWon,
            wonNft
        });
    } catch (error) {
        console.error('Ошибка завершения битвы:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Покупка звёзд через Telegram Stars
app.post('/api/payment/buy-stars', validateTelegramUser, getUser, async (req, res) => {
    try {
        const { amount, telegramPaymentData } = req.body;
        
        // В реальном приложении здесь должна быть валидация платежа через Telegram
        // Пример проверки платежа (требует настройки бота и webhook'ов)
        /*
        const isValidPayment = await validateTelegramPayment(telegramPaymentData);
        if (!isValidPayment) {
            return res.status(400).json({ error: 'Неверные данные платежа' });
        }
        */
        
        const starsToAdd = amount || 100; // По умолчанию 100 звёзд
        const newStars = req.user.stars + starsToAdd;
        
        await db.collection('users').updateOne(
            { _id: req.user._id },
            { $set: { stars: newStars } }
        );
        
        // Записываем транзакцию
        await db.collection('transactions').insertOne({
            userId: req.user._id,
            telegramId: req.user.telegramId,
            type: 'purchase',
            amount: starsToAdd,
            paymentData: telegramPaymentData,
            createdAt: new Date()
        });
        
        res.json({
            success: true,
            stars: newStars,
            added: starsToAdd
        });
    } catch (error) {
        console.error('Ошибка покупки звёзд:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Получение топ игроков (лидерборд)
app.get('/api/leaderboard', async (req, res) => {
    try {
        const topPlayers = await db.collection('users')
            .find({})
            .sort({ wins: -1, totalBattles: -1 })
            .limit(50)
            .project({
                username: 1,
                wins: 1,
                losses: 1,
                totalBattles: 1
            })
            .toArray();
        
        const leaderboard = topPlayers.map((player, index) => ({
            rank: index + 1,
            username: player.username || 'Анонимный игрок',
            wins: player.wins || 0,
            losses: player.losses || 0,
            totalBattles: player.totalBattles || 0,
            winRate: player.totalBattles > 0 
                ? Math.round((player.wins / player.totalBattles) * 100) 
                : 0
        }));
        
        res.json({
            success: true,
            leaderboard
        });
    } catch (error) {
        console.error('Ошибка получения лидерборда:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Получение статистики игры
app.get('/api/stats', async (req, res) => {
    try {
        const totalUsers = await db.collection('users').countDocuments({});
        const totalBattles = await db.collection('battles').countDocuments({});
        const activePlayers = await db.collection('users').countDocuments({
            lastActive: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // за последнюю неделю
        });
        
        res.json({
            success: true,
            stats: {
                totalUsers,
                totalBattles,
                activePlayers
            }
        });
    } catch (error) {
        console.error('Ошибка получения статистики:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Webhook для Telegram Bot (для обработки платежей)
app.post('/api/telegram-webhook', express.raw({ type: 'application/json' }), (req, res) => {
    try {
        // Обработка webhook'ов от Telegram (платежи, события бота)
        const update = JSON.parse(req.body);
        
        if (update.pre_checkout_query) {
            // Обработка предварительного запроса оплаты
            // Здесь можно добавить дополнительные проверки
        }
        
        if (update.message && update.message.successful_payment) {
            // Обработка успешного платежа
            const payment = update.message.successful_payment;
            // Добавить звёзды пользователю
        }
        
        res.status(200).send('OK');
    } catch (error) {
        console.error('Ошибка webhook:', error);
        res.status(500).send('Error');
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Статические файлы для фронтенда (в продакшене)
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('../'));
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../index.html'));
    });
}

// Обработка ошибок
app.use((error, req, res, next) => {
    console.error('Ошибка сервера:', error);
    res.status(500).json({ 
        error: process.env.NODE_ENV === 'production' 
            ? 'Внутренняя ошибка сервера' 
            : error.message 
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint не найден' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('🛑 Получен сигнал SIGINT, завершаем работу...');
    
    try {
        await mongoClient.close();
        console.log('✅ Соединение с MongoDB закрыто');
        process.exit(0);
    } catch (error) {
        console.error('❌ Ошибка при закрытии соединения:', error);
        process.exit(1);
    }
});

// Запуск сервера
async function startServer() {
    try {
        await connectToDatabase();
        
        app.listen(PORT, () => {
            console.log(`🚀 Сервер запущен на порту ${PORT}`);
            console.log(`🌍 Режим: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('❌ Ошибка запуска сервера:', error);
        process.exit(1);
    }
}

startServer();