import createElement from './lib';

export default class App {
  constructor() {
    this.text = 'Your browser is not supported canvas!';
    this.frames = [];
  }

  createFrame() {
    const frames = document.querySelector('.list__frames');
    const counter = frames ? frames.childNodes.length + 1 : 1;

    const buttonDelete = createElement('button', 'button button__delete');
    const buttonCopy = createElement('button', 'button button__copy');
    const buttonMove = createElement('button', 'button button__move');
    const number = createElement('div', 'number__frame', `${counter}`);
    const buttons = [buttonDelete, buttonCopy, buttonMove];
    buttons.forEach(button => button.setAttribute('type', 'button'));

    const activeFrame = document.querySelector('.canvas--active');
    if (activeFrame) {
      activeFrame.classList.remove('canvas--active');
    }

    const frameCanvas = createElement('canvas', `frame__canvas frame__canvas-${counter} canvas--active`);
    frameCanvas.width = 200;
    frameCanvas.height = 200;

    buttonCopy.addEventListener('click', this.copyFrame.bind(this));
    const frame = createElement('li', 'frames__item', frameCanvas, number, ...buttons);
    frames.append(frame);

    return frame;
  }

  copyMainCanvas() {
    const canvas = document.querySelector('.canvas');
    const newCanvas = createElement('canvas', 'canvas');
    newCanvas.width = 500;
    newCanvas.height = 500;

    const ctx = newCanvas.getContext('2d');
    ctx.drawImage(canvas, 0, 0);

    document.body.replaceChild(newCanvas, canvas);
    this.draw();
  }

  createNewFrame() {
    this.createFrame();

    const canvas = document.querySelector('.canvas');
    const newCanvas = createElement('canvas', 'canvas');
    newCanvas.width = 500;
    newCanvas.height = 500;

    document.body.replaceChild(newCanvas, canvas);
    this.draw();
  }

  copyFrame(event) {
    const frame = this.createFrame();

    const sourceCanvas = event.target.parentNode.firstChild;
    const distinationCanvas = frame.firstChild;
    const ctx = distinationCanvas.getContext('2d');

    this.copyMainCanvas();

    // const canvas = document.querySelector('.canvas');
    ctx.drawImage(sourceCanvas, 0, 0);
  }

  start() {
    const canvas = createElement('canvas', 'canvas', this.text);
    canvas.width = 500;
    canvas.height = 500;

    const input = createElement('input');
    input.setAttribute('type', 'color');

    const label = createElement('label', 'label', 'Color: ', input);

    const frames = createElement('ul', 'list__frames');

    const button = createElement('button', 'button__new-frame', 'Add new frame');
    button.addEventListener('click', this.createNewFrame.bind(this));

    const framesWrapper = createElement('div', 'frames__wrapper', frames, button);

    const animation = createElement('canvas', 'canvas__animation');
    animation.width = 300;
    animation.height = 300;

    document.body.append(label, framesWrapper, canvas, animation);

    this.createFrame();

    this.draw();
    this.startAnimation();
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

  startAnimation() {
    let count = 0;
    const animation = document.querySelector('.canvas__animation');
    const ctx = animation.getContext('2d');

    setInterval(() => {
      const frames = [...document.querySelector('.list__frames').children];
      ctx.clearRect(0, 0, 300, 300);
      ctx.drawImage(frames[count].firstChild, 0, 0, 200, 200, 0, 0, 300, 300);
      count = count === frames.length - 1 ? 0 : count + 1;
    }, 1000 / 5);
  }
}
