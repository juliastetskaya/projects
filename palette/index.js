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
    currentColorElem.value = rgbToHex(backgroundColor);
    previuosColorElem.style.backgroundColor = state.currentColor;
    state.previousColor = state.currentColor;
    state.currentColor = currentColorElem.value;
  }
});

currentColorElem.addEventListener('change', () => {
  if (currentColorElem.value !== state.currentColor) {
    previuosColorElem.style.backgroundColor = state.currentColor;
    state.previousColor = state.currentColor;
    state.currentColor = currentColorElem.value;
  }
});

const getCoords = (elem) => {
  const box = elem.getBoundingClientRect();
  return {
    top: box.top + window.pageYOffset,
    left: box.left + window.pageXOffset,
  };
};


const canvases = document.querySelectorAll('.canvas__item');

[].forEach.call(canvases, (canvas) => {
  canvas.addEventListener('mousedown', (event) => {
    const { target } = event;

    if (state.currentTool === 'move') {
      const coords = getCoords(target);
      const shiftX = event.pageX - coords.left;
      const shiftY = event.pageY - coords.top;

      const moveAt = (e) => {
        target.style.left = `${e.pageX - shiftX}px`;
        target.style.top = `${e.pageY - shiftY}px`;
      };

      target.style.position = 'absolute';
      moveAt(event, shiftX, shiftY);
      document.body.appendChild(target);
      target.style.zIndex = 1000;

      document.addEventListener('mousemove', moveAt);

      target.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', moveAt);
        target.removeEventListener('mouseup', moveAt);
      });

      target.addEventListener('dragstart', () => false);
    }
    if (state.currentTool === 'transform') {
      target.classList.toggle('circle');
    }
    if (state.currentTool === 'paint') {
      target.style.backgroundColor = state.currentColor;
    }
  });
});
