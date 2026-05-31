localStorage.setItem("global_bgm", "off");

let startTime = Date.now();
let timerInterval;

let currentIndex = 0;
let score = 0;
let gameEnded = false;

let girl = document.querySelector(".girl");

// =======================
// 🔊 סאונדים
// =======================

let successSound = new Audio("../ASSETS/SOUNDS/success.mp3");
let failSound = new Audio("../ASSETS/SOUNDS/error.mp3");
let winSound = new Audio("../ASSETS/SOUNDS/winLevel.mp3");
let wheelsSound = new Audio("../ASSETS/SOUNDS/wheels.mp3");

successSound.onerror = () => {};
failSound.onerror = () => {};
winSound.onerror = () => {};
wheelsSound.onerror = () => {};

// =======================
// 🧾 סדר המוצרים
// =======================

let items = [
  "רימון", "מעיל", "עט",
  "שמלה", "בובה", "ביצים",
  "בננה", "פיצה", "בצל",
  "מעדן", "מגלשה", "אופניים",
  "מחשבון", "מספריים", "תות",
  "מיקסר", "חליפה", "מצלמה",
  "כובע", "מחק", "תפוח",
  "רחפן", "תנור", "מהדק"
];

// =======================
// ⏱ טיימר
// =======================

const TIME_LIMIT = 110;
let timeLeft = TIME_LIMIT;
let gameLost = false;

function startTimer() {
  const timeEl = document.getElementById("time");
  if (!timeEl) return;

  timeEl.innerText = "01:50";

  timerInterval = setInterval(() => {
    if (gameLost || gameEnded) return;

    timeLeft--;

    let min = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    let sec = String(timeLeft % 60).padStart(2, "0");
    timeEl.innerText = `${min}:${sec}`;

    if (timeLeft <= 10) {
      timeEl.parentElement.style.background = "linear-gradient(145deg, #ff5252, #d32f2f)";
      timeEl.parentElement.style.color = "white";
    } else {
      timeEl.parentElement.style.background = "";
      timeEl.parentElement.style.color = "";
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      showLoseScreen();
    }
  }, 1000);
}

startTimer();

// =======================
// 💔 מסך הפסד
// =======================

function showLoseScreen() {
  if (gameLost || gameEnded) return;
  gameLost = true;

  document.querySelectorAll(".item").forEach(el => {
    el.style.pointerEvents = "none";
    el.style.opacity = "0.4";
  });

  let lose = document.createElement("div");
  lose.innerHTML = `
    <div style="
      position:fixed; inset:0;
      background: radial-gradient(circle at top, #7f0000, #1a0000 60%, #000);
      display:flex; justify-content:center; align-items:center;
      z-index:99999; font-family:Segoe UI;
      animation: fadeIn 0.6s ease;
    ">
      <div style="
        width:580px; padding:55px; border-radius:38px; text-align:center;
        background:rgba(255,255,255,0.08); backdrop-filter:blur(20px);
        border:2px solid rgba(255,100,100,0.3);
        box-shadow: 0 25px 90px rgba(0,0,0,0.7);
        animation: popLose 0.7s ease;
      ">
        <div style="font-size:90px; margin-bottom:16px;">⏰</div>
        <div style="font-size:14px; letter-spacing:5px; color:rgba(255,150,150,0.8); margin-bottom:14px;">TIME IS UP</div>
        <h1 style="margin:0; font-size:52px; font-weight:900;
          background: linear-gradient(90deg, #ff8a80, #ff5252, #ff1744);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;">
          אוי לא! ⌛
        </h1>
        <div style="width:90px; height:4px; border-radius:20px; margin:20px auto;
          background: linear-gradient(90deg, #ff5252, #ff1744);"></div>
        <p style="font-size:22px; line-height:1.8; color:rgba(255,255,255,0.85); margin-bottom:30px;">
          נגמר הזמן בשלב ב׳!<br>
          <span style="font-size:18px; opacity:0.7;">נסי שוב – את יכולה!</span>
        </p>
        <div style="display:flex; gap:16px; justify-content:center; flex-wrap:wrap;">
          <button onclick="location.reload()" style="
            padding:14px 32px; border:none; border-radius:50px;
            background: linear-gradient(135deg, #ff5252, #d32f2f);
            color:white; font-size:18px; font-weight:bold; cursor:pointer;
            transition:0.3s;
          " onmouseover="this.style.transform='scale(1.07)'" onmouseout="this.style.transform='scale(1)'">
            🔄 נסי שוב
          </button>
          <button onclick="location.href='../PAGES/choose-level.html'" style="
            padding:14px 32px; border:none; border-radius:50px;
            background: rgba(255,255,255,0.15);
            color:white; font-size:18px; font-weight:bold; cursor:pointer;
            border:2px solid rgba(255,255,255,0.3); transition:0.3s;
          " onmouseover="this.style.transform='scale(1.07)'" onmouseout="this.style.transform='scale(1)'">
            🎮 תפריט רמות
          </button>
        </div>
      </div>
    </div>
    <style>
      @keyframes popLose { 0%{transform:scale(0.6);opacity:0;} 100%{transform:scale(1);opacity:1;} }
      @keyframes fadeIn { from{opacity:0;} to{opacity:1;} }
    </style>
  `;
  document.body.appendChild(lose);
}

// =======================
// 🎯 קליקים
// =======================

document.querySelectorAll(".item").forEach(item => {
  item.addEventListener("click", () => {
    if (gameLost || gameEnded) return;

    let name = item.getAttribute("data-name");
    if (!name) return;

    if (name === items[currentIndex]) {
      successSound.currentTime = 0;
      successSound.play();

      moveToCart(item);
      currentIndex++;
      score++;

      if (currentIndex === items.length) {
        setTimeout(finishGame, 800);
      }
    } else {
      failSound.currentTime = 0;
      failSound.play();
      item.style.animation = "shake 0.4s";
      setTimeout(() => { item.style.animation = ""; }, 400);
    }
  });
});

// =======================
// 🛒 מעבר לעגלה
// =======================

function moveToCart(item) {
  let clone = item.cloneNode(true);
  document.body.appendChild(clone);

  let rect = item.getBoundingClientRect();
  let girlRect = girl.getBoundingClientRect();

  clone.style.position = "fixed";
  clone.style.left = rect.left + "px";
  clone.style.top = rect.top + "px";
  clone.style.width = "46px";
  clone.style.transition = "0.7s ease";
  clone.style.zIndex = "9999";

  setTimeout(() => {
    clone.style.top = (rect.top + 90) + "px";
  }, 50);

  setTimeout(() => {
    clone.style.left = (girlRect.left + 15) + "px";
    clone.style.top = (girlRect.top - 5) + "px";
    clone.style.transform = "scale(0.4)";
  }, 250);

  setTimeout(() => {
    clone.remove();

    let cart = document.querySelector(".cart-stack");
    if (!cart) {
      cart = document.createElement("div");
      cart.className = "cart-stack";
      document.querySelector(".bottom").appendChild(cart);
    }

    let finalItem = document.createElement("img");
    finalItem.src = item.src;
    finalItem.style.width = "24px";
    finalItem.style.height = "24px";
    finalItem.style.position = "absolute";

    let pile = score % 3;
    if (pile === 0) { finalItem.style.right = "0px";  finalItem.style.bottom = (score * 2) + "px"; }
    if (pile === 1) { finalItem.style.right = "25px"; finalItem.style.bottom = (score * 2) + "px"; }
    if (pile === 2) { finalItem.style.right = "50px"; finalItem.style.bottom = (score * 2) + "px"; }

    finalItem.style.zIndex = score;
    cart.appendChild(finalItem);
  }, 700);
}

// =======================
// 🏁 סיום משחק
// =======================

function finishGame() {
  if (gameEnded) return;
  gameEnded = true;

  clearInterval(timerInterval);

  let levelTime = Math.floor((Date.now() - startTime) / 1000);
  let currentUser = JSON.parse(localStorage.getItem("shop_session")) || {};

  // =========================
  // ⭐ חישוב ציון שלב ב׳
  // =========================
  let stars = "⭐⭐⭐";
  let scoreText = "מושלם! את אלופת הקניות!";
  if (levelTime > 95) {
    stars = "⭐";
    scoreText = "אפשר להשתפר";
  } else if (levelTime > 70) {
    stars = "⭐⭐";
    scoreText = "כל הכבוד!";
  }

  // =========================
  // 💾 שמירת שלב ב׳ ל-current_game
  // קוראים את מה שנשמר בשלב א׳ ומוסיפים
  // =========================
  let currentGame = JSON.parse(localStorage.getItem("current_game")) || {
    username: currentUser.username || "אנונימי",
    date: new Date().toLocaleDateString("he-IL"),
    hour: new Date().toLocaleTimeString("he-IL"),
    levelGroup: "B",
    levelB_stage1: null,
    levelB_stage2: null,
    levelB_stage3: null,
    levelB_summary: null,
    stages: { stage1: 0, stage2: 0, stage3: 0 }
  };

  currentGame.levelGroup = "B";

  currentGame.levelB_stage2 = {
    time: levelTime,
    max: TIME_LIMIT,
    stars: stars,
    scoreText: scoreText
  };

  // עדכון stages לדף המנהל
  if (!currentGame.stages) currentGame.stages = { stage1: 0, stage2: 0, stage3: 0 };
  currentGame.stages.stage2 = levelTime;

  localStorage.setItem("current_game", JSON.stringify(currentGame));

  // =========================
  // 🚗 הילדה מתחילה לזוז
  // =========================
  let bottom = document.querySelector(".bottom");
  bottom.style.transition = "7s linear";

  wheelsSound.currentTime = 0;
  wheelsSound.play();
  bottom.style.transform = "translateX(-120vw)";

  setTimeout(() => {
    wheelsSound.pause();
    wheelsSound.currentTime = 0;

    winSound.currentTime = 0;
    winSound.play();

    let win = document.createElement("div");
    win.innerHTML = `
      <div style="
        position:fixed; inset:0;
        background:rgba(0,0,0,0.82); backdrop-filter:blur(8px);
        display:flex; justify-content:center; align-items:center;
        z-index:99999; animation:fadeIn 0.7s;
      ">
        <div style="
          width:650px; padding:55px; border-radius:40px; text-align:center;
          background: linear-gradient(145deg, #ffcc33, #ff006e, #7b2ff7, #3a0ca3, #240046);
          background-size:400% 400%;
          animation: gradientMove 10s ease infinite, popWin 0.8s ease;
          box-shadow: 0 0 60px rgba(255,0,110,0.7), 0 0 120px rgba(123,47,247,0.5);
          border:6px solid rgba(255,255,255,0.35);
        ">
          <div style="font-size:90px; margin-bottom:15px; animation:bounce 1.2s infinite;">🏆</div>
          <h1 style="color:white; font-size:54px; margin-bottom:18px; font-weight:900;">STAGE COMPLETE</h1>
          <div style="color:white; font-size:34px; font-weight:bold; margin-bottom:20px;">כל הכבוד!</div>
          <div style="font-size:36px; letter-spacing:6px; margin-bottom:10px;">${stars}</div>
          <div style="color:rgba(255,255,255,0.85); font-size:20px; margin-bottom:20px;">${scoreText}</div>
          <div style="background:rgba(255,255,255,0.18); border-radius:20px; padding:18px;
            color:white; font-size:24px; border:2px solid rgba(255,255,255,0.25);">
            סיימת את שלב ב׳ בהצלחה!<br>עוברים לשלב ג׳...
          </div>
        </div>
      </div>
      <style>
        @keyframes popWin { 0%{transform:scale(0.5) rotate(-4deg);opacity:0;} 100%{transform:scale(1);opacity:1;} }
        @keyframes bounce { 0%{transform:translateY(0px);} 50%{transform:translateY(-12px);} 100%{transform:translateY(0px);} }
        @keyframes fadeIn { from{opacity:0;} to{opacity:1;} }
        @keyframes gradientMove { 0%{background-position:0% 50%;} 50%{background-position:100% 50%;} 100%{background-position:0% 50%;} }
      </style>
    `;
    document.body.appendChild(win);

    // ✅ מעבר אוטומטי לשלב ג׳
    setTimeout(() => {
      localStorage.setItem("currentStage", "3");
      window.location.href = "level3.html";
    }, 4000);

  }, 7000);
}