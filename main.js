// 1. Elementen selecteren en variabelen
const titleInput = document.getElementById("titleInput");
const colorPicker = document.getElementById("colorPicker");
const eraserBtn = document.getElementById("eraserBtn");
const clearBtn = document.getElementById("clearBtn");
const gridSizeEl = document.getElementById("gridSize");
const downloadBtn = document.getElementById("downloadBtn");
const canvas = document.getElementById("canvas");

let currentColor = colorPicker.value;
let eraserActive = false;

// 2. Raster-maker functie
function createGrid(size) {
  canvas.innerHTML = "";
  canvas.style.gridTemplateColumns = `repeat(${size}, 20px)`;
  canvas.style.gridTemplateRows = `repeat(${size}, 20px)`;
  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div");
    cell.classList.add("pixel");
    canvas.appendChild(cell);
  }
}

// Init met 16×16
createGrid(16);

// 3. Event-listeners
// 3.1 Kleurkiezer
colorPicker.addEventListener("input", (e) => {
  currentColor = e.target.value;
  eraserActive = false;
  eraserBtn.classList.remove("active");
});

// 3.2 Gum-knop
eraserBtn.addEventListener("click", () => {
  eraserActive = !eraserActive;
  eraserBtn.classList.toggle("active");
});

// 3.3 Canvas klik (tekenen én gummen in één handler)
canvas.addEventListener("click", (e) => {
  if (!e.target.classList.contains("pixel")) return;
  if (eraserActive) {
    e.target.style.background = "#fff";
  } else {
    e.target.style.background = currentColor;
  }
});

// 3.4 Alles leegmaken
clearBtn.addEventListener("click", () => {
  document
    .querySelectorAll(".pixel")
    .forEach((p) => (p.style.background = "#fff"));
});

// 3.5 Grid-grootte veranderen
gridSizeEl.addEventListener("change", (e) => {
  createGrid(parseInt(e.target.value, 10));
});

// 3.6 Download knop
downloadBtn.addEventListener("click", () => {
  const px = 20;
  const size = parseInt(gridSizeEl.value, 10);

  // teken op tijdelijk canvas
  const tempCanvas = document.createElement("canvas");
  const ctx = tempCanvas.getContext("2d");
  tempCanvas.width = size * px;
  tempCanvas.height = size * px;

  document.querySelectorAll(".pixel").forEach((div, idx) => {
    const x = (idx % size) * px;
    const y = Math.floor(idx / size) * px;
    ctx.fillStyle = div.style.background || "#fff";
    ctx.fillRect(x, y, px, px);
  });

  // bestandsnaam met title + timestamp
  const title = titleInput.value.trim() || "pixel-art";
  const timestamp = Date.now();
  const filename = `${title}_${timestamp}.png`;

  tempCanvas.toBlob((blob) => {
    const link = document.createElement("a");
    link.download = filename;
    link.href = URL.createObjectURL(blob);
    link.click();
  });
});
