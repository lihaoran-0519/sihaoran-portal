const LANG_KEY = "sihaoran.lang";

const I18N = {
  zh: {
    pageTitle: "haoran · 个人平台",
    metaDescription: "haoran 个人平台门户 — 大模型对话、门禁、光伏等功能的统一入口",
    heroTitle: "工具与系统的统一入口。",
    appsAria: "功能入口",
    aboutTitle: "关于",
    aboutParagraphs: [
      "你好，这里是我的个人平台门户。我会围绕自己的兴趣和业务能力，做一些网站与系统。",
      "包括但不限于：大模型知识库、门禁出入平台、光伏系统、日常小工具等等。",
      "当然可能最后什么都没做成。不管怎样，先努力去做吧。",
    ],
    icp: "ICP 备案号待补充",
    enter: "进入",
    soon: "即将开放",
    ready: "可用",
    navToggleAria: "打开导航",
    navOverview: "总览",
    apps: {
      ai: {
        title: "模型对话",
        desc: "个人 AI 对话入口。",
      },
      access: {
        title: "门禁系统",
        desc: "门禁管理，接入后开放。",
      },
      solar: {
        title: "光伏系统",
        desc: "光伏运维与管理，接入后开放。",
      },
    },
  },
  en: {
    pageTitle: "haoran · Personal Platform",
    metaDescription:
      "haoran personal platform portal — unified entry for AI chat, access control, and solar systems",
    heroTitle: "A unified entry for tools and systems.",
    appsAria: "Apps",
    aboutTitle: "About",
    aboutParagraphs: [
      "Hi — this is my personal platform portal. I'll build sites and systems around my interests and skills.",
      "Including but not limited to: LLM knowledge bases, access control platforms, solar systems, everyday tools, and more.",
      "Maybe none of it ships in the end. Either way, I'll start by doing the work.",
    ],
    icp: "ICP filing number pending",
    enter: "Enter",
    soon: "Coming soon",
    ready: "Available",
    navToggleAria: "Open navigation",
    navOverview: "Overview",
    apps: {
      ai: {
        title: "AI Chat",
        desc: "Personal AI conversation entry.",
      },
      access: {
        title: "Access Control",
        desc: "Access management — opening after integration.",
      },
      solar: {
        title: "Solar System",
        desc: "Solar ops and admin — opening after integration.",
      },
    },
  },
};

const APP_DEFS = [
  { id: "ai", href: "/ai" },
  { id: "access", href: "" },
  { id: "solar", href: "" },
];

function detectLang() {
  const saved = localStorage.getItem(LANG_KEY);
  if (saved === "zh" || saved === "en") return saved;
  return navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
}

function t(lang) {
  return I18N[lang] || I18N.zh;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll("'", "&#39;");
}

function renderApps(lang) {
  const copy = t(lang);
  const list = document.getElementById("app-list");
  if (!list) return;

  list.innerHTML = APP_DEFS.map((app) => {
    const item = copy.apps[app.id];
    const disabled = !app.href;
    const badge = disabled ? copy.soon : copy.ready;
    const action = disabled ? copy.soon : copy.enter;
    const badgeClass = disabled ? "is-soon" : "is-ready";
    const inner = `
      <div class="app-meta">
        <div class="app-title-row">
          <h2 class="app-title">${escapeHtml(item.title)}</h2>
          <span class="app-badge ${badgeClass}">${escapeHtml(badge)}</span>
        </div>
        <p class="app-desc">${escapeHtml(item.desc)}</p>
      </div>
      <span class="app-action">${escapeHtml(action)}</span>
    `;

    if (disabled) {
      return `<div class="app-item is-disabled" id="app-${app.id}" role="listitem">${inner}</div>`;
    }

    return `<a class="app-item" id="app-${app.id}" role="listitem" href="${escapeAttr(app.href)}">${inner}</a>`;
  }).join("");
}

function renderSideLinks(lang) {
  const copy = t(lang);
  const wrap = document.getElementById("side-app-links");
  if (!wrap) return;

  wrap.innerHTML = APP_DEFS.map((app) => {
    const item = copy.apps[app.id];
    const disabled = !app.href;
    const href = disabled ? `#app-${app.id}` : escapeAttr(app.href);
    const cls = disabled ? "side-link is-soon" : "side-link";
    return `<a class="${cls}" href="${href}" data-nav="app-${app.id}">${escapeHtml(item.title)}</a>`;
  }).join("");
}

function renderAbout(lang) {
  const copy = t(lang);
  const body = document.getElementById("about-body");
  if (!body) return;

  body.innerHTML = (copy.aboutParagraphs || [])
    .map((paragraph, index) => {
      const cls = index === (copy.aboutParagraphs.length - 1) ? "about-text about-closing" : "about-text";
      return `<p class="${cls}">${escapeHtml(paragraph)}</p>`;
    })
    .join("");
}

function applyStaticCopy(lang) {
  const copy = t(lang);

  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  document.title = copy.pageTitle;

  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", copy.metaDescription);

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (key && copy[key] != null) el.textContent = copy[key];
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria");
    if (key && copy[key] != null) el.setAttribute("aria-label", copy[key]);
  });

  renderAbout(lang);
}

function syncLangButtons(lang) {
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    const active = btn.getAttribute("data-lang") === lang;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

function setActiveNav(navId) {
  document.querySelectorAll(".side-link").forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("data-nav") === navId);
  });
}

function closeMobileNav() {
  document.body.classList.remove("nav-open");
  const toggle = document.getElementById("nav-toggle");
  const backdrop = document.getElementById("sidebar-backdrop");
  if (toggle) toggle.setAttribute("aria-expanded", "false");
  if (backdrop) backdrop.hidden = true;
}

function openMobileNav() {
  document.body.classList.add("nav-open");
  const toggle = document.getElementById("nav-toggle");
  const backdrop = document.getElementById("sidebar-backdrop");
  if (toggle) toggle.setAttribute("aria-expanded", "true");
  if (backdrop) backdrop.hidden = false;
}

function initNav() {
  const toggle = document.getElementById("nav-toggle");
  const backdrop = document.getElementById("sidebar-backdrop");

  toggle?.addEventListener("click", () => {
    if (document.body.classList.contains("nav-open")) closeMobileNav();
    else openMobileNav();
  });

  backdrop?.addEventListener("click", closeMobileNav);

  document.addEventListener("click", (event) => {
    const link = event.target.closest(".side-link");
    if (!link) return;

    const href = link.getAttribute("href") || "";
    const navId = link.getAttribute("data-nav");

    if (href.startsWith("#")) {
      setActiveNav(navId);
      closeMobileNav();
      return;
    }

    // external/module path: keep default navigation
    closeMobileNav();
  });

  const hash = location.hash.replace("#", "");
  if (hash === "about") setActiveNav("about");
  else if (hash.startsWith("app-")) setActiveNav(hash);
  else setActiveNav("overview");
}

function setLang(lang) {
  const next = lang === "en" ? "en" : "zh";
  const current =
    document.querySelector(".side-link.is-active")?.getAttribute("data-nav") || "overview";
  localStorage.setItem(LANG_KEY, next);
  applyStaticCopy(next);
  renderApps(next);
  renderSideLinks(next);
  syncLangButtons(next);
  setActiveNav(current);
}

function initLangSwitch() {
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      setLang(btn.getAttribute("data-lang"));
    });
  });
}

document.getElementById("year").textContent = String(new Date().getFullYear());
initLangSwitch();
initNav();
setLang(detectLang());
