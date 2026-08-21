(() => {
  const input = document.querySelector("#archive-search");
  if (!input) return;
  const list = document.querySelector("#search-results-list");
  const count = document.querySelector("#result-count");
  const empty = document.querySelector("#search-empty");
  const collectionBox = document.querySelector("#collection-filters");
  const yearSelect = document.querySelector("#year-filter");
  const sortSelect = document.querySelector("#sort-filter");
  const activeFilters = document.querySelector("#active-filters");
  const clearButton = document.querySelector("#clear-search");
  const state = { documents: [], collections: new Set(), year: "", query: "", sort: "relevance" };
  const normalize = (value = "") => value.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const escapeHtml = (value = "") => value.replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
  const cleanText = (value = "") => value.replace(/\s+/g, " ").trim();
  const termsFor = (query) => {
    const phrases = [...query.matchAll(/"([^"]+)"/g)].map((match) => normalize(match[1]));
    const words = normalize(query.replace(/"[^"]+"/g, " ")).split(/[^a-z0-9ñáéíóúü:.-]+/).filter((term) => term.length > 1);
    return [...phrases, ...words];
  };
  function prepare(document) {
    const tags = Array.isArray(document.tags) ? document.tags : document.tags ? [document.tags] : [];
    const categories = Array.isArray(document.categories) ? document.categories : document.categories ? [document.categories] : [];
    const themes = Array.isArray(document.themes) ? document.themes : document.themes ? [document.themes] : [];
    const date = (document.date || document.rawDate || "").toString();
    const year = document.year || ((date.match(/(?:19|20)\d{2}/) || [""])[0]);
    const title = normalize(document.title);
    const metadata = normalize([document.book, document.passage, ...tags, ...categories, ...themes].join(" "));
    const body = normalize(document.content);
    return { ...document, date, year, tags, categories, themes, _title: title, _meta: metadata, _body: body, _all: `${title} ${metadata} ${body}` };
  }
  function score(document, terms) {
    if (!terms.length) return 1;
    let total = 0;
    for (const term of terms) {
      if (!document._all.includes(term)) return 0;
      if (document._title === term) total += 80;
      else if (document._title.includes(term)) total += 35;
      if (document._meta.includes(term)) total += 20;
      const first = document._body.indexOf(term);
      if (first >= 0) total += 8 + Math.max(0, 6 - first / 800);
      total += Math.min(8, document._body.split(term).length - 1);
    }
    const phrase = normalize(state.query.trim().replace(/^"|"$/g, ""));
    if (phrase.length > 4 && document._all.includes(phrase)) total += 25;
    return total;
  }
  function snippet(document, terms) {
    const source = cleanText(document.content || document.summary || "");
    if (!source) return "Sin resumen disponible.";
    const normalized = normalize(source);
    const positions = terms.map((term) => normalized.indexOf(term)).filter((position) => position >= 0);
    const center = positions.length ? Math.min(...positions) : 0;
    const start = Math.max(0, center - 90);
    const end = Math.min(source.length, start + 260);
    let text = `${start ? "…" : ""}${source.slice(start, end)}${end < source.length ? "…" : ""}`;
    text = escapeHtml(text);
    for (const term of terms.sort((a, b) => b.length - a.length)) {
      const safe = term.replace(/[.*+?^$()|[\]{}\\]/g, "\\$&");
      text = text.replace(new RegExp(`(${safe})`, "ig"), "<mark>$1</mark>");
    }
    return text;
  }
  function setUrl() {
    const params = new URLSearchParams();
    if (state.query) params.set("q", state.query);
    if (state.collections.size) params.set("collection", [...state.collections].join(","));
    if (state.year) params.set("year", state.year);
    if (state.sort !== "relevance") params.set("sort", state.sort);
    history.replaceState(null, "", `${location.pathname}${params.size ? `?${params}` : ""}`);
  }
  function renderFilters() {
    const collectionCounts = new Map();
    for (const document of state.documents) collectionCounts.set(document.collection, (collectionCounts.get(document.collection) || 0) + 1);
    collectionBox.innerHTML = [...collectionCounts.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([name, total]) => `<label><input type="checkbox" value="${escapeHtml(name)}" ${state.collections.has(name) ? "checked" : ""}><span>${escapeHtml(name)}</span><small>${total}</small></label>`).join("");
    collectionBox.querySelectorAll("input").forEach((checkbox) => checkbox.addEventListener("change", () => { checkbox.checked ? state.collections.add(checkbox.value) : state.collections.delete(checkbox.value); render(); }));
    const years = [...new Set(state.documents.map((item) => item.year).filter(Boolean))].sort().reverse();
    yearSelect.innerHTML = '<option value="">Todos los años</option>' + years.map((year) => `<option value="${year}" ${state.year === year ? "selected" : ""}>${year}</option>`).join("");
  }
  function render() {
    const terms = termsFor(state.query);
    let results = state.documents.map((document) => ({ document, relevance: score(document, terms) })).filter(({ document, relevance }) => relevance > 0 && (!state.collections.size || state.collections.has(document.collection)) && (!state.year || document.year === state.year));
    results.sort((a, b) => {
      if (state.sort === "newest") return (b.document.date || "").localeCompare(a.document.date || "");
      if (state.sort === "oldest") return (a.document.date || "9999").localeCompare(b.document.date || "9999");
      if (state.sort === "title") return a.document.title.localeCompare(b.document.title);
      return b.relevance - a.relevance || a.document.title.localeCompare(b.document.title);
    });
    count.textContent = `${results.length} ${results.length === 1 ? "resultado" : "resultados"}${state.query ? ` para “${state.query}”` : ""}`;
    empty.hidden = results.length > 0;
    list.innerHTML = results.slice(0, 120).map(({ document }) => `<article class="search-result"><a href="${document.url}"><div class="result-meta"><span>${escapeHtml(document.collection)}</span>${document.date ? `<time>${document.date}</time>` : ""}${document.book ? `<span>${escapeHtml(document.book)}</span>` : ""}</div><h2>${escapeHtml(document.title)}</h2><p>${snippet(document, terms)}</p>${document.tags.length ? `<div class="tag-row">${document.tags.slice(0, 4).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>` : ""}</a></article>`).join("");
    activeFilters.innerHTML = [...state.collections].map((item) => `<button type="button" data-collection="${escapeHtml(item)}">${escapeHtml(item)} ×</button>`).join("") + (state.year ? `<button type="button" data-year>${state.year} ×</button>` : "");
    activeFilters.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => { if (button.dataset.collection) state.collections.delete(button.dataset.collection); if (button.hasAttribute("data-year")) state.year = ""; renderFilters(); render(); }));
    setUrl();
  }
  const params = new URLSearchParams(location.search);
  state.query = params.get("q") || "";
  state.year = params.get("year") || "";
  state.sort = params.get("sort") || "relevance";
  (params.get("collection") || "").split(",").filter(Boolean).forEach((item) => state.collections.add(item));
  input.value = state.query; sortSelect.value = state.sort;
  let timer;
  input.addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(() => { state.query = input.value.trim(); render(); }, 120); });
  yearSelect.addEventListener("change", () => { state.year = yearSelect.value; render(); });
  sortSelect.addEventListener("change", () => { state.sort = sortSelect.value; render(); });
  clearButton.addEventListener("click", () => { state.query = ""; state.year = ""; state.sort = "relevance"; state.collections.clear(); input.value = ""; sortSelect.value = "relevance"; renderFilters(); render(); input.focus(); });
  fetch("/index.json").then((response) => { if (!response.ok) throw new Error("index"); return response.json(); }).then((documents) => { state.documents = documents.map(prepare); renderFilters(); render(); }).catch(() => { count.textContent = "No se pudo abrir el índice de búsqueda."; empty.hidden = false; });
})();

