// Mejoras en la interacción y accesibilidad
const sortable = document.getElementById('sortable');
const itemsArray = Array.from(sortable.children);
const audio = new Audio(); // Elemento de audio para reproducir sonidos
let selectedItem = null;

// Función para mezclar aleatoriamente los elementos
function shuffleItems() {
  for (let i = itemsArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    sortable.appendChild(itemsArray[j]);
  }
  updateTabIndex();
}

// Actualizar tabindex en el orden en que están en la lista
function updateTabIndex() {
  Array.from(sortable.children).forEach((item, index) => {
    item.setAttribute('tabindex', index + 1);
  });
}

shuffleItems();

let draggedItem = null;

sortable.addEventListener('dragend', updateTabIndex);
sortable.addEventListener('drop', updateTabIndex);

itemsArray.forEach(item => {
  item.addEventListener('dragstart', handleDragStart);
  item.addEventListener('dragover', handleDragOver);
  item.addEventListener('dragenter', handleDragEnter);
  item.addEventListener('dragleave', handleDragLeave);
  item.addEventListener('drop', handleDrop);
  item.addEventListener('dragend', handleDragEnd);
  item.addEventListener('keydown', handleKeyDown);
  item.addEventListener('click', handleClick);
  item.addEventListener('touchstart', handleTouchStart);
  item.addEventListener('touchend', handleTouchEnd);
});

function handleDragStart(e) {
  draggedItem = this;
  this.classList.add('dragging');
  this.setAttribute('aria-grabbed', 'true');
  e.dataTransfer.setData('text/plain', '');
}

function handleDragOver(e) {
  e.preventDefault();
}

function handleDragEnter(e) {
  e.preventDefault();
}

function handleDragLeave() {
  this.style.borderLeft = '';
  this.style.borderRight = '';
}

function handleDrop(e) {
  e.preventDefault();
  if (draggedItem !== this) {
    sortable.insertBefore(draggedItem, this.nextSibling);
  }
  draggedItem.classList.remove('dragging');
  updateTabIndex();
}

function handleDragEnd() {
  itemsArray.forEach(item => {
    item.classList.remove('dragging');
    item.setAttribute('aria-grabbed', 'false');
  });
  updateTabIndex();
}

// Soporte táctil
function handleTouchStart(e) {
  draggedItem = this;
  this.classList.add('dragging');
}

function handleTouchEnd(e) {
  this.classList.remove('dragging');
}

// Retroalimentación de sonido
function handleClick() {
  const letter = this.textContent.trim().toLowerCase();
  audio.src = `audio/${letter} audio.wav`; // Archivo de audio asociado
  audio.play();
}

// Navegación y selección con teclado
function handleKeyDown(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    if (!selectedItem) {
      // Selecciona el primer elemento con animación
      selectedItem = this;
      this.classList.add('selected');
    } else if (selectedItem === this) {
      // Deselecciona si se vuelve a presionar espacio
      selectedItem.classList.remove('selected');
      selectedItem = null;
    } else {
      // Intercambiar posiciones entre selectedItem y el actual
      const parent = this.parentNode;
      const nextSibling = this.nextSibling === selectedItem ? this : this.nextSibling;
      parent.insertBefore(selectedItem, nextSibling);
      
      // Actualizar tabindex
      updateTabIndex();
      
      // Reset selección
      selectedItem.classList.remove('selected');
      selectedItem = null;
    }
  }
}

// Agregar estilos para la animación
document.head.insertAdjacentHTML('beforeend', `
  <style>
    .selected {
      transform: scale(1.1);
      background-color: #ccc;
      transition: transform 0.3s ease, background-color 0.3s ease;
      outline: 2px solid black;    
    }
  </style>
`);


document.addEventListener("click", () => {
  const bgMusic = document.getElementById("bg-music");
  bgMusic.volume = 0.1;
  bgMusic.play();
}, { once: true });