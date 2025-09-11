const upgradeTypes = {
    damage: {
        name: 'Увеличение урона',
        description: '+15% к урону',
        rarity: 'common',
        cost: 50,
        icon: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/img_upd/desc/damage.png',
        color: '#4caf50'
    },
    dodge: {
        name: 'Уклонение',
        description: '+10% к уклонению',
        rarity: 'uncommon',
        cost: 75,
        icon: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/img_upd/desc/dodge.png',
        color: '#2196f3'
    },
    crit: {
        name: 'Критический удар',
        description: '+12% к критам',
        rarity: 'rare',
        cost: 100,
        icon: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/img_upd/desc/crit.png',
        color: '#ff9800'
    }
};

const upgradeChances = {
    common: 75,
    uncommon: 20,
    rare: 5
};

const rarityColors = {
    common: '#4caf50',
    uncommon: '#2196f3', 
    rare: '#ff9800',
    epic: '#9c27b0'
};

let selectedNftForUpgrade = null;
let currentUpgradeType = null;
let upgradeInProgress = false;

function renderUpgradeScreen() {
    const grid = document.getElementById('upgradable-nft-grid');
    grid.innerHTML = '';
    
    if (collection.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #888888;">У вас нет NFT для апгрейда<br>Купите NFT в магазине</div>';
        return;
    }
    
    collection.forEach((nft, index) => {
        const card = document.createElement('div');
        card.className = 'nft-card upgrade-card';
        
        // Определяем цвет рамки и название на основе апгрейда
        let cardStyle = '';
        let nameStyle = '';
        let upgradeInfo = '';
        let isUpgraded = false;
        
        if (nft.upgrades && Object.keys(nft.upgrades).length > 0) {
            isUpgraded = true;
            // Определяем редкость на основе значения апгрейда
            const upgradeValues = Object.values(nft.upgrades);
            const maxUpgrade = Math.max(...upgradeValues);
            
            let rarity = 'common';
            if (maxUpgrade >= 1.35) rarity = 'rare';
            else if (maxUpgrade >= 1.20) rarity = 'uncommon';
            
            const rarityColor = rarityColors[rarity];
            cardStyle = `border: 2px solid ${rarityColor}; box-shadow: 0 0 15px ${rarityColor}40;`;
            nameStyle = `color: ${rarityColor}; font-weight: 700;`;
            
            const upgradesList = Object.entries(nft.upgrades)
                .map(([type, level]) => {
                    const upgrade = upgradeTypes[type];
                    if (upgrade) {
                        return `<div class="upgrade-badge" style="background: ${rarityColor}20; color: ${rarityColor}; border: 1px solid ${rarityColor};">
                            ${upgrade.name.split(' ')[0]} +${Math.round((level - 1) * 100)}%
                        </div>`;
                    }
                    return '';
                }).filter(Boolean).join('');
            upgradeInfo = `<div class="nft-upgrades">${upgradesList}</div>`;
        }
        
        card.style.cssText = cardStyle;
        
        card.innerHTML = `
            <img src="${nft.img}" class="nft-card-img" alt="${nft.name}">
            <div class="nft-card-name" style="${nameStyle}">${nft.name}</div>
            <div class="nft-card-price">Базовая цена: ${nft.buyPrice} звёзд</div>
            ${upgradeInfo}
            <button class="nft-card-btn upgrade-btn" onclick="showUpgradeModal(${index})" ${isUpgraded ? 'disabled style="background: #666; color: #999; cursor: not-allowed;"' : ''}>
                <i class="fas fa-arrow-up"></i> ${isUpgraded ? 'Апгрейд получен' : 'Апгрейд (50 звёзд)'}
            </button>
        `;
        
        grid.appendChild(card);
    });
}

function showUpgradeModal(index) {
    const nft = collection[index];
    
    // Проверяем, был ли уже апгрейд
    if (nft.upgrades && Object.keys(nft.upgrades).length > 0) {
        alert('Этот NFT уже апгрейден!');
        return;
    }
    
    // Проверяем наличие звёзд
    if (stars < 50) {
        alert('Недостаточно звёзд! Нужно 50 звёзд.');
        return;
    }
    
    selectedNftForUpgrade = {nft, index};
    
    // Снимаем звёзды сразу
    stars -= 50;
    updateUI();
    
    // Случайно выбираем тип апгрейда
    const upgradeTypeKeys = Object.keys(upgradeTypes);
    currentUpgradeType = upgradeTypeKeys[Math.floor(Math.random() * upgradeTypeKeys.length)];
    
    showUpgradeAnimation();
}

function showUpgradeAnimation() {
    upgradeInProgress = true;
    const overlay = document.getElementById('upgrade-animation-overlay');
    const giftBox = document.getElementById('gift-box');
    const tapsCounter = document.getElementById('taps-remaining');
    const result = document.getElementById('upgrade-result');
    
    overlay.style.display = 'flex';
    result.style.display = 'none';
    giftBox.className = 'gift-box';
    giftBox.style.transform = '';
    giftBox.style.boxShadow = '';
    giftBox.style.animation = '';
    giftBox.style.filter = '';
    
    let tapsRemaining = 5;
    tapsCounter.textContent = tapsRemaining;
    
    giftBox.onclick = () => {
        if (tapsRemaining > 0) {
            tapsRemaining--;
            tapsCounter.textContent = tapsRemaining;
            
            // Добавляем эффект тряски при каждом клике
            giftBox.style.animation = 'giftShake 0.3s ease';
            
            // Добавляем визуальные эффекты постепенно
            if (tapsRemaining === 4) {
                giftBox.style.boxShadow = '0 0 20px rgba(76, 175, 80, 0.5)';
            } else if (tapsRemaining === 3) {
                giftBox.style.boxShadow = '0 0 30px rgba(33, 150, 243, 0.5)';
                giftBox.style.transform = 'scale(1.05)';
            } else if (tapsRemaining === 2) {
                giftBox.style.boxShadow = '0 0 40px rgba(255, 152, 0, 0.5)';
                giftBox.style.transform = 'scale(1.1)';
            } else if (tapsRemaining === 1) {
                giftBox.style.boxShadow = '0 0 50px rgba(156, 39, 176, 0.7)';
                giftBox.style.transform = 'scale(1.15)';
            } else if (tapsRemaining === 0) {
                giftBox.style.animation = 'giftExplode 0.5s ease';
                setTimeout(() => {
                    showUpgradeResult();
                }, 500);
            }
            
            // Сброс анимации тряски
            setTimeout(() => {
                if (tapsRemaining > 0) {
                    giftBox.style.animation = '';
                }
            }, 300);
        }
    };
}

function showUpgradeResult() {
    const result = document.getElementById('upgrade-result');
    const resultIcon = result.querySelector('.result-icon');
    const resultText = result.querySelector('.result-text');
    
    // Определяем редкость случайно
    const rand = Math.random() * 100;
    let wonRarity = 'common';
    let cumulativeChance = 0;
    
    for (const [rarity, chance] of Object.entries(upgradeChances)) {
        cumulativeChance += chance;
        if (rand <= cumulativeChance) {
            wonRarity = rarity;
            break;
        }
    }
    
    const rarityMultipliers = {
        common: { min: 1.10, max: 1.20 },
        uncommon: { min: 1.20, max: 1.35 },
        rare: { min: 1.35, max: 1.60 }
    };
    
    const multiplier = rarityMultipliers[wonRarity];
    const rarityBonus = multiplier.min + Math.random() * (multiplier.max - multiplier.min);
    
    const upgrade = upgradeTypes[currentUpgradeType];
    const nft = selectedNftForUpgrade.nft;
    
    // Применяем апгрейд
    if (!nft.upgrades) nft.upgrades = {};
    nft.upgrades[currentUpgradeType] = rarityBonus;
    
    // Обновляем коллекцию
    collection[selectedNftForUpgrade.index] = nft;
    
    // Обновляем активный NFT если это он
    if (activeBattleNft && 
        activeBattleNft.name === nft.name && 
        activeBattleNft.img === nft.img && 
        activeBattleNft.buyPrice === nft.buyPrice) {
        activeBattleNft = {...nft};
    }
    
    const rarityColor = rarityColors[wonRarity];
    resultIcon.style.background = rarityColor;
    resultIcon.innerHTML = `<i class="fas fa-star"></i>`;
    
    const rarityNames = {
        common: { name: 'Обычный', color: '#4caf50' },
        uncommon: { name: 'Редкий', color: '#2196f3' },
        rare: { name: 'Эпический', color: '#ff9800' }
    };
    
    const rarityInfo = rarityNames[wonRarity];
    const bonusPercent = Math.round((rarityBonus - 1) * 100);
    
    resultText.innerHTML = `
        <div style="color: ${rarityInfo.color}; font-size: 20px; font-weight: bold; margin-bottom: 8px;">${rarityInfo.name} апгрейд!</div>
        <div style="font-size: 18px; margin-bottom: 8px;">${upgrade.name}</div>
        <div style="color: ${rarityInfo.color}; font-size: 16px; font-weight: bold;">Бонус: +${bonusPercent}%</div>
        <div style="color: #ccc; font-size: 14px; margin-top: 8px;">${upgrade.description}</div>
    `;
    
    result.style.display = 'block';
    updateUI();
    saveData();
}

function closeUpgradeAnimation() {
    document.getElementById('upgrade-animation-overlay').style.display = 'none';
    upgradeInProgress = false;
    renderUpgradeScreen();
    renderCenterArea();
    renderCollection();
}

function closeUpgradeModal() {
    document.getElementById('upgrade-selection-overlay').style.display = 'none';
}
