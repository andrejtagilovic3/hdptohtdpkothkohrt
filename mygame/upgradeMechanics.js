// upgradeMechanics.js - Логика апгрейда и анимаций

// Инициализация
function initializeUpgrades() {
  // Добавляем stats к каждому NFT в коллекции (если нет)
  collection.forEach(nft => {
    if (!nft.stats) {
      nft.stats = { health: 100, attack: 10, evasion: 0, critChance: 15, missChance: 8 };
    }
    if (!nft.upgrades) nft.upgrades = [];
  });
  if (activeBattleNft) {
    if (!activeBattleNft.stats) activeBattleNft.stats = { health: 100, attack: 10, evasion: 0, critChance: 15, missChance: 8 };
    if (!activeBattleNft.upgrades) activeBattleNft.upgrades = [];
  }
}

// Рендер экрана апгрейда
function renderUpgradeScreen() {
  const upgradeDiv = document.getElementById('upgrade-content');
  upgradeDiv.innerHTML = `
    <div class="gift-container">
      <img id="gift-img" src="https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/img_upd/desc/1.gif" alt="Подарок" class="gift-sprite">
      <div id="cracks" class="cracks"></div>
    </div>
    <p>Тапайте по подарку, чтобы открыть! (Стоимость: 50 звезд)</p>
  `;
  const gift = document.getElementById('gift-img');
  let tapCount = 0;
  const maxTaps = 5; // Кол-во тапов для открытия
  const selectedUpgrade = getRandomUpgrade(); // Выбираем заранее для цвета трещин
  const rarityColor = upgradeRarities[selectedUpgrade.rarity].color;

  gift.addEventListener('click', () => {
    if (stars < 50) return alert('Недостаточно звезд!');
    if (tapCount === 0) stars -= 50; // Снимаем только раз
    tapCount++;
    // Анимация: звук (симулируем), трещины, тряска
    // TODO: Добавьте звук: new Audio('hit.mp3').play();
    const cracks = document.getElementById('cracks');
    cracks.style.opacity = tapCount / maxTaps;
    cracks.style.background = `radial-gradient(circle, transparent, ${rarityColor})`; // Цвет трещин по редкости
    gift.classList.add('shake');
    setTimeout(() => gift.classList.remove('shake'), 500);

    if (tapCount >= maxTaps) {
      // Взлом: Анимация открытия
      gift.style.animation = 'explode 1s forwards';
      setTimeout(() => {
        showUpgradePopup(selectedUpgrade);
      }, 1000);
    }
  });
}

// Попап с апгрейдом
function showUpgradePopup(upgrade) {
  // Для теста: Применяем только к 'Bday candle 2v'
  const targetNft = collection.find(nft => nft.name === 'Bday candle 2v');
  if (!targetNft) return alert('Нет подходящего NFT для теста!');
  
  const popup = document.createElement('div');
  popup.className = 'upgrade-popup';
  popup.innerHTML = `
    <h2>${upgrade.name}</h2>
    <p>Редкость: ${upgrade.rarity}</p>
    <p>Улучшение: ${upgrade.stat_buff} +${upgrade.buff_value}%</p>
    <p>Стоимость применения: ${upgrade.price} звезд</p>
    <button onclick="applyUpgrade(${upgrade.id})">Применить</button>
  `;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 10000); // Автозакрытие
}

// Применение апгрейда
function applyUpgrade(upgradeId) {
  const upgrade = upgrades.find(u => u.id === upgradeId);
  const targetNft = collection.find(nft => nft.name === 'Bday candle 2v');
  if (stars < upgrade.price) return alert('Недостаточно звезд!');
  stars -= upgrade.price;
  targetNft.upgrades.push(upgrade);
  // Применяем buff
  targetNft.stats[upgrade.stat_buff] += upgrade.buff_value;
  updateUI();
  saveData();
  alert('Апгрейд применен!');
}

// Новый подбор бота с учетом апгрейдов
function selectBotNft(playerNft) {
  let bot = {}; // Симулируем бота
  if (playerNft.upgrades.length > 0) {
    // Похожий уровень: Суммарный buff_value
    const playerBuffSum = playerNft.upgrades.reduce((sum, u) => sum + u.buff_value, 0);
    const botBuffSum = playerBuffSum + Math.floor(playerBuffSum * 0.1); // +10% для <50% шанса
    // Симулируем апгрейды для бота
    bot.stats = { health: 100, attack: 10, evasion: 0, critChance: 15, missChance: 8 };
    for (let i = 0; i < playerNft.upgrades.length; i++) {
      const simUpgrade = getRandomUpgrade();
      bot.stats[simUpgrade.stat_buff] += simUpgrade.buff_value + (simUpgrade.buff_value * 0.1); // +10%
    }
  } else {
    // Стандартный бот (как в оригинале)
    const randomIndex = Math.floor(Math.random() * nftTemplates.length);
    bot = { ...nftTemplates[randomIndex], price: nftPrices[randomIndex], stats: { health: 100, attack: 10, evasion: 0, critChance: 15, missChance: 8 } };
  }
  return bot;
}

// Учет buffs в атаке (вызывается в performAttack)
function applyBuffsToAttack(attackerStats, damage, isCrit, isMiss) {
  damage += attackerStats.attack * (attackerStats.attack / 100); // Buff attack
  if (Math.random() < attackerStats.evasion / 100) return 0; // Evasion miss
  if (Math.random() < attackerStats.critChance / 100) isCrit = true;
  if (Math.random() < attackerStats.missChance / 100) isMiss = true;
  // ... остальная логика атаки
  return damage;
}
