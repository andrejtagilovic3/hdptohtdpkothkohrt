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
    { name: 'Jolly Chimp', img: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/imgg/JollyChimp.gif', tier: 'premium' }
];

let playerData = {
    userId: null,
    userName: 'Игрок',
    stars: 0,
    nfts: [],
    upgrades: {},
    battleHistory: [],
    activeNFT: null
};

const screens = document.querySelectorAll('.screen');
const navItems = document.querySelectorAll('.nav-item');
const bottomNav = document.getElementById('bottom-nav');

async function saveData() {
    try {
        const dataToSave = JSON.stringify(playerData);
        await cloudStorage.setItem('playerData', dataToSave);
        console.log('✅ Данные сохранены в облаке!');
    } catch (e) {
        console.error('❌ Ошибка сохранения данных:', e);
    }
}

async function loadData() {
    try {
        const data = await cloudStorage.getItem('playerData');
        if (data) {
            playerData = JSON.parse(data);
            console.log('✅ Данные загружены из облака!');
            if (!playerData.nfts || playerData.nfts.length === 0) {
                await generateInitialNFT();
            }
        } else {
            console.log('ℹ️ Данные не найдены, генерирую стартовый NFT.');
            await generateInitialNFT();
        }
        updateUI();
    } catch (e) {
        console.error('❌ Ошибка загрузки данных:', e);
        await generateInitialNFT();
        updateUI();
    }
}

function generateInitialNFT() {
    return new Promise(async (resolve) => {
        const basicNFTs = nftTemplates.filter(nft => nft.tier === 'basic');
        const randomNFT = basicNFTs[Math.floor(Math.random() * basicNFTs.length)];
        const newNFT = {
            id: Date.now().toString(),
            name: randomNFT.name,
            img: randomNFT.img,
            tier: randomNFT.tier,
            stats: {
                damage: 10,
                dodge: 0.1,
                critChance: 0.05
            },
            upgrades: {}
        };
        playerData.nfts.push(newNFT);
        playerData.activeNFT = newNFT.id;
        playerData.stars = 100;
        await saveData();
        resolve();
    });
}

window.showScreen = function (screenId, sender = null) {
    console.log(`➡️ Переключение на экран: ${screenId}`);
    const targetScreen = document.getElementById(screenId);
    
    // Определяем, является ли целевой экран экраном битвы
    const isBattleScreen = screenId === 'battle-screen';

    // Управление анимацией экранов
    const currentActiveScreen = document.querySelector('.screen.active');
    if (currentActiveScreen && currentActiveScreen !== targetScreen) {
        currentActiveScreen.classList.remove('active', 'screen-enter');
        currentActiveScreen.classList.add('screen-exit');
    }

    // Управление навигацией
    if (!isBattleScreen) {
        if (bottomNav) {
            bottomNav.classList.remove('hidden');
        }
        navItems.forEach(item => item.classList.remove('active'));
        if (sender) {
            sender.classList.add('active');
        } else {
            const defaultNav = document.querySelector(`.nav-item[onclick*="${screenId}"]`);
            if (defaultNav) {
                defaultNav.classList.add('active');
            }
        }
    } else {
        if (bottomNav) {
            bottomNav.classList.add('hidden');
        }
    }

    // Показываем новый экран с анимацией
    if (targetScreen) {
        targetScreen.style.display = 'flex'; // Делаем его видимым для анимации
        setTimeout(() => {
            if (currentActiveScreen) {
                currentActiveScreen.style.display = 'none'; // Скрываем старый экран после анимации
            }
            targetScreen.classList.add('active', 'screen-enter');
            targetScreen.classList.remove('screen-exit');
        }, 300); // Задержка для завершения анимации
    }

    if (screenId === 'collection-screen') {
        renderCollection();
    } else if (screenId === 'shop-screen') {
        renderShop();
    } else if (screenId === 'upgrade-screen') {
        renderUpgradeScreen();
    } else if (screenId === 'profile-screen') {
        renderProfile();
    }
};

window.updateUI = function () {
    const starCountEl = document.getElementById('star-count');
    if (starCountEl) starCountEl.textContent = playerData.stars;

    const userNameEl = document.getElementById('user-name');
    if (userNameEl) userNameEl.textContent = playerData.userName;

    const userAvatarEl = document.getElementById('user-avatar');
    if (userAvatarEl) {
        const userAvatarText = playerData.userName.charAt(0).toUpperCase();
        userAvatarEl.textContent = userAvatarText;
    }
};

window.showPurchaseMenu = function () {
    alert('Пока не реализовано. Здесь будет меню покупки звёзд.');
};

window.showHowToPlay = function () {
    alert('Как играть:\\n1. Нажимайте "Найти врага", чтобы начать бой.\\n2. Выбирайте действия: Атака, Защита или Лечение.\\n3. Побеждайте врагов, получайте звёзды и улучшайте свои NFT!');
};

function renderCollection() {
    const nftGrid = document.getElementById('nft-grid');
    if (!nftGrid) return;
    nftGrid.innerHTML = '';
    const activeNft = playerData.nfts.find(nft => nft.id === playerData.activeNFT);

    playerData.nfts.forEach(nft => {
        const card = document.createElement('div');
        card.className = `nft-card ${nft.id === playerData.activeNFT ? 'active' : ''}`;
        card.innerHTML = `
            <img src="${nft.img}" alt="${nft.name}" class="nft-card-img">
            <h4 class="nft-card-name">${nft.name}</h4>
            <div class="nft-card-actions">
                <button class="nft-card-btn use-btn ${nft.id === playerData.activeNFT ? 'disabled' : ''}" data-id="${nft.id}">
                    ${nft.id === playerData.activeNFT ? 'Используется' : 'Использовать'}
                </button>
                <button class="nft-card-btn upgrade-btn" onclick="startUpgrade('${nft.id}')">
                    <i class="fas fa-hammer"></i> Апгрейд
                </button>
            </div>
        `;
        nftGrid.appendChild(card);
    });

    document.querySelectorAll('.use-btn').forEach(btn => {
        btn.onclick = function() {
            const nftId = this.getAttribute('data-id');
            if (nftId !== playerData.activeNFT) {
                playerData.activeNFT = nftId;
                saveData();
                renderCollection();
                updateUI();
            }
        };
    });
}

function renderShop() {
    const shopGrid = document.getElementById('shop-grid');
    if (!shopGrid) return;
    shopGrid.innerHTML = '';

    const shopItems = [
        { name: 'Basic NFT', cost: 200, tier: 'basic' },
        { name: 'Premium NFT', cost: 500, tier: 'premium' }
    ];

    shopItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'shop-card';
        card.innerHTML = `
            <h4 class="shop-card-name">${item.name}</h4>
            <p class="shop-card-cost"><i class="fas fa-star" style="color: #ffd700;"></i> ${item.cost}</p>
            <button class="shop-card-btn" onclick="purchaseNFT('${item.tier}', ${item.cost})">Купить</button>
        `;
        shopGrid.appendChild(card);
    });
}

function purchaseNFT(tier, cost) {
    if (playerData.stars < cost) {
        alert('Недостаточно звёзд!');
        return;
    }

    playerData.stars -= cost;

    const availableNFTs = nftTemplates.filter(nft => nft.tier === tier);
    const newNFT = availableNFTs[Math.floor(Math.random() * availableNFTs.length)];
    const newNftObject = {
        id: Date.now().toString(),
        name: newNFT.name,
        img: newNFT.img,
        tier: newNFT.tier,
        stats: {
            damage: 10,
            dodge: 0.1,
            critChance: 0.05
        },
        upgrades: {}
    };

    playerData.nfts.push(newNftObject);
    saveData();
    updateUI();
    alert(`Вы купили NFT: ${newNftObject.name}!`);
    renderShop();
}

window.startBattleSearch = function() {
    console.log('Поиск врага начат...');
    const mainScreen = document.getElementById('main-screen');
    const centerMessage = document.getElementById('center-message');
    const playBtn = document.querySelector('.play-btn');

    playBtn.textContent = 'Поиск...';
    playBtn.classList.remove('pulsing');
    playBtn.disabled = true;

    setTimeout(() => {
        const playerNft = playerData.nfts.find(nft => nft.id === playerData.activeNFT);
        if (!playerNft) {
            alert('Сначала выберите NFT для битвы!');
            playBtn.textContent = 'Найти врага';
            playBtn.classList.add('pulsing');
            playBtn.disabled = false;
            return;
        }

        const enemyNft = nftTemplates[Math.floor(Math.random() * nftTemplates.length)];

        // Запускаем битву через экземпляр класса
        if (window.battleSystem && typeof window.battleSystem.init === 'function') {
            const battleStarted = window.battleSystem.init(playerNft, enemyNft);
            if (battleStarted) {
                window.showScreen('battle-screen');
                console.log('Битва успешно запущена!');
            } else {
                console.error('Ошибка запуска битвы!');
                playBtn.textContent = 'Найти врага';
                playBtn.classList.add('pulsing');
                playBtn.disabled = false;
            }
        } else {
            console.error('Undertale Battle System не загружена!');
            playBtn.textContent = 'Найти врага';
            playBtn.classList.add('pulsing');
            playBtn.disabled = false;
        }
    }, 1500);
};

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOM загружен');
    loadData();
    window.renderUI = updateUI;
    if (typeof initUIAnimations === 'function') {
        initUIAnimations();
    }
});

function renderProfile() {
    const profileContent = document.getElementById('profile-content');
    if (!profileContent) return;
    profileContent.innerHTML = `
        <div class="profile-card">
            <div class="profile-info">
                <h3 class="profile-name">Ваш профиль</h3>
                <p><strong>ID:</strong> ${playerData.userId || 'Неизвестно'}</p>
                <p><strong>Имя:</strong> ${playerData.userName}</p>
                <p><strong>Звёзды:</strong> ${playerData.stars}</p>
            </div>
        </div>
        <div class="profile-history">
            <h3>История боев</h3>
            <ul id="battle-history-list">
                ${playerData.battleHistory.length > 0 ? playerData.battleHistory.map(battle => `
                    <li class="${battle.won ? 'won' : 'lost'}">
                        ${battle.won ? 'Победа!' : 'Поражение.'}
                        ${battle.won ? `(+${battle.starsGained} звёзд)` : ''}
                        vs ${battle.opponentNft.name}
                    </li>
                `).join('') : '<li style="text-align: center; color: #666;">Пока нет истории боев.</li>'}
            </ul>
        </div>
        <div class="profile-section">
            <button class="profile-btn" onclick="showTerms()">Условия партнерства</button>
            <button class="profile-btn" onclick="inviteFriend()">Пригласить друга</button>
        </div>
    `;
}

// Функции для партнерства
let referralCode = 'test-referral'; // Замените на реальный код

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
        copyReferralLink();
    }
}

function showTerms() {
    alert('Условия партнёрства:\\n\\n- Привлекайте активных игроков\\n- Получайте % от их покупок\\n- Минимальный порог выплат: 100 TON\\n\\nДля подключения свяжитесь с администратором.');
}
