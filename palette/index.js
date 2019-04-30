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
const canvases = document.querySelectorAll('.canvas__item');

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

const tools = {
  paint,
  color,
  move,
  transform,
};

if (localStorage.getItem('state') !== null) {
  const cash = JSON.parse(localStorage.getItem('state'));
  state.currentTool = cash.currentTool;
  currentColorElem.value = cash.currentColor;
  state.currentColor = cash.currentColor;
  previuosColorElem.style.backgroundColor = cash.previousColor;
  state.previousColor = cash.previousColor;
  if (tools[cash.currentTool]) {
    tools[cash.currentTool].classList.add('background');
  }
}

if (localStorage.getItem('canvas') !== null) {
  const canv = JSON.parse(localStorage.getItem('canvas'));
  canv.forEach((item, index) => {
    canvases[index].classList = item.classes;
    canvases[index].style.backgroundColor = item.bg;
    canvases[index].style.position = item.position;
    canvases[index].style.left = item.offsetLeft;
    canvases[index].style.top = item.offsetTop;
  });
}

header.addEventListener('click', () => {
  const background = document.querySelector('.background');
  if (background) {
    background.classList.remove('background');
  }
  state.currentTool = '';
  localStorage.setItem('state', JSON.stringify(state));
});

palette.addEventListener('click', (event) => {
  const background = document.querySelector('.background');
  let { target } = event;
  if (background) {
    background.classList.remove('background');
  }
  state.currentTool = '';
  localStorage.setItem('state', JSON.stringify(state));

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
      localStorage.setItem('state', JSON.stringify(state));
      return;
    }
    target = target.parentNode;
  }
});

currentColorElem.addEventListener('change', () => {
  previuosColorElem.style.backgroundColor = state.currentColor;
  state.previousColor = state.currentColor;
  state.currentColor = currentColorElem.value;
  localStorage.setItem('state', JSON.stringify(state));
});

document.addEventListener('click', (event) => {
  const { target } = event;
  if (state.currentTool === 'color' && target.tagName !== 'I' && target.parentNode !== palette && target !== currentColorElem) {
    const col = getComputedStyle(target).backgroundColor;
    state.previousColor = state.currentColor;
    previuosColorElem.style.backgroundColor = state.currentColor;
    state.currentColor = rgbToHex(col);
    currentColorElem.value = rgbToHex(col);
    localStorage.setItem('state', JSON.stringify(state));
  }
});

const local = () => {
  const arr = [];
  canvases.forEach((canv) => {
    const obj = {
      classes: canv.classList.value,
      position: canv.style.position,
      offsetLeft: canv.style.left,
      offsetTop: canv.style.top,
      bg: canv.style.backgroundColor,
    };
    arr.push(obj);
  });
  localStorage.setItem('canvas', JSON.stringify(arr));
};

const getCoords = (elem) => {
  const box = elem.getBoundingClientRect();
  return {
    top: box.top + window.pageYOffset,
    left: box.left + window.pageXOffset,
  };
};

canvases.forEach((canvas) => {
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
      moveAt(event);
      document.body.appendChild(target);
      target.style.zIndex = 1000;

      document.addEventListener('mousemove', moveAt);

      target.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', moveAt);
        target.removeEventListener('mouseup', moveAt);
      });

      target.addEventListener('dragstart', () => false);

      local();
    }
    if (state.currentTool === 'transform') {
      target.classList.toggle('circle');
      local();
    }
    if (state.currentTool === 'paint') {
      target.style.backgroundColor = state.currentColor;
      local();
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

  if (event.keyCode === 81) {
    localStorage.clear();
  }
});
