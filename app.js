import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";
import { firebaseConfig, hasFirebaseConfig } from "./firebase-config.js";

const defaultHomeSettings = {
  eyebrow: "Charlie Class Hub",
  headline: "今天的班級節奏，從這裡開始。",
  intro: "自動整理今日日期、時間、天氣與近期提醒，讓師生一進首頁就知道今天的狀態，也讓班級工具和課程入口保持清楚好找。"
};

const defaultWidgets = [
  {
    title: "Charlie",
    description: "自我介紹、教學理念、班級經營風格與常用連結。",
    href: "charlie.html",
    color: "blue",
    tag: "Profile",
    icon: "profile",
    enabled: false,
    order: 1
  },
  {
    title: "班級操作台",
    description: "課表、行事曆、重要公告與班級常用資料的集中入口。",
    href: "class-console.html",
    color: "cyan",
    tag: "Class",
    icon: "calendar",
    enabled: true,
    order: 2
  },
  {
    title: "班經小工具",
    description: "時鐘、碼表、計時、分組、抽籤、作業點交等工具入口。",
    href: "class-tools.html",
    color: "green",
    tag: "Tools",
    icon: "tools",
    enabled: true,
    order: 3
  },
  {
    title: "課程應用程式",
    description: "依不同主題、單元與課程活動設計的互動應用入口。",
    href: "course-apps.html",
    color: "amber",
    tag: "Apps",
    icon: "apps",
    enabled: true,
    order: 4
  },
  {
    title: "互動區",
    description: "公開、半匿名、全匿名留言，搭配 Firebase 帳號權限與教師備份。",
    href: "comments.html",
    color: "rose",
    tag: "Community",
    icon: "message",
    enabled: true,
    order: 5
  },
  {
    title: "工作後台",
    description: "未來串接 Google Firebase 登入，管理首頁 widget、名稱與連結。",
    href: "admin.html",
    color: "violet",
    tag: "Firebase",
    icon: "admin",
    enabled: true,
    order: 6
  }
];

const icons = {
  profile: '<path d="M20 21a8 8 0 0 0-16 0" /><circle cx="12" cy="7" r="4" />',
  calendar: '<rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 10h18" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" />',
  tools: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.1-3.1a6 6 0 0 1-7.9 7.9l-6 6a2.1 2.1 0 0 1-3-3l6-6a6 6 0 0 1 7.9-7.9l-3.1 3.1Z" />',
  apps: '<rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />',
  message: '<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />',
  admin: '<path d="M12 1v22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6" />'
};

const fixedWidgetLinks = {
  "班級操作台": {
    href: "./class-console.html",
    enabled: true,
    tag: "Class",
    icon: "calendar"
  },
  "班經小工具": {
    href: "./class-tools.html",
    enabled: true,
    tag: "Tools",
    icon: "tools"
  },
  "課程應用程式": {
    href: "./course-apps.html",
    enabled: true,
    tag: "Apps",
    icon: "apps"
  },
  "互動區": {
    href: "./comments.html",
    enabled: true,
    tag: "Community",
    icon: "message"
  },
  "工作後台": {
    href: "./admin.html",
    enabled: true,
    tag: "Firebase",
    icon: "admin"
  }
};

function normalizeWidget(widget) {
  const fixed = fixedWidgetLinks[String(widget.title || "").trim()];
  return fixed ? { ...widget, ...fixed } : widget;
}

const formatter = new Intl.DateTimeFormat("zh-Hant-TW", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long"
});

const timeFormatter = new Intl.DateTimeFormat("zh-Hant-TW", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false
});

const lunarFormatter = new Intl.DateTimeFormat("zh-Hant-TW-u-ca-chinese", {
  month: "long",
  day: "numeric"
});

const today = document.getElementById("today");
if (today) {
  today.textContent = formatter.format(new Date());
}

function updateClock() {
  const now = new Date();
  const heroDate = document.getElementById("heroDate");
  const lunarDate = document.getElementById("lunarDate");
  const heroTime = document.getElementById("heroTime");

  if (today) today.textContent = formatter.format(now);
  if (heroDate) heroDate.textContent = formatter.format(now);
  if (lunarDate) lunarDate.textContent = `農曆 ${lunarFormatter.format(now)}`;
  if (heroTime) heroTime.textContent = timeFormatter.format(now);
}

const weatherCodes = {
  0: "晴朗",
  1: "大致晴朗",
  2: "局部多雲",
  3: "陰天",
  45: "有霧",
  48: "霧凇",
  51: "毛毛雨",
  53: "毛毛雨",
  55: "較明顯毛毛雨",
  61: "小雨",
  63: "降雨",
  65: "大雨",
  80: "短暫陣雨",
  81: "陣雨",
  82: "強陣雨",
  95: "雷雨",
  96: "雷雨可能伴隨冰雹",
  99: "強雷雨可能伴隨冰雹"
};

async function loadWeather() {
  const weatherTemp = document.getElementById("weatherTemp");
  const weatherDesc = document.getElementById("weatherDesc");
  const weatherMeta = document.getElementById("weatherMeta");

  if (!weatherTemp || !weatherDesc || !weatherMeta) return;

  try {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=24.1813&longitude=120.6387&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=Asia%2FTaipei";
    const response = await fetch(url);
    if (!response.ok) throw new Error("Weather request failed");
    const data = await response.json();
    const current = data.current;
    const description = weatherCodes[current.weather_code] || "天氣資料已更新";

    weatherTemp.textContent = `${Math.round(current.temperature_2m)}°C`;
    weatherDesc.textContent = `${description}，濕度 ${current.relative_humidity_2m}%`;
    weatherMeta.textContent = `台中西屯目前風速 ${Math.round(current.wind_speed_10m)} km/h`;
  } catch (error) {
    console.error(error);
    weatherTemp.textContent = "天氣暫缺";
    weatherDesc.textContent = "目前無法取得即時天氣";
    weatherMeta.textContent = "請確認網路連線，稍後重新整理";
  }
}

const reminders = [
  { month: 1, day: 1, name: "元旦", note: "新的一年開始，大家可以一起整理目標與期待。" },
  { month: 1, day: 20, name: "大寒", note: "節氣進入寒冷時段，進教室前記得照顧身體與保暖。" },
  { month: 2, day: 3, name: "立春", note: "春天開始，班級可以一起啟動新的任務與節奏。" },
  { month: 2, day: 14, name: "西洋情人節", note: "今天適合練習感謝、友善表達與尊重彼此。" },
  { month: 2, day: 19, name: "雨水", note: "天氣漸濕，大家記得雨具、外套和走廊安全。" },
  { month: 2, day: 28, name: "和平紀念日", note: "今天適合一起思考和平、理解與尊重差異。" },
  { month: 3, day: 5, name: "驚蟄", note: "萬物甦醒，也提醒大家把學習狀態慢慢喚醒。" },
  { month: 3, day: 8, name: "婦女節", note: "今天可以一起看見不同角色的努力與貢獻。" },
  { month: 3, day: 12, name: "植樹節", note: "適合一起關心校園環境，從一個小行動開始。" },
  { month: 3, day: 20, name: "春分", note: "晝夜均分，大家也可以練習平衡學習與休息。" },
  { month: 4, day: 4, name: "兒童節 / 清明", note: "連假前後記得整理作業、活動安排與生活節奏。" },
  { month: 4, day: 20, name: "穀雨", note: "春雨滋養，今天適合閱讀、寫作或觀察身邊的自然。" },
  { month: 4, day: 22, name: "世界地球日", note: "大家可以一起完成一件減塑、節能或愛護校園的小事。" },
  { month: 5, day: 1, name: "勞動節", note: "今天適合一起理解工作、責任與生活的價值。" },
  { month: 5, day: 5, name: "立夏", note: "天氣轉熱，大家記得補水、防曬與保持教室通風。" },
  { month: 5, day: 15, name: "國際家庭日", note: "可以把感謝帶回家，也把家人的支持放在心裡。" },
  { month: 5, day: 21, name: "小滿", note: "事情漸漸成形，大家持續累積，不需要急著一次完成。" },
  { month: 6, day: 5, name: "芒種", note: "期末前事情會變多，大家一起整理進度與補交清單。" },
  { month: 6, day: 21, name: "夏至", note: "白天最長，戶外活動時記得補水、防曬與留意身體狀態。" },
  { month: 7, day: 7, name: "小暑", note: "暑氣開始，大家一起把暑假前的安全事項確認好。" },
  { month: 7, day: 23, name: "大暑", note: "炎熱高峰，記得防中暑，也讓作息保持規律。" },
  { month: 8, day: 7, name: "立秋", note: "新學期將近，可以一起整理環境、用品與心情。" },
  { month: 8, day: 23, name: "處暑", note: "暑氣漸退，大家慢慢把生活節奏調回穩定狀態。" },
  { month: 9, day: 3, name: "軍人節", note: "今天適合一起討論服務、守護與責任。" },
  { month: 9, day: 7, name: "白露", note: "早晚溫差變明顯，大家記得外套與身體照顧。" },
  { month: 9, day: 21, name: "國家防災日", note: "大家一起熟悉避難動線，安全感來自平常的練習。" },
  { month: 9, day: 23, name: "秋分", note: "學期進入穩定期，可以一起檢查學習習慣與目標。" },
  { month: 9, day: 28, name: "教師節", note: "今天適合把感謝說出來，也一起珍惜教室裡的陪伴。" },
  { month: 10, day: 6, name: "中秋節前後", note: "可以一起觀察月亮、分享節慶故事，也記得連假安排。" },
  { month: 10, day: 8, name: "寒露", note: "天氣轉涼，大家留意早晚溫差與衣物準備。" },
  { month: 10, day: 10, name: "國慶日", note: "近期留意連假、活動與班級行程調整。" },
  { month: 10, day: 24, name: "霜降", note: "秋意更深，適合一起收束任務與整理作品。" },
  { month: 10, day: 25, name: "臺灣光復節", note: "可以依課程進度一起認識歷史與在地故事。" },
  { month: 10, day: 31, name: "萬聖節", note: "今天適合用英語、閱讀或創意活動讓教室更有趣。" },
  { month: 11, day: 7, name: "立冬", note: "冬季開始，大家一起留意保暖、健康與作息。" },
  { month: 11, day: 12, name: "國父誕辰紀念日", note: "可以搭配課程一起討論人物、時代與公共生活。" },
  { month: 11, day: 22, name: "小雪", note: "天氣逐漸轉冷，運動後記得擦汗與保暖。" },
  { month: 12, day: 7, name: "大雪", note: "期末前適合一起檢查作品、作業與學習檔案。" },
  { month: 12, day: 21, name: "冬至", note: "今天可以一起認識節氣與家庭文化，讓學期慢慢收束。" },
  { month: 12, day: 25, name: "聖誕節", note: "適合交換祝福、整理成果，也把善意留在教室裡。" },
  { month: 12, day: 31, name: "跨年", note: "適合一起回顧這一年的成長、作品與值得感謝的人。" }
];

const weekdayNotes = [
  "星期日：適合慢慢收心，準備明天的課本、水壺和心情。",
  "星期一：本週啟動，大家先確認目標、課表與重要任務。",
  "星期二：適合穩定推進，把昨天未完成的小事補齊。",
  "星期三：一週中點，大家可以做一次小檢核，確認自己走到哪裡。",
  "星期四：適合收束作品與作業，提早處理零碎待辦。",
  "星期五：整理日，大家帶著清楚的任務和輕一點的心情回家。",
  "星期六：休息也算進度，留一點時間閱讀、運動和充電。"
];

function updateReminder() {
  const holidayName = document.getElementById("holidayName");
  const holidayCountdown = document.getElementById("holidayCountdown");
  const dailyNote = document.getElementById("dailyNote");

  if (!holidayName || !holidayCountdown || !dailyNote) return;

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const candidates = reminders
    .map((item) => {
      let date = new Date(now.getFullYear(), item.month - 1, item.day);
      if (date < todayStart) date = new Date(now.getFullYear() + 1, item.month - 1, item.day);
      return { ...item, date, days: Math.round((date - todayStart) / 86400000) };
    })
    .sort((a, b) => a.days - b.days);

  const next = candidates[0];
  holidayName.textContent = next.name;
  holidayCountdown.textContent = next.days === 0 ? "就是今天" : `還有 ${next.days} 天`;
  dailyNote.textContent = `${weekdayNotes[now.getDay()]} ${next.note}`;
}

const toast = document.getElementById("toast");
let toastTimer;

function showToast(message = "這個區塊尚未啟用，之後可以接上正式頁面。") {
  if (!toast) return;
  toast.textContent = message;
  clearTimeout(toastTimer);
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1900);
}

function iconSvg(name) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">${icons[name] || icons.apps}</svg>`;
}

function widgetTemplate(widget) {
  const normalized = normalizeWidget(widget);
  const enabled = normalized.enabled && normalized.href;
  const href = enabled ? normalized.href : "#";
  return `
    <a class="widget ${normalized.color || "blue"}" href="${href}" ${enabled ? "" : 'data-placeholder="true"'}>
      <div class="widget-top">
        <span class="widget-icon">${iconSvg(normalized.icon)}</span>
        <span class="tag">${normalized.tag || "Widget"}</span>
      </div>
      <h3>${normalized.title || "未命名 Widget"}</h3>
      <p>${normalized.description || "這個區塊尚未填寫說明。"}</p>
      <span class="widget-footer">進入區塊<span class="arrow">${iconSvg("arrow")}</span></span>
    </a>
  `;
}

icons.arrow = '<path d="M5 12h14" /><path d="m12 5 7 7-7 7" />';

function renderWidgets(widgets) {
  const grid = document.querySelector(".widget-grid");
  if (!grid) return;
  grid.innerHTML = widgets
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
    .map(widgetTemplate)
    .join("");

  grid.querySelectorAll("[data-placeholder='true']").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showToast();
    });
  });
}

async function loadWidgets() {
  renderWidgets(defaultWidgets);

  if (!hasFirebaseConfig()) {
    showToast("尚未貼上 Firebase 設定，目前使用預設首頁。");
    return;
  }

  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    await loadHomeSettings(db);
    const snapshot = await getDocs(query(collection(db, "widgets"), orderBy("order", "asc")));
    const widgets = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    if (widgets.length > 0) {
      renderWidgets(widgets);
    }
  } catch (error) {
    console.error(error);
    showToast("Firebase 讀取失敗，目前使用預設首頁。");
  }
}

function renderHomeSettings(settings = defaultHomeSettings) {
  const heroEyebrow = document.getElementById("heroEyebrow");
  const heroHeadline = document.getElementById("site-title");
  const heroIntro = document.getElementById("heroIntro");

  if (heroEyebrow) heroEyebrow.textContent = settings.eyebrow || defaultHomeSettings.eyebrow;
  if (heroHeadline) heroHeadline.textContent = settings.headline || defaultHomeSettings.headline;
  if (heroIntro) heroIntro.textContent = settings.intro || defaultHomeSettings.intro;
}

async function loadHomeSettings(db) {
  const settingsDoc = await getDoc(doc(db, "siteSettings", "home"));
  if (settingsDoc.exists()) {
    renderHomeSettings(settingsDoc.data());
  }
}

document.querySelectorAll("[data-placeholder='true']").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showToast();
  });
});

loadWidgets();
renderHomeSettings();
updateClock();
updateReminder();
loadWeather();
setInterval(updateClock, 1000);
