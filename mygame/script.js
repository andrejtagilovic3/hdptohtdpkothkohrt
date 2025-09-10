Telegram.WebApp.ready();

const cloudStorage = Telegram.WebApp.CloudStorage;

const nftTemplates = [
    { name: 'Bday candle', img: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/imgg/bdaycandle.gif', tier: 'basic' },
    { name: 'Big Year', img: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/imgg/bigyear.gif', tier: 'basic' },
    { name: 'Durev', img: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/imgg/durev.gif', tier: 'basic' },
    { name: 'Electric Skull', img: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/imgg/electricskull.gif', tier: 'premium' },
    { name: 'Jelly Bean', img: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/imgg/jellybean.gif', tier: 'basic' },
    { name: 'Low Rider', img: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/imgg/lowrider.gif', tier: 'basic' },
    { name: 'Siber', img: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/imgg/siber.gif', tier: 'basic' },
    { name: 'Skull Flower', img: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/imgg/SkullFlower_holders.gif', tier: 'basic' },
    { name: 'Snoop Dog', img: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/imgg/SnoopDogSkins.gif', tier: 'basic' },
    { name: 'Snoops Cigars', img: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/imgg/SnoopsCigars.gif', tier: 'premium' },
    { name: 'Swag Bag', img: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/imgg/Swag_Bag.gif', tier: 'basic' },
    { name: 'Vintage Cigar', img: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/imgg/VintageCigar.gif', tier: 'basic' },
    { name: 'West Side', img: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/imgg/WestSide.gif', tier: 'premium' },
    { name: 'Bday candle 2v', img: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/imgg/1.tgs', tier: 'premium' }
];

const nftPrices = [100, 150, 200, 250, 440, 350, 240, 85, 200, 300, 700, 500, 220, 450];

// Основные переменные игры
let stars = 100;
let collection = [];
let activeBattleNft = null;
let totalStarsEarned = 0;
let battleHistory = [];

// Фильтр магазина
let currentFilter = 'price_asc';
const popularityOrder = [0, 3, 9, 12, 6, 13, 11, 2, 5, 1, 8, 4, 7, 10];

function toggleFilter() {
    const dropdown = document.getElementById('filter-dropdown');
    const filterBtn = document.getElementById('filter-btn');
    
    if (dropdown.style.display === 'none') {
        dropdown.style.display = 'block';
        filterBtn.classList.add('active');
        
        setTimeout(() => {
            document.addEventListener('click', closeFilterOnOutsideClick);
        }, 0);
    } else {
        dropdown.style.display = 'none';
        filterBtn.classList.remove('active');
        document.removeEventListener('click', closeFilterOnOutsideClick);
    }
}

function closeFilterOnOutsideClick(event) {
    const filterContainer = document.querySelector('.filter-container');
    if (!filterContainer.contains(event.target)) {
        document.getElementById('filter-dropdown').style.display = 'none';
        document.getElementById('filter-btn').classList.remove('active');
        document.removeEventListener('click', closeFilterOnOutsideClick);
    }
}

function setFilter(filterType) {
    currentFilter = filterType;
    
    document.querySelectorAll('.filter-option').forEach(option => {
        option.classList.remove('active');
    });
    event.target.closest('.filter-option').classList.add('active');
    
    document.getElementById('filter-dropdown').style.display = 'none';
    document.getElementById('filter-btn').classList.remove('active');
    document.removeEventListener('click', closeFilterOnOutsideClick);
    
    const filterBtn = document.getElementById('filter-btn');
    const iconElement = filterBtn.querySelector('i:first-child');
    
    switch(filterType) {
        case 'price_asc':
            iconElement.className = 'fas fa-dollar-sign';
            break;
        case 'price_desc':
            iconElement.className = 'fas fa-dollar-sign';
            break;
        case 'popularity':
            iconElement.className = 'fas fa-fire';
            break;
    }
    
    renderShop();
}

// Реферальная система
let referralCode = '';
let referredFriends = [];
let starsFromReferrals = 0;

const tgUser = Telegram.WebApp.initDataUnsafe?.user;
let userName = tgUser?.first_name || 'Игрок';
let userAvatar = tgUser?.photo_url || '👤';
let userId = tgUser?.id || Math.random().toString(36).substr(2, 9);

let playerHP = 100;
let botHP = 100;
let botNft = null;
let battleInProgress = false;
let currentScreen = 'main';

// Флаг для предотвращения множественных сохранений
let isSaving = false;

init();

async function init() {
    console.log('Initializing game...');
    generateReferralCode();
    await loadData();
    initializeUpgrades(); // Добавлено: инициализация апгрейдов
    updateUI();
    renderCenterArea();
    renderCollection();
    renderShop();
    renderProfile();
    updateUserInfo();
    updateReferralInfo();
    console.log('Game initialized successfully');
}

async function loadData() {
    try {
        console.log('Loading data from cloud storage...');
       
        const starsStr = await getCloudItem('stars');
        const collectionStr = await getCloudItem('collection');
        const activeNftStr = await getCloudItem('activeBattleNft');
        const totalEarnedStr = await getCloudItem('totalStarsEarned');
        const historyStr = await getCloudItem('battleHistory');
        const referralCodeStr = await getCloudItem('referralCode');
        const friendsStr = await getCloudItem('referredFriends');
        const refStarsStr = await getCloudItem('starsFromReferrals');
        const upgradesStr = await getCloudItem('nftUpgrades'); // Добавлено: загрузка апгрейдов
       
        stars = starsStr ? parseInt(starsStr) : 100;
        collection = collectionStr ? JSON.parse(collectionStr) : [];
        activeBattleNft = activeNftStr ? JSON.parse(activeNftStr) : null;
        totalStarsEarned = totalEarnedStr ? parseInt(totalEarnedStr) : 0;
        battleHistory = historyStr ? JSON.parse(historyStr) : [];
        referralCode = referralCodeStr || '';
        referredFriends = friendsStr ? JSON.parse(friendsStr) : [];
        starsFromReferrals = refStarsStr ? parseInt(refStarsStr) : 0;
        if (upgradesStr) { // Добавлено: восстановление апгрейдов
            const parsed = JSON.parse(upgradesStr);
            collection.forEach((nft, i) => nft.upgrades = parsed[i] || []);
        }
       
        console.log('Data loaded:', {
            stars,
            collectionLength: collection.length,
            totalStarsEarned,
            battleHistoryLength: battleHistory.length,
            referralCode,
            friendsCount: referredFriends.length
        });
       
    } catch (error) {
        console.error('Error loading data:', error);
        stars = 100;
        collection = [];
        activeBattleNft = null;
        totalStarsEarned = 0;
        battleHistory = [];
        referralCode = '';
        referredFriends = [];
        starsFromReferrals = 0;
    }
}

async function saveData() {
    if (isSaving) {
        console.log('Already saving, skipping...');
        return;
    }
   
    isSaving = true;
    try {
        console.log('Saving data to cloud storage...', {
            stars,
            collectionLength: collection.length,
            totalStarsEarned,
            battleHistoryLength: battleHistory.length,
            referralCode,
            friendsCount: referredFriends.length
        });
       
        await setCloudItem('stars', stars.toString());
        await setCloudItem('collection', JSON.stringify(collection));
        await setCloudItem('activeBattleNft', JSON.stringify(activeBattleNft));
        await setCloudItem('totalStarsEarned', totalStarsEarned.toString());
        await setCloudItem('battleHistory', JSON.stringify(battleHistory));
        await setCloudItem('referralCode', referralCode);
        await setCloudItem('referredFriends', JSON.stringify(referredFriends));
        await setCloudItem('starsFromReferrals', starsFromReferrals.toString());
        await setCloudItem('nftUpgrades', JSON.stringify(collection.map(nft => nft.upgrades))); // Добавлено: сохранение апгрейдов
       
        console.log('Data saved successfully');
       
    } catch (error) {
        console.error('Error saving data:', error);
    } finally {
        isSaving = false;
    }
}

function getCloudItem(key) {
    return new Promise((resolve, reject) => {
        cloudStorage.getItem(key, (error, value) => {
            if (error) {
                console.error(`Error getting ${key}:`, error);
                resolve(null);
            } else {
                resolve(value);
            }
        });
    });
}

function setCloudItem(key, value) {
    return new Promise((resolve, reject) => {
        cloudStorage.setItem(key, value, (error, success) => {
            if (error || !success) {
                console.error(`Error setting ${key}:`, error);
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

function updateUserInfo() {
    document.getElementById('user-name').textContent = userName;
    document.getElementById('profile-name').textContent = userName;
   
    if (typeof userAvatar === 'string' && userAvatar.startsWith('http')) {
        document.getElementById('user-avatar').innerHTML = `<img src="${userAvatar}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
        document.getElementById('profile-avatar').innerHTML = `<img src="${userAvatar}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
    }
}

function updateUI() {
    document.getElementById('star-count').textContent = stars;
    document.getElementById('profile-nft-count').textContent = collection.length;
    document.getElementById('profile-stars-earned').textContent = totalStarsEarned;
    document.getElementById('profile-battles-count').textContent = battleHistory.length;
    updatePlayButton();
   
    setTimeout(() => saveData(), 100);
}

function updatePlayButton() {
    const playBtn = document.getElementById('play-button');
    if (!activeBattleNft) {
        playBtn.textContent = 'Выберите NFT для дуэли';
        playBtn.disabled = true;
    } else if (stars < 10) {
        playBtn.textContent = 'Недостаточно звёзд (10 звёзд)';
        playBtn.disabled = true;
    } else {
        playBtn.textContent = 'ДУЭЛЬ (10 звёзд)';
        playBtn.disabled = false;
    }
}

function showPurchaseMenu() {
    document.getElementById('purchase-overlay').style.display = 'flex';
}

function closePurchaseMenu() {
    document.getElementById('purchase-overlay').style.display = 'none';
}

function purchaseStars(amount) {
    stars += amount;
    totalStarsEarned += amount;
    updateUI();
    alert(`Куплено ${amount} звёзд! (Тест)`);
    closePurchaseMenu();
}

function startBattleSearch() {
    if (!activeBattleNft || stars < 10) return;
   
    stars -= 10;
    updateUI();
   
    document.getElementById('searching-overlay').style.display = 'flex';
   
    const searchStatuses = [
        'Подключение к серверу...',
        'Поиск игроков...',
        'Проверка совместимости...',
        'Оппонент найден!'
    ];
   
    let statusIndex = 0;
    const statusElement = document.getElementById('search-status');
   
    const updateStatus = () => {
        if (statusIndex < searchStatuses.length) {
            statusElement.textContent = searchStatuses[statusIndex];
            statusIndex++;
            if (statusIndex < searchStatuses.length) {
                setTimeout(updateStatus, 800);
            } else {
                setTimeout(startBattle, 500);
            }
        }
    };
   
    updateStatus();
}

function startBattle() {
    document.getElementById('searching-overlay').style.display = 'none';
   
    botNft = selectBotNft(activeBattleNft); // Изменено: используем новый матчмейкинг
   
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('battle-screen').classList.add('active');
   
    document.getElementById('coin-toss-overlay').style.display = 'flex';
    document.getElementById('coin-front').src = activeBattleNft.img;
    document.getElementById('coin-back').src = botNft.img;
    document.getElementById('coin-result-text').textContent = '';
    const coin = document.getElementById('coin');
    coin.style.animation = 'none';
   
    setTimeout(() => {
        const playerFirst = Math.random() < 0.5;
        const animationName = playerFirst ? 'flipFront' : 'flipBack';
        coin.style.animation = `${animationName} 3s ease-out forwards`;
       
        coin.addEventListener('animationend', () => {
            const text = playerFirst ? 'Вы ходите первым!' : 'Оппонент ходит первым!';
            document.getElementById('coin-result-text').textContent = text;
           
            setTimeout(() => {
                document.getElementById('coin-toss-overlay').style.display = 'none';
                initializeBattle(playerFirst);
            }, 2000);
        }, {once: true});
    }, 1000);
}

function initializeBattle(playerFirst) {
    playerHP = activeBattleNft.stats.health; // Изменено: используем stats
    botHP = botNft.stats.health; // Изменено: используем stats
    battleInProgress = true;
   
    document.getElementById('player-img').src = activeBattleNft.img;
    document.getElementById('bot-img').src = botNft.img;
   
    document.getElementById('battle-result').style.display = 'none';
    document.getElementById('reward-info').style.display = 'none';
    document.getElementById('back-to-menu-btn').style.display = 'none';
   
    const vsText = document.querySelector('.vs-text');
    const playerHpContainer = document.querySelector('.participant.left .hp-container');
    const botHpContainer = document.querySelector('.participant.right .hp-container');
    const playerHpText = document.getElementById('player-hp-text');
    const botHpText = document.getElementById('bot-hp-text');
    const playerName = document.querySelector('.participant.left .participant-name');
    const botName = document.querySelector('.participant.right .participant-name');
    const playerParticipant = document.querySelector('.participant.left');
    const botParticipant = document.querySelector('.participant.right');
   
    vsText.style.opacity = 0;
    playerHpContainer.style.opacity = 0;
    botHpContainer.style.opacity = 0;
    playerHpText.style.opacity = 0;
    botHpText.style.opacity = 0;
    playerName.style.opacity = 0;
    botName.style.opacity = 0;
    playerParticipant.style.opacity = 0;
    playerParticipant.style.transform = 'translateX(-100vw)';
    botParticipant.style.opacity = 0;
    botParticipant.style.transform = 'translateX(100vw)';
   
    setTimeout(() => {
        playerParticipant.style.transition = 'transform 1s ease, opacity 1s ease';
        botParticipant.style.transition = 'transform 1s ease, opacity 1s ease';
        playerParticipant.style.transform = 'translateX(0)';
        playerParticipant.style.opacity = 1;
        botParticipant.style.transform = 'translateX(0)';
        botParticipant.style.opacity = 1;
    }, 100);
   
    setTimeout(() => {
        botParticipant.style.transition = 'transform 0.5s ease';
        botParticipant.style.transform = 'scale(0.8) translateY(-20px)';
    }, 2100);
   
    setTimeout(() => {
        vsText.style.transition = 'opacity 0.5s ease';
        vsText.style.opacity = 1;
        vsText.classList.add('fade-in');
        playerHpContainer.style.transition = 'opacity 0.5s ease';
        botHpContainer.style.transition = 'opacity 0.5s ease';
        playerHpText.style.transition = 'opacity 0.5s ease';
        botHpText.style.transition = 'opacity 0.5s ease';
        playerName.style.transition = 'opacity 0.5s ease';
        botName.style.transition = 'opacity 0.5s ease';
        playerHpContainer.style.opacity = 1;
        botHpContainer.style.opacity = 1;
        playerHpText.style.opacity = 1;
        botHpText.style.opacity = 1;
        playerName.style.opacity = 1;
        botName.style.opacity = 1;
    }, 1100);
   
    playerName.textContent = userName;
    botName.textContent = botNft.name;
    updateBattleUI();
   
    setTimeout(() => {
        performBattle(playerFirst);
    }, 2500);
}

function updateBattleUI() {
    const playerHpBar = document.getElementById('player-hp-bar');
    const botHpBar = document.getElementById('bot-hp-bar');
    const playerHpText = document.getElementById('player-hp-text');
    const botHpText = document.getElementById('bot-hp-text');
   
    playerHpBar.style.width = `${(playerHP / activeBattleNft.stats.health) * 100}%`;
    botHpBar.style.width = `${(botHP / botNft.stats.health) * 100}%`;
    playerHpText.textContent = `${Math.max(0, Math.floor(playerHP))}/${activeBattleNft.stats.health} HP`;
    botHpText.textContent = `${Math.max(0, Math.floor(botHP))}/${botNft.stats.health} HP`;
   
    if (playerHP < 30) playerHpBar.classList.add('low');
    else playerHpBar.classList.remove('low');
    if (botHP < 30) botHpBar.classList.add('low');
    else botHpBar.classList.remove('low');
}

function performBattle(playerFirst) {
    let currentTurn = playerFirst ? 'player' : 'bot';
    const battleLog = document.getElementById('battle-log');
    battleLog.innerHTML = '';
   
    const battleInterval = setInterval(() => {
        if (!battleInProgress) {
            clearInterval(battleInterval);
            return;
        }
   
        const logEntry = document.createElement('div');
        logEntry.className = 'battle-log-entry';
        let damage = 0;
        let isCrit = false;
        let isMiss = false;
   
        if (currentTurn === 'player') {
            damage = applyBuffsToAttack(activeBattleNft.stats, Math.floor(Math.random() * 20) + 5, isCrit, isMiss); // Изменено: учет апгрейдов
            if (isMiss) {
                logEntry.textContent = `${userName} промахнулся!`;
                battleLog.appendChild(logEntry);
            } else {
                if (isCrit) {
                    damage *= 2;
                    logEntry.textContent = `${userName} наносит критический удар на ${damage} урона!`;
                    document.querySelector('.participant.right').classList.add('shake');
                    setTimeout(() => document.querySelector('.participant.right').classList.remove('shake'), 500);
                } else {
                    logEntry.textContent = `${userName} наносит ${damage} урона!`;
                    document.querySelector('.participant.right').classList.add('shake');
                    setTimeout(() => document.querySelector('.participant.right').classList.remove('shake'), 500);
                }
                botHP -= damage;
            }
            currentTurn = 'bot';
        } else {
            damage = applyBuffsToAttack(botNft.stats, Math.floor(Math.random() * 20) + 5, isCrit, isMiss); // Изменено: учет апгрейдов
            if (isMiss) {
                logEntry.textContent = `${botNft.name} промахнулся!`;
                battleLog.appendChild(logEntry);
            } else {
                if (isCrit) {
                    damage *= 2;
                    logEntry.textContent = `${botNft.name} наносит критический удар на ${damage} урона!`;
                    document.querySelector('.participant.left').classList.add('shake');
                    setTimeout(() => document.querySelector('.participant.left').classList.remove('shake'), 500);
                } else {
                    logEntry.textContent = `${botNft.name} наносит ${damage} урона!`;
                    document.querySelector('.participant.left').classList.add('shake');
                    setTimeout(() => document.querySelector('.participant.left').classList.remove('shake'), 500);
                }
                playerHP -= damage;
            }
            currentTurn = 'player';
        }
   
        battleLog.appendChild(logEntry);
        battleLog.scrollTop = battleLog.scrollHeight;
        updateBattleUI();
   
        if (playerHP <= 0 || botHP <= 0) {
            battleInProgress = false;
            clearInterval(battleInterval);
            endBattle();
        }
    }, 1500);
}

function endBattle() {
    const battleResult = document.getElementById('battle-result');
    const rewardInfo = document.getElementById('reward-info');
    const backBtn = document.getElementById('back-to-menu-btn');
    let rewardText = '';
   
    battleResult.style.display = 'block';
    rewardInfo.style.display = 'block';
    backBtn.style.display = 'block';
   
    const date = new Date().toLocaleString('ru-RU');
   
    if (playerHP <= 0 && botHP <= 0) {
        battleResult.textContent = 'НИЧЬЯ!';
        battleResult.className = 'battle-result';
        rewardInfo.textContent = 'Оба участника пали в бою!';
        rewardInfo.className = 'reward-info';
        battleHistory.push({
            result: 'draw',
            date,
            playerNft: activeBattleNft,
            botNft,
            reward: 'Ничья'
        });
    } else if (playerHP <= 0) {
        battleResult.textContent = 'ПОРАЖЕНИЕ!';
        battleResult.className = 'battle-result lose';
        rewardInfo.textContent = `Вы потеряли ${activeBattleNft.name}!`;
        rewardInfo.className = 'reward-info lose';
        collection = collection.filter(nft => 
            !(nft.name === activeBattleNft.name && nft.img === activeBattleNft.img && nft.buyPrice === activeBattleNft.buyPrice)
        );
        activeBattleNft = null;
        battleHistory.push({
            result: 'lose',
            date,
            playerNft: activeBattleNft,
            botNft,
            reward: `Потерян ${activeBattleNft.name}`
        });
    } else {
        battleResult.textContent = 'ПОБЕДА!';
        battleResult.className = 'battle-result win';
        const rewardStars = Math.floor(botNft.price * 0.5);
        stars += rewardStars;
        totalStarsEarned += rewardStars;
        collection.push({ ...botNft, buyPrice: botNft.price });
        rewardText = `Вы выиграли ${botNft.name} и ${rewardStars} звёзд!`;
        rewardInfo.textContent = rewardText;
        rewardInfo.className = 'reward-info win';
        battleHistory.push({
            result: 'win',
            date,
            playerNft: activeBattleNft,
            botNft,
            reward: rewardText
        });
    }
   
    updateUI();
}

function showScreen(screen) {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach((item, index) => {
        if (
            (screen === 'main' && index === 0) ||
            (screen === 'collection' && index === 1) ||
            (screen === 'upgrade' && index === 2) ||
            (screen === 'profile' && index === 3) ||
            (screen === 'friends' && index === 4)
        ) {
            item.classList.add('active');
        }
    });
   
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
   
    if (screen === 'main') {
        document.getElementById('main-screen').classList.add('active');
        renderCenterArea();
    } else if (screen === 'collection') {
        document.getElementById('collection-screen').classList.add('active');
        renderCollection();
    } else if (screen === 'upgrade') {
        document.getElementById('upgrade-screen').classList.add('active');
        renderUpgradeScreen(); // Изменено: рендер апгрейда
    } else if (screen === 'profile') {
        document.getElementById('profile-screen').classList.add('active');
        renderProfile();
    } else if (screen === 'friends') {
        document.getElementById('friends-screen').classList.add('active');
        renderFriends();
    }
   
    currentScreen = screen;
}

function goToCollection() {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.nav-item')[1].classList.add('active');
   
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('collection-screen').classList.add('active');
   
    renderCollection();
    currentScreen = 'collection';
}

function openShop() {
    document.getElementById('collection-screen').classList.remove('active');
    document.getElementById('shop-screen').classList.add('active');
    renderShop();
}

function backToCollection() {
    document.getElementById('shop-screen').classList.remove('active');
    document.getElementById('collection-screen').classList.add('active');
    renderCollection();
}

function renderCenterArea() {
    const centerDiv = document.getElementById('center-content');
    centerDiv.innerHTML = '';
    if (activeBattleNft) {
        centerDiv.innerHTML = `
            <img src="${activeBattleNft.img}" class="center-nft-img" alt="${activeBattleNft.name}">
            <div class="center-nft-name">${activeBattleNft.name}</div>
            <div class="center-nft-status">Готов к дуэли</div>
        `;
    } else {
        centerDiv.innerHTML = '<div class="center-logo">//</div><div class="center-message">У вас не выбран NFT для дуэли, выберите его в <span class="clickable-link" onclick="goToCollection()">коллекции</span></div>';
    }
}

function renderCollection() {
    const grid = document.getElementById('collection-grid');
    grid.innerHTML = '';
   
    if (collection.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #888888;">Коллекция пуста<br>Купите NFT в магазине</div>';
    } else {
        collection.forEach((nft, index) => {
            const isActive = activeBattleNft && activeBattleNft.name === nft.name && activeBattleNft.img === nft.img && activeBattleNft.buyPrice === nft.buyPrice;
            const card = document.createElement('div');
            card.className = 'nft-card';
            card.innerHTML = `
                <img src="${nft.img}" class="nft-card-img" alt="${nft.name}">
                <div class="nft-card-name">${nft.name} ${isActive ? '⚔️' : ''}</div>
                <div class="nft-card-price">Куплено за ${nft.buyPrice} звёзд</div>
                <button class="nft-card-btn" onclick="setToBattle(${index})" ${isActive ? 'disabled' : ''}>
                    ${isActive ? 'Готов к дуэли' : 'К дуэли'}
                </button>
                <button class="nft-card-btn secondary" onclick="sellNft(${index})">
                    Продать ${Math.floor(nft.buyPrice * 0.8)} звёзд
                </button>
            `;
            grid.appendChild(card);
        });
    }
}

function renderShop() {
    const grid = document.getElementById('shop-grid');
    grid.innerHTML = '';
    
    let nftItems = nftTemplates.map((template, index) => ({
        template,
        price: nftPrices[index],
        originalIndex: index
    }));
    
    switch(currentFilter) {
        case 'price_asc':
            nftItems.sort((a, b) => a.price - b.price);
            break;
        case 'price_desc':
            nftItems.sort((a, b) => b.price - a.price);
            break;
        case 'popularity':
            nftItems.sort((a, b) => popularityOrder.indexOf(a.originalIndex) - popularityOrder.indexOf(b.originalIndex));
            break;
    }
    
    nftItems.forEach(({template, price, originalIndex}) => {
        const card = document.createElement('div');
        card.className = 'nft-card';
        card.innerHTML = `
            <img src="${template.img}" class="nft-card-img" alt="${template.name}">
            <div class="nft-card-name">${template.name}</div>
            <div class="nft-card-price">${price} звёзд</div>
            <button class="nft-card-btn" onclick="buyNft(${originalIndex}, ${price})" ${stars < price ? 'disabled' : ''}>
                ${stars < price ? 'Недостаточно звёзд' : 'Купить'}
            </button>
        `;
        grid.appendChild(card);
    });
}

function renderProfile() {
    const grid = document.getElementById('profile-collection');
    grid.innerHTML = '';
   
    if (collection.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #888888;">У вас пока нет NFT</div>';
    } else {
        collection.forEach((nft) => {
            const isActive = activeBattleNft && activeBattleNft.name === nft.name && activeBattleNft.img === nft.img && activeBattleNft.buyPrice === nft.buyPrice;
            const card = document.createElement('div');
            card.className = 'nft-card';
            card.innerHTML = `
                <img src="${nft.img}" class="nft-card-img" alt="${nft.name}">
                <div class="nft-card-name">${nft.name} ${isActive ? '⚔️' : ''}</div>
                <div class="nft-card-price">Стоимость: ${nft.buyPrice} звёзд</div>
            `;
            grid.appendChild(card);
        });
    }
}

function buyNft(templateIndex, price) {
    if (stars >= price) {
        stars -= price;
        const nft = { ...nftTemplates[templateIndex], buyPrice: price, stats: { health: 100, attack: 10, evasion: 0, critChance: 15, missChance: 8 }, upgrades: [] }; // Изменено: добавляем stats и upgrades
        collection.push(nft);
        updateUI();
        alert(`Куплен ${nft.name}!`);
        renderShop();
       
        setTimeout(() => {
            backToCollection();
        }, 500);
    } else {
        alert('Недостаточно звёзд!');
    }
}

function sellNft(index) {
    const nft = collection[index];
    const sellPrice = Math.floor(nft.buyPrice * 0.8);
    stars += sellPrice;
   
    if (activeBattleNft && activeBattleNft.name === nft.name && activeBattleNft.img === nft.img && activeBattleNft.buyPrice === nft.buyPrice) {
        activeBattleNft = null;
    }
   
    collection.splice(index, 1);
    updateUI();
    renderCollection();
    renderCenterArea();
    alert(`Продан за ${sellPrice} звёзд!`);
}

function showRules() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('rules-screen').classList.add('active');
}

function backToMainFromRules() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('main-screen').classList.add('active');
    document.querySelectorAll('.nav-item')[0].classList.add('active');
}

function setToBattle(index) {
    activeBattleNft = { ...collection[index] };
    renderCollection();
    renderCenterArea();
    updateUI();
   
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('main-screen').classList.add('active');
   
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.nav-item')[0].classList.add('active');
   
    currentScreen = 'main';
}

function showBattleHistory() {
    document.getElementById('profile-screen').classList.remove('active');
    document.getElementById('battle-history-screen').classList.add('active');
    renderBattleHistory();
}

function backToProfile() {
    document.getElementById('battle-history-screen').classList.remove('active');
    document.getElementById('profile-screen').classList.add('active');
}

function renderBattleHistory() {
    const historyList = document.getElementById('battle-history-list');
    historyList.innerHTML = '';
   
    if (battleHistory.length === 0) {
        historyList.innerHTML = '<div style="text-align: center; padding: 40px; color: #888888;">История дуэлей пуста<br>Проведите первую дуэль!</div>';
        return;
    }
   
    battleHistory.slice().reverse().forEach(battle => {
        const historyItem = document.createElement('div');
        historyItem.className = 'battle-history-item';
       
        historyItem.innerHTML = `
            <div class="battle-history-header">
                <span class="battle-result-text ${battle.result}">${battle.result === 'win' ? 'ПОБЕДА' : 'ПОРАЖЕНИЕ'}</span>
                <span style="color: #888888; font-size: 14px;">${battle.date}</span>
            </div>
            <div class="battle-history-nfts">
                <div class="history-nft">
                    <img src="${battle.playerNft.img}" class="history-nft-img" alt="${battle.playerNft.name}" onerror="this.src='https://via.placeholder.com/60x60?text=?'">
                    <div class="history-nft-name">${battle.playerNft.name}</div>
                </div>
                <div class="history-vs">VS</div>
                <div class="history-nft">
                    <img src="${battle.botNft.img}" class="history-nft-img" alt="${battle.botNft.name}" onerror="this.src='https://via.placeholder.com/60x60?text=?'">
                    <div class="history-nft-name">${battle.botNft.name}</div>
                </div>
            </div>
            <div style="text-align: center; margin-top: 10px; font-size: 14px; color: #cccccc;">
                ${battle.reward}
            </div>
        `;
       
        historyList.appendChild(historyItem);
    });
}

function generateReferralCode() {
    if (!referralCode) {
        referralCode = 'ref_' + userId;
        console.log('Generated referral code:', referralCode);
    }
}

function updateReferralInfo() {
    if (referralCode) {
        const referralLink = `https://t.me/dfgijrfjirfgjieh_bot?start=${referralCode}`;
        const linkInput = document.getElementById('referral-link');
        if (linkInput) {
            linkInput.value = referralLink;
        }
    }
   
    const invitedCountEl = document.getElementById('invited-count');
    const earnedFromReferralsEl = document.getElementById('earned-from-referrals');
    const friendsCountEl = document.getElementById('friends-count');
   
    if (invitedCountEl) invitedCountEl.textContent = referredFriends.length;
    if (earnedFromReferralsEl) earnedFromReferralsEl.textContent = starsFromReferrals;
    if (friendsCountEl) friendsCountEl.textContent = `(${referredFriends.length})`;
}

function inviteFriend() {
    if (!referralCode) {
        generateReferralCode();
    }
   
    const botUrl = `https://t.me/dfgijrfjirfgjieh_bot?start=${referralCode}`;
    const shareText = 'Присоединяйся к NFT игре! 🎮 Покупай, сражайся и побеждай!';
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(botUrl)}&text=${encodeURIComponent(shareText)}`;
   
    if (Telegram.WebApp.openTelegramLink) {
        Telegram.WebApp.openTelegramLink(shareUrl);
    } else {
        window.open(shareUrl, '_blank');
    }
}

function copyReferralLink() {
    const referralLink = document.getElementById('referral-link');
    if (!referralLink) return;
   
    if (navigator.clipboard) {
        navigator.clipboard.writeText(referralLink.value).then(() => {
            showToast('Ссылка скопирована!');
        });
    } else {
        referralLink.select();
        referralLink.setSelectionRange(0, 99999);
        document.execCommand('copy');
        showToast('Ссылка скопирована!');
    }
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #333;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 10000;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
   
    setTimeout(() => {
        if (document.body.contains(toast)) {
            document.body.removeChild(toast);
        }
    }, 2000);
}

function showTerms() {
    const termsText = `Условия партнёрства:

• Пригласите 50+ активных игроков
• Свяжитесь с поддержкой для получения статуса партнёра  
• Получайте % от покупок ваших рефералов
• Дополнительные бонусы за активность

Для получения статуса партнёра обратитесь в поддержку!`;
    
    alert(termsText);
}

function renderFriends() {
    const friendsList = document.getElementById('friends-list');
    if (!friendsList) return;
    
    if (referredFriends.length === 0) {
        friendsList.innerHTML = `
            <div class="no-friends">
                <p>Друг должен зайти в приложение по вашей ссылке, чтобы вы получили звёзды.</p>
            </div>
        `;
    } else {
        friendsList.innerHTML = '';
        referredFriends.forEach(friend => {
            const friendItem = document.createElement('div');
            friendItem.className = 'friend-item';
            friendItem.innerHTML = `
                <div class="friend-info">
                    <div class="friend-avatar">${friend.name ? friend.name.charAt(0).toUpperCase() : '?'}</div>
                    <div class="friend-details">
                        <div class="friend-name">${friend.name || 'Аноним'}</div>
                        <div class="friend-date">${friend.joinDate || 'Недавно'}</div>
                    </div>
                </div>
                <div class="friend-reward">
                    <i class="fas fa-star" style="color: #ffd700;"></i>
                    1 звезда
                </div>
            `;
            friendsList.appendChild(friendItem);
        });
    }
    
    updateReferralInfo();
}

function addReferredFriend(friendData) {
    const newFriend = {
        id: friendData.id || Math.random().toString(36).substr(2, 9),
        name: friendData.name || 'Новый игрок',
        joinDate: new Date().toLocaleDateString('ru-RU')
    };
   
    if (!referredFriends.find(friend => friend.id === newFriend.id)) {
        referredFriends.push(newFriend);
        stars += 1;
        starsFromReferrals += 1;
        totalStarsEarned += 1;
       
        console.log(`Added new referral: ${newFriend.name}, earned 1 star`);
       
        updateUI();
        updateReferralInfo();
        saveData();
        showToast(`+1 звезда за друга ${newFriend.name}!`);
    }
}

window.addEventListener('beforeunload', () => {
    console.log('App closing, saving data...');
    saveData();
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('App hidden, saving data...');
        saveData();
    } else {
        console.log('App visible again, loading data...');
        loadData().then(() => {
            updateUI();
            updateReferralInfo();
            renderCenterArea();
            if (currentScreen === 'collection') renderCollection();
            if (currentScreen === 'friends') renderFriends();
            if (currentScreen === 'profile') renderProfile();
            if (currentScreen === 'upgrade') renderUpgradeScreen();
        });
    }
});

setInterval(() => {
    console.log('Auto-saving data...');
    saveData();
}, 30000);
