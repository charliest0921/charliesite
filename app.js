import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  orderBy,
  query
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";
import { firebaseConfig, hasFirebaseConfig } from "./firebase-config.js";

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
    enabled: false,
    order: 2
  },
  {
    title: "班經小工具",
    description: "時鐘、碼表、計時、分組、抽籤、作業點交等工具入口。",
    href: "class-tools.html",
    color: "green",
    tag: "Tools",
    icon: "tools",
    enabled: false,
    order: 3
  },
  {
    title: "課程應用程式",
    description: "依不同主題、單元與課程活動設計的互動應用入口。",
    href: "course-apps.html",
    color: "amber",
    tag: "Apps",
    icon: "apps",
    enabled: false,
    order: 4
  },
  {
    title: "互動區",
    description: "未來可放留言板、回饋表單、班級投票與作品交流。",
    href: "interactive.html",
    color: "rose",
    tag: "Community",
    icon: "message",
    enabled: false,
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

const formatter = new Intl.DateTimeFormat("zh-Hant-TW", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long"
});

const today = document.getElementById("today");
if (today) {
  today.textContent = formatter.format(new Date());
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
  const enabled = widget.enabled && widget.href;
  const href = enabled ? widget.href : "#";
  return `
    <a class="widget ${widget.color || "blue"}" href="${href}" ${enabled ? "" : 'data-placeholder="true"'}>
      <div class="widget-top">
        <span class="widget-icon">${iconSvg(widget.icon)}</span>
        <span class="tag">${widget.tag || "Widget"}</span>
      </div>
      <h3>${widget.title || "未命名 Widget"}</h3>
      <p>${widget.description || "這個區塊尚未填寫說明。"}</p>
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

document.querySelectorAll("[data-placeholder='true']").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showToast();
  });
});

loadWidgets();
