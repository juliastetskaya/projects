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


const canvasList = document.querySelector('.canvas__list');

canvasList.addEventListener('click', (event) => {
  let { target } = event;

  while (target !== canvasList) {
    if (target.tagName === 'LI' && state.currentTool === 'transform') {
      target.classList.toggle('circle');
      return;
    }
    target = target.parentNode;
  }
});
