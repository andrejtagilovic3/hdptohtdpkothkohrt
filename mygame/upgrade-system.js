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
    common: 55,
    uncommon: 35,
    rare: 10
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
        
        let upgradeInfo = '';
        if (nft.upgrades) {
            const upgradesList = Object.entries(nft.upgrades)
                .map(([type, level]) => {
                    const upgrade = upgradeTypes[type];
                    if (upgrade) {
                        return `<div class="upgrade-badge" style="color: ${upgrade.color}">
                            ${upgrade.name.split(' ')[0]} +${Math.round((level - 1) * 100)}%
                        </div>`;
                    }
                    return '';
                }).filter(Boolean).join('');
            upgradeInfo = `<div class="nft-upgrades">${upgradesList}</div>`;
        }
        
        card.innerHTML = `
            <img src="${nft.img}" class="nft-card-img" alt="${nft.name}">
            <div class="nft-card-name">${nft.name}</div>
            <div class="nft-card-price">Базовая цена: ${nft.buyPrice} звёзд</div>
            ${upgradeInfo}
            <button class="nft-card-btn upgrade-btn" onclick="showUpgradeModal(collection[${index}], ${index})">
                <i class="fas fa-arrow-up"></i> Апгрейд
            </button>
        `;
        
        grid.appendChild(card);
    });
}

function showUpgradeModal(nft, index) {
    selectedNftForUpgrade = {nft, index};
    const modal = document.getElementById('upgrade-selection-overlay');
    const nftName = document.getElementById('upgrade-nft-name');
    const nftImg = document.getElementById('upgrade-nft-img');
    const optionsGrid = document.getElementById('upgrade-options');
    
    nftName.textContent = nft.name;
    nftImg.src = nft.img;
    
    optionsGrid.innerHTML = '';
    Object.entries(upgradeTypes).forEach(([key, upgrade]) => {
        const currentLevel = (nft.upgrades && nft.upgrades[key]) ? nft.upgrades[key] : 1;
        const scaledCost = Math.floor(upgrade.cost * Math.pow(1.3, currentLevel - 1));
        
        const option = document.createElement('div');
        option.className = 'upgrade-option';
        
        if (stars < scaledCost) {
            option.classList.add('disabled');
        }
        
        option.innerHTML = `
            <img src="${upgrade.icon}" alt="${upgrade.name}" class="upgrade-icon" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzU1NTU1NSIvPgo8cGF0aCBkPSJNMjAgMTBMMjYgMjZIMTRMMjAgMTBaIiBmaWxsPSIjRkZGRkZGIi8+Cjwvc3ZnPgo='">
            <div class="upgrade-info">
                <div class="upgrade-name">${upgrade.name}</div>
                <div class="upgrade-desc">${upgrade.description} (Уровень ${Math.floor(currentLevel)})</div>
                <div class="upgrade-cost">${scaledCost} звёзд</div>
            </div>
        `;
        
        if (stars >= scaledCost) {
            option.onclick = () => startUpgradeProcess(key);
        }
        
        optionsGrid.appendChild(option);
    });
    
    modal.style.display = 'flex';
}

function closeUpgradeModal() {
    document.getElementById('upgrade-selection-overlay').style.display = 'none';
}

function startUpgradeProcess(upgradeType) {
    if (upgradeInProgress) return;
    
    currentUpgradeType = upgradeType;
    const upgrade = upgradeTypes[upgradeType];
    const nft = selectedNftForUpgrade.nft;
    const currentLevel = (nft.upgrades && nft.upgrades[upgradeType]) ? nft.upgrades[upgradeType] : 1;
    const scaledCost = Math.floor(upgrade.cost * Math.pow(1.3, currentLevel - 1));
    
    if (stars < scaledCost) {
        alert('Недостаточно звёзд!');
        return;
    }
    
    stars -= scaledCost;
    updateUI();
    
    closeUpgradeModal();
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
    
    let tapsRemaining = 5;
    tapsCounter.textContent = tapsRemaining;
    
    giftBox.onclick = () => {
        if (tapsRemaining > 0) {
            tapsRemaining--;
            tapsCounter.textContent = tapsRemaining;
            
            giftBox.classList.add('crack-' + (5 - tapsRemaining));
            
            if (tapsRemaining === 0) {
                setTimeout(() => {
                    showUpgradeResult();
                }, 500);
            }
        }
    };
}

function showUpgradeResult() {
    const result = document.getElementById('upgrade-result');
    const resultIcon = result.querySelector('.result-icon');
    const resultText = result.querySelector('.result-text');
    
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
    
    if (!nft.upgrades) nft.upgrades = {};
    if (!nft.upgrades[currentUpgradeType]) nft.upgrades[currentUpgradeType] = 1;
    
    const oldLevel = nft.upgrades[currentUpgradeType];
    nft.upgrades[currentUpgradeType] *= rarityBonus;
    
    collection[selectedNftForUpgrade.index] = nft;
    
    if (activeBattleNft && 
        activeBattleNft.name === nft.name && 
        activeBattleNft.img === nft.img && 
        activeBattleNft.buyPrice === nft.buyPrice) {
        activeBattleNft = {...nft};
    }
    
    resultIcon.style.background = upgrade.color;
    resultIcon.innerHTML = `<i class="fas fa-arrow-up"></i>`;
    
    const rarityNames = {
        common: { name: 'Обычный', color: '#4caf50' },
        uncommon: { name: 'Редкий', color: '#2196f3' },
        rare: { name: 'Эпический', color: '#ff9800' }
    };
    
    const rarityInfo = rarityNames[wonRarity];
    const bonusPercent = Math.round((rarityBonus - 1) * 100);
    const totalPercent = Math.round((nft.upgrades[currentUpgradeType] - 1) * 100);
    
    resultText.innerHTML = `
        <div style="color: ${rarityInfo.color}; font-size: 20px; font-weight: bold;">${rarityInfo.name} апгрейд!</div>
        <div style="margin-top: 8px;">${upgrade.name}</div>
        <div style="color: #888; font-size: 14px;">Получен бонус: +${bonusPercent}%</div>
        <div style="color: #fff; font-size: 14px; margin-top: 4px;">Общий бонус: +${totalPercent}%</div>
    `;
    
    result.style.display = 'block';
    updateUI();
}

function closeUpgradeAnimation() {
    document.getElementById('upgrade-animation-overlay').style.display = 'none';
    upgradeInProgress = false;
    renderUpgradeScreen();
}
