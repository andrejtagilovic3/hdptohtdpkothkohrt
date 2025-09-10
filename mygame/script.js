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
    { name: 'Bday candle 2v', img: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/imgg/1.gif', tier: 'premium' }
];

const nftPrices = [100, 150, 200, 250, 440, 350, 240, 85, 200, 300, 700, 500, 220, 450];

let stars = 100;
let collection = [];
let activeBattleNft = null;
let totalStarsEarned = 0;
let battleHistory = [];

const tgUser = Telegram.WebApp.initDataUnsafe?.user;
let userName = tgUser?.first_name || 'Игрок';
let userAvatar = tgUser?.photo_url || '👤';

let playerHP = 100;
let botHP = 100;
let botNft = null;
let battleInProgress = false;
let currentScreen = 'main';

init();

async function init() {
    await loadData();
    updateUI();
    renderCenterArea();
    renderCollection();
    renderShop();
    renderProfile();
    updateUserInfo();
}

async function loadData() {
    try {
        const [starsStr, collectionStr, activeNftStr, totalEarnedStr, historyStr] = await Promise.all([
            getCloudItem('stars'),
            getCloudItem('collection'),
            getCloudItem('activeBattleNft'),
            getCloudItem('totalStarsEarned'),
            getCloudItem('battleHistory')
        ]);
        stars = parseInt(starsStr) || 100;
        collection = JSON.parse(collectionStr) || [];
        activeBattleNft = JSON.parse(activeNftStr) || null;
        totalStarsEarned = parseInt(totalEarnedStr) || 0;
        battleHistory = JSON.parse(historyStr) || [];
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

async function saveData() {
    try {
        await Promise.all([
            setCloudItem('stars', stars.toString()),
            setCloudItem('collection', JSON.stringify(collection)),
            setCloudItem('activeBattleNft', JSON.stringify(activeBattleNft)),
            setCloudItem('totalStarsEarned', totalStarsEarned.toString()),
            setCloudItem('battleHistory', JSON.stringify(battleHistory))
        ]);
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

function getCloudItem(key) {
    return new Promise((resolve, reject) => {
        cloudStorage.getItem(key, (error, value) => {
            if (error) reject(error);
            else resolve(value);
        });
    });
}

function setCloudItem(key, value) {
    return new Promise((resolve, reject) => {
        cloudStorage.setItem(key, value, (error, success) => {
            if (error || !success) reject(error);
            else resolve();
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
    saveData();
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
    
    const playerPrice = activeBattleNft.buyPrice;
    let suitableNfts = [];
    
    nftTemplates.forEach((template, index) => {
        if (nftPrices[index] <= playerPrice + 50) {
            suitableNfts.push({ ...template, price: nftPrices[index] });
        }
    });
    
    if (suitableNfts.length === 0) {
        const randomIndex = Math.floor(Math.random() * nftTemplates.length);
        botNft = { ...nftTemplates[randomIndex], price: nftPrices[randomIndex] };
    } else {
        const randomIndex = Math.floor(Math.random() * suitableNfts.length);
        botNft = suitableNfts[randomIndex];
    }
    
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
    playerHP = 100;
    botHP = 100;
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
    }, 2100 + 500);
    
    setTimeout(() => {
        playerHpContainer.style.transition = 'opacity 0.5s ease';
        botHpContainer.style.transition = 'opacity 0.5s ease';
        playerHpContainer.style.opacity = 1;
        botHpContainer.style.opacity = 1;
        playerHpText.style.transition = 'opacity 0.5s ease';
        botHpText.style.transition = 'opacity 0.5s ease';
        playerHpText.style.opacity = 1;
        botHpText.style.opacity = 1;
        updateHPBars();
    }, 2100 + 500 + 500);
    
    setTimeout(() => {
        playerName.style.transition = 'opacity 0.5s ease';
        botName.style.transition = 'opacity 0.5s ease';
        playerName.style.opacity = 1;
        botName.style.opacity = 1;
    }, 2100 + 500 + 500 + 500);
    
    setTimeout(() => {
        const log = document.getElementById('battle-log');
        if (playerFirst) {
            log.textContent = 'Вы атакуете первыми! Приготовьтесь...';
            setTimeout(() => performAttack(true), 2000);
        } else {
            log.textContent = 'Оппонент атакует первым! Защищайтесь...';
            setTimeout(() => performAttack(false), 2000);
        }
    }, 2100 + 500 + 500 + 500 + 500);
}

function performAttack(isPlayerTurn) {
    if (!battleInProgress) return;
    
    let damage;
    const isLowHP = (isPlayerTurn ? botHP : playerHP) <= 25;
    const isCritical = Math.random() < (isLowHP ? 0.3 : 0.15);
    
    if (isCritical) {
        damage = Math.floor(Math.random() * 30) + 45;
    } else {
        damage = Math.floor(Math.random() * 35) + 8;
    }
    
    const isMiss = Math.random() < 0.08;
    const log = document.getElementById('battle-log');
    let targetImg;
    
    if (isPlayerTurn) {
        targetImg = document.getElementById('bot-img');
    } else {
        targetImg = document.getElementById('player-img');
    }
    
    if (isMiss) {
        if (isPlayerTurn) {
            log.textContent = 'Промах! Ваша атака не попала в цель!';
        } else {
            log.textContent = 'Уклонение! Вы избежали атаки оппонента!';
        }
    } else {
        if (isPlayerTurn) {
            botHP = Math.max(0, botHP - damage);
            if (isCritical) {
                log.textContent = `КРИТИЧЕСКИЙ УДАР! Вы наносите ${damage} урона оппоненту!`;
            } else {
                log.textContent = `Вы наносите ${damage} урона оппоненту!`;
            }
        } else {
            playerHP = Math.max(0, playerHP - damage);
            if (isCritical) {
                log.textContent = `КРИТИЧЕСКАЯ АТАКА ОППОНЕНТА! Вы получаете ${damage} урона!`;
            } else {
                log.textContent = `Оппонент наносит вам ${damage} урона!`;
            }
        }
        targetImg.classList.add('shake');
        setTimeout(() => targetImg.classList.remove('shake'), 500);
    }
    
    updateHPBars();
    
    if ((playerHP <= 15 || botHP <= 15) && playerHP > 0 && botHP > 0) {
        setTimeout(() => {
            log.textContent = 'Критическое состояние! Следующий удар может быть решающим!';
        }, 1000);
    }
    
    if (playerHP <= 0 || botHP <= 0) {
        setTimeout(() => endBattle(), 2000);
    } else {
        const delay = Math.random() * 1000 + 1500;
        setTimeout(() => performAttack(!isPlayerTurn), delay);
    }
}

function updateHPBars() {
    const playerBar = document.getElementById('player-hp-bar');
    const botBar = document.getElementById('bot-hp-bar');
    const playerText = document.getElementById('player-hp-text');
    const botText = document.getElementById('bot-hp-text');
    
    playerBar.style.width = `${playerHP}%`;
    botBar.style.width = `${botHP}%`;
    
    if (playerHP <= 20) playerBar.classList.add('low');
    else playerBar.classList.remove('low');
    
    if (botHP <= 20) botBar.classList.add('low');
    else botBar.classList.remove('low');
    
    playerText.textContent = `${playerHP}/100 HP`;
    botText.textContent = `${botHP}/100 HP`;
}

function endBattle() {
    battleInProgress = false;
    const resultDiv = document.getElementById('battle-result');
    const rewardDiv = document.getElementById('reward-info');
    const log = document.getElementById('battle-log');
    
    let result;
    let reward;
    
    // Создаем копию данных NFT для истории до их изменения
    const battlePlayerNft = activeBattleNft ? { ...activeBattleNft } : null;
    const battleBotNft = { ...botNft };
    
    if (playerHP > 0) {
        resultDiv.textContent = 'ПОБЕДА!';
        resultDiv.className = 'battle-result win';
        log.textContent = 'Невероятная победа! Вы оказались сильнее!';
        
        const rewardNft = { ...botNft, buyPrice: botNft.price };
        collection.push(rewardNft);
        rewardDiv.innerHTML = `Вы получили NFT: ${botNft.name}!`;
        rewardDiv.classList.add('win');
        rewardDiv.classList.remove('lose');
        
        result = 'win';
        reward = botNft.name;
    } else {
        resultDiv.textContent = 'ПОРАЖЕНИЕ!';
        resultDiv.className = 'battle-result lose';
        log.textContent = 'Вы потерпели поражение...';
        
        if (activeBattleNft) {
            collection = collection.filter(nft => 
                nft.name !== activeBattleNft.name || nft.img !== activeBattleNft.img
            );
            reward = `Потерян: ${activeBattleNft.name}`;
            activeBattleNft = null;
            rewardDiv.innerHTML = `Ваш NFT захвачен противником!`;
            rewardDiv.classList.add('lose');
            rewardDiv.classList.remove('win');
        }
        
        result = 'lose';
    }
    
    // Добавляем в историю с сохраненными данными
    battleHistory.push({
        date: new Date().toLocaleDateString('ru-RU'),
        result: result,
        playerNft: {
            name: battlePlayerNft ? battlePlayerNft.name : 'Неизвестно',
            img: battlePlayerNft ? battlePlayerNft.img : 'https://via.placeholder.com/60x60?text=?'
        },
        botNft: {
            name: battleBotNft.name,
            img: battleBotNft.img
        },
        reward: reward
    });
    
    resultDiv.style.display = 'block';
    rewardDiv.style.display = 'block';
    document.getElementById('back-to-menu-btn').style.display = 'block';
    updateUI();
}

function backToMainFromBattle() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('main-screen').classList.add('active');
    
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.nav-item')[0].classList.add('active');
    
    updateUI();
    renderCenterArea();
    currentScreen = 'main';
}

function switchScreen(screen) {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    event.target.closest('.nav-item').classList.add('active');
    
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    
    if (screen === 'main') {
        document.getElementById('main-screen').classList.add('active');
        renderCenterArea();
    } else if (screen === 'collection') {
        document.getElementById('collection-screen').classList.add('active');
        renderCollection();
    } else if (screen === 'upgrade') {
        document.getElementById('upgrade-screen').classList.add('active');
    } else if (screen === 'profile') {
        document.getElementById('profile-screen').classList.add('active');
        renderProfile();
    } else if (screen === 'friends') {
        document.getElementById('friends-screen').classList.add('active');
    }
    
    currentScreen = screen;
}

// Функция для перехода в коллекцию из главного экрана
function goToCollection() {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.nav-item')[1].classList.add('active'); // коллекция - второй элемент
    
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
    renderCollection(); // Автоматически рендерим коллекцию при возврате
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
            const isActive = activeBattleNft && activeBattleNft.name === nft.name && activeBattleNft.img === nft.img;
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
    
    nftTemplates.forEach((template, index) => {
        const price = nftPrices[index];
        const card = document.createElement('div');
        card.className = 'nft-card';
        card.innerHTML = `
            <img src="${template.img}" class="nft-card-img" alt="${template.name}">
            <div class="nft-card-name">${template.name}</div>
            <div class="nft-card-price">${price} звёзд</div>
            <button class="nft-card-btn" onclick="buyNft(${index}, ${price})" ${stars < price ? 'disabled' : ''}>
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
            const isActive = activeBattleNft && activeBattleNft.name === nft.name && activeBattleNft.img === nft.img;
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
        const nft = { ...nftTemplates[templateIndex], buyPrice: price };
        collection.push(nft);
        updateUI();
        alert(`Куплен ${nft.name}!`);
        renderShop();
        
        // Переходим в коллекцию после покупки
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
    
    if (activeBattleNft && activeBattleNft.name === nft.name && activeBattleNft.img === nft.img) {
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
    activeBattleNft = collection[index];
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

// Реферальная система
function generateReferralCode() {
    if (!referralCode) {
        referralCode = 'ref_' + Math.random().toString(36).substr(2, 8);
        saveData();
    }
}

function inviteFriend() {
    const botUrl = `https://t.me/your_bot_name?start=${referralCode}`;
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(botUrl)}&text=${encodeURIComponent('Присоединяйся к NFT игре! 🎮')}`;
    
    if (Telegram.WebApp.openTelegramLink) {
        Telegram.WebApp.openTelegramLink(shareUrl);
    } else {
        window.open(shareUrl, '_blank');
    }
}

function copyReferralLink() {
    const botUrl = `https://t.me/your_bot_name?start=${referralCode}`;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(botUrl).then(() => {
            showToast('Ссылка скопирована!');
        });
    } else {
        // Fallback для старых браузеров
        const textArea = document.createElement('textarea');
        textArea.value = botUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('Ссылка скопирована!');
    }
}

function showToast(message) {
    // Создаем простой toast
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
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        document.body.removeChild(toast);
    }, 2000);
}

function showTerms() {
    alert('Условия партнёрства:\n\n• Пригласите 50+ активных игроков\n• Свяжитесь с поддержкой для получения статуса партнёра\n• Получайте % от покупок ваших рефералов');
}

function renderFriends() {
    const friendsList = document.getElementById('friends-list');
    const friendsCount = document.getElementById('friends-count');
    
    friendsCount.textContent = `(${referredFriends.length})`;
    
    if (referredFriends.length === 0) {
        friendsList.innerHTML = `
            <div class="no-friends">
                Друг должен зайти в приложение по вашей<br>ссылке, чтобы вы получили звёзды.
            </div>
        `;
    } else {
        friendsList.innerHTML = '';
        referredFriends.forEach(friend => {
            const friendItem = document.createElement('div');
            friendItem.className = 'friend-item';
            friendItem.innerHTML = `
                <div class="friend-info">
                    <div class="friend-avatar">${friend.name.charAt(0).toUpperCase()}</div>
                    <div class="friend-name">${friend.name}</div>
                </div>
                <div class="friend-reward">
                    <i class="fas fa-star"></i>
                    10 звёзд
                </div>
            `;
            friendsList.appendChild(friendItem);
        });
    }
}

function switchScreen(screen) {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    event.target.closest('.nav-item').classList.add('active');
    
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    
    if (screen === 'main') {
        document.getElementById('main-screen').classList.add('active');
        renderCenterArea();
    } else if (screen === 'collection') {
        document.getElementById('collection-screen').classList.add('active');
        renderCollection();
    } else if (screen === 'upgrade') {
        document.getElementById('upgrade-screen').classList.add('active');
    } else if (screen === 'profile') {
        document.getElementById('profile-screen').classList.add('active');
        renderProfile();
    } else if (screen === 'friends') {
        document.getElementById('friends-screen').classList.add('active');
        renderFriends(); // Добавляем рендеринг друзей
    }
    
    currentScreen = screen;
}
