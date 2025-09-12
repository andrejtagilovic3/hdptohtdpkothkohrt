const upgradeTypes = {
       damage: {
           name: 'Увеличение урона',
           rarity: 'common',
           cost: 50,
           icon: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/img_upd/desc/damage.png',
           color: '#4caf50'
       },
       dodge: {
           name: 'Уклонение',
           rarity: 'uncommon',
           cost: 75,
           icon: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/img_upd/desc/dodge.png',
           color: '#2196f3'
       },
       crit: {
           name: 'Критический удар',
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

   // Новая функция для определения редкости и цвета
   function getRarityAndColor(nft) {
       if (!nft.upgrades || Object.keys(nft.upgrades).length === 0) {
           return { rarity: 'common', color: rarityColors.common };
       }
       
       const maxUpgrade = Math.max(...Object.values(nft.upgrades));
       let rarity = 'common';
       if (maxUpgrade >= 1.20) rarity = 'rare';
       else if (maxUpgrade >= 1.12) rarity = 'uncommon';
       
       return { rarity, color: rarityColors[rarity] };
   }

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
           
           const { rarity, color } = getRarityAndColor(nft);
           let cardStyle = `border: 2px solid ${color}; box-shadow: 0 0 15px ${color}40;`;
           let nameStyle = `color: ${color}; font-weight: 700;`;
           let upgradeInfo = '';
           let isUpgraded = nft.upgrades && Object.keys(nft.upgrades).length > 0;
           
           if (isUpgraded) {
               upgradeInfo = Object.entries(nft.upgrades)
                   .map(([type, level]) => {
                       const upgrade = upgradeTypes[type];
                       if (upgrade) {
                           return `<div class="upgrade-badge" style="background: ${color}20; color: ${color}; border: 1px solid ${color};">
                               ${upgrade.name.split(' ')[0]} +${Math.round((level - 1) * 100)}%
                           </div>`;
                       }
                       return '';
                   }).filter(Boolean).join('');
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
       
       if (nft.upgrades && Object.keys(nft.upgrades).length > 0) {
           alert('Этот NFT уже апгрейден!');
           return;
       }
       
       if (stars < 50) {
           alert('Недостаточно звёзд! Нужно 50 звёзд.');
           return;
       }
       
       selectedNftForUpgrade = {nft: {...nft}, index};
       stars -= 50;
       updateUI();
       
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
               
               giftBox.style.animation = 'giftShake 0.3s ease';
               
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
           common: { min: 1.05, max: 1.12 },
           uncommon: { min: 1.12, max: 1.20 },
           rare: { min: 1.20, max: 1.30 }
       };
       
       const multiplier = rarityMultipliers[wonRarity];
       const rarityBonus = multiplier.min + Math.random() * (multiplier.max - multiplier.min);
       
       const upgrade = upgradeTypes[currentUpgradeType];
       
       const nftToUpgrade = collection[selectedNftForUpgrade.index];
       if (!nftToUpgrade.upgrades) nftToUpgrade.upgrades = {};
       nftToUpgrade.upgrades[currentUpgradeType] = rarityBonus;
       
       if (activeBattleNft && 
           activeBattleNft.name === nftToUpgrade.name && 
           activeBattleNft.img === nftToUpgrade.img && 
           activeBattleNft.buyPrice === nftToUpgrade.buyPrice) {
           activeBattleNft = {...nftToUpgrade};
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

   // Экспортируем функцию для использования в других файлах
   window.getRarityAndColor = getRarityAndColor;
