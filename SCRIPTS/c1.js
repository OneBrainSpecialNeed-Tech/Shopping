localStorage.setItem("levelGroup", "C");
let currentIndex = 0;
let score = 0;
let gameEnded = false;

const GAMES_KEY = "shop_games";

let items = [
  "מכנסיים",
  "פלפל",
  "פאזל",
  "עגבנייה",
  "חולצה",
  "כדור",
  "מלפפון",
  "עפיפון",
  "חצאית"
];

// =======================
// 🎧 סאונדים
// =======================

let successSound = new Audio("../ASSETS/SOUNDS/success.mp3");
let errorSound   = new Audio("../ASSETS/SOUNDS/error.mp3");
let winSound     = new Audio("../ASSETS/SOUNDS/winLevel.mp3");
let wheelsSound  = new Audio("../ASSETS/SOUNDS/wheels.mp3");

// =======================
// ❌ הסתרת טיימר
// =======================

window.addEventListener("load", () => {
  let timerBox = document.querySelector(".timer");
  if (timerBox) {
    timerBox.style.opacity = "0";
    timerBox.style.pointerEvents = "none";
  }
});

// =======================
// 🛒 עגלה
// =======================

let cart = document.createElement("div");
cart.id = "cart";
cart.style.position  = "fixed";
cart.style.bottom    = "70px";
cart.style.right     = "40px";
cart.style.width     = "140px";
cart.style.minHeight = "120px";
cart.style.zIndex    = "1000";
document.body.appendChild(cart);

// =======================
// 🚶‍♀️ תנועת הילדה
// =======================

let bottom = document.querySelector(".bottom");
let startTime = Date.now();
const TIME_LIMIT = 18;

setTimeout(() => {
  if (gameEnded) return;

  wheelsSound.currentTime = 0;
  wheelsSound.play();

  bottom.style.transition = `${TIME_LIMIT}s linear`;
  cart.style.transition   = `${TIME_LIMIT}s linear`;

  bottom.style.transform = "translateX(-120vw)";
  cart.style.transform   = "translateX(-120vw)";

  setTimeout(() => {
    if (gameEnded) return;
    gameEnded = true;
    wheelsSound.pause();
    wheelsSound.currentTime = 0;
    document.querySelectorAll(".item").forEach(el => {
      el.style.pointerEvents = "none";
      el.style.opacity = "0.4";
    });
    showLoseScreen();
  }, TIME_LIMIT * 1000);

}, 1200);

// =======================
// 🎯 קליקים על מוצרים
// =======================

document.querySelectorAll(".item").forEach(item => {
  item.addEventListener("click", () => {
    if (gameEnded) return;

    if (item.dataset.name === items[currentIndex]) {
      successSound.currentTime = 0;
      successSound.play();

      addToCart(item);
      item.style.pointerEvents = "none";
      currentIndex++;
      score++;

      if (currentIndex === items.length) {
        gameEnded = true;
        finishGame();
      }
    } else {
      errorSound.currentTime = 0;
      errorSound.play();
    }
  });
});

// =======================
// 🛒 הוספה לעגלה
// =======================

function addToCart(item) {
  let clone = item.cloneNode(true);
  document.body.appendChild(clone);

  let rect = item.getBoundingClientRect();

  clone.style.position   = "fixed";
  clone.style.left       = rect.left + "px";
  clone.style.top        = rect.top  + "px";
  clone.style.width      = "55px";
  clone.style.transition = "0.55s linear";
  clone.style.zIndex     = "9999";

  setTimeout(() => {
    clone.style.left      = "86%";
    clone.style.top       = "80%";
    clone.style.transform = "scale(0.35)";
  }, 20);

  setTimeout(() => {
    clone.remove();

    let inCart = item.cloneNode(true);
    inCart.style.position  = "absolute";
    inCart.style.width     = "40px";
    inCart.style.bottom    = (score * 10) + "px";
    inCart.style.right     = "115px";
    inCart.style.transform = `rotate(${Math.random() * 14 - 7}deg)`;
    cart.appendChild(inCart);
  }, 600);
}

// =======================
// 💔 מסך הפסד
// =======================

function showLoseScreen() {
  document.querySelectorAll(".item").forEach(el => {
    el.style.pointerEvents = "none";
    el.style.opacity = "0.4";
  });

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
        <div style="font-size:14px; letter-spacing:5px; color:rgba(255,150,150,0.8); margin-bottom:14px;">TIME IS UP</div>
        <h1 style="margin:0; font-size:52px; font-weight:900;
          background:linear-gradient(90deg,#ff8a80,#ff5252,#ff1744);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;">
          אוי לא!
        </h1>
        <p style="font-size:22px; color:rgba(255,255,255,0.85); margin:20px 0 30px;">
          הילדה נעלמה לפני שסיימת למלא את העגלה
        </p>
        <div style="display:flex; gap:16px; justify-content:center;">
          <button onclick="location.reload()" style="
            padding:14px 32px; border:none; border-radius:50px;
            background:linear-gradient(135deg,#ff5252,#d32f2f);
            color:white; font-size:18px; font-weight:bold; cursor:pointer;">
            🔄 נסה/י שוב
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
// 🎉 ניצחון
// =======================

function finishGame() {
  wheelsSound.pause();
  wheelsSound.currentTime = 0;

  let levelTime = Math.floor((Date.now() - startTime) / 1000);
  let currentUser = JSON.parse(localStorage.getItem("shop_session")) || {};

  // =========================
  // ✅ שמירה ל-current_game
  // איפוס מלא כי זה שלב ראשון ברמה ג׳
  // =========================
  let currentGame = {
    username:   currentUser.username || "אנונימי",
    date:       new Date().toLocaleDateString("he-IL"),
    hour:       new Date().toLocaleTimeString("he-IL"),
    levelGroup: "C",
    levelC_stage1: { time: levelTime, max: TIME_LIMIT },
    levelC_stage2: null,
    levelC_stage3: null
  };
  localStorage.setItem("current_game", JSON.stringify(currentGame));

  winSound.currentTime = 0;
  winSound.play();

  let win = document.createElement("div");
  win.innerHTML = `
    <div style="
      position:fixed; inset:0;
      background:radial-gradient(circle at top, #312e81, #0f172a 60%, #020617);
      display:flex; justify-content:center; align-items:center;
      z-index:99999; font-family:Segoe UI;
    ">
      <div style="
        width:620px; padding:55px; border-radius:38px; text-align:center;
        background:rgba(255,255,255,0.08); backdrop-filter:blur(20px);
        border:1px solid rgba(255,255,255,0.15);
        box-shadow:0 25px 90px rgba(0,0,0,0.65);
        animation:popWin 0.7s ease;
      ">
        <div style="font-size:95px; margin-bottom:12px;">🏆</div>
        <div style="font-size:14px; letter-spacing:5px; color:rgba(255,255,255,0.65); margin-bottom:14px;">STAGE COMPLETE</div>
        <h1 style="margin:0; font-size:54px; font-weight:900;
          background:linear-gradient(90deg,#ffffff,#ddd6fe,#93c5fd);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;">
          כל הכבוד!
        </h1>
        <p style="font-size:24px; color:rgba(255,255,255,0.92); margin-top:20px; font-weight:600;">
          סיימת את שלב א׳ בהצלחה!<br>עוברים לשלב ב׳...
        </p>
      </div>
    </div>
    <style>
      @keyframes popWin { 0%{transform:scale(0.6);opacity:0;} 100%{transform:scale(1);opacity:1;} }
    </style>
  `;
  document.body.appendChild(win);

  setTimeout(() => {
    localStorage.setItem("currentLevel", "c");
    localStorage.setItem("currentStage", "2");
    window.location.href = "level2.html";
  }, 4000);
}

// =======================
// 📱 התאמה למסך
// =======================

window.addEventListener("resize", () => {
  cart.style.right = window.innerWidth <= 768 ? "10px" : "40px";
});