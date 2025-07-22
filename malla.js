const mallaData = [
  { id: "mat101", nombre: "Matemáticas I", prer: [] },
  { id: "fis101", nombre: "Física I", prer: ["mat101"] },
  // → Agrega aquí todos tus ramos, con su campo "prer": [...]
];

document.addEventListener("DOMContentLoaded", () => {
  const cont = document.getElementById("malla");
  const progreso = JSON.parse(localStorage.getItem("progresoMalla")) || {};

  mallaData.forEach(r => {
    const div = document.createElement("div");
    div.className = "ramo locked";
    div.dataset.id = r.id;
    if (r.prer.length === 0) div.classList.remove("locked");
    div.innerHTML = `<div>${r.nombre}</div>`;
    cont.appendChild(div);
  });

  // Aplicar progreso guardado
  Object.entries(progreso).forEach(([id, nota]) => {
    const div = document.querySelector(`.ramo[data-id="${id}"]`);
    if (div) marcarRamo(div, nota);
  });
  actualizarDesbloqueos();

  cont.addEventListener("click", e => {
    const div = e.target.closest(".ramo");
    if (!div || div.classList.contains("locked")) return;
    const id = div.dataset.id;
    if (div.classList.contains("done")) {
      borrarRamo(div, id);
    } else {
      const nota = prompt("Ingresa tu promedio para este ramo:");
      if (!nota) return;
      marcarRamo(div, nota);
    }
    localStorage.setItem("progresoMalla", JSON.stringify(progreso));
    actualizarDesbloqueos();
  });

  function marcarRamo(div, nota) {
    div.classList.add("done");
    div.classList.remove("locked");
    let sp = div.querySelector(".nota");
    if (!sp) {
      sp = document.createElement("span");
      sp.className = "nota";
      div.appendChild(sp);
    }
    sp.textContent = nota;
    progreso[div.dataset.id] = nota;
  }

  function borrarRamo(div, id) {
    div.classList.remove("done");
    delete progreso[id];
    const sp = div.querySelector(".nota");
    if (sp) sp.remove();
  }

  function actualizarDesbloqueos() {
    document.querySelectorAll(".ramo").forEach(div => {
      const id = div.dataset.id;
      const reqs = mallaData.find(r => r.id === id).prer;
      const ok = reqs.every(pr => progreso[pr] !== undefined);
      if (reqs.length > 0) div.classList.toggle("locked", !ok);
    });
  }
});
