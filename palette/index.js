const state = {
  currentTool: '',
};

const palette = document.querySelector('.palette__wrapper');

palette.addEventListener('click', (event) => {
  let { target } = event;

  while (target !== palette) {
    if (target.classList.contains('palette__button--paint')) {
      state.currentTool = 'paint';
    } else if (target.classList.contains('palette__button--color')) {
      state.currentTool = 'color';
    } else if (target.classList.contains('palette__button--move')) {
      state.currentTool = 'move';
    } else if (target.classList.contains('palette__button--transform')) {
      state.currentTool = 'transform';
    }

    target = target.parentNode;
  }
});

const currentColorElem = document.querySelector('.current-color');
let currentColor = currentColorElem.value;
const previuosColorElem = document.querySelector('.previous-color');


currentColorElem.addEventListener('change', () => {
  if (currentColorElem.value !== currentColor) {
    previuosColorElem.style.backgroundColor = currentColor;
    currentColor = currentColorElem.value;
  }
});

const canvasList = document.querySelector('.canvas__list');

canvasList.addEventListener('click', (event) => {
  let { target } = event;
  const { currentTool } = state;

  while (target !== canvasList) {
    if (target.tagName === 'LI') {
      if (currentTool === 'transform') {
        target.classList.toggle('circle');
      }
      if (currentTool === 'paint') {
        target.style.backgroundColor = currentColor;
      }
    }
    target = target.parentNode;
  }
});
