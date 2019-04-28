const rgbToHex = (color) => {
  const arr = color.split('(')[1].split(')')[0].split(',');
  const arrHex = arr.map((x) => {
    const num = parseInt(x, 10).toString(16);
    return (num.length === 1) ? `0${num}` : num;
  });
  return `#${arrHex.join('')}`;
};

const state = {
  currentTool: '',
  currentColor: '#00eeee',
  previousColor: '#00ff00',
};

const palette = document.querySelector('.palette__wrapper');
const canvasList = document.querySelector('.canvas__list');
const currentColorElem = document.querySelector('.current-color');
const previuosColorElem = document.querySelector('.previous-color');

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

document.addEventListener('click', (event) => {
  const { target } = event;
  if (!target.classList.contains('palette__button--color') && state.currentTool === 'color') {
    const { backgroundColor } = getComputedStyle(target);
    console.dir(target);
    console.log(backgroundColor);
    currentColorElem.value = rgbToHex(backgroundColor);
    previuosColorElem.style.backgroundColor = state.currentColor;
    state.previousColor = state.currentColor;
    state.currentColor = currentColorElem.value;
  }
});

currentColorElem.addEventListener('change', () => {
  console.log('!!!!!!!!!!!!!!!');
  if (currentColorElem.value !== state.currentColor) {
    previuosColorElem.style.backgroundColor = state.currentColor;
    state.previousColor = state.currentColor;
    state.currentColor = currentColorElem.value;
  }
});


canvasList.addEventListener('click', (event) => {
  let { target } = event;
  const { currentTool } = state;

  while (target !== canvasList) {
    if (target.tagName === 'LI') {
      if (currentTool === 'transform') {
        target.classList.toggle('circle');
      }
      if (currentTool === 'paint') {
        target.style.backgroundColor = state.currentColor;
      }
    }
    target = target.parentNode;
  }
});
