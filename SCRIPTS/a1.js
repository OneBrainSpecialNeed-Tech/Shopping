localStorage.setItem("levelGroup", "A");
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

let currentIndex = 0;
let score = 0;
let startTime = Date.now();
let timerInterval;

// =======================
// 🎧 סאונדים
// =======================

let successSound = new Audio("../ASSETS/SOUNDS/success.mp3");
let errorSound = new Audio("../ASSETS/SOUNDS/error.mp3");
let winSound = new Audio("../ASSETS/SOUNDS/winLevel.mp3");
let wheelsSound = new Audio("../ASSETS/SOUNDS/wheels.mp3");

// =======================
// ⏱ טיימר
// =======================

function startTimer() {
  timerInterval = setInterval(() => {
    let diff = Math.floor((Date.now() - startTime) / 1000);
    let min = String(Math.floor(diff / 60)).padStart(2, "0");
    let sec = String(diff % 60).padStart(2, "0");
    let timeEl = document.getElementById("time");
    if (timeEl) {
      timeEl.innerText = `${min}:${sec}`;
    }
  }, 1000);
}

startTimer();

// =======================
// 🛒 עגלה
// =======================

let cart = document.createElement("div");

cart.id = "cart";
cart.style.position = "fixed";
cart.style.bottom = "70px";
cart.style.right = "40px";
cart.style.width = "140px";
cart.style.minHeight = "120px";
cart.style.zIndex = "1000";

document.body.appendChild(cart);

// =======================
// 🎯 קליקים על פריטים
// =======================

document.querySelectorAll(".item").forEach(item => {
  item.addEventListener("click", () => {
    if (item.dataset.name === items[currentIndex]) {

      successSound.currentTime = 0;
      successSound.play();

      addToCart(item);

      item.style.pointerEvents = "none";

      currentIndex++;
      score++;

      if (currentIndex === items.length) {
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

  clone.style.position = "fixed";
  clone.style.left = rect.left + "px";
  clone.style.top = rect.top + "px";
  clone.style.transition = "0.8s ease";
  clone.style.zIndex = "9999";

  setTimeout(() => {
    clone.style.left = "85%";
    clone.style.top = "80%";
    clone.style.transform = "scale(0.3)";
  }, 50);

  setTimeout(() => {
    clone.remove();

    let inCart = item.cloneNode(true);
    inCart.style.position = "absolute";
    inCart.style.width = "40px";
    inCart.style.bottom = (score * 10) + "px";
    inCart.style.right = "115px";
    inCart.style.transform = `rotate(${Math.random() * 14 - 7}deg)`;

    cart.appendChild(inCart);
  }, 900);
}

// =======================
// ➡ מעבר לשלב הבא
// =======================

function goToNextStage() {
  const level = localStorage.getItem("currentLevel");
  let stage = parseInt(localStorage.getItem("currentStage"));

  stage++;

  if (stage > 3) {
    window.location.href = "choose-level.html";
  } else {
    localStorage.setItem("currentStage", String(stage));
    window.location.href = "level" + stage + ".html";
  }
}

// =======================
// 🎉 סיום משחק
// =======================

function finishGame() {
  clearInterval(timerInterval);

  let level1Time = Math.floor((Date.now() - startTime) / 1000);

  let currentUser = JSON.parse(localStorage.getItem("shop_session")) || {};

  let currentGame = {
    username: currentUser.username,
    date: new Date().toLocaleDateString("he-IL"),
    hour: new Date().toLocaleTimeString("he-IL"),
    level1: level1Time,
    level2: 0,
    level3: 0,
    total: level1Time
  };

  localStorage.setItem("current_game", JSON.stringify(currentGame));

  setTimeout(() => {
    let bottom = document.querySelector(".bottom");

    // =======================
    // 🚗 הילדה מתחילה לזוז
    // =======================

    bottom.style.transition = "8s linear";
    cart.style.transition = "8s linear";

    wheelsSound.currentTime = 0;
    wheelsSound.play();

    bottom.style.transform = "translateX(-120vw)";
    cart.style.transform = "translateX(-120vw)";

    // =======================
    // ⏳ אחרי שהילדה נעלמת
    // =======================

    setTimeout(() => {
      bottom.style.opacity = "0";
      cart.style.opacity = "0";

      wheelsSound.pause();
      wheelsSound.currentTime = 0;

      winSound.currentTime = 0;
      winSound.play();

      // =========================
      // 🟣 מודעת ניצחון
      // =========================

      let win = document.createElement("div");

      win.innerHTML = `
        <div style="
          position:fixed;
          inset:0;
          background:radial-gradient(circle at top, #312e81, #0f172a 60%, #020617);
          display:flex;
          justify-content:center;
          align-items:center;
          z-index:99999;
          font-family:Segoe UI;
          overflow:hidden;
        ">
          <div style="
            width:620px;
            padding:55px;
            border-radius:38px;
            text-align:center;
            background:rgba(255,255,255,0.08);
            backdrop-filter:blur(20px);
            -webkit-backdrop-filter:blur(20px);
            border:1px solid rgba(255,255,255,0.15);
            box-shadow:0 25px 90px rgba(0,0,0,0.65), inset 0 0 0 1px rgba(255,255,255,0.05);
            position:relative;
            overflow:hidden;
            animation:popWin 0.7s ease;
          ">

            <div style="
              position:absolute;
              top:-120px;
              right:-100px;
              width:300px;
              height:300px;
              border-radius:50%;
              background:radial-gradient(circle, rgba(168,85,247,0.55), transparent 70%);
            "></div>

            <div style="
              position:absolute;
              bottom:-140px;
              left:-120px;
              width:320px;
              height:320px;
              border-radius:50%;
              background:radial-gradient(circle, rgba(59,130,246,0.45), transparent 70%);
            "></div>

            <div style="
              font-size:95px;
              margin-bottom:12px;
              animation:floatIcon 2s ease-in-out infinite;
              filter:drop-shadow(0 12px 25px rgba(0,0,0,0.45));
            ">🏆</div>

            <div style="
              font-size:14px;
              letter-spacing:5px;
              color:rgba(255,255,255,0.65);
              margin-bottom:14px;
            ">STAGE COMPLETE</div>

            <h1 style="
              margin:0;
              font-size:54px;
              font-weight:900;
              background:linear-gradient(90deg, #ffffff, #ddd6fe, #93c5fd);
              -webkit-background-clip:text;
              -webkit-text-fill-color:transparent;
            ">כל הכבוד!</h1>

            <div style="
              width:90px;
              height:5px;
              border-radius:20px;
              margin:22px auto;
              background:linear-gradient(90deg, #8b5cf6, #3b82f6);
            "></div>

            <p style="
              font-size:24px;
              line-height:1.8;
              color:rgba(255,255,255,0.92);
              margin:0;
              font-weight:600;
            "> סיימת את שלב א׳ בהצלחה מלאה</p>

          </div>
        </div>

        <style>
          @keyframes popWin {
            0%  { transform:scale(0.6); opacity:0; }
            100%{ transform:scale(1);   opacity:1; }
          }
          @keyframes floatIcon {
            0%  { transform:translateY(0px);  }
            50% { transform:translateY(-10px); }
            100%{ transform:translateY(0px);  }
          }
        </style>
      `;

      document.body.appendChild(win);

      // =======================
      // ➡ מעבר אוטומטי
      // =======================

      setTimeout(() => {
        goToNextStage(); // ✅ תוקן מ-nextStage()
      }, 9000);

    }, 8000);

  }, 800);
}

// =======================
// 📱 התאמה למסך
// =======================
function goToNextStage() {
  let stage = Number(localStorage.getItem("currentStage"));

  // אם לא קיים עדיין → מתחילים משלב 1
  if (isNaN(stage) || stage < 1) {
    stage = 1;
  }

  // עוברים לשלב הבא
  stage++;

  // עדכון שמירה
  localStorage.setItem("currentStage", String(stage));

  // מעבר דפים
  if (stage === 2) {
    window.location.href = "level2.html"; // שלב ב
  } 
  else if (stage === 3) {
    window.location.href = "level3.html"; // שלב ג
  } 
  else {
    // אם עבר את כל השלבים
    localStorage.setItem("currentStage", "1");
    window.location.href = "choose-level.html";
  }
}

// =======================
// 📱 רספונסיביות
// =======================

window.addEventListener("resize", () => {
  if (window.innerWidth <= 768) {
    cart.style.right = "10px";
  } else {
    cart.style.right = "40px";
  }
});