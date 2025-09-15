Telegram.WebApp.ready();

const cloudStorage = Telegram.WebApp.CloudStorage;

const nftTemplates = [
    { name: 'Bday', img: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/imgg/bdaycandle.gif', tier: 'basic' },
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
    { name: 'Bday calendar', img: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/imgg/1.gif', tier: 'premium' },
    { name: 'Jester Hat', img: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/imgg/jesterhat.gif', tier: 'premium' },
    { name: 'Jolly Chimp', img: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/imgg/JollyChimp.gif', tier: 'premium' },
    { name: 'Kissed Frog', img: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/imgg/kissedfrog.gif', tier: 'premium' },
    { name: 'Cupid Charm', img: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/imgg/cupidcharm.gif', tier: 'premium' },
    { name: 'Pet snake', img: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/imgg/petsnake.gif', tier: 'premium' },
    { name: 'Plush Pepe', img: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/imgg/plushpepe.gif', tier: 'premium' },
    { name: 'Scared Cat', img: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/imgg/scaredcat.gif', tier: 'premium' },
    { name: 'Swiss Watch', img: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/imgg/swisswatch.gif', tier: 'premium' },
    { name: 'Top Hat', img: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/imgg/tophat.gif', tier: 'premium' },
    { name: 'Xmas Stocking', img: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/imgg/xmasstocking.gif', tier: 'premium' }
];

const nftPrices = [100, 150, 200, 250, 440, 350, 240, 85, 200, 300, 700, 500, 220, 150, 90, 120, 300, 350, 150, 1000, 500, 450, 200, 100];

let stars = 100;
let collection = [];
let activeBattleNft = null;
let totalStarsEarned = 0;
let battleHistory = [];

let currentFilter = 'price_asc';
const popularityOrder = [0, 3, 9, 12, 6, 13, 11, 2, 5, 1, 8, 4, 7, 10];

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

let playerUpgrades = {};
let botUpgrades = {};

let isSaving = false;

init();

async function init() {
    console.log('Initializing game...');
    generateReferralCode();
    await loadData();
    updateUI();
    renderCenterArea();
    renderCollection();
    renderShop();
    renderProfile();
    updateUserInfo();
    updateReferralInfo();
    console.log('Game initialized successfully');
    initUIAnimations();
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

        stars = starsStr ? parseInt(starsStr) : 100;
        collection = collectionStr ? JSON.parse(collectionStr) : [];
        activeBattleNft = activeNftStr ? JSON.parse(activeNftStr) : null;
        totalStarsEarned = totalEarnedStr ? parseInt(totalEarnedStr) : 0;
        battleHistory = historyStr ? JSON.parse(historyStr) : [];
        referralCode = referralCodeStr || '';
        referredFriends = friendsStr ? JSON.parse(friendsStr) : [];
        starsFromReferrals = refStarsStr ? parseInt(refStarsStr) : 0;

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

function generateReferralCode() {
    if (!referralCode) {
        referralCode = Math.random().toString(36).substr(2, 8).toUpperCase();
    }
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

function generateBotUpgrades(botNft, matchPlayerLevel) {
    if (!botNft.upgrades) botNft.upgrades = {};
    
    const upgradeTypes = ['damage', 'dodge', 'crit'];
    const numUpgrades = Math.floor(Math.random() * 2) + 1; // 1-2 апгрейда
    
    for (let i = 0; i < numUpgrades; i++) {
        const randomType = upgradeTypes[Math.floor(Math.random() * upgradeTypes.length)];
        
        let upgradeValue;
        if (matchPlayerLevel && activeBattleNft.upgrades) {
            // Похожий уровень на игрока ±10%
            const playerUpgradeValues = Object.values(activeBattleNft.upgrades);
            const avgPlayerUpgrade = playerUpgradeValues.reduce((a, b) => a + b, 0) / playerUpgradeValues.length;
            upgradeValue = avgPlayerUpgrade * (0.9 + Math.random() * 0.2);
        } else {
            // Случайный слабый апгрейд
            upgradeValue = 1.05 + Math.random() * 0.1; // 5-15%
        }
        
        botNft.upgrades[randomType] = upgradeValue;
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

    switch (filterType) {
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
    if (!activeBattleNft) {
        alert('Пожалуйста, выберите NFT для битвы.');
        return;
    }

    if (stars < 10) {
        alert('Недостаточно звёзд для начала дуэли (необходимо 10 звёзд).');
        return;
    }

    showScreen('battle-screen', document.querySelector('.bottom-nav .nav-item[onclick*="battle-screen"]'));

    const enemyNft = getRandomEnemy();
    if (window.startUndertaleBattle) {
        window.startUndertaleBattle(activeBattleNft, enemyNft);
    } else {
        console.error('❌ Функция startUndertaleBattle не найдена.');
    }
}

// Исправленная функция startNewBattle - замените эту функцию в вашем script.js

function startNewBattle() {
    console.log('🚀 Запуск нового боя...');
    document.getElementById('searching-overlay').style.display = 'none';

    const playerPrice = activeBattleNft.buyPrice;
    const playerHasUpgrades = activeBattleNft.upgrades && Object.keys(activeBattleNft.upgrades).length > 0;
    let suitableNfts = [];

    nftTemplates.forEach((template, index) => {
        const nftPrice = nftPrices[index];
        
        // Подбор по цене (±30% от цены игрока)
        const priceMin = playerPrice * 0.7;
        const priceMax = playerPrice * 1.3;
        
        if (nftPrice >= priceMin && nftPrice <= priceMax) {
            suitableNfts.push({ 
                ...template, 
                price: nftPrice
            });
        }
    });

    let botNft;
    if (suitableNfts.length === 0) {
        const randomIndex = Math.floor(Math.random() * nftTemplates.length);
        botNft = { ...nftTemplates[randomIndex], price: nftPrices[randomIndex] };
    } else {
        const randomIndex = Math.floor(Math.random() * suitableNfts.length);
        botNft = suitableNfts[randomIndex];
    }

    // Генерируем апгрейды для бота
    if (playerHasUpgrades) {
        if (Math.random() < 0.7) {
            generateBotUpgrades(botNft, true);
        }
    } else {
        if (Math.random() < 0.15) {
            generateBotUpgrades(botNft, false);
        }
    }

    console.log('👤 Игрок:', activeBattleNft.name);
    console.log('🤖 Бот:', botNft.name);
    console.log('🔧 battleSystem:', window.battleSystem);
    console.log('🔧 startUndertaleBattle:', typeof window.startUndertaleBattle);

    // ЗАПУСКАЕМ НОВУЮ БОЕВУЮ СИСТЕМУ UNDERTALE
    if (window.battleSystem && typeof window.battleSystem.init === 'function') {
        console.log('✅ Запуск через battleSystem.init');
        const success = window.battleSystem.init(activeBattleNft, botNft);
        if (success) {
            console.log('🎉 Битва успешно запущена!');
        } else {
            console.error('❌ Ошибка при запуске битвы через battleSystem.init');
            alert('Ошибка запуска боя. Попробуйте еще раз.');
            // Возвращаем звёзды игроку
            stars += 10;
            updateUI();
        }
    } else if (typeof window.startUndertaleBattle === 'function') {
        console.log('✅ Запуск через startUndertaleBattle');
        const success = window.startUndertaleBattle(activeBattleNft, botNft);
        if (!success) {
            console.error('❌ Ошибка при запуске битвы через startUndertaleBattle');
            alert('Ошибка запуска боя. Попробуйте еще раз.');
            // Возвращаем звёзды игроку
            stars += 10;
            updateUI();
        }
    } else {
        console.error('❌ КРИТИЧЕСКАЯ ОШИБКА: battleSystem не найден!');
        console.error('🔍 Доступные объекты window:', Object.keys(window).filter(key => key.includes('battle')));
        alert('Ошибка: система боя не загружена. Убедитесь что файл undertale-battle.js подключен правильно.');
        // Возвращаем звёзды игроку
        stars += 10;
        updateUI();
        // Скрываем оверлей поиска
        document.getElementById('searching-overlay').style.display = 'none';
    }
}

function initializeBattle(playerFirst) {
    playerHP = 100;
    botHP = 100;
    battleInProgress = true;

    document.getElementById('player-img').src = activeBattleNft.img;
    document.getElementById('bot-img').src = botNft.img;
    document.getElementById('battle-log').textContent = 'Бой начался!';
    // Добавляем обводку для апгрейженных NFT
    const playerImg = document.getElementById('player-img');
    const botImg = document.getElementById('bot-img');

    if (activeBattleNft.upgrades && Object.keys(activeBattleNft.upgrades).length > 0) {
        const playerUpgradeLevel = Math.max(...Object.values(activeBattleNft.upgrades));
        let playerColor = '#4caf50'; // зеленый для обычных
        if (playerUpgradeLevel >= 1.12) playerColor = '#ff9800'; // оранжевый для редких
        else if (playerUpgradeLevel >= 1.12) playerColor = '#2196f3'; // синий для необычных
    
        playerImg.style.border = `3px solid ${playerColor}`;
        playerImg.style.boxShadow = `0 0 15px ${playerColor}60`;
    }

    if (botNft.upgrades && Object.keys(botNft.upgrades).length > 0) {
        const botUpgradeLevel = Math.max(...Object.values(botNft.upgrades));
        let botColor = '#4caf50';
        if (botUpgradeLevel >= 1.12) botColor = '#ff9800';
        else if (botUpgradeLevel >= 1.12) botColor = '#2196f3';
    
        botImg.style.border = `3px solid ${botColor}`;
        botImg.style.boxShadow = `0 0 15px ${botColor}60`;
    }
    
    // Скрываем кнопку возврата
    document.getElementById('back-to-menu-btn').style.display = 'none';
    
    updateHPBars();

    setTimeout(() => performAttack(playerFirst), 1500);
}

function performAttack(isPlayerTurn) {
    if (!battleInProgress) return;

    let damage;
    const isLowHP = (isPlayerTurn ? botHP : playerHP) <= 25;
    let critChance = isLowHP ? 0.3 : 0.15;
    let dodgeChance = 0.08;

    // ПРИМЕНЯЕМ АПГРЕЙДЫ
    if (isPlayerTurn && activeBattleNft && activeBattleNft.upgrades) {
        if (activeBattleNft.upgrades.crit) {
            critChance *= activeBattleNft.upgrades.crit;
        }
    } else if (!isPlayerTurn && botNft && botNft.upgrades) {
        if (botNft.upgrades.crit) {
            critChance *= botNft.upgrades.crit;
        }
    }

    // ПРИМЕНЯЕМ УКЛОНЕНИЯ
    if (!isPlayerTurn && activeBattleNft && activeBattleNft.upgrades && activeBattleNft.upgrades.dodge) {
        dodgeChance *= activeBattleNft.upgrades.dodge;
    } else if (isPlayerTurn && botNft && botNft.upgrades && botNft.upgrades.dodge) {
        dodgeChance *= botNft.upgrades.dodge;
    }

    const isCritical = Math.random() < critChance;
    const isMiss = Math.random() < dodgeChance;

    if (isCritical) {
        damage = Math.floor(Math.random() * 30) + 45;
    } else {
        damage = Math.floor(Math.random() * 35) + 8;
    }

    // ПРИМЕНЯЕМ УРОН
    if (isPlayerTurn && activeBattleNft && activeBattleNft.upgrades && activeBattleNft.upgrades.damage) {
        damage *= activeBattleNft.upgrades.damage;
    } else if (!isPlayerTurn && botNft && botNft.upgrades && botNft.upgrades.damage) {
        damage *= botNft.upgrades.damage;
    }

    damage = Math.floor(damage);

    // БАЛАНС: БОТ ПОЛУЧАЕТ +15% К УРОНУ И -10% К ПОЛУЧАЕМОМУ УРОНУ
    if (!isPlayerTurn) {
        damage *= 1.15; // Бот наносит больше урона
    } else {
        damage *= 0.90; // Игрок наносит меньше урона
    }

    damage = Math.floor(damage); // Окончательное округление

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


function switchScreen(screen) {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.nav-item')[['main', 'collection', 'upgrade', 'profile', 'friends'].indexOf(screen)].classList.add('active');

// Анимация скрытия старого экрана
    const currentActiveScreen = document.querySelector('.screen.active');
    if (currentActiveScreen) {
        currentActiveScreen.classList.add('screen-exit');
        setTimeout(() => {
            document.querySelectorAll('.screen').forEach(s => {
                s.classList.remove('active', 'screen-exit');
            });
            showNewScreen(screen);
        }, 200);
    } else {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        showNewScreen(screen);
    }

    if (screen === 'main') {
        document.getElementById('main-screen').classList.add('active');
        renderCenterArea();
    } else if (screen === 'collection') {
        document.getElementById('collection-screen').classList.add('active');
        renderCollection();
    } else if (screen === 'upgrade') {
        document.getElementById('upgrade-screen').classList.add('active');
        renderUpgradeScreen();
    } else if (screen === 'profile') {
        document.getElementById('profile-screen').classList.add('active');
        renderProfile();
    } else if (screen === 'friends') {
        document.getElementById('friends-screen').classList.add('active');
        renderFriends();
    }

    currentScreen = screen;
}

function showNewScreen(screen) {
    if (screen === 'main') {
        document.getElementById('main-screen').classList.add('active', 'screen-enter');
        renderCenterArea();
    } else if (screen === 'collection') {
        document.getElementById('collection-screen').classList.add('active', 'screen-enter');
        renderCollection();
    } else if (screen === 'upgrade') {
        document.getElementById('upgrade-screen').classList.add('active', 'screen-enter');
        renderUpgradeScreen();
    } else if (screen === 'profile') {
        document.getElementById('profile-screen').classList.add('active', 'screen-enter');
        renderProfile();
    } else if (screen === 'friends') {
        document.getElementById('friends-screen').classList.add('active', 'screen-enter');
        renderFriends();
    }
    
    // Убираем класс анимации входа через короткое время
    setTimeout(() => {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('screen-enter'));
    }, 300);

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
        let upgradeGlow = '';
        let nameStyle = '';
        let upgradeInfo = '';
        
        // Проверяем наличие апгрейдов
        if (activeBattleNft.upgrades && Object.keys(activeBattleNft.upgrades).length > 0) {
            const upgradeValues = Object.values(activeBattleNft.upgrades);
            const maxUpgrade = Math.max(...upgradeValues);
    
            let rarity = 'common';
            if (maxUpgrade >= 1.20) {
                rarity = 'rare';
            } else if (maxUpgrade >= 1.12) {
                rarity = 'uncommon';
            }

            const rarityColors = {
                common: '#4caf50',
                uncommon: '#2196f3', 
                rare: '#ff9800'
            };

            const rarityColor = rarityColors[rarity];
    
    // ТОЛЬКО ОБВОДКА БЕЗ АНИМАЦИИ
            upgradeGlow = `
                border: 3px solid ${rarityColor}; 
                box-shadow: 0 0 20px ${rarityColor}60;
            `;
    
            nameStyle = `color: ${rarityColor}; text-shadow: 0 0 10px ${rarityColor}60;`;
    
            const upgradeTypes = {
                damage: { name: 'Увеличение урона', icon: '⚔️' },
                dodge: { name: 'Уклонение', icon: '🛡️' },
                crit: { name: 'Критический удар', icon: '💥' }
            };
    
            const upgradesList = Object.entries(activeBattleNft.upgrades)
                .map(([type, level]) => {
                    const upgrade = upgradeTypes[type];
                    if (upgrade) {
                        return `<div style="display: inline-block; background: ${rarityColor}20; color: ${rarityColor}; border: 1px solid ${rarityColor}; padding: 4px 8px; border-radius: 6px; margin: 2px; font-size: 12px; font-weight: 600;">
                            ${upgrade.icon} +${Math.round((level - 1) * 100)}%
                        </div>`;
                    }
                    return '';
                }).filter(Boolean).join('');
            upgradeInfo = `<div style="margin-top: 12px;">${upgradesList}</div>`;
        }

        
        centerDiv.innerHTML = `
            <img src="${activeBattleNft.img}" class="center-nft-img" alt="${activeBattleNft.name}" style="${upgradeGlow}">
            <div class="center-nft-name" style="${nameStyle}">${activeBattleNft.name}</div>
            <div class="center-nft-status">Готов к дуэли</div>
            ${upgradeInfo}
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
            
            // Определяем стили для апгрейженных NFT
            let cardStyle = '';
            let nameStyle = '';
            let upgradeInfo = '';
            let isUpgraded = false;
            
            if (nft.upgrades && Object.keys(nft.upgrades).length > 0) {
                isUpgraded = true;
                const upgradeValues = Object.values(nft.upgrades);
                const maxUpgrade = Math.max(...upgradeValues);
    
                let rarity = 'common';
                if (maxUpgrade >= 1.20) {
                    rarity = 'rare';
                } else if (maxUpgrade >= 1.12) {
                    rarity = 'uncommon';
                }
    
                const rarityColors = {
                    common: '#4caf50',
                    uncommon: '#2196f3',
                    rare: '#ff9800'
                };
    
                const rarityColor = rarityColors[rarity];
    
    // ТОЛЬКО ОБВОДКА БЕЗ АНИМАЦИИ
                cardStyle = `
                    border: 2px solid ${rarityColor}; 
                    box-shadow: 0 0 15px ${rarityColor}40;
                `;
    
                nameStyle = `color: ${rarityColor}; font-weight: 700;`;
    
                const upgradeTypes = {
                    damage: { name: 'Урон', icon: '⚔️' },
                    dodge: { name: 'Уклонение', icon: '🛡️' },
                    crit: { name: 'Крит', icon: '💥' }
                };
    
                const upgradesList = Object.entries(nft.upgrades)
                    .map(([type, level]) => {
                        const upgrade = upgradeTypes[type];
                        if (upgrade) {
                            return `<div class="upgrade-badge" style="background: ${rarityColor}20; color: ${rarityColor}; border: 1px solid ${rarityColor};">
                                ${upgrade.icon} +${Math.round((level - 1) * 100)}%
                            </div>`;
                        }
                        return '';
                    }).filter(Boolean).join('');
                upgradeInfo = `<div class="nft-upgrades">${upgradesList}</div>`;
            }
            
            const card = document.createElement('div');
            card.className = 'nft-card';
            card.style.cssText = cardStyle;
            
            card.innerHTML = `
                <img src="${nft.img}" class="nft-card-img" alt="${nft.name}">
                <div class="nft-card-name" style="${nameStyle}">${nft.name} ${isActive ? '⚔️' : ''}</div>
                <div class="nft-card-price">Куплено за ${nft.buyPrice} звёзд</div>
                ${upgradeInfo}
                <button class="nft-card-btn" onclick="setToBattle(${index})" ${isActive ? 'disabled' : ''}>
                    ${isActive ? 'Готов к дуэли' : 'Выбрать'}
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

    switch (currentFilter) {
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

    nftItems.forEach(({ template, price, originalIndex }) => {
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
            
            // Определяем стили для апгрейженных NFT
            let cardStyle = '';
            let nameStyle = '';
            let upgradeInfo = '';
            
            if (nft.upgrades && Object.keys(nft.upgrades).length > 0) {
                const upgradeValues = Object.values(nft.upgrades);
                const maxUpgrade = Math.max(...upgradeValues);
                
                let rarity = 'common';
                if (maxUpgrade >= 1.20) {
                    rarity = 'rare';
                } else if (maxUpgrade >= 1.12) {
                    rarity = 'uncommon';
                }
    
                const rarityColors = {
                    common: '#4caf50',
                    uncommon: '#2196f3',
                    rare: '#ff9800'
                };
    
                const rarityColor = rarityColors[rarity];
                
    // ТОЛЬКО ОБВОДКА БЕЗ АНИМАЦИИ
                cardStyle = `
                    border: 2px solid ${rarityColor}; 
                    box-shadow: 0 0 15px ${rarityColor}40;
                `;
    
                nameStyle = `color: ${rarityColor}; font-weight: 700;`;
                
                const upgradeTypes = {
                    damage: { name: 'Урон', icon: '⚔️' },
                    dodge: { name: 'Уклонение', icon: '🛡️' },
                    crit: { name: 'Крит', icon: '💥' }
                };
    
                const upgradesList = Object.entries(nft.upgrades)
                    .map(([type, level]) => {
                        const upgrade = upgradeTypes[type];
                        if (upgrade) {
                            return `<div class="upgrade-badge" style="background: ${rarityColor}20; color: ${rarityColor}; border: 1px solid ${rarityColor};">
                                ${upgrade.icon} +${Math.round((level - 1) * 100)}%
                            </div>`;
                        }
                        return '';
                    }).filter(Boolean).join('');
                upgradeInfo = `<div class="nft-upgrades">${upgradesList}</div>`;
            }
            
            const card = document.createElement('div');
            card.className = 'nft-card';
            card.style.cssText = cardStyle;
            
            card.innerHTML = `
                <img src="${nft.img}" class="nft-card-img" alt="${nft.name}">
                <div class="nft-card-name" style="${nameStyle}">${nft.name} ${isActive ? '⚔️' : ''}</div>
                <div class="nft-card-price">Стоимость: ${nft.buyPrice} звёзд</div>
                ${upgradeInfo}
            `;
            grid.appendChild(card);
        });
    }
}

function renderFriends() {
    const friendsList = document.getElementById('friends-list');
    friendsList.innerHTML = '';

    if (referredFriends.length === 0) {
        friendsList.innerHTML = `
            <div class="no-friends">
                <p>У вас пока нет приглашённых друзей<br>Приглашайте друзей и получайте звёзды!</p>
            </div>
        `;
    } else {
        referredFriends.forEach(friend => {
            const friendItem = document.createElement('div');
            friendItem.className = 'friend-item';
            friendItem.innerHTML = `
                <div class="friend-info">
                    <div class="friend-avatar">${friend.name[0]}</div>
                    <div class="friend-details">
                        <div class="friend-name">${friend.name}</div>
                        <div class="friend-date">${new Date(friend.date).toLocaleDateString()}</div>
                    </div>
                </div>
                <div class="friend-reward">+1 <i class="fas fa-star"></i></div>
            `;
            friendsList.appendChild(friendItem);
        });
    }

    document.getElementById('friends-count').textContent = `(${referredFriends.length})`;
    document.getElementById('invited-count').textContent = referredFriends.length;
    document.getElementById('earned-from-referrals').textContent = starsFromReferrals;
}

function updateReferralInfo() {
    document.getElementById('referral-link').value = `https://t.me/YourBot?start=${referralCode}`;
}

function buyNft(templateIndex, price) {
    if (stars >= price) {
        stars -= price;
        const nft = { ...nftTemplates[templateIndex], buyPrice: price };
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

function setToBattle(index) {
    activeBattleNft = { ...collection[index] };
    updateUI();
    renderCollection();
    renderCenterArea();
    alert(`${activeBattleNft.name} выбран для дуэли!`);
    
    // Переходим в главное меню
    setTimeout(() => {
        switchScreen('main');
    }, 1000);
}

function showRules() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('rules-screen').classList.add('active');
}

function backToMainFromRules() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('main-screen').classList.add('active');
}

function showBattleHistory() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('battle-history-screen').classList.add('active');
    renderBattleHistory();
}

function renderBattleHistory() {
    const historyList = document.getElementById('battle-history-list');
    historyList.innerHTML = '';

    if (battleHistory.length === 0) {
        historyList.innerHTML = '<div style="text-align: center; padding: 40px; color: #888888;">История дуэлей пуста</div>';
    } else {
        battleHistory.reverse().forEach(battle => {
            const item = document.createElement('div');
            item.className = 'battle-history-item';
            item.innerHTML = `
                <div class="battle-history-header">
                    <div class="battle-result-text ${battle.won ? 'win' : 'lose'}">${battle.won ? 'Победа' : 'Поражение'}</div>
                    <div style="font-size: 12px; color: #888888;">${new Date(battle.timestamp).toLocaleString()}</div>
                </div>
                <div class="battle-history-nfts">
                    <div class="history-nft">
                        <img src="${battle.playerNft.img}" class="history-nft-img" alt="${battle.playerNft.name}">
                        <div class="history-nft-name">${battle.playerNft.name}</div>
                    </div>
                    <div class="history-vs">VS</div>
                    <div class="history-nft">
                        <img src="${battle.opponentNft.img}" class="history-nft-img" alt="${battle.opponentNft.name}">
                        <div class="history-nft-name">${battle.opponentNft.name}</div>
                    </div>
                </div>
            `;
            historyList.appendChild(item);
        });
    }
}

function backToProfile() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('profile-screen').classList.add('active');
    renderProfile();
}

function copyReferralLink() {
    const referralInput = document.getElementById('referral-link');
    referralInput.select();
    document.execCommand('copy');
    alert('Реферальная ссылка скопирована!');
}

function inviteFriend() {
    const referralLink = `https://t.me/YourBot?start=${referralCode}`;
    const shareText = `Присоединяйся к игре и получи бонусы! ${referralLink}`;
    
    if (Telegram.WebApp.openTelegramLink) {
        Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareText)}`);
    } else {
        // Fallback для тестирования
        copyReferralLink();
    }
}

function showTerms() {
    alert('Условия партнёрства:\n\n- Привлекайте активных игроков\n- Получайте % от их покупок\n- Минимальный порог выплат: 100 TON\n\nДля подключения свяжитесь с администратором.');
}

// Функция для загрузки апгрейд системы (из upgrade-system.js)
function renderUpgradeScreen() {
    if (typeof window.renderUpgradeScreen === 'function') {
        window.renderUpgradeScreen();
    } else {
        // Fallback если upgrade-system.js не загружен
        const grid = document.getElementById('upgradable-nft-grid');
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #888888;">Система апгрейдов загружается...</div>';
    }
}

// Добавьте эту функцию в конец файла script.js

// Добавьте эту функцию в конец файла script.js

