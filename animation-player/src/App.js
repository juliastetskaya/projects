import createElement from './lib';

export default class App {
  constructor() {
    this.text = 'Your browser is not supported canvas!';
    this.speed = 10;
  }

  createButtonsForFrame() {
    const buttonDelete = createElement('button', 'button button__delete');
    const buttonCopy = createElement('button', 'button button__copy');
    const buttonMove = createElement('button', 'button button__move');

    const buttons = [buttonDelete, buttonCopy, buttonMove];

    buttonCopy.addEventListener('click', this.copyFrame.bind(this));
    buttonDelete.addEventListener('click', this.deleteFrame.bind(this));

    buttons.forEach(button => button.setAttribute('type', 'button'));

    return buttons;
  }

  createFrame() {
    const frames = document.querySelector('.list__frames');
    const counter = frames ? frames.childNodes.length + 1 : 1;

    const buttons = this.createButtonsForFrame();

    const number = createElement('div', 'number__frame', `${counter}`);

    const activeFrame = document.querySelector('.canvas--active');
    if (activeFrame) {
      activeFrame.classList.remove('canvas--active');
    }

    const frameCanvas = createElement('canvas', 'frame__canvas canvas--active');
    frameCanvas.width = 200;
    frameCanvas.height = 200;

    const frame = createElement('li', 'frames__item', frameCanvas, number, ...buttons);
    frames.append(frame);

    if (counter > 1) {
      frames.firstChild.querySelector('.button__delete').style.display = '';
      frames.firstChild.querySelector('.button__move').style.display = '';
    } else {
      frames.firstChild.querySelector('.button__delete').style.display = 'none';
      frames.firstChild.querySelector('.button__move').style.display = 'none';
    }

    return frame;
  }

  deleteFrame(event) {
    const frame = event.target.closest('.frames__item');
    document.querySelector('.list__frames').removeChild(frame);

    const canvas = document.querySelector('.canvas');
    const cxt = canvas.getContext('2d');

    cxt.clearRect(0, 0, canvas.width, canvas.height);

    const frames = document.querySelector('.list__frames');
    if (frames.children.length === 1) {
      frames.firstChild.querySelector('.button__delete').style.display = 'none';
      frames.firstChild.querySelector('.button__move').style.display = 'none';
    }

    if (frame.firstChild.matches('.canvas--active')) {
      frames.lastChild.firstChild.classList.add('canvas--active');
    }

    this.updateFramesNumbers();
    this.setFrame();
  }

  copyMainCanvas() {
    const canvas = document.querySelector('.canvas');
    const newCanvas = createElement('canvas', 'canvas');
    newCanvas.width = 500;
    newCanvas.height = 500;

    const ctx = newCanvas.getContext('2d');
    ctx.drawImage(canvas, 0, 0);

    document.querySelector('.page-main').replaceChild(newCanvas, canvas);
    this.draw();
  }

  createNewFrame() {
    this.createFrame();

    const canvas = document.querySelector('.canvas');
    const newCanvas = createElement('canvas', 'canvas');
    newCanvas.width = 500;
    newCanvas.height = 500;

    document.querySelector('.page-main').replaceChild(newCanvas, canvas);
    this.draw();
  }

  copyFrame(event) {
    const frame = this.createFrame();

    const sourceCanvas = event.target.parentNode.firstChild;
    const distinationCanvas = frame.firstChild;
    const ctx = distinationCanvas.getContext('2d');

    this.copyMainCanvas();

    ctx.drawImage(sourceCanvas, 0, 0);
    this.setFrame();
  }

  updateFramesNumbers() {
    const frames = [...document.querySelector('.list__frames').children];
    frames.forEach((frame, index) => {
      const div = frame.querySelector('div');
      div.innerHTML = index + 1;
    });
  }

  render() {
    const h1 = createElement('h1', 'page-title', 'CodeJam - Animation Player');
    const header = createElement('header', 'page-header container', h1);

    const canvas = createElement('canvas', 'canvas', this.text);
    canvas.width = 500;
    canvas.height = 500;

    const input = createElement('input');
    input.setAttribute('type', 'color');
    input.setAttribute('value', '#00ff00');

    const label = createElement('label', 'label', 'Color: ', input);

    const frames = createElement('ul', 'list__frames');
    frames.addEventListener('click', this.changeActiveFrame.bind(this));

    const button = createElement('button', 'button__new-frame', 'Add new frame');
    button.addEventListener('click', this.createNewFrame.bind(this));

    const framesWrapper = createElement('div', 'frames__wrapper', frames, button);

    const animation = createElement('canvas', 'canvas__animation');
    animation.width = 300;
    animation.height = 300;

    const buttonFS = createElement('button', 'button-fullscreen', 'Fullscreen');
    buttonFS.setAttribute('type', 'button');
    buttonFS.addEventListener('click', () => {
      const canvasAnimation = document.querySelector('.canvas__animation');
      canvasAnimation.requestFullscreen();
    });

    const inputRange = createElement('input', 'animation__speed');
    inputRange.setAttribute('type', 'range');
    inputRange.setAttribute('name', 'speed');
    inputRange.setAttribute('value', '10');
    inputRange.setAttribute('min', '0');
    inputRange.setAttribute('max', '24');

    const span = createElement('span', 'speed', `${this.speed} FPS`);

    const labelAnimation = createElement('label', 'animation__label', 'Animation speed: ', span, inputRange);
    const animationWrapper = createElement('div', 'animation__wrapper', animation, buttonFS, labelAnimation);

    const main = createElement('main', 'page-main container', label, framesWrapper, canvas, animationWrapper);

    document.body.append(header, main);
  }

  changeActiveFrame(event) {
    if (event.target.tagName.toLowerCase() === 'canvas') {
      const activeCanvas = document.querySelector('.canvas--active');
      activeCanvas.classList.remove('canvas--active');
      event.target.classList.add('canvas--active');
      this.setFrame();
    }
  }

  draw() {
    let isMouseDown = false;

    const canvas = document.querySelector('.canvas');
    const ctx = canvas.getContext('2d');

    const mouseDownHandler = () => {
      isMouseDown = true;
    };

    const mouseMoveHandler = (event) => {
      if (isMouseDown) {
        const userColor = document.querySelector('input').value;
        ctx.fillStyle = userColor;
        ctx.strokeStyle = userColor;

        ctx.lineWidth = 10 * 2;
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(event.offsetX, event.offsetY, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(event.offsetX, event.offsetY);
      }
    };

    const mouseUpHandler = () => {
      isMouseDown = false;
      ctx.beginPath();

      this.getFrame();
    };

    canvas.addEventListener('mousedown', mouseDownHandler);
    canvas.addEventListener('mousemove', mouseMoveHandler);
    canvas.addEventListener('mouseup', mouseUpHandler);
  }

  getFrame() {
    const canvas = document.querySelector('.canvas--active');
    const ctx = canvas.getContext('2d');

    const image = document.querySelector('.canvas');

    ctx.drawImage(image, 0, 0, 500, 500, 0, 0, 200, 200);
  }

  setFrame() {
    const sourseCanvas = document.querySelector('.canvas--active');

    const canvas = document.querySelector('.canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(sourseCanvas, 0, 0, 200, 200, 0, 0, 500, 500);
  }

  startAnimation() {
    let count = 0;
    let timer;
    const animation = document.querySelector('.canvas__animation');
    const ctx = animation.getContext('2d');

    const start = () => {
      if (this.speed > 0) {
        const frames = [...document.querySelector('.list__frames').children];
        ctx.clearRect(0, 0, animation.width, animation.height);
        const image = frames[count % frames.length].firstChild;
        ctx.drawImage(image, 0, 0, 200, 200, 0, 0, 300, 300);
        count += 1;
      }
    };

    timer = setInterval(() => start(), 1000 / Number(this.speed));

    const inputRange = document.querySelector('.animation__speed');
    inputRange.addEventListener('input', () => {
      this.speed = inputRange.value;
      clearInterval(timer);
      timer = setInterval(() => start(), 1000 / Number(this.speed));

      const labelAnimation = document.querySelector('.speed');
      labelAnimation.innerHTML = `${this.speed} FRS`;
    });
  }

  start() {
    this.render();
    this.createFrame();
    this.draw();
    this.startAnimation();
  }
}
