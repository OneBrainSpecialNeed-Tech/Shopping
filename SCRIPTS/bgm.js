// // =======================================
// // BGM - מנגינת רקע עם המשכיות בין דפים
// // =======================================

// (function () {

//   const isInSubfolder = window.location.pathname.includes("/PAGES/");
//   const soundPath = isInSubfolder
//     ? "../ASSETS/SOUNDS/bgm.mp3"
//     : "ASSETS/SOUNDS/bgm.mp3";

//   if (!window.globalBGM) {
//     window.globalBGM = new Audio(soundPath);
//     window.globalBGM.loop = true;
//     window.globalBGM.volume = 0.4;
//   }

//   const bgm = window.globalBGM;

//   // שחזר מיקום מהדף הקודם
//   function restoreTime() {
//     const savedTime = parseFloat(localStorage.getItem("bgm_time") || "0");
//     if (savedTime > 0) {
//       bgm.currentTime = savedTime;
//     }
//   }

//   // שמור מיקום לפני עזיבת הדף
//   window.addEventListener("beforeunload", () => {
//     localStorage.setItem("bgm_time", bgm.currentTime);
//   });

//   // נסה להפעיל מיד בטעינת הדף (עובד אם המשתמש כבר אינטרקט קודם)
//   restoreTime();
//   bgm.play().catch(() => {
//     // הדפדפן חסם — נחכה לאינטראקציה
//     console.log("BGM: ממתין לאינטראקציה...");
//   });

//   window.startBGM = function () {
//     restoreTime();
//     if (!bgm.paused) return;
//     bgm.play().catch(e => console.warn("BGM error:", e));
//   };

//   window.stopBGM = function () {
//     localStorage.removeItem("bgm_time");
//     bgm.pause();
//     bgm.currentTime = 0;
//   };

//   // גיבוי — אם הדפדפן חסם, מתחיל בקליק ראשון
//   function tryStart() {
//     if (bgm.paused) {
//       restoreTime();
//       bgm.play().catch(() => {});
//     }
//     document.removeEventListener("click", tryStart);
//     document.removeEventListener("keydown", tryStart);
//     document.removeEventListener("touchstart", tryStart);
//   }

//   document.addEventListener("click", tryStart);
//   document.addEventListener("keydown", tryStart);
//   document.addEventListener("touchstart", tryStart);

// })();