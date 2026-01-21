// Gaming Hub JavaScript - Game Management & UI Logic

// Online Hardcore Multiplayer Games Database
const GAMES_DATABASE = [
  {
    id: 1,
    name: "Blood Strike",
    emoji: "🩸",
    category: "action",
    description: "Intense multiplayer tactical shooter. Fast-paced combat with various game modes. Free-to-play FPS action!",
    playersNow: 456789,
    avgScore: 18500,
    avgTime: 12,
    rating: 4.8,
    badges: "HOT",
    gameUrl: "https://play.bloodstrike.com",
    type: "shooter"
  },
  {
    id: 2,
    name: "Call of Duty Mobile",
    emoji: "🔫",
    category: "action",
    description: "COD Mobile - Legendary FPS on mobile! Multiplayer battles, Zombies, Campaign. True COD experience.",
    playersNow: 2345678,
    avgScore: 24500,
    avgTime: 15,
    rating: 4.9,
    badges: "TOP",
    gameUrl: "https://www.callofduty.com/mobile",
    type: "shooter"
  },
  {
    id: 3,
    name: "PUBG Mobile",
    emoji: "🎯",
    category: "action",
    description: "PUBG Mobile - Battle royale legend! 100 players drop, loot, and fight. Survive to win!",
    playersNow: 3456789,
    avgScore: 45000,
    avgTime: 20,
    rating: 4.8,
    badges: "TRENDING",
    gameUrl: "https://www.pubgmobile.com",
    type: "battle-royale"
  },
  {
    id: 4,
    name: "FireLite",
    emoji: "🔥",
    category: "action",
    description: "Fast-paced online shooter! Competitive matches with squad-based gameplay. Download and dominate!",
    playersNow: 234567,
    avgScore: 16200,
    avgTime: 10,
    rating: 4.7,
    badges: null,
    gameUrl: "https://firelite.com",
    type: "shooter"
  },
  {
    id: 5,
    name: "Fortnite",
    emoji: "⚡",
    category: "action",
    description: "Epic battle royale! 100 players compete with building mechanics. Free-to-play with seasons & events.",
    playersNow: 5678901,
    avgScore: 55000,
    avgTime: 18,
    rating: 4.9,
    badges: "TOP",
    gameUrl: "https://www.fortnite.com",
    type: "battle-royale"
  },
  {
    id: 6,
    name: "Valorant",
    emoji: "🎪",
    category: "action",
    description: "Tactical 5v5 competitive shooter! Agent-based abilities with round-based economy system.",
    playersNow: 1234567,
    avgScore: 28000,
    avgTime: 35,
    rating: 4.9,
    badges: "HOT",
    gameUrl: "https://playvalorant.com",
    type: "shooter"
  },
  {
    id: 7,
    name: "Counter-Strike 2",
    emoji: "💥",
    category: "action",
    description: "CS2 - The legendary competitive FPS! Terrorist vs Counter-Terrorist. Pure tactical gameplay.",
    playersNow: 2789012,
    avgScore: 32000,
    avgTime: 40,
    rating: 4.8,
    badges: null,
    gameUrl: "https://www.counter-strike.net/cs2",
    type: "shooter"
  },
  {
    id: 8,
    name: "Apex Legends",
    emoji: "🎮",
    category: "action",
    description: "Hero-based battle royale! 3v3 teams with unique legends. Ping system for teamwork.",
    playersNow: 1890234,
    avgScore: 38000,
    avgTime: 20,
    rating: 4.8,
    badges: "TRENDING",
    gameUrl: "https://www.ea.com/games/apex",
    type: "battle-royale"
  },
  {
    id: 9,
    name: "Warzone 2.0",
    emoji: "⚔️",
    category: "action",
    description: "Call of Duty Warzone - Massive 150-player battle royale. Squads, Solos, Duos modes.",
    playersNow: 3567890,
    avgScore: 52000,
    avgTime: 25,
    rating: 4.7,
    badges: "HOT",
    gameUrl: "https://www.callofduty.com/warzone",
    type: "battle-royale"
  },
  {
    id: 10,
    name: "Rainbow Six Siege",
    emoji: "🛡️",
    category: "strategy",
    description: "Tactical team-based shooter! 5v5 with destructible environments. Attack & defend objectives.",
    playersNow: 987654,
    avgScore: 25000,
    avgTime: 40,
    rating: 4.7,
    badges: null,
    gameUrl: "https://www.ubisoft.com/en-us/game/rainbow-six/siege",
    type: "shooter"
  },
  {
    id: 11,
    name: "Overwatch 2",
    emoji: "🎯",
    category: "multiplayer",
    description: "Hero shooter 5v5! Team-based gameplay with diverse character abilities. Free-to-play.",
    playersNow: 2345678,
    avgScore: 35000,
    avgTime: 25,
    rating: 4.8,
    badges: "TOP",
    gameUrl: "https://overwatch.blizzard.com",
    type: "hero-shooter"
  },
  {
    id: 12,
    name: "Lost Ark",
    emoji: "⚔️",
    category: "multiplayer",
    description: "MMO action RPG! Hardcore PvE raids and PvP combat. Rich story with dungeons and guilds.",
    playersNow: 456789,
    avgScore: 45000,
    avgTime: 120,
    rating: 4.6,
    badges: null,
    gameUrl: "https://www.lostarkmmo.com",
    type: "mmo"
  },
  {
    id: 13,
    name: "New World",
    emoji: "🗡️",
    category: "multiplayer",
    description: "MMO with large-scale PvP! Territory wars between factions. Crafting, dungeons, raids.",
    playersNow: 234567,
    avgScore: 40000,
    avgTime: 90,
    rating: 4.5,
    badges: null,
    gameUrl: "https://www.newworld.com",
    type: "mmo"
  },
  {
    id: 14,
    name: "Destiny 2",
    emoji: "🌙",
    category: "action",
    description: "Sci-fi shooter MMO! PvE strikes & raids. Competitive PvP Crucible matches.",
    playersNow: 1234567,
    avgScore: 48000,
    avgTime: 60,
    rating: 4.8,
    badges: "TRENDING",
    gameUrl: "https://www.bungie.net/7/en/Destiny/NewLight",
    type: "shooter-mmo"
  },
  {
    id: 15,
    name: "PLAYERUNKNOWN'S BATTLEGROUNDS",
    emoji: "🏆",
    category: "action",
    description: "Original battle royale! 100 players, massive map, intense combat. The game that started it all!",
    playersNow: 2567890,
    avgScore: 50000,
    avgTime: 25,
    rating: 4.7,
    badges: "HOT",
    gameUrl: "https://www.pubg.com",
    type: "battle-royale"
  }
];

// State management
let allGames = [...GAMES_DATABASE];
let currentCategory = "all";
let currentSearchQuery = "";
let selectedGame = null;
let darkMode = true;

// Initialize gaming hub
document.addEventListener("DOMContentLoaded", () => {
  initializeDarkMode();
  loadGames();
  setupEventListeners();
});

// Setup all event listeners
function setupEventListeners() {
  // Back button
  document.getElementById("back-to-chat-btn")?.addEventListener("click", () => {
    window.location.href = "chat.html";
  });

  // Search input
  document.getElementById("game-search-input")?.addEventListener("input", (e) => {
    currentSearchQuery = e.target.value.toLowerCase();
    filterAndDisplayGames();
  });

  // Category tabs
  document.querySelectorAll(".category-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".category-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      currentCategory = tab.dataset.category;
      filterAndDisplayGames();
    });
  });

  // Close modal
  document.getElementById("close-game-modal-btn")?.addEventListener("click", closeGameModal);

  // Modal background click
  document.getElementById("game-detail-modal")?.addEventListener("click", (e) => {
    if (e.target.id === "game-detail-modal") {
      closeGameModal();
    }
  });

  // Play button
  document.getElementById("play-game-btn")?.addEventListener("click", () => {
    if (selectedGame) {
      playGame(selectedGame);
    }
  });

  // Share button
  document.getElementById("share-game-btn")?.addEventListener("click", () => {
    if (selectedGame) {
      shareGame(selectedGame);
    }
  });
}

// Dark mode management
function initializeDarkMode() {
  const savedDarkMode = localStorage.getItem("darkMode");
  darkMode = savedDarkMode !== "false";
  
  if (!darkMode) {
    document.body.classList.add("light-mode");
  } else {
    document.body.classList.remove("light-mode");
  }
}

// Load and display games
function loadGames() {
  displayLoadingState(true);
  
  // Simulate loading delay
  setTimeout(() => {
    displayLoadingState(false);
    filterAndDisplayGames();
  }, 300);
}

// Filter games based on category and search
function filterAndDisplayGames() {
  let filtered = allGames;

  // Filter by category
  if (currentCategory !== "all") {
    filtered = filtered.filter((game) => game.category === currentCategory);
  }

  // Filter by search query
  if (currentSearchQuery) {
    filtered = filtered.filter((game) =>
      game.name.toLowerCase().includes(currentSearchQuery) ||
      game.description.toLowerCase().includes(currentSearchQuery)
    );
  }

  displayGames(filtered);
}

// Display games in grid
function displayGames(games) {
  const grid = document.getElementById("games-grid");
  const emptyState = document.getElementById("empty-state");

  if (!grid) return;

  if (games.length === 0) {
    grid.style.display = "none";
    emptyState.style.display = "flex";
    return;
  }

  grid.style.display = "grid";
  emptyState.style.display = "none";
  grid.innerHTML = games
    .map(
      (game) => `
    <div class="game-card" onclick="viewGameDetail(${game.id})">
      <div class="game-card-image">
        <span>${game.emoji}</span>
        ${game.badges ? `<div class="game-card-badge">${game.badges}</div>` : ""}
      </div>
      <div class="game-card-info">
        <h3 class="game-card-name">${game.name}</h3>
        <p class="game-card-category">${game.category}</p>
        <div class="game-card-stats">
          <span class="stat">👥 ${formatNumber(game.playersNow)}</span>
          <span class="stat">⭐ ${game.rating}</span>
        </div>
        <div class="game-card-rating">
          ${Array(Math.round(game.rating))
            .fill("⭐")
            .join("")}
        </div>
      </div>
    </div>
  `
    )
    .join("");
}

// View game detail modal
function viewGameDetail(gameId) {
  selectedGame = allGames.find((g) => g.id === gameId);
  if (!selectedGame) return;

  const modal = document.getElementById("game-detail-modal");
  document.getElementById("game-detail-image").innerHTML = selectedGame.emoji;
  document.getElementById("game-detail-name").textContent = selectedGame.name;
  document.getElementById("game-detail-category").textContent = 
    selectedGame.category.charAt(0).toUpperCase() + selectedGame.category.slice(1);
  document.getElementById("game-detail-players").textContent = formatNumber(selectedGame.playersNow);
  document.getElementById("game-detail-rating").textContent = `${selectedGame.rating} ⭐`;
  document.getElementById("game-detail-description").textContent = selectedGame.description;
  document.getElementById("game-detail-playing").textContent = formatNumber(selectedGame.playersNow);
  document.getElementById("game-detail-score").textContent = formatNumber(selectedGame.avgScore);
  document.getElementById("game-detail-time").textContent = `${selectedGame.avgTime}min`;

  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

// Close game modal
function closeGameModal() {
  const modal = document.getElementById("game-detail-modal");
  modal.style.display = "none";
  document.body.style.overflow = "auto";
  selectedGame = null;
}

// Play game - Open online game in new tab
function playGame(game) {
  if (!game.gameUrl) {
    showNotification(`Game ${game.name} not yet available`, "error");
    return;
  }
  
  showNotification(`🎮 Launching ${game.name}...`, "success");
  
  // Log game play event
  console.log(`▶️ Playing online game: ${game.name} | URL: ${game.gameUrl}`);
  
  // Open game in new tab after a short delay
  setTimeout(() => {
    window.open(game.gameUrl, "_blank");
    showNotification(`🎮 ${game.name} opened in new tab!`, "success", 2000);
    closeGameModal();
  }, 500);
}

// Share game
function shareGame(game) {
  const shareText = `🎮 Check out ${game.name}! ${game.emoji}\n\n${game.description}\n\nRate: ${game.rating}⭐`;
  
  if (navigator.share) {
    navigator.share({
      title: game.name,
      text: shareText,
      url: window.location.href
    });
  } else {
    // Fallback for non-supporting browsers
    const textArea = document.createElement("textarea");
    textArea.value = shareText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    showNotification("📋 Game info copied to clipboard!", "success");
  }
}

// Display loading state
function displayLoadingState(show) {
  const loadingState = document.getElementById("loading-state");
  if (loadingState) {
    loadingState.style.display = show ? "flex" : "none";
  }
}

// Format number for display (1000 -> 1K)
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

// Notification system
function showNotification(message, type = "info", duration = 2000) {
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 16px;
    left: 16px;
    right: 16px;
    background: ${type === "success" ? "#00ff66" : type === "error" ? "#ff4444" : "#00ccff"};
    color: ${type === "success" ? "#000" : "#fff"};
    padding: 14px 16px;
    border-radius: 12px;
    font-weight: 600;
    z-index: 1001;
    animation: slideDown 0.3s ease-out;
    box-shadow: 0 4px 16px ${type === "success" ? "rgba(0, 255, 102, 0.3)" : "rgba(0, 204, 255, 0.3)"};
    max-width: 320px;
  `;
  
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideUp 0.3s ease-out";
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, duration);
}

// Add animation styles
const style = document.createElement("style");
style.textContent = `
  @keyframes slideDown {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      transform: translateY(0);
      opacity: 1;
    }
    to {
      transform: translateY(-100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Haptic feedback for interactions
function hapticFeedback(type = "light") {
  if (navigator.vibrate) {
    const patterns = {
      light: 10,
      medium: 20,
      heavy: 50,
      success: [10, 20, 10]
    };
    navigator.vibrate(patterns[type] || 10);
  }
}

// Handle keyboard navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeGameModal();
  }
});

// Responsive check
window.addEventListener("orientationchange", () => {
  setTimeout(() => {
    filterAndDisplayGames();
  }, 100);
});

console.log("🎮 Gaming Hub initialized successfully!");
