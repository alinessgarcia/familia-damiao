const descendants = [
  {
    id: "nilton",
    name: "Nilton Damião",
    deceased: false,
    children: ["Gessia Damião", "Fernando Damião"],
    birthDate: "Não informado",
    ageText: "Não informada",
    mapUrl: "https://maps.app.goo.gl/QE4NE13MqZZyGQZj7"
  },
  {
    id: "samuel",
    name: "Samuel Damião",
    deceased: false,
    children: [],
    birthDate: "Não informado",
    ageText: "Não informada",
    mapUrl: "https://maps.app.goo.gl/QE4NE13MqZZyGQZj7"
  },
  { id: "ezequiel", name: "Ezequiel Damião", deceased: false, children: ["Felipe", "Leticia", "Gabriela"] },
  { id: "marcos", name: "Marcos Damião", deceased: false, children: ["Rafael", "Gabriel", "Érika"] },
  { id: "elias", name: "Elias Damião", deceased: true, children: [] },
  { id: "wilson", name: "Wilson Damião", deceased: true, children: [] },
  { id: "vanda", name: "Vanda Damião", deceased: false, children: [] },
  { id: "marcia", name: "Márcia Damião", deceased: false, children: ["Vitor Damião", "Ana Melia Damião"] },
  { id: "sonia", name: "Sônia Damião", deceased: false, children: ["Liliane"] },
  { id: "sara", name: "Sara Damião", deceased: false, children: ["Samantha"] },
  { id: "hilda", name: "Hilda Damião", deceased: true, children: ["Luís Fabiano", "Kelly", "Katia"] },
  {
    id: "terezinha",
    name: "Terezinha Candida Damião",
    deceased: true,
    children: [
      "Marcos Roberto Garcia",
      "Genessi Damião",
      "Karin Regina Garcia",
      "Milena Lopes Pacheco Garcia",
      "Daniel Lopes Garcia",
      "Carlos Henrique Garcia"
    ],
    photos: [
      "./assets/fotos/terezinha/terezinha-candida.jpg",
      "./assets/fotos/terezinha/terezinha-candida2.jpg",
      "./assets/fotos/terezinha/terezinha-candida3.jpg",
      "./assets/fotos/terezinha/terezinha-candida4.jpg"
    ]
  }
];

const childFamilies = {
  "Marcos Roberto Garcia": ["Leonardo Garcia", "João Marcos"],
  "Genessi Damião": ["Giovana Damião"],
  "Karin Regina Garcia": ["Nathalia", "Isabela", "Matheus", "Renato"],
  "Milena Lopes Pacheco Garcia": ["Julia", "Lucas"],
  "Daniel Lopes Garcia": ["Gustavo Garcia", "Chloé"],
  "Carlos Henrique Garcia": ["Samuel Henrique Oliveira Garcia", "Bianca Santos Silva Garcia"]
};

const registry = {
  "lamires": {
    title: "Lamires (†)",
    subtitle: "Bisavó — falecida em 1963",
    description: "Lamires é a geradora desta linhagem familiar. Pouco se sabe sobre sua vida até o momento — o nome foi preservado pela memória oral familiar. Faleceu em 1963."
  },
  "divino-catarina": {
    title: "Divino Damião (†) e Catarina (†)",
    subtitle: "Casal ancestral da família",
    description: "Ambos são falecidos e representam a origem principal desta árvore. Filhos de Lamires."
  },
  "vicente-amelia": {
    title: "Vicente Damião (†) e Amélia (†)",
    subtitle: "Casal central desta linhagem",
    description: "Ambos são falecidos. Clique em cada filho para abrir os netos em elementos clicáveis."
  },
  "jose-raimundo": {
    title: "José Raimundo Cândido (†)",
    subtitle: "Irmão de Amélia",
    description: "José Raimundo Cândido era irmão de Amélia. Sobrenome Cândido em investigação — pode indicar origem materna ou batismo católico pós-abolição."
  }
};

const familyChildrenByParent = new Map();
const modalHistory = [];

const childrenGrid = document.getElementById("children-grid");
const vicenteSiblings = document.getElementById("vicente-siblings");
const ameliaSiblings = document.getElementById("amelia-siblings");

const modal = document.getElementById("person-modal");
const closeModalButton = document.getElementById("close-modal");
const backModalButton = document.getElementById("back-modal");
const modalTitle = document.getElementById("modal-title");
const modalSubtitle = document.getElementById("modal-subtitle");
const modalContent = document.getElementById("modal-content");

function registerFamilyLink(parentName, children = []) {
  familyChildrenByParent.set(parentName, [...children]);
}

function buildFamilyIndexes() {
  descendants.forEach((person) => {
    registerFamilyLink(person.name, person.children);
  });

  Object.entries(childFamilies).forEach(([parentName, children]) => {
    registerFamilyLink(parentName, children);
  });
}

// Irmãos de Amélia já confirmados
const ameliaNamedSiblings = [
  { id: "jose-raimundo", label: "José Raimundo Cândido", sub: "Irmão confirmado" }
];

// Irmãos de Vicente já confirmados
const vicenteNamedSiblings = [];

function createUnknownSiblingCards(container, sideLabel) {
  const isAmelia = sideLabel === "amelia";
  const namedSiblings = isAmelia ? ameliaNamedSiblings : vicenteNamedSiblings;
  const nameLabel = isAmelia ? "Amélia" : "Vicente";

  const cards = [];

  // Irmãos já confirmados
  namedSiblings.forEach(({ id, label, sub }) => {
    cards.push(`
      <button type="button" class="card small-card deceased" data-person="${id}">
        <span class="card-title">${label}</span>
        <span class="card-subtitle">${sub}</span>
      </button>
    `);
  });

  // Espaços para irmãos ainda não identificados
  const totalUnknown = 10 - namedSiblings.length;
  for (let i = 1; i <= totalUnknown; i += 1) {
    const uid = `${sideLabel}-unknown-${i}`;
    registry[uid] = {
      title: `Irmão(a) de ${nameLabel} ${i}`,
      subtitle: "Nome pendente de confirmação",
      description: "Espaço reservado para preencher o nome futuramente."
    };
    cards.push(`
      <button type="button" class="card small-card" data-person="${uid}">
        <span class="card-title">Irmão(a) [${i}]</span>
        <span class="card-subtitle">Desconhecido(a)</span>
      </button>
    `);
  }

  container.innerHTML = cards.join("");
}

function renderChildrenCards() {
  childrenGrid.innerHTML = descendants
    .map((person) => {
      const childrenCount = person.children.length;
      const countLabel = childrenCount ? `${childrenCount} filho(s)` : "Sem filhos";
      const deceasedClass = person.deceased ? "deceased" : "";

      registry[person.id] = {
        title: person.deceased ? `${person.name} (†)` : person.name,
        subtitle: "Filho(a) de Vicente e Amélia",
        description: "Clique nos elementos abaixo para abrir o detalhe dos descendentes.",
        children: person.children,
        parentName: person.name,
        birthDate: person.birthDate || "",
        ageText: person.ageText || "",
        mapUrl: person.mapUrl || "",
        photos: person.photos || []
      };

      return `
        <button type="button" class="card child-card ${deceasedClass}" data-person="${person.id}">
          <span class="card-title">${person.name}</span>
          <span class="card-subtitle">${countLabel}</span>
        </button>
      `;
    })
    .join("");
}

function buildPersonMeta(person) {
  const hasMeta = person.birthDate || person.ageText || person.mapUrl;
  if (!hasMeta) return "";

  const rows = [];
  if (person.birthDate) rows.push(`<p><strong>Nascimento:</strong> ${person.birthDate}</p>`);
  if (person.ageText) rows.push(`<p><strong>Idade:</strong> ${person.ageText}</p>`);
  if (person.mapUrl) {
    rows.push(`
      <a class="map-link" href="${person.mapUrl}" target="_blank" rel="noopener noreferrer">
        Ver endereço no Google Maps
      </a>
    `);
  }

  return `<div class="person-meta">${rows.join("")}</div>`;
}

function renderChildrenChips(children, parentName) {
  if (!children.length) return "<p>Sem filhos registrados.</p>";

  return `
    <div class="chip-wrap">
      ${children
        .map((child) => {
          const encodedChild = encodeURIComponent(child);
          const encodedParent = encodeURIComponent(parentName);
          return `<button type="button" class="chip" data-relative="${encodedChild}" data-parent="${encodedParent}">${child}</button>`;
        })
        .join("")}
    </div>
  `;
}

function renderPersonContent(personId) {
  const person = registry[personId];
  if (!person) return;

  modalTitle.textContent = person.title;
  modalSubtitle.textContent = person.subtitle || "";

  const personMetaHTML = buildPersonMeta(person);

  if (personId === "vicente-amelia") {
    const names = descendants.map((child) => (child.deceased ? `${child.name} (†)` : child.name));
    modalContent.innerHTML = `
      <p>${person.description}</p>
      ${personMetaHTML}
      <h4>Filhos do casal</h4>
      <ul class="modal-list">${names.map((name) => `<li>${name}</li>`).join("")}</ul>
    `;
    return;
  }

  if (person.children) {
    const photosButton =
      person.photos && person.photos.length
        ? `<button type="button" class="photo-trigger" data-show-photos="${personId}">Ver fotos</button>`
        : "";

    modalContent.innerHTML = `
      <p>${person.description}</p>
      ${personMetaHTML}
      <h4>Filhos registrados</h4>
      ${renderChildrenChips(person.children, person.parentName || person.title)}
      ${photosButton}
    `;
    return;
  }

  modalContent.innerHTML = `<p>${person.description}</p>${personMetaHTML}`;
}

function renderRelativeContent(relativeName, parentName) {
  const children = familyChildrenByParent.get(relativeName) || [];

  modalTitle.textContent = relativeName;
  modalSubtitle.textContent = parentName
    ? `Filho(a) de ${parentName}`
    : "Descendente da família";

  modalContent.innerHTML = `
    <p>Registro de descendência familiar.</p>
    ${children.length ? "<h4>Filhos registrados</h4>" : "<p>Sem filhos registrados nesta árvore.</p>"}
    ${renderChildrenChips(children, relativeName)}
  `;
}

function renderPhotosContent(personId) {
  const person = registry[personId];
  if (!person || !person.photos || !person.photos.length) return;

  modalTitle.textContent = `Fotos de ${person.title}`;
  modalSubtitle.textContent = "Memórias da família";

  modalContent.innerHTML = `
    <p>Galeria de fotos cadastradas.</p>
    <div class="photo-grid">
      ${person.photos
        .map((photoPath, index) => {
          const number = index + 1;
          return `
            <a class="photo-card" href="${photoPath}" target="_blank" rel="noopener noreferrer">
              <img src="${photoPath}" alt="Foto ${number} de ${person.title}" loading="lazy">
              <span>Foto ${number}</span>
            </a>
          `;
        })
        .join("")}
    </div>
  `;
}

function updateBackButton() {
  backModalButton.hidden = modalHistory.length <= 1;
}

function openModalShell() {
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function renderState(state) {
  if (state.type === "person") {
    renderPersonContent(state.personId);
    return;
  }

  if (state.type === "relative") {
    renderRelativeContent(state.relativeName, state.parentName);
    return;
  }

  if (state.type === "photos") {
    renderPhotosContent(state.personId);
  }
}

function pushModalState(state) {
  modalHistory.push(state);
  renderState(state);
  updateBackButton();
  openModalShell();
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  modalHistory.length = 0;
  updateBackButton();
}

function goBackModal() {
  if (modalHistory.length <= 1) return;
  modalHistory.pop();
  renderState(modalHistory[modalHistory.length - 1]);
  updateBackButton();
}

function initLightParticles() {
  const container = document.querySelector(".light-particles");
  if (!container) return;

  const docHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    window.innerHeight
  );

  const isMobile = window.innerWidth < 700;
  const total = Math.min(240, (isMobile ? 56 : 92) + Math.floor(docHeight / 520) * (isMobile ? 8 : 12));

  container.style.height = `${docHeight}px`;
  container.innerHTML = "";

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < total; i += 1) {
    const particle = document.createElement("span");
    const size = (2.3 + Math.random() * 4.8).toFixed(2);
    const duration = (7 + Math.random() * 10).toFixed(2);
    const delay = (-Math.random() * 20).toFixed(2);
    const dx = `${(-34 + Math.random() * 68).toFixed(2)}px`;
    const dy = `${(-42 + Math.random() * 84).toFixed(2)}px`;
    const twinkle = (1.3 + Math.random() * 2.5).toFixed(2);

    particle.className = "light-particle";
    particle.style.left = `${(Math.random() * 100).toFixed(2)}%`;
    particle.style.top = `${(Math.random() * docHeight).toFixed(2)}px`;
    particle.style.setProperty("--size", `${size}px`);
    particle.style.setProperty("--duration", `${duration}s`);
    particle.style.setProperty("--delay", `${delay}s`);
    particle.style.setProperty("--dx", dx);
    particle.style.setProperty("--dy", dy);
    particle.style.setProperty("--twinkle", `${twinkle}s`);
    fragment.appendChild(particle);
  }

  container.appendChild(fragment);
}

let lightParticlesResizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(lightParticlesResizeTimer);
  lightParticlesResizeTimer = setTimeout(initLightParticles, 180);
});

document.addEventListener("click", (event) => {
  const personButton = event.target.closest("[data-person]");
  if (personButton) {
    modalHistory.length = 0;
    pushModalState({ type: "person", personId: personButton.dataset.person });
    return;
  }

  const relativeButton = event.target.closest("[data-relative]");
  if (relativeButton) {
    const relativeName = decodeURIComponent(relativeButton.dataset.relative);
    const parentName = decodeURIComponent(relativeButton.dataset.parent || "");
    pushModalState({ type: "relative", relativeName, parentName });
    return;
  }

  const showPhotosButton = event.target.closest("[data-show-photos]");
  if (showPhotosButton) {
    pushModalState({ type: "photos", personId: showPhotosButton.dataset.showPhotos });
    return;
  }

  if (event.target === modal) {
    closeModal();
  }
});

closeModalButton.addEventListener("click", closeModal);
backModalButton.addEventListener("click", goBackModal);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

buildFamilyIndexes();
createUnknownSiblingCards(vicenteSiblings, "vicente");
createUnknownSiblingCards(ameliaSiblings, "amelia");
renderChildrenCards();
initLightParticles();
