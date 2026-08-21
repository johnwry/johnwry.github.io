function goToRef() {
  let input = document.getElementById("refInput").value.toLowerCase().trim();

  // --- normalize accents ---
  input = input.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // --- BOOK MAP (NT FULL) ---
  const books = {
    // Evangelios
    "mateo": "mat", "mt": "mat",
    "marcos": "mrk", "mc": "mrk",
    "lucas": "luk", "lc": "luk",
    "juan": "jhn", "jn": "jhn",

    // Hechos
    "hechos": "act", "act": "act",

    // Pablo
    "romanos": "rom", "rom": "rom",
    "1 corintios": "1co", "1co": "1co", "1 cor": "1co",
    "2 corintios": "2co", "2co": "2co", "2 cor": "2co",
    "galatas": "gal", "gal": "gal",
    "efesios": "eph", "ef": "eph",
    "filipenses": "php", "fil": "php",
    "colosenses": "col", "col": "col",
    "1 tesalonicenses": "1th", "1th": "1th",
    "2 tesalonicenses": "2th", "2th": "2th",
    "1 timoteo": "1ti", "1ti": "1ti",
    "2 timoteo": "2ti", "2ti": "2ti",
    "tito": "tit", "tit": "tit",
    "filemon": "phm", "flm": "phm",

    // Generales
    "hebreos": "heb", "heb": "heb",
    "santiago": "jas", "stg": "jas",
    "1 pedro": "1pe", "1pe": "1pe",
    "2 pedro": "2pe", "2pe": "2pe",
    "1 juan": "1jn", "1jn": "1jn",
    "2 juan": "2jn", "2jn": "2jn",
    "3 juan": "3jn", "3jn": "3jn",
    "judas": "jud", "jud": "jud",

    // Apocalipsis
    "apocalipsis": "rev", "ap": "rev"
  };

  // --- detect book ---
  let bookCode = null;

  for (let key in books) {
    if (input.startsWith(key)) {
      bookCode = books[key];
      input = input.replace(key, "").trim();
      break;
    }
  }

  // --- fallback: current page book ---
  if (!bookCode) {
    const path = window.location.pathname;
    if (path.includes("tito")) bookCode = "tit";
    if (path.includes("galatas")) bookCode = "gal";
    if (path.includes("romanos")) bookCode = "rom";
  }

  // --- extract chapter:verse ---
  const match = input.match(/(\d+):(\d+)/);

  if (!match || !bookCode) {
    alert("Referencia inválida");
    return;
  }

  const chapter = match[1];
  const verse = match[2];

  const id = `${bookCode}-${chapter}-${verse}`;
  const el = document.getElementById(id);

  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
    location.hash = id;
  } else {
    alert("Versículo no encontrado");
  }
}