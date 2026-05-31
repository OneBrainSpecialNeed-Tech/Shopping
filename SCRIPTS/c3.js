localStorage.setItem("global_bgm", "off");
// =======================
// 🎲 דילמות
// =======================
 
const GAMES_KEY = "shop_games";

let playerName = JSON.parse(localStorage.getItem("shop_session"))?.username || "שחקן";
 
let dilemmas = [
  {
    text: "אִמָּא בְּאֶמְצַע לֶאֱפוֹת עוּגָה אַךְ חֲסֵרִים לָהּ מוּצָרִים. לֵךְ קְנֵה 3 מוּצָרִים מַתְאִימִים.",
    correctShop: "מכולת",
    products: ["ביצים", "קמח", "שוקולד"],
    speech: "אמא באמצע לאפות עוגה אַךְ חסרים לה מוצרים. לך קנה שלושה מוצרים מתאימים."
  },
  {
    text: " לִכְבוֹד פֶּסַח אֲנַחְנוּ רוֹצִים לְנַקּוֹת אֶת הַחַלּוֹנוֹת. לֵךְ קְנֵה 3 מוּצָרִים שֶׁיַּעַזְרוּ לָנוּ..",
    correctShop: "מוצרי ניקיון",
    products: ["סמרטוט", "מנקה חלונות", "סקוצ"],
    speech: "לִכְבוֹד פֶּסַח אֲנַחְנוּ רוֹצִים לְנַקּוֹת אֶת הַחַלּוֹנוֹת. לֵךְ קְנֵה 3 מוּצָרִים שֶׁיַּעַזְרוּ לָנו."
  },
  {
    text: "אִמָּא רוֹצָה לְהָכִין סָלָט פֵּרוֹת לִכְבוֹד שַׁבָּת. לֵךְ וְקְנֵה 3 מוּצָרִים מַתְאִימִים.",
    correctShop: "פירות וירקות",
    products: ["אננס", "אגס", "בננה"],
    speech: "אִמָּא רוֹצָה לְהָכִין סָלָט פֵּרוֹת לִכְבוֹד שַׁבָּת. לֵךְ קְנֵה שְׁלוֹשָׁה פֵּרוֹת מַתְאִימִים."
  },
  {
    text: "חֲנוּכָּה מִתְקָרֵב וַאֲנַחְנוּ צְרִיכִים מוּצָרִים לְהַדְלָקַת הַחֲנוּכִּיָּה. לֵךְ וְקְנֵה 3 מוּצָרִים מַתְאִימִים.",
    correctShop: "תשמישי קדושה",
    products: ["פתילות", "שמן זית", "חנוכיה"],
    speech: "חֲנוּכָּה מִתְקָרֵב וַאֲנַחְנוּ צְרִיכִים מוּצָרִים לְהַדְלָקַת הַחֲנוּכִּיָּה. לֵךְ קְנֵה שְׁלוֹשָׁה מוּצָרִים מַתְאִימִים."
  },
  {
    text: "יְצִיאָה לַפַּארְק! מָה כְּדַאי לָקַחַת אִתָּנוּ? לֵךְ וְקְנֵה 3 מוּצָרִים מַתְאִימִים.",
    correctShop: "צעצועים",
    products: ["רחפן", "אופניים", "כדור"],
    speech: "יְצִיאָה לַפַּארְק! מָה כְּדַאי לָקַחַת אִתָּנוּ? לֵךְ קְנֵה שְׁלוֹשָׁה צַעֲצוּעִים לַפַּארְק."
  },
  {
    text: "לִקְרַאת הוֹלֶדֶת תִּינוֹק חָדָשׁ בַּמִּשְׁפָּחָה, אָנוּ צְרִיכִים לְהִתְאַרְגֵּן בִּמְהִירוּת. לֵךְ וְקְנֵה 3 מוּצְרֵי תִּינוֹקוֹת חִיּוּנִיִּים.",
    correctShop: "מוצרי תינוקות",
    products: ["בקבוק", "מוצץ", "עגלה"],
    speech: "לקראת הולדת תינוק חדש במשפחה, אנחנו צריכים להתארגן במהירות. לך וקנה שלושה מוצרי תינוקות חיוניים."
  },
];
 
// =======================
// 🎯 דילמה נוכחית
// =======================
 
let currentDilemma = dilemmas[Math.floor(Math.random() * dilemmas.length)];
document.getElementById("dilemmaText").innerText = currentDilemma.text;

// =======================
// 🔊 סאונדים
// =======================

let successSound = new Audio("../ASSETS/SOUNDS/success.mp3");
let failSound = new Audio("../ASSETS/SOUNDS/error.mp3");
let wheelsSound = new Audio("../ASSETS/SOUNDS/wheels.mp3");
let winSound = new Audio("../ASSETS/SOUNDS/win.mp3");

let wheelsStarted = false;

// =======================
// 🔊 רמקול
// =======================
 
document.getElementById("speaker").addEventListener("click", () => {
  speechSynthesis.cancel();
  let speech = new SpeechSynthesisUtterance(currentDilemma.speech);
  speech.lang = "he-IL";
  speech.rate = 0.82;
  speechSynthesis.speak(speech);

  wheelsSound.load();
});
 
// =======================
// ⏱ הגדרות זמן
// =======================
 
const TIME_LIMIT = 30;
let startTime = Date.now();
let gameLost = false;
let gameWon = false;
 
// =======================
// 👧 ילדה + עגלה
// =======================
 
let girl = document.querySelector(".girl");
let bottom = document.querySelector(".bottom");
 
let cart = document.createElement("div");
cart.className = "cart-stack";
cart.style.position = "absolute";
cart.style.width = "160px";
cart.style.height = "110px";
cart.style.right = "60px";
cart.style.bottom = "65px";
cart.style.zIndex = "-3";
bottom.appendChild(cart);

// =======================
// 🚶‍♀️ הילדה זזה + קול גלגלים מתחיל
// =======================

setTimeout(() => {
  if (gameLost || gameWon) return;

  wheelsStarted = true;
  wheelsSound.loop = true;
  wheelsSound.currentTime = 0;
  wheelsSound.play().catch(() => {});

  bottom.style.transition = `${TIME_LIMIT}s linear`;
  bottom.style.transform = "translateX(-120vw)";

  setTimeout(() => {
    if (gameLost || gameWon) return;
    showLoseScreen();
  }, TIME_LIMIT * 1000);

}, 700);
 
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
// 💔 מסך הפסד
// =======================
 
function showLoseScreen() {
    if (gameLost) return;
    gameLost = true;

    wheelsSound.pause();
    wheelsSound.currentTime = 0;
   
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
            נגמר הזמן בשלב ג!<br>
            <span style="font-size:18px; opacity:0.7;">נסה/י שוב – את/ה יכול/ה!</span>
          </p>
          <div style="display:flex; gap:16px; justify-content:center; flex-wrap:wrap;">
            <button onclick="location.reload()" style="
              padding:14px 32px; border:none; border-radius:50px;
              background: linear-gradient(135deg, #ff5252, #d32f2f);
              color:white; font-size:18px; font-weight:bold; cursor:pointer;
              box-shadow: 0 8px 20px rgba(255,82,82,0.4);
              transition:0.3s;
            " onmouseover="this.style.transform='scale(1.07)'" onmouseout="this.style.transform='scale(1)'">
              🔄 נסה/י שוב
            </button>
            <button onclick="location.href='../PAGES/choose-level.html'" style="
              padding:14px 32px; border:none; border-radius:50px;
              background: rgba(255,255,255,0.15);
              color:white; font-size:18px; font-weight:bold; cursor:pointer;
              border:2px solid rgba(255,255,255,0.3);
              transition:0.3s;
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
// 🎯 קליקים
// =======================

let collected = 0;

document.querySelectorAll(".item").forEach(item => {
  item.addEventListener("click", () => {
    if (gameLost || gameWon) return;

    if (!wheelsStarted) {
      wheelsStarted = true;
      wheelsSound.loop = true;
      wheelsSound.currentTime = 0;
      wheelsSound.play().catch(() => {});
    }

    let product = item.dataset.name;
    let shop = item.dataset.shop;

    if (
      currentDilemma.products.includes(product) &&
      shop === currentDilemma.correctShop
    ) {
      successSound.currentTime = 0;
      successSound.play();

      moveToCart(item);
      item.style.pointerEvents = "none";
      collected++;

      if (collected === 3) {
        document.querySelectorAll(".item").forEach(el => {
          el.style.pointerEvents = "none";
        });

        setTimeout(() => {
          finishLevel();
        }, 1000);
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
  let cartRect = cart.getBoundingClientRect();
 
  clone.style.position = "fixed";
  clone.style.left = rect.left + "px";
  clone.style.top = rect.top + "px";
  clone.style.width = "55px";
  clone.style.transition = "1s ease";
  clone.style.zIndex = "9999";
 
  setTimeout(() => {
    clone.style.top = rect.top + 120 + "px";
  }, 100);
 
  setTimeout(() => {
    clone.style.left = cartRect.left + 35 + "px";
    clone.style.top = cartRect.top + 25 + "px";
    clone.style.transform = "scale(0.35)";
  }, 350);
 
  setTimeout(() => {
    clone.remove();
 
    let finalItem = item.cloneNode(true);
    finalItem.style.position = "absolute";
    finalItem.style.width = "48px";
    finalItem.style.right = "60px";
    finalItem.style.bottom = (-19 + collected * 14) + "px";
    finalItem.style.transform = `rotate(${Math.random() * 12 - 6}deg)`;
    cart.appendChild(finalItem);
  }, 1000);
}
 
// =======================
// 🏁 סיום שלב - ניצחון!
// =======================
 
function finishLevel() {
  if (gameLost || gameWon) return;
  gameWon = true;

  let computedTransform = window.getComputedStyle(bottom).transform;
  bottom.style.transition = "none";
  bottom.style.transform = computedTransform;

  wheelsSound.pause();
  wheelsSound.currentTime = 0;
 
  let levelTime = Math.floor((Date.now() - startTime) / 1000);
  let timeLeft = TIME_LIMIT - levelTime;

  let currentUser = JSON.parse(localStorage.getItem("shop_session")) || {};

  // =========================
  // ⭐ דירוג לפי זמן שנותר
  // =========================
  let rating, ratingText;
  if (timeLeft > 20) {
    rating = "🛒🛒🛒";
    ratingText = "עגלה מלאה, משימה הושלמה!";
  } else if (timeLeft >= 10) {
    rating = "🛒🛒";
    ratingText = "עגלה מלאה, אבל היה קרוב!";
  } else {
    rating = "🛒";
    ratingText = "עגלה מלאה, ברגע האחרון!";
  }

  // =========================
  // ✅ שמירת שלב ג׳ + סיכום רמה ג׳ לדף מנהל
  // =========================
  let currentGame = JSON.parse(localStorage.getItem("current_game")) || {
    username:   currentUser.username || "אנונימי",
    levelGroup: "C",
    levelC_stage1: null,
    levelC_stage2: null,
    levelC_stage3: null
  };

  currentGame.levelGroup = "C";
  currentGame.levelC_stage3 = { time: levelTime, max: TIME_LIMIT };

  let s1 = currentGame.levelC_stage1;
  let s2 = currentGame.levelC_stage2;
  let s3 = currentGame.levelC_stage3;

  let games = JSON.parse(localStorage.getItem(GAMES_KEY)) || [];
  games.push({
    username:   currentUser.username || "אנונימי",
    levelGroup: "C",
    date:       new Date().toLocaleDateString("he-IL"),
    hour:       new Date().toLocaleTimeString("he-IL"),
    rating:     rating,
    ratingText: ratingText,
    stages: {
      stage1:    s1 ? s1.time : 0, stage1Max: 18,
      stage2:    s2 ? s2.time : 0, stage2Max: 100,
      stage3:    levelTime,        stage3Max: TIME_LIMIT
    }
  });
  localStorage.setItem(GAMES_KEY, JSON.stringify(games));
  localStorage.removeItem("current_game");

  // =========================
  // 🚗 הילדה ממשיכה לזוז
  // =========================
  setTimeout(() => {
    bottom.style.transition = "5s linear";
    bottom.style.transform = "translateX(-130vw)";
  }, 500);
 
  setTimeout(() => {
    winSound.currentTime = 0;
    winSound.play();

    let modal = document.createElement("div");
    modal.innerHTML = `
      <div style="
        position:fixed; inset:0;
        background: radial-gradient(circle at top, #2b1055, #12001f, #000);
        display:flex; justify-content:center; align-items:center;
        z-index:999999; font-family:Segoe UI;
        animation:fadeIn 1s;
      ">
        <div style="
          width:760px; transform: scale(0.75); transform-origin: center;
          padding:38px 55px; border-radius:45px; text-align:center;
          position:relative; overflow:hidden;
          background: linear-gradient(145deg, #ffb703, #ff006e, #8338ec, #3a86ff);
          background-size:300% 300%;
          animation: gradientMove 8s ease infinite, popWin 0.8s ease;
          border:7px solid rgba(255,255,255,0.3);
          box-shadow: 0 0 60px rgba(255,0,110,0.6), 0 0 120px rgba(58,134,255,0.5);
        ">
          <div style="font-size:110px; margin-bottom:10px; animation:bounce 1.4s infinite;
            filter: drop-shadow(0 8px 20px rgba(0,0,0,0.35));">👑</div>
          <div style="color:white; font-size:18px; letter-spacing:5px; margin-bottom:18px; opacity:0.9;">
            LEVEL 3 COMPLETE
          </div>
          <h1 style="color:white; font-size:62px; margin:0; font-weight:900;
            text-shadow: 0 6px 18px rgba(0,0,0,0.4);">כל הכבוד, ${playerName}!</h1>
          <div style="margin-top:18px; color:white; font-size:26px; font-weight:bold; line-height:1.8;">
            מילאת את העגלה בזמן<br>
            <span style="font-size:20px; opacity:0.85;">הספקת לפני שהילדה נעלמה מהמסך!</span>
          </div>
          <div style="
            margin-top:38px; background:rgba(255,255,255,0.18);
            border-radius:28px; padding:28px;
            border:2px solid rgba(255,255,255,0.28);
            backdrop-filter:blur(8px); color:white;
          ">
            <div style="font-size:50px; margin-bottom:16px;">${rating}</div>
            <div style="font-size:28px; font-weight:bold; margin-bottom:10px;">${ratingText}</div>
            <div style="font-size:20px; opacity:0.8;"></div>
          </div>
          <button onclick="location.href='../PAGES/choose-level.html'" style="
            margin-top:40px; padding:18px 42px; border:none; border-radius:22px;
            background:white; color:#ff006e; font-size:20px; font-weight:bold;
            cursor:pointer; box-shadow: 0 10px 25px rgba(0,0,0,0.25); transition:0.3s;
          "
          onmouseover="this.style.transform='scale(1.08)'"
          onmouseout="this.style.transform='scale(1)'">
            🏠 חזרה לתפריט
          </button>
        </div>
      </div>
      <style>
        @keyframes popWin { 0%{transform:scale(0.55) rotate(-6deg);opacity:0;} 100%{transform:scale(1);opacity:1;} }
        @keyframes bounce { 0%{transform:translateY(0px);} 50%{transform:translateY(-16px);} 100%{transform:translateY(0px);} }
        @keyframes fadeIn { from{opacity:0;} to{opacity:1;} }
        @keyframes gradientMove { 0%{background-position:0% 50%;} 50%{background-position:100% 50%;} 100%{background-position:0% 50%;} }
      </style>
    `;
    document.body.appendChild(modal);

  }, 2000);
}

function goToNextStage() {
  const level = localStorage.getItem("currentLevel");
  let stage = parseInt(localStorage.getItem("currentStage"));

  stage++;

  if (stage > 3) {
    location.href = "../login.html";
  } else {
    localStorage.setItem("currentStage", String(stage));
    window.location.href = "level" + stage + ".html";
  }
}