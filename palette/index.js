const rgbToHex = (color) => {
  const arr = color.split('(')[1].split(')')[0].split(',');
  const arrHex = arr.map((x) => {
    const num = parseInt(x, 10).toString(16);
    return (num.length === 1) ? `0${num}` : num;
  });
  return `#${arrHex.join('')}`;
};

const palette = document.querySelector('.palette__wrapper');
const header = document.querySelector('.page-header');

const paint = document.querySelector('.palette__button--paint');
const color = document.querySelector('.palette__button--color');
const move = document.querySelector('.palette__button--move');
const transform = document.querySelector('.palette__button--transform');

const currentColorElem = document.querySelector('.current-color');
const previuosColorElem = document.querySelector('.previous-color');

const state = {
  currentTool: '',
  currentColor: currentColorElem.value,
  previousColor: getComputedStyle(previuosColorElem).backgroundColor,
};

header.addEventListener('click', () => {
  const background = document.querySelector('.background');
  if (background) {
    background.classList.remove('background');
  }
  state.currentTool = '';
});

palette.addEventListener('click', (event) => {
  const background = document.querySelector('.background');
  let { target } = event;
  if (background) {
    background.classList.remove('background');
  }
  state.currentTool = '';

  while (target !== palette) {
    if (target.tagName === 'BUTTON') {
      if (target === paint) {
        state.currentTool = 'paint';
      } else if (target === color) {
        state.currentTool = 'color';
      } else if (target === move) {
        state.currentTool = 'move';
      } else if (target === transform) {
        state.currentTool = 'transform';
      }
      target.classList.add('background');
      return;
    }
    target = target.parentNode;
  }
});

currentColorElem.addEventListener('change', () => {
  previuosColorElem.style.backgroundColor = state.currentColor;
  state.previousColor = state.currentColor;
  state.currentColor = currentColorElem.value;
});

document.addEventListener('click', (event) => {
  const { target } = event;
  if (state.currentTool === 'color' && target.tagName !== 'I' && target.parentNode !== palette && target !== currentColorElem) {
    const col = getComputedStyle(target).backgroundColor;
    state.previousColor = state.currentColor;
    previuosColorElem.style.backgroundColor = state.currentColor;
    state.currentColor = col;
    currentColorElem.value = rgbToHex(col);
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

document.addEventListener('keydown', (event) => {
  if (event.ctrlKey || event.altKey || event.metaKey) return;

  const click = new Event('click', { bubbles: true, cancelable: false });

  const keyCodes = {
    65: paint,
    83: color,
    68: move,
    70: transform,
    27: header,
  };

  if (keyCodes[event.keyCode]) {
    keyCodes[event.keyCode].dispatchEvent(click);
  }
});
