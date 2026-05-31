const SESSION_KEY = "shop_session";
const GAMES_KEY = "shop_games";

// localStorage.setItem("global_bgm", "on");

let chartInstance = null;

let user = JSON.parse(localStorage.getItem(SESSION_KEY));

if (!user) {
  window.location.href = "login.html";
}

// =======================
// 🧠 פונקציות עזר
// =======================

function getLevelGroup(game) {
  return game.levelGroup || "A";
}

function levelLabel(game) {
  const g = getLevelGroup(game);
  if (g === "A") return "רמה א׳";
  if (g === "B") return "רמה ב׳";
  if (g === "C") return "רמה ג׳";
  return "רמה " + g;
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

  // רמה A — תומך גם בפורמט ישן וגם בחדש
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

function isLevelC(game) {
  return getLevelGroup(game) === "C";
}

// =======================
// 📥 טעינה
// =======================

window.onload = function () {
  loadMyGames();
};

// =======================
// 👤 משחקים שלי
// =======================

function loadMyGames() {
  let games = JSON.parse(localStorage.getItem(GAMES_KEY)) || [];
  let myGames = games.filter(g => g.username === user.username);

  document.getElementById("userInfo").innerHTML = `
    <h2>👤 ${user.username}</h2>
    <p>🎮 ${myGames.length} משחקים</p>
  `;

  let container = document.getElementById("gamesList");
  container.innerHTML = "";

  if (myGames.length === 0) {
    container.innerHTML = "<p>אין משחקים עדיין 🎮</p>";
    return;
  }

  let best = Math.min(...myGames.map(getTotal));
  document.getElementById("bestRecord").innerHTML = `
    <div class="record-box">
      🏆 השיא האישי שלך:
      <b>${best}</b> שניות
    </div>
  `;

  myGames.forEach((g, i) => {
    const s = getStages(g);
    const total = getTotal(g);
    const totalMax = getTotalMax(g);

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

    let div = document.createElement("div");
    div.className = "game-card";

    div.innerHTML = `
      <h3>🎮 משחק ${i + 1} — ${levelLabel(g)}</h3>
      📅 ${g.date || ""} 🕒 ${g.hour || ""}
      <hr>
      ${stagesHTML}
    `;

    container.appendChild(div);
  });

  drawChart(myGames);
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
        label: "התקדמות שלי",
        data,
        borderWidth: 3,
        tension: 0.4,
        fill: true
      }]
    }
  });
}

// =======================
// 🔙 חזרה
// =======================

function goBack() {
  window.location.href = "../login.html";
}