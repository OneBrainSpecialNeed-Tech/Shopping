
// =======================
// 🎮 משתנים גלובליים
// =======================
localStorage.setItem("global_bgm", "off");
let startTime = Date.now();
let currentIndex = 0;
let score = 0;
let gameEnded = false;
let timerInterval;

let bottom = document.querySelector(".bottom");

// =======================
// 🔊 סאונדים
// =======================

let successSound = new Audio("../ASSETS/SOUNDS/success.mp3");
let failSound = new Audio("../ASSETS/SOUNDS/error.mp3");
let winSound = new Audio("../ASSETS/SOUNDS/winLevel.mp3");
let wheelsSound = new Audio("../ASSETS/SOUNDS/wheels.mp3");

// =======================
// 🧾 רשימת מוצרים
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

timerInterval = setInterval(() => {
  let diff = Math.floor((Date.now() - startTime) / 1000);
  let min = String(Math.floor(diff / 60)).padStart(2, "0");
  let sec = String(diff % 60).padStart(2, "0");
  let timeEl = document.getElementById("time");
  if (timeEl) timeEl.innerText = `${min}:${sec}`;
}, 1000);

// =======================
// 🎯 קליקים על פריטים
// =======================

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

// =======================
// 🛒 הוספה לעגלה
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
// 🏁 סיום שלב
// =======================

function finishGame() {

  if (gameEnded) return;
  gameEnded = true;

  clearInterval(timerInterval);
  let stage2Time = Math.floor(
    (Date.now() - startTime) / 1000
  );

  let currentGame =
    JSON.parse(localStorage.getItem("current_game")) || {};

  currentGame.level2 = stage2Time;

  currentGame.total =
    (currentGame.level1 || 0) +
    (currentGame.level2 || 0) +
    (currentGame.level3 || 0);

  localStorage.setItem(
    "current_game",
    JSON.stringify(currentGame)
  );

  document.querySelectorAll(".item").forEach(el => {
    el.style.pointerEvents = "none";
    el.style.opacity = "0.4";
  });

  if (!bottom) return;

  wheelsSound.currentTime = 0;
  wheelsSound.play();

  bottom.style.transition = "4s linear";
  bottom.style.transform = "translateX(-50vw)";

  setTimeout(() => {
    bottom.style.transition = "4s linear";
    bottom.style.transform = "translateX(-120vw)";
  }, 4000);

  setTimeout(() => {

    wheelsSound.pause();

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
background:
linear-gradient(
145deg,
#ffcc33,
#ff006e,
#7b2ff7,
#3a0ca3,
#240046
);

background-size:400% 400%;

animation:
gradientMove 8s ease infinite,
popWin 0.8s ease;

box-shadow:
0 0 40px rgba(255,0,110,0.75),
0 0 90px rgba(123,47,247,0.65),
0 0 140px rgba(255,204,51,0.45);          box-shadow: 0 0 60px rgba(0,198,255,0.7), 0 0 120px rgba(123,47,247,0.5);
          border:6px solid rgba(255,255,255,0.35);
          animation:popWin 0.8s ease;
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
      </style>
    `;
    document.body.appendChild(win);
    setTimeout(() => {
      localStorage.setItem("currentStage", "3");
      window.location.href = "level3.html";
    }, 3000);

  }, 8500);
}
