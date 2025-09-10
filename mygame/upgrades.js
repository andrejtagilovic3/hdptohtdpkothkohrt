// upgrades.js - Структура данных апгрейдов

const upgradeRarities = {
  Common: { chance: 0.60, color: '#888888', coeff: 1 }, // Серый
  Rare: { chance: 0.25, color: '#00bfff', coeff: 2 },   // Синий
  Epic: { chance: 0.10, color: '#9932cc', coeff: 3 },   // Фиолетовый
  Legendary: { chance: 0.05, color: '#ffd700', coeff: 4 } // Золотой
};

const upgrades = [
  { id: 1, name: 'Повышенная маневренность', rarity: 'Common', stat_buff: 'evasion', buff_value: 5, price: 50 }, // +5% evasion
  { id: 2, name: 'Усиленная атака', rarity: 'Rare', stat_buff: 'attack', buff_value: 10, price: 150 },
  { id: 3, name: 'Дополнительное здоровье', rarity: 'Epic', stat_buff: 'health', buff_value: 20, price: 300 },
  { id: 4, name: 'Критический удар', rarity: 'Legendary', stat_buff: 'critChance', buff_value: 5, price: 500 },
  // Добавьте больше по аналогии. Баланс: price = buff_value * coeff + 50 (base)
];

// Функция рандомного выбора апгрейда по шансам
function getRandomUpgrade() {
  const rand = Math.random();
  let cumulative = 0;
  for (const rarity in upgradeRarities) {
    cumulative += upgradeRarities[rarity].chance;
    if (rand <= cumulative) {
      const filtered = upgrades.filter(u => u.rarity === rarity);
      return filtered[Math.floor(Math.random() * filtered.length)];
    }
  }
  return upgrades[0]; // Fallback
}
