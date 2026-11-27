/**
 * 功能入口配置。
 * - href: 有值则跳转；为空则仅展示入口（如门禁）
 * - external: 外链时新开标签页
 *
 * 后续若改子域名，只需改 href，例如：
 *   https://ai.sihaoran.cn
 */
const APPS = [
  {
    id: "ai",
    title: "大模型对话",
    desc: "个人 AI 对话入口，后续可接入自建模型服务。",
    href: "/ai",
    action: "进入",
  },
  {
    id: "access",
    title: "门禁系统",
    desc: "门禁管理与通行能力，入口已预留，系统接入后开放跳转。",
    href: "",
    action: "即将开放",
  },
  {
    id: "solar",
    title: "光伏系统",
    desc: "光伏运维与管理后台。",
    href: "https://admin.sunpowerglobal.com/op#/user/login",
    external: true,
    action: "进入",
  },
];

function renderApps() {
  const list = document.getElementById("app-list");
  if (!list) return;

  list.innerHTML = APPS.map((app) => {
    const disabled = !app.href;
    const action = app.action || (disabled ? "即将开放" : "进入");
    const inner = `
      <div class="app-meta">
        <h3 class="app-title">${escapeHtml(app.title)}</h3>
        <p class="app-desc">${escapeHtml(app.desc)}</p>
      </div>
      <span class="app-action">${escapeHtml(action)}</span>
    `;

    if (disabled) {
      return `<div class="app-item is-disabled reveal" role="listitem">${inner}</div>`;
    }

    const target = app.external ? ' target="_blank" rel="noopener noreferrer"' : "";
    return `<a class="app-item reveal" role="listitem" href="${escapeAttr(app.href)}"${target}>${inner}</a>`;
  }).join("");
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

function observeReveals() {
  const nodes = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    nodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );

  nodes.forEach((node) => observer.observe(node));
}

document.getElementById("year").textContent = String(new Date().getFullYear());
renderApps();
observeReveals();
