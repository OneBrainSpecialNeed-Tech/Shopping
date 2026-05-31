let chartInstance = null;

localStorage.setItem("global_bgm", "off");

const SESSION_KEY = "shop_session";
const USERS_KEY = "shop_users";
const GAMES_KEY = "shop_games";

// =======================
// 🔐 בדיקת מנהל
// =======================

let user = JSON.parse(localStorage.getItem(SESSION_KEY));

if (!user || user.role !== "admin") {
  window.location.href = "login.html";
}

// =======================
// 🧠 נירמול נתונים לפי רמות
// =======================

function normalizeStage(value) {
  if (typeof value === "number") return value;
  if (typeof value === "object" && value !== null) return value.time || 0;
  return 0;
}

function getLevelGroup(game) {
  return game.levelGroup || "A";
}

function getStages(game) {
  const group = getLevelGroup(game);

  if (group === "B") {
    return {
      stage1:    game.stages?.stage1    || 0,
      stage1Max: game.stages?.stage1Max || 40,
      stage2:    game.stages?.stage2    || 0,
      stage2Max: game.stages?.stage2Max || 110,
      stage3:    game.stages?.stage3    || 0,
      stage3Max: game.stages?.stage3Max || 30
    };
  }

  if (group === "C") {
    return {
      stage1:    game.stages?.stage1    || 0,
      stage1Max: game.stages?.stage1Max || 18,
      stage2:    game.stages?.stage2    || 0,
      stage2Max: game.stages?.stage2Max || 100,
      stage3:    game.stages?.stage3    || 0,
      stage3Max: game.stages?.stage3Max || 30
    };
  }

  // רמה A — תומך גם בפורמט ישן (level1/2/3) וגם בחדש (stages)
  if (game.stages) {
    return {
      stage1:    game.stages?.stage1    || 0,
      stage1Max: game.stages?.stage1Max || 40,
      stage2:    game.stages?.stage2    || 0,
      stage2Max: game.stages?.stage2Max || 110,
      stage3:    game.stages?.stage3    || 0,
      stage3Max: game.stages?.stage3Max || 30
    };
  }

  // פורמט ישן מאוד
  return {
    stage1:    game.level1 || 0, stage1Max: 40,
    stage2:    game.level2 || 0, stage2Max: 110,
    stage3:    game.level3 || 0, stage3Max: 30
  };
}

function getTotal(game) {
  const s = getStages(game);
  return s.stage1 + s.stage2 + s.stage3;
}

function getTotalMax(game) {
  const s = getStages(game);
  return s.stage1Max + s.stage2Max + s.stage3Max;
}

function levelLabel(game) {
  const g = getLevelGroup(game);
  if (g === "A") return "רמה א׳";
  if (g === "B") return "רמה ב׳";
  if (g === "C") return "רמה ג׳";
  return "רמה " + g;
}

function isLevelC(game) {
  return getLevelGroup(game) === "C";
}

// =======================
// 🔊 סאונד
// =======================

const alertSound = new Audio("../ASSETS/SOUNDS/alert.mp3");

function playAlertSound() {
  alertSound.currentTime = 0;
  alertSound.play();
}

// =======================
// 📥 טעינה
// =======================

window.onload = function () {
  loadUsers();
};

// =======================
// 👤 רשימת שחקנים
// =======================

function loadUsers() {
  let games = JSON.parse(localStorage.getItem(GAMES_KEY)) || [];
  let list = document.getElementById("usersList");

  list.innerHTML = "";
  document.querySelector(".chart-panel").style.display = "none";

  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  let usernames = [...new Set(games.map(g => g.username))];

  if (usernames.length === 0) {
    list.innerHTML = "<div>אין שחקנים עדיין</div>";
    return;
  }

  usernames.forEach(username => {
    let userGames = games.filter(g => g.username === username);
    let best = Math.min(...userGames.map(getTotal));

    let card = document.createElement("div");
    card.className = "player-card";

    card.innerHTML = `
      <div class="avatar">${username.charAt(0)}</div>
      <div class="info">
        <h3>${username}</h3>
        <p>🎮 ${userGames.length} משחקים</p>
        <p>🏆 שיא: ${best} שניות</p>
      </div>
      <button>צפה</button>
    `;

    card.querySelector("button").onclick = () => openPlayer(username);
    list.appendChild(card);
  });
}

// =======================
// 👤 פתיחת שחקן
// =======================

function openPlayer(username) {
  let list = document.getElementById("usersList");
  list.innerHTML = "";

  let box = document.createElement("div");
  box.className = "games-box";
  list.appendChild(box);

  loadPlayerGames(username, box);
}

// =======================
// 🎮 משחקי שחקן
// =======================

function loadPlayerGames(username, container) {
  let games = JSON.parse(localStorage.getItem(GAMES_KEY)) || [];
  let userGames = games.filter(g => g.username === username);

  document.querySelector(".chart-panel").style.display = "block";
  container.innerHTML = "";

  if (userGames.length === 0) {
    container.innerHTML = "אין משחקים";
    return;
  }

  let title = document.createElement("h2");
  title.innerText = `👤 ${username}`;
  container.appendChild(title);

  let best = Math.min(...userGames.map(getTotal));

  let record = document.createElement("div");
  record.className = "record-box";
  record.innerHTML = `🏆 שיא: <b>${best}</b> שניות`;
  container.appendChild(record);

  userGames.forEach((g, i) => {
    const s = getStages(g);
    const total = getTotal(g);
    const totalMax = getTotalMax(g);
    const label = levelLabel(g);

    let div = document.createElement("div");
    div.className = "game-card";

    let levelGroup = getLevelGroup(g);
    let stagesHTML;

    if (levelGroup === "C") {
      stagesHTML = `⏱ שלב א׳: <b>${s.stage1}</b> שניות מתוך ${s.stage1Max}<br>
         ⏱ שלב ב׳: <b>${s.stage2}</b> שניות מתוך ${s.stage2Max}<br>
         ⏱ שלב ג׳: <b>${s.stage3}</b> שניות מתוך ${s.stage3Max}<hr>
         🏆 סה״כ: <b>${total}</b> מתוך ${totalMax} שניות<br>
         ${g.rating || ""} ${g.ratingText || ""}`;
    } else if (levelGroup === "B") {
      stagesHTML = `⏱ שלב 1: <b>${s.stage1}</b> שניות מתוך ${s.stage1Max}<br>
         ⏱ שלב 2: <b>${s.stage2}</b> שניות מתוך ${s.stage2Max}<br>
         ⏱ שלב 3: <b>${s.stage3}</b> שניות מתוך ${s.stage3Max}<hr>
         🏆 סה״כ: <b>${total}</b> מתוך ${totalMax} שניות
         ${g.stars ? `<br>⭐ ${g.stars}` : ""}`;
    } else {
      stagesHTML = `⏱ שלב 1: <b>${s.stage1}</b> שניות<br>
         ⏱ שלב 2: <b>${s.stage2}</b> שניות<br>
         ⏱ שלב 3: <b>${s.stage3}</b> שניות<hr>
         🏆 סה״כ: <b>${total}</b> שניות
         ${g.stars ? `<br>⭐ ${g.stars}` : ""}`;
    }

    div.innerHTML = `
      <h3>🎮 משחק ${i + 1} — ${label}</h3>
      📅 ${g.date} | 🕒 ${g.hour || ""}
      <hr>
      ${stagesHTML}
    `;

    container.appendChild(div);
  });

  let backBtn = document.createElement("button");
  backBtn.className = "back-btn";
  backBtn.innerText = "🔙 חזור";
  backBtn.onclick = loadUsers;
  container.appendChild(backBtn);

  drawChart(userGames);
}

// =======================
// 📊 גרף
// =======================

function drawChart(games) {
  let ctx = document.getElementById("progressChart").getContext("2d");

  let labels = games.map((g, i) => `משחק ${i + 1} (${levelLabel(g)})`);
  let data = games.map(getTotal);

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "זמן כולל (שניות)",
        data,
        borderWidth: 3,
        tension: 0.4,
        fill: true
      }]
    }
  });
}

// =======================
// 🔎 חיפוש
// =======================

function searchUser() {
  let name = document.getElementById("searchUser").value.trim();
  let games = JSON.parse(localStorage.getItem(GAMES_KEY)) || [];
  let found = games.filter(g => g.username === name);

  let list = document.getElementById("usersList");
  list.innerHTML = "";

  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  document.querySelector(".chart-panel").style.display = "none";

  if (found.length === 0) {
    list.innerHTML = "משתמש לא קיים!";
    return;
  }

  openPlayer(name);
}

// =======================
// 🧹 איפוס
// =======================

function clearResults() {
  playAlertSound();
  if (!confirm("למחוק הכל?")) return;

  localStorage.removeItem(GAMES_KEY);
  localStorage.removeItem(USERS_KEY);

  loadUsers();
}

// =======================
// 🚪 יציאה
// =======================

function logout() {
  localStorage.removeItem(SESSION_KEY);
  window.location.href = "../login.html";
}