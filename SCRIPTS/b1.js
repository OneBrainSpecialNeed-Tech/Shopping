localStorage.setItem("levelGroup", "B");
let stage = Number(localStorage.getItem("currentStage")) || 1;

function nextStage() {
  if (stage < 3) {
    localStorage.setItem("currentStage", stage + 1);
    location.href = "level" + (stage + 1) + ".html";
  } else {
    alert("סיימת רמה!");
    localStorage.setItem("currentStage", "1");
    window.location.href = "../PAGES/choose-level.html";
  }
}

localStorage.setItem("global_bgm", "off");

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

const TIME_LIMIT = 40;
let timeLeft = TIME_LIMIT;
let gameLost = false;

function startTimer() {
  const timeEl = document.getElementById("time");
  if (!timeEl) return;

  timeEl.innerText = "00:40";

  timerInterval = setInterval(() => {
    if (gameLost) return;

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
  if (gameLost) return;
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
        position:relative; overflow:hidden;
        animation: popLose 0.7s ease;
      ">
        <div style="font-size:90px; margin-bottom:16px; animation:shake 0.5s ease;">⏰</div>
        <div style="font-size:14px; letter-spacing:5px; color:rgba(255,150,150,0.8); margin-bottom:14px;">TIME IS UP</div>
        <h1 style="margin:0; font-size:52px; font-weight:900;
          background: linear-gradient(90deg, #ff8a80, #ff5252, #ff1744);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;">
          אוי לא! ⌛
        </h1>
        <div style="width:90px; height:4px; border-radius:20px; margin:20px auto;
          background: linear-gradient(90deg, #ff5252, #ff1744);"></div>
        <p style="font-size:22px; line-height:1.8; color:rgba(255,255,255,0.85); margin-bottom:30px;">
          נגמר הזמן בשלב א׳!<br>
          <span style="font-size:18px; opacity:0.7;">נסי שוב – את יכולה!</span>
        </p>
        <div style="display:flex; gap:16px; justify-content:center; flex-wrap:wrap;">
          <button onclick="location.reload()" style="
            padding:14px 32px; border:none; border-radius:50px;
            background: linear-gradient(135deg, #ff5252, #d32f2f);
            color:white; font-size:18px; font-weight:bold; cursor:pointer;
            box-shadow: 0 8px 20px rgba(255,82,82,0.4); transition:0.3s;
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
      @keyframes shake {
        0%,100%{transform:translateX(0);}
        20%{transform:translateX(-8px);}
        40%{transform:translateX(8px);}
        60%{transform:translateX(-6px);}
        80%{transform:translateX(6px);}
      }
    </style>
  `;
  document.body.appendChild(lose);
}

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
    if (gameLost) return;

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
// 🏁 סיום משחק
// =======================

function finishGame() {
  clearInterval(timerInterval);

  let levelTime = Math.floor((Date.now() - startTime) / 1000);
  let currentUser = JSON.parse(localStorage.getItem("shop_session")) || {};

  // =========================
  // ⭐ חישוב ציון שלב א׳
  // =========================
  let stars = "⭐⭐⭐";
  let scoreText = "מושלם! את אלופת הקניות!";
  if (levelTime > 35) {
    stars = "⭐";
    scoreText = "אפשר להשתפר";
  } else if (levelTime > 25) {
    stars = "⭐⭐";
    scoreText = "כל הכבוד!";
  }

  // =========================
  // 💾 שמירה ל-current_game
  // איפוס מלא כי זה שלב ראשון ברמה ב׳
  // =========================
  let currentGame = {
    username: currentUser.username || "אנונימי",
    date: new Date().toLocaleDateString("he-IL"),
    hour: new Date().toLocaleTimeString("he-IL"),
    levelGroup: "B",
    levelB_stage1: {
      time: levelTime,
      max: TIME_LIMIT,
      stars: stars,
      scoreText: scoreText
    },
    levelB_stage2: null,
    levelB_stage3: null,
    levelB_summary: null,
    stages: {
      stage1: levelTime,
      stage2: 0,
      stage3: 0
    }
  };

  localStorage.setItem("current_game", JSON.stringify(currentGame));

  // =========================
  // 🚗 הילדה מתחילה לזוז
  // =========================
  setTimeout(() => {
    let bottom = document.querySelector(".bottom");
    bottom.style.transition = "8s linear";
    cart.style.transition = "8s linear";

    wheelsSound.currentTime = 0;
    wheelsSound.play();

    bottom.style.transform = "translateX(-120vw)";
    cart.style.transform = "translateX(-120vw)";

    setTimeout(() => {
      bottom.style.opacity = "0";
      cart.style.opacity = "0";

      wheelsSound.pause();
      wheelsSound.currentTime = 0;

      winSound.currentTime = 0;
      winSound.play();

      let win = document.createElement("div");
      win.innerHTML = `
        <div style="
          position:fixed; inset:0;
          background: radial-gradient(circle at top, #312e81, #0f172a 60%, #020617);
          display:flex; justify-content:center; align-items:center;
          z-index:99999; font-family:Segoe UI; overflow:hidden;
        ">
          <div style="
            width:620px; padding:55px; border-radius:38px; text-align:center;
            background:rgba(255,255,255,0.08); backdrop-filter:blur(20px);
            border:1px solid rgba(255,255,255,0.15);
            box-shadow: 0 25px 90px rgba(0,0,0,0.65);
            animation:popWin 0.7s ease;
          ">
            <div style="font-size:95px; margin-bottom:12px; animation:floatIcon 2s ease-in-out infinite;">🏆</div>
            <div style="font-size:14px; letter-spacing:5px; color:rgba(255,255,255,0.65); margin-bottom:14px;">STAGE COMPLETE</div>
            <h1 style="margin:0; font-size:54px; font-weight:900;
              background: linear-gradient(90deg, #ffffff, #ddd6fe, #93c5fd);
              -webkit-background-clip:text; -webkit-text-fill-color:transparent;">כל הכבוד!</h1>
            <div style="width:90px; height:5px; border-radius:20px; margin:22px auto;
              background: linear-gradient(90deg, #8b5cf6, #3b82f6);"></div>
            <p style="font-size:24px; line-height:1.8; color:rgba(255,255,255,0.92); margin:0; font-weight:600;">
              סיימת את שלב א׳ בהצלחה מלאה</p>
            <div style="margin-top:18px; font-size:36px; letter-spacing:6px;">${stars}</div>
            <div style="color:rgba(255,255,255,0.75); font-size:18px; margin-top:8px;">${scoreText}</div>
          </div>
        </div>
        <style>
          @keyframes popWin { 0%{transform:scale(0.6);opacity:0;} 100%{transform:scale(1);opacity:1;} }
          @keyframes floatIcon { 0%{transform:translateY(0px);} 50%{transform:translateY(-10px);} 100%{transform:translateY(0px);} }
        </style>
      `;
      document.body.appendChild(win);

      // ✅ מעבר אוטומטי לשלב ב׳
      setTimeout(() => {
        localStorage.setItem("currentStage", "2");
        window.location.href = "level2.html";
      }, 4000);

    }, 8000);
  }, 800);
}

// =======================
// 📱 התאמה למסך
// =======================

window.addEventListener("resize", () => {
  if (window.innerWidth <= 768) {
    cart.style.right = "10px";
  } else {
    cart.style.right = "40px";
  }
});

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