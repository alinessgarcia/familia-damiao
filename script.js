const descendants = [
  { id: "nilton", name: "Nilton Damião", deceased: false, children: ["Gessia Damião", "Fernando Damião"] },
  { id: "samuel", name: "Samuel Damião", deceased: false, children: [] },
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
    ]
  }
];

const registry = {
  "divino-katarina": {
    title: "Divino Damião (†) e Katarina (†)",
    subtitle: "Casal ancestral da família",
    description: "Ambos são falecidos e representam a origem principal desta árvore."
  },
  "vicente-amelia": {
    title: "Vicente Damião (†) e Amélia (†)",
    subtitle: "Casal central desta linhagem",
    description: "Ambos são falecidos. Clique em cada filho para abrir os netos em elementos clicáveis."
  }
};

const grandchildrenParent = new Map();

const childrenGrid = document.getElementById("children-grid");
const vicenteSiblings = document.getElementById("vicente-siblings");
const ameliaSiblings = document.getElementById("amelia-siblings");

const modal = document.getElementById("person-modal");
const closeModalButton = document.getElementById("close-modal");
const modalTitle = document.getElementById("modal-title");
const modalSubtitle = document.getElementById("modal-subtitle");
const modalContent = document.getElementById("modal-content");

function createUnknownSiblingCards(container, sideLabel) {
  const cards = [];
  for (let i = 1; i <= 10; i += 1) {
    const id = `${sideLabel}-unknown-${i}`;
    registry[id] = {
      title: `Irmão(a) de ${sideLabel === "vicente" ? "Vicente" : "Amélia"} ${i}`,
      subtitle: "Nome pendente de confirmação",
      description: "Espaço reservado para preencher o nome futuramente."
    };

    cards.push(`
      <button type="button" class="card small-card" data-person="${id}">
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
        description: "Clique nos elementos abaixo para abrir o detalhe dos netos.",
        children: person.children,
        parentName: person.name
      };

      person.children.forEach((grandchild) => {
        grandchildrenParent.set(grandchild, person.name);
      });

      return `
        <button type="button" class="card child-card ${deceasedClass}" data-person="${person.id}">
          <span class="card-title">${person.name}</span>
          <span class="card-subtitle">${countLabel}</span>
        </button>
      `;
    })
    .join("");
}

function buildModalContent(personId) {
  const person = registry[personId];
  if (!person) return;

  modalTitle.textContent = person.title;
  modalSubtitle.textContent = person.subtitle || "";

  if (personId === "vicente-amelia") {
    const names = descendants.map((child) => (child.deceased ? `${child.name} (†)` : child.name));
    modalContent.innerHTML = `
      <p>${person.description}</p>
      <h4>Filhos do casal</h4>
      <ul class="modal-list">${names.map((name) => `<li>${name}</li>`).join("")}</ul>
    `;
    return;
  }

  if (person.children) {
    if (!person.children.length) {
      modalContent.innerHTML = `
        <p>${person.title} não possui filhos registrados nesta árvore.</p>
      `;
      return;
    }

    modalContent.innerHTML = `
      <p>${person.description}</p>
      <div class="chip-wrap">
        ${person.children
          .map(
            (child) =>
              `<button type="button" class="chip" data-grandchild="${encodeURIComponent(child)}">${child}</button>`
          )
          .join("")}
      </div>
    `;
    return;
  }

  modalContent.innerHTML = `<p>${person.description}</p>`;
}

function openModal(personId) {
  buildModalContent(personId);
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

document.addEventListener("click", (event) => {
  const personButton = event.target.closest("[data-person]");
  if (personButton) {
    openModal(personButton.dataset.person);
    return;
  }

  const grandchildButton = event.target.closest("[data-grandchild]");
  if (grandchildButton) {
    const grandchildName = decodeURIComponent(grandchildButton.dataset.grandchild);
    const parentName = grandchildrenParent.get(grandchildName) || "Filho(a) não informado(a)";
    modalTitle.textContent = grandchildName;
    modalSubtitle.textContent = "Neto(a) de Vicente Damião e Amélia";
    modalContent.innerHTML = `
      <p>Filho(a) de <strong>${parentName}</strong>.</p>
      <p>Elemento interativo criado para permitir navegação por netos.</p>
    `;
    return;
  }

  if (event.target === modal) {
    closeModal();
  }
});

closeModalButton.addEventListener("click", closeModal);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

createUnknownSiblingCards(vicenteSiblings, "vicente");
createUnknownSiblingCards(ameliaSiblings, "amelia");
renderChildrenCards();
