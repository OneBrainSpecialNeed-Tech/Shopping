// =======================
// 🎲 דילמות
// =======================
localStorage.setItem("global_bgm", "off");
const GAMES_KEY = "shop_games";

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
    speech: "אִמָּא רוֹצָה לְהָכִין סָלָט פֵּרוֹת לִכְבוֹד שַׁבָּת. לֵךְ קְנֵה שְׁלוֹשָׁה מוצרים מַתְאִימִים."
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
// 🔊 רמקול
// =======================

document.getElementById("speaker").addEventListener("click", () => {

  speechSynthesis.cancel();

  let speech = new SpeechSynthesisUtterance(currentDilemma.speech);

  speech.lang = "he-IL";
  speech.rate = 0.82;

  speechSynthesis.speak(speech);

});

// =======================
// ⏱ טיימר
// =======================

let startTime = Date.now();

let timerInterval = setInterval(() => {

  let diff = Math.floor((Date.now() - startTime) / 1000);

  let min = String(Math.floor(diff / 60)).padStart(2, "0");
  let sec = String(diff % 60).padStart(2, "0");

  document.getElementById("time").innerText = `${min}:${sec}`;

}, 1000);

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
// 🔊 סאונדים
// =======================

let successSound = new Audio("../ASSETS/SOUNDS/success.mp3");
let failSound = new Audio("../ASSETS/SOUNDS/error.mp3");
let wheelsSound = new Audio("../ASSETS/SOUNDS/wheels.mp3");
let winSound = new Audio("../ASSETS/SOUNDS/win.mp3");

// =======================
// 🎯 קליקים
// =======================

let collected = 0;

document.querySelectorAll(".item").forEach(item => {

  item.addEventListener("click", () => {

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

        setTimeout(finishLevel, 1700);

      }

    } else {

      failSound.currentTime = 0;
      failSound.play();

      item.style.animation = "shake 0.4s";

      setTimeout(() => {

        item.style.animation = "";

      }, 400);

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

    clone.style.transform =
      "scale(0.35)";

  }, 350);

  setTimeout(() => {

    clone.remove();

    let finalItem = item.cloneNode(true);

    finalItem.style.position = "absolute";
    finalItem.style.width = "34px";

    finalItem.style.width = "48px";

    finalItem.style.right = "60px";

    finalItem.style.bottom =
      (-19 + collected * 14) + "px";

    finalItem.style.transform =
      `rotate(${Math.random() * 12 - 6}deg)`;
    cart.appendChild(finalItem);

  }, 1000);
}

// =======================
// 🏁 סיום שלב
// =======================

function finishLevel() {

  clearInterval(timerInterval);

  let session = JSON.parse(localStorage.getItem("current_game")) || {};
  let currentUser = JSON.parse(localStorage.getItem("shop_session")) || {};
  let games = JSON.parse(localStorage.getItem(GAMES_KEY)) || [];

  let levelTime = Math.floor((Date.now() - startTime) / 1000);
  let playerName = currentUser.username || "אנונימי";

  session.level3 = levelTime;

  session.total =
    (session.level1 || 0) +
    (session.level2 || 0) +
    (session.level3 || 0);

  session.username = playerName;

  // =========================
  // ✅ שמירה לדף מנהל — רק אם זו רמה א׳
  // =========================
  if ((session.levelGroup || "A") === "A") {
    games.push({
      username:   playerName,
      levelGroup: "A",
      date:       new Date().toLocaleDateString("he-IL"),
      hour:       new Date().toLocaleTimeString("he-IL"),
      stages: {
        stage1:    session.level1 || 0, stage1Max: 40,
        stage2:    session.level2 || 0, stage2Max: 110,
        stage3:    levelTime,           stage3Max: 30
      }
    });
    localStorage.setItem(GAMES_KEY, JSON.stringify(games));
  }

  localStorage.removeItem("current_game");

  // =========================
  // 🚗 הילדה מתחילה לנסוע
  // =========================

  wheelsSound.currentTime = 0;
  wheelsSound.play();

  bottom.style.transition = "9s linear";

  bottom.style.transform =
    "translateX(-160vw)";

  // =========================
  // ⏳ כשהילדה נעלמת
  // =========================

  setTimeout(() => {

    wheelsSound.pause();
    wheelsSound.currentTime = 0;

    winSound.currentTime = 0;
    winSound.play();

    // =========================
    // 🎉 מסך ניצחון סופי
    // =========================

    let modal = document.createElement("div");

    modal.innerHTML = `

      <div style="
        position:fixed;
        inset:0;
        background:
        radial-gradient(circle at top,
        #2b1055,
        #12001f,
        #000);

        display:flex;
        justify-content:center;
        align-items:center;

        z-index:999999;

        font-family:Segoe UI;

        animation:fadeIn 1s;
      ">

        <div style="
          width:760px;
          transform: scale(0.75);
         transform-origin: center;
          padding:38px 55px;
          border-radius:45px;

          text-align:center;

          position:relative;

          overflow:hidden;

          background:
          linear-gradient(
          145deg,
          #ffb703,
          #ff006e,
          #8338ec,
          #3a86ff);

          background-size:300% 300%;

          animation:
          gradientMove 8s ease infinite,
          popWin 0.8s ease;

          border:7px solid rgba(255,255,255,0.3);

          box-shadow:
          0 0 60px rgba(255,0,110,0.6),
          0 0 120px rgba(58,134,255,0.5),
          0 0 180px rgba(255,183,3,0.45);
        ">

          <div style="
            position:absolute;
            top:-120px;
            right:-120px;

            width:320px;
            height:320px;

            background:rgba(255,255,255,0.12);

            border-radius:50%;
          "></div>

          <div style="
            position:absolute;
            bottom:-140px;
            left:-140px;

            width:300px;
            height:300px;

            background:rgba(255,255,255,0.08);

            border-radius:50%;
          "></div>

          <div style="
            font-size:110px;

            margin-bottom:10px;

            animation:bounce 1.4s infinite;

            filter:
            drop-shadow(0 8px 20px rgba(0,0,0,0.35));
          ">
            👑
          </div>

          <div style="
            color:white;

            font-size:18px;

            letter-spacing:5px;

            margin-bottom:18px;

            opacity:0.9;
          ">
            GRAND FINAL COMPLETE
          </div>

         <h1 style="
  color:white;

  font-size:62px;

  margin:0;

  font-weight:900;

  text-shadow:
  0 6px 18px rgba(0,0,0,0.4);
">
  ${playerName} האלופ/ה! 
</h1>

          <div style="
            margin-top:18px;

            color:white;

            font-size:34px;

            font-weight:bold;

            line-height:1.7;
          ">
             <br>
            סיימת את כל המשחק בהצלחה!
          </div>

          <div style="
            margin-top:38px;

            background:rgba(255,255,255,0.18);

            border-radius:28px;

            padding:28px;

            border:2px solid rgba(255,255,255,0.28);

            backdrop-filter:blur(8px);

            color:white;
          ">

            <div style="
              font-size:30px;
              margin-bottom:22px;
              font-weight:bold;
            ">
              🏆 תוצאות המשחק
            </div>

            <div style="
              font-size:23px;
              line-height:2;
            ">
              ⏱ שלב 1: ${session.level1} שניות<br>
              ⏱ שלב 2: ${session.level2} שניות<br>
              ⏱ שלב 3: ${session.level3} שניות
            </div>

            <div style="
              margin-top:28px;

              font-size:42px;

              font-weight:900;

              color:#fff4b3;

              text-shadow:
              0 0 18px rgba(255,255,255,0.7);
            ">
              ⭐ סה״כ: ${session.total} שניות
            </div>

          </div>

          <button onclick="location.href='../PAGES/choose-level.html'"
           style="
            margin-top:40px;

            padding:18px 42px;

            border:none;

            border-radius:22px;

            background:white;

            color:#ff006e;

            font-size:20px;

            font-weight:bold;

            cursor:pointer;

            box-shadow:
            0 10px 25px rgba(0,0,0,0.25);

            transition:0.3s;
          "
          onmouseover="
            this.style.transform='scale(1.08)';
          "
          onmouseout="
            this.style.transform='scale(1)';
          ">
          🏠 חזרה לתפריט 
          </button>

        </div>
      </div>

      <style>

        @keyframes popWin {

          0%{
            transform:scale(0.55) rotate(-6deg);
            opacity:0;
          }

          100%{
            transform:scale(1);
            opacity:1;
          }
        }

        @keyframes bounce {

          0%{
            transform:translateY(0px);
          }

          50%{
            transform:translateY(-16px);
          }

          100%{
            transform:translateY(0px);
          }
        }

        @keyframes fadeIn {

          from{
            opacity:0;
          }

          to{
            opacity:1;
          }
        }

        @keyframes gradientMove {

          0%{
            background-position:0% 50%;
          }

          50%{
            background-position:100% 50%;
          }

          100%{
            background-position:0% 50%;
          }
        }

      </style>
    `;

    document.body.appendChild(modal);

  }, 9000);
}

function goToNextStage() {
  let stage = Number(localStorage.getItem("currentStage"));

  if (isNaN(stage) || stage < 1) stage = 1;

  stage++;

  if (stage > 3) {
    localStorage.setItem("currentStage", "1");
    window.location.href = "../PAGES/choose-level.html";
    return;
  }

  localStorage.setItem("currentStage", String(stage));
  window.location.href = "level" + stage + ".html";
}