const USERS_KEY = "shop_users";
const SESSION_KEY = "shop_session";
// localStorage.setItem("global_bgm", "on");
document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     ELEMENTS
  ========================= */
  const tabs = document.querySelectorAll(".tab");

  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  const loginUsername = document.getElementById("loginUsername");
  const loginPassword = document.getElementById("loginPassword");
  const loginMsg = document.getElementById("loginMsg");

  const regUsername = document.getElementById("regUsername");
  const regPassword = document.getElementById("regPassword");
  const regMsg = document.getElementById("regMsg");

  const startGameBtn = document.getElementById("startGameBtn");
  const myGamesBtn = document.getElementById("myGamesBtn");
  const helpBtn = document.getElementById("helpBtn");

  if (helpBtn) {
    helpBtn.addEventListener("click", () => {
      window.location.href = "PAGES/rules.html";
    });
  }

  // ✅ וודא שיש משתמש admin
  let users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  if (!users.find(u => u.username === "admin")) {
    users.push({ username: "admin", password: "1234", role: "admin" });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  /* =========================
     עדכון כפתור לפי סוג משתמש
  ========================= */
  function updateButtonByRole(role) {
    if (!startGameBtn) return;

    if (role === "admin") {
      startGameBtn.textContent = "🛠️ כניסת מנהל ";
    } else {
      startGameBtn.textContent = "🚀 התחל משחק";
    }
  }

  // בדוק אם יש session פעיל כבר
  const existingSession = JSON.parse(localStorage.getItem(SESSION_KEY));
  if (existingSession) {
    updateButtonByRole(existingSession.role);
  }
  // אחרי הגדרת הפונקציה updateButtonByRole, הוסיפי את זה:

  loginUsername.addEventListener("input", checkAndUpdateButton);
  loginPassword.addEventListener("input", checkAndUpdateButton);

  function checkAndUpdateButton() {
    const username = loginUsername.value.trim();
    const password = loginPassword.value;

    const allUsers = JSON.parse(localStorage.getItem(USERS_KEY)) || [];

    const user = allUsers.find(u =>
      u.username === username &&
      u.password === password
    );

    if (user) {
      updateButtonByRole(user.role);
    } else {
      // ברירת מחדל
      startGameBtn.textContent = "🚀 התחל משחק";
    }
  }

  /* =========================
     TABS
  ========================= */
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {

      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      if (!loginForm || !registerForm) return;

      loginForm.classList.remove("show");
      registerForm.classList.remove("show");

      if (tab.dataset.tab === "login") {
        loginForm.classList.add("show");
      } else if (tab.dataset.tab === "register") {
        registerForm.classList.add("show");
      }
    });
  });

  /* =========================
     🚀 START / ADMIN BUTTON
  ========================= */
  if (startGameBtn) {
    startGameBtn.addEventListener("click", () => {

      const username = loginUsername.value.trim();
      const password = loginPassword.value;

      // אם השדות ריקים — בדוק אם יש session פעיל
      if (!username || !password) {
        loginMsg.textContent = "⚠️ יש למלא שם משתמש וסיסמה";
        loginMsg.style.color = "orange";
        return;
      }

      if (!username || !password) {
        loginMsg.textContent = "⚠️ עדיין לא נרשמת!";
        loginMsg.style.color = "orange";
        return;
      }

      const allUsers = JSON.parse(localStorage.getItem(USERS_KEY)) || [];

      const user = allUsers.find(u =>
        u.username === username &&
        u.password === password
      );

      if (!user) {
        loginMsg.textContent = "⚠️ עדיין לא נרשמת!";
        loginMsg.style.color = "orange";
        return;
      }

      // שמור session
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));

      // הודעה לפי תפקיד
      if (user.role === "admin") {
        loginMsg.textContent = "👑 התחברת כמנהל!";
        loginMsg.style.color = "#FFD700";
      } else {
        loginMsg.textContent = "✅ התחברת כמשתמש!";
        loginMsg.style.color = "lightgreen";
      }

      // עדכן כפתור
      updateButtonByRole(user.role);

      setTimeout(() => {
        if (user.role === "admin") {
          window.location.href = "PAGES/admin.html";
        } else {
          window.location.href = "PAGES/choose-level.html";
        }
      }, 700);
    });
  }

  /* =========================
     🎮 MY GAMES
  ========================= */
  if (myGamesBtn) {

    myGamesBtn.addEventListener("click", () => {
  
      const username = loginUsername.value.trim();
      const password = loginPassword.value;
  
      const allUsers =
        JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  
      const user = allUsers.find(u =>
        u.username === username &&
        u.password === password
      );
  
      if (!user) {
  
        loginMsg.textContent =
          "⚠️ התחבר קודם כדי לראות משחקים";
  
        loginMsg.style.color = "orange";
  
        return;
      }
  
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify(user)
      );
  
      window.location.href =
        "PAGES/mygames.html";
  
    });
  
  }

  /* =========================
     🧾 REGISTER
  ========================= */
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      let allUsers = JSON.parse(localStorage.getItem(USERS_KEY)) || [];

      const username = regUsername.value.trim();
      const password = regPassword.value;

      if (password.length < 6) {
        regMsg.textContent = "❌ סיסמה חייבת להיות לפחות 6 תווים";
        regMsg.style.color = "red";
        return;
      }

      if (allUsers.find(u => u.username === username)) {
        console.log("משתמשים קיימים:", allUsers.map(u => u.username));
        console.log("ניסיון הרשמה:", JSON.stringify(username));
        regMsg.textContent = "❕ כבר קיים משתמש כזה";
        regMsg.style.color = "red";
        return;
      }

      allUsers.push({ username, password, role: "user" });
      localStorage.setItem(USERS_KEY, JSON.stringify(allUsers));

      regMsg.textContent = "✅ נרשמת בהצלחה! עבור להתחברות";
      regMsg.style.color = "lightgreen";

      regUsername.value = "";
      regPassword.value = "";

      setTimeout(() => {
        document.querySelector('[data-tab="login"]').click();
        loginUsername.value = username;
      }, 1000);
    });
  }

});