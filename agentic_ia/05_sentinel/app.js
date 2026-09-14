const elements = {
  form: document.querySelector("#repository-form"),
  repository: document.querySelector("#repository"),
  status: document.querySelector("#status-message"),
  issues: document.querySelector("#issues-container"),
  search: document.querySelector("#search-input"),
  state: document.querySelector("#state-filter"),
  sort: document.querySelector("#sort-select"),
  updated: document.querySelector("#last-updated"),
  total: document.querySelector("#total-count"),
  open: document.querySelector("#open-count"),
  closed: document.querySelector("#closed-count"),
  authors: document.querySelector("#author-count"),
};

const injectedIssues = [
  { number: 335702, title: "Instal problem", state: "open", author: "PURIDgo", url: "https://github.com/microsoft/vscode/issues/335702", labels: ["info-needed", "new release"], created_at: "2026-09-11T11:59:56Z" },
  { number: 335701, title: "Multi diff editor: Empty spaces appear", state: "open", author: "hediet", url: "https://github.com/microsoft/vscode/issues/335701", labels: ["bug", "multi-diff-editor"], created_at: "2026-09-11T11:57:19Z" },
  { number: 335700, title: "Align Source Control resource decorations", state: "open", author: "mrleemurray", url: "https://github.com/microsoft/vscode/pull/335700", labels: [], created_at: "2026-09-11T11:49:44Z" },
  { number: 335699, title: "Align comment author and timestamp labels", state: "open", author: "mrleemurray", url: "https://github.com/microsoft/vscode/pull/335699", labels: [], created_at: "2026-09-11T11:49:08Z" },
  { number: 335698, title: "Use crisp icons in chat thinking blocks", state: "open", author: "mrleemurray", url: "https://github.com/microsoft/vscode/pull/335698", labels: [], created_at: "2026-09-11T11:49:08Z" },
  { number: 335697, title: "Differentiate terminal bright colors in light themes", state: "open", author: "mrleemurray", url: "https://github.com/microsoft/vscode/pull/335697", labels: [], created_at: "2026-09-11T11:49:08Z" },
  { number: 335696, title: "Test component fixture token palette restoration", state: "open", author: "hediet", url: "https://github.com/microsoft/vscode/pull/335696", labels: [], created_at: "2026-09-11T11:48:33Z" },
  { number: 335694, title: "Make focus visible on checked toggle buttons", state: "open", author: "mrleemurray", url: "https://github.com/microsoft/vscode/pull/335694", labels: [], created_at: "2026-09-11T11:41:46Z" },
  { number: 335693, title: 'Feature Request: Add "Reopen Closed Terminal" command (like Ctrl+Shift+T in web browsers)', state: "open", author: "Fahad090NP", url: "https://github.com/microsoft/vscode/issues/335693", labels: [], created_at: "2026-09-11T11:34:15Z" },
  { number: 335692, title: "Automations not having a workspace pre-selected leads to confusing interactions", state: "open", author: "benibenj", url: "https://github.com/microsoft/vscode/issues/335692", labels: ["papercut :drop_of_blood:"], created_at: "2026-09-11T10:57:56Z" },
  { number: 335691, title: 'Add a command to focus and expand the Chat “Files changed” list', state: "open", author: "armgilles", url: "https://github.com/microsoft/vscode/issues/335691", labels: ["triage-needed"], created_at: "2026-09-11T10:47:41Z" },
  { number: 335690, title: "mcp migration, various issues", state: "open", author: "aeschli", url: "https://github.com/microsoft/vscode/issues/335690", labels: [], created_at: "2026-09-11T10:38:13Z" },
  { number: 335688, title: "/btw message is too transparent", state: "open", author: "ulugbekna", url: "https://github.com/microsoft/vscode/issues/335688", labels: [], created_at: "2026-09-11T10:26:18Z" },
  { number: 335687, title: "Agent Host downloads Claude SDK 0.3.239 / Claude Code 2.1.239, but Fable 5.1 requires >= 2.1.251", state: "open", author: "hoshimoe", url: "https://github.com/microsoft/vscode/issues/335687", labels: [], created_at: "2026-09-11T10:26:07Z" },
  { number: 335686, title: "`automation.created` telemetry does't include how it was created", state: "open", author: "benibenj", url: "https://github.com/microsoft/vscode/issues/335686", labels: [], created_at: "2026-09-11T10:26:07Z" },
  { number: 335684, title: 'Right clicking on background within a session should have "set background option"', state: "open", author: "ulugbekna", url: "https://github.com/microsoft/vscode/issues/335684", labels: [], created_at: "2026-09-11T10:23:13Z" },
  { number: 335683, title: "MCP configuration: Show where the server was configured", state: "open", author: "aeschli", url: "https://github.com/microsoft/vscode/issues/335683", labels: [], created_at: "2026-09-11T10:23:03Z" },
  { number: 335681, title: "Add ability to pin folders in the Project Explorer", state: "open", author: "sagartec", url: "https://github.com/microsoft/vscode/issues/335681", labels: [], created_at: "2026-09-11T10:16:45Z" },
  { number: 335680, title: "Document does not refresh in Markdown Editor", state: "open", author: "Neptilo", url: "https://github.com/microsoft/vscode/issues/335680", labels: ["triage-needed", "new release"], created_at: "2026-09-11T10:16:43Z" },
  { number: 335679, title: "Partly scrolled away messages feel unnatural with chat image background in Agents", state: "open", author: "ulugbekna", url: "https://github.com/microsoft/vscode/issues/335679", labels: [], created_at: "2026-09-11T10:15:32Z" },
  { number: 335678, title: "Opening an automations file should show an action to import/add the automation", state: "open", author: "benibenj", url: "https://github.com/microsoft/vscode/issues/335678", labels: [], created_at: "2026-09-11T10:15:08Z" },
  { number: 335677, title: "Work from Repository: Early pasting into repo picker does not show Clone from URL", state: "open", author: "chrmarti", url: "https://github.com/microsoft/vscode/issues/335677", labels: [], created_at: "2026-09-11T10:09:10Z" },
  { number: 335676, title: "Accepting an automation template keeps it visible. Should it?", state: "open", author: "benibenj", url: "https://github.com/microsoft/vscode/issues/335676", labels: [], created_at: "2026-09-11T10:08:33Z" },
  { number: 335675, title: 'Automations overflow menu hover should be just "More Actions..."', state: "open", author: "benibenj", url: "https://github.com/microsoft/vscode/issues/335675", labels: [], created_at: "2026-09-11T10:01:29Z" },
  { number: 335673, title: "Unable to DnD import multiple automations", state: "open", author: "benibenj", url: "https://github.com/microsoft/vscode/issues/335673", labels: [], created_at: "2026-09-11T09:59:23Z" },
  { number: 335672, title: "Folder picker resurfaces deleted folder", state: "open", author: "chrmarti", url: "https://github.com/microsoft/vscode/issues/335672", labels: [], created_at: "2026-09-11T09:49:07Z" },
  { number: 335671, title: "Automations DnD: No hover feedback", state: "open", author: "benibenj", url: "https://github.com/microsoft/vscode/issues/335671", labels: [], created_at: "2026-09-11T09:48:15Z" },
  { number: 335670, title: 'Got a duplicated output on the next message after a "Try again"', state: "open", author: "alexr00", url: "https://github.com/microsoft/vscode/issues/335670", labels: [], created_at: "2026-09-11T09:45:27Z" },
  { number: 335669, title: "Customization migrations - migration appears in progress", state: "open", author: "lszomoru", url: "https://github.com/microsoft/vscode/issues/335669", labels: [], created_at: "2026-09-11T09:45:25Z" },
  { number: 335668, title: "Automations are disabled by default when imported", state: "open", author: "benibenj", url: "https://github.com/microsoft/vscode/issues/335668", labels: [], created_at: "2026-09-11T09:44:37Z" },
];

let issues = injectedIssues;

function showMessage(message, type = "error") {
  elements.status.textContent = message;
  elements.status.className = `status-message ${type}`;
  elements.status.hidden = false;
}

function clearMessage() {
  elements.status.hidden = true;
  elements.status.textContent = "";
}

function updateMetrics(items) {
  elements.total.textContent = items.length;
  elements.open.textContent = items.filter((issue) => issue.state === "open").length;
  elements.closed.textContent = items.filter((issue) => issue.state === "closed").length;
  elements.authors.textContent = new Set(items.map((issue) => issue.author).filter(Boolean)).size;
}

function formatDate(date) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(date));
}

function initials(author) {
  return author.slice(0, 2).toUpperCase();
}

function issueTemplate(issue) {
  const labels = issue.labels.slice(0, 4).map((label) => `<span class="label">${escapeHtml(label)}</span>`).join("");
  return `<article class="issue-row">
    <span class="issue-number">#${issue.number}</span>
    <a class="issue-title" href="${escapeAttribute(issue.url)}" target="_blank" rel="noopener">${escapeHtml(issue.title)}</a>
    <div class="issue-meta"><span class="avatar" aria-hidden="true">${escapeHtml(initials(issue.author))}</span><span class="issue-author">${escapeHtml(issue.author)}</span><span>·</span><span>${formatDate(issue.created_at)}</span></div>
    <span class="issue-state ${issue.state === "closed" ? "closed" : ""}">${issue.state === "open" ? "Ouverte" : "Fermée"}</span>
    ${labels ? `<div class="labels">${labels}</div>` : ""}
  </article>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/javascript:/gi, "");
}

function renderIssues() {
  const query = elements.search.value.trim().toLowerCase();
  const state = elements.state.value;
  const sort = elements.sort.value;
  const visibleIssues = issues.filter((issue) => {
    const matchesState = state === "all" || issue.state === state;
    const searchable = `${issue.title} ${issue.author} ${issue.labels.join(" ")}`.toLowerCase();
    return matchesState && searchable.includes(query);
  }).sort((first, second) => {
    if (sort === "oldest") return new Date(first.created_at) - new Date(second.created_at);
    if (sort === "number") return second.number - first.number;
    return new Date(second.created_at) - new Date(first.created_at);
  });
  updateMetrics(visibleIssues);
  elements.issues.innerHTML = visibleIssues.length
    ? visibleIssues.map(issueTemplate).join("")
    : '<div class="empty-state">Aucune issue ne correspond à ces critères.</div>';
}

function loadRepository(repository) {
  clearMessage();
  issues = injectedIssues;
  renderIssues();
  elements.updated.textContent = "Données MCP injectées";
  showMessage(`${issues.length} éléments issus de fetchgithubissues pour ${repository}.`, "success");
}

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  loadRepository(elements.repository.value);
});
[elements.search, elements.state, elements.sort].forEach((element) => element.addEventListener("input", renderIssues));

loadRepository(elements.repository.value);