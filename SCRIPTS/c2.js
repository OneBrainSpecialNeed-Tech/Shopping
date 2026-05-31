let currentIndex = 0;
let score = 0;
let gameEnded = false;
localStorage.setItem("global_bgm", "off");
let bottom;

const GAMES_KEY = "shop_games";
const TIME_LIMIT = 100; // משך האנימציה בשניות

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
// 🔊 סאונדים
// =======================

let successSound = new Audio("../ASSETS/SOUNDS/success.mp3");
let failSound    = new Audio("../ASSETS/SOUNDS/error.mp3");
let winSound     = new Audio("../ASSETS/SOUNDS/winLevel.mp3");
let wheelsSound  = new Audio("../ASSETS/SOUNDS/wheels.mp3");

// =======================
// 🚀 התחלה
// =======================

bottom = document.querySelector(".bottom");
const timer = document.querySelector(".timer");
if (timer) timer.remove();
startGame();

// =======================
// 🎮 התחלת משחק
// =======================

function startGame() {
  startClicks();
  startGirlMovement();
}

// =======================
// 🎯 קליקים
// =======================

function startClicks() {
  document.querySelectorAll(".item").forEach(item => {
    item.addEventListener("click", () => {
      if (gameEnded) return;

      let name = item.getAttribute("data-name");
      if (!name) return;

      if (name === items[currentIndex]) {
        successSound.currentTime = 0;
        successSound.play();

        moveToCart(item);
        currentIndex++;
        score++;

        if (currentIndex === items.length) {
          finishGame();
        }
      } else {
        failSound.currentTime = 0;
        failSound.play();
      }
    });
  });
}

// =======================
// 🛒 עגלה
// =======================

function moveToCart(item) {
  if (gameEnded) return;

  let clone = item.cloneNode(true);
  let rect = item.getBoundingClientRect();

  clone.style.position = "fixed";
  clone.style.left = rect.left + "px";
  clone.style.top = rect.top + "px";
  clone.style.width = "46px";
  clone.style.transition = "0.25s linear";
  clone.style.zIndex = "9999";

  document.body.appendChild(clone);

  setTimeout(() => {
    clone.style.left = "85%";
    clone.style.top = "80%";
    clone.style.transform = "scale(0.4)";
  }, 20);

  setTimeout(() => {
    clone.remove();

    let cart = document.querySelector(".cart-stack");
    if (!cart) {
      cart = document.createElement("div");
      cart.className = "cart-stack";
      bottom.appendChild(cart);
    }

    let img = document.createElement("img");
    img.src = item.src;
    img.style.width = "24px";
    img.style.position = "absolute";
    img.style.right = (score % 3) * 25 + "px";
    img.style.bottom = (score * 2) + "px";
    img.style.zIndex = score;

    cart.appendChild(img);
  }, 300);
}

// =======================
// 🚗 תנועת הילדה
// =======================

let startTime = Date.now();

function startGirlMovement() {
  if (!bottom) return;

  let playCount = 0;

  function playWheelsThreeTimes() {
    if (gameEnded) return;
    playCount++;
    wheelsSound.currentTime = 0;
    wheelsSound.play();
    if (playCount < 3) {
      wheelsSound.onended = playWheelsThreeTimes;
    }
  }

  playWheelsThreeTimes();

  const anim = bottom.animate(
    [
      { transform: "translateX(0px)" },
      { transform: "translateX(-140vw)" }
    ],
    {
      duration: TIME_LIMIT * 1000,
      easing: "linear",
      fill: "forwards"
    }
  );

  const check = setInterval(() => {
    if (gameEnded) {
      clearInterval(check);
      return;
    }

    const rect = bottom.getBoundingClientRect();
    if (rect.right < 0) {
      clearInterval(check);
      wheelsSound.pause();
      wheelsSound.currentTime = 0;
      loseGame();
    }
  }, 100);
}

// =======================
// ❌ הפסד
// =======================

function loseGame() {
  gameEnded = true;

  document.querySelectorAll(".item").forEach(el => {
    el.style.pointerEvents = "none";
    el.style.opacity       = "0.4";
  });

  wheelsSound.pause();

  let lose = document.createElement("div");
  lose.innerHTML = `
    <div style="
      position:fixed; inset:0;
      background:radial-gradient(circle at top, #7f0000, #1a0000 60%, #000);
      display:flex; justify-content:center; align-items:center;
      z-index:99999; font-family:Segoe UI;
    ">
      <div style="
        width:580px; padding:55px; border-radius:38px; text-align:center;
        background:rgba(255,255,255,0.08); backdrop-filter:blur(20px);
        border:2px solid rgba(255,100,100,0.3);
        box-shadow:0 25px 90px rgba(0,0,0,0.7);
        animation:popLose 0.7s ease;
      ">
        <div style="font-size:90px; margin-bottom:16px;">⏰</div>
        <h1 style="margin:0; font-size:52px; font-weight:900;
          background:linear-gradient(90deg,#ff8a80,#ff5252,#ff1744);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;">
          אוי לא!
        </h1>
        <p style="font-size:22px; color:rgba(255,255,255,0.85); margin:20px 0 30px;">
          הילדה נעלמה לפני שסיימת
        </p>
        <div style="display:flex; gap:16px; justify-content:center;">
          <button onclick="location.reload()" style="
            padding:14px 32px; border:none; border-radius:50px;
            background:linear-gradient(135deg,#ff5252,#d32f2f);
            color:white; font-size:18px; font-weight:bold; cursor:pointer;">
            🔄 נסי שוב
          </button>
          <button onclick="location.href='../PAGES/choose-level.html'" style="
            padding:14px 32px; border:none; border-radius:50px;
            background:rgba(255,255,255,0.15);
            color:white; font-size:18px; font-weight:bold; cursor:pointer;
            border:2px solid rgba(255,255,255,0.3);">
            🏠 תפריט רמות
          </button>
        </div>
      </div>
    </div>
    <style>
      @keyframes popLose { 0%{transform:scale(0.6);opacity:0;} 100%{transform:scale(1);opacity:1;} }
    </style>
  `;
  document.body.appendChild(lose);
}

// =======================
// 🏆 ניצחון
// =======================

function finishGame() {
  if (gameEnded) return;
  gameEnded = true;

  wheelsSound.pause();
  wheelsSound.currentTime = 0;

  let levelTime = Math.floor((Date.now() - startTime) / 1000);
  let currentUser = JSON.parse(localStorage.getItem("shop_session")) || {};

  // =========================
  // ✅ שמירת שלב ב׳ ל-current_game
  // =========================
  let currentGame = JSON.parse(localStorage.getItem("current_game")) || {
    username:   currentUser.username || "אנונימי",
    date:       new Date().toLocaleDateString("he-IL"),
    hour:       new Date().toLocaleTimeString("he-IL"),
    levelGroup: "C",
    levelC_stage1: null,
    levelC_stage2: null,
    levelC_stage3: null
  };

  currentGame.levelGroup = "C";
  currentGame.levelC_stage2 = { time: levelTime, max: TIME_LIMIT };
  localStorage.setItem("current_game", JSON.stringify(currentGame));

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
        animation: gradientMove 8s ease infinite, popWin 0.8s ease;
        box-shadow: 0 0 40px rgba(255,0,110,0.75), 0 0 90px rgba(123,47,247,0.65);
        border:6px solid rgba(255,255,255,0.35);
      ">
        <div style="font-size:90px; margin-bottom:15px; animation:bounce 1.2s infinite;">🏆</div>
        <h1 style="color:white; font-size:54px; margin-bottom:18px; font-weight:900;">STAGE COMPLETE</h1>
        <div style="color:white; font-size:34px; font-weight:bold; margin-bottom:20px;">כל הכבוד!</div>
        <div style="background:rgba(255,255,255,0.18); border-radius:20px; padding:18px; margin-top:25px;
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

  setTimeout(() => {
    localStorage.setItem("currentStage", "3");
    window.location.href = "level3.html";
  }, 4000);
}