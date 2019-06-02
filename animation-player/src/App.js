import createElement from './lib';

export default class App {
  constructor() {
    this.text = 'Your browser is not supported canvas!';
  }

  static createFrame(counter) {
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

    buttonCopy.addEventListener('click', App.copyFrame);
    const frame = createElement('li', 'frames__item', frameCanvas, number, ...buttons);

    return frame;
  }

  static copyMainCanvas() {
    const canvas = document.querySelector('.canvas');
    const newCanvas = createElement('canvas', 'canvas');
    newCanvas.width = 500;
    newCanvas.height = 500;

    const ctx = newCanvas.getContext('2d');
    ctx.drawImage(canvas, 0, 0);

    document.body.replaceChild(newCanvas, canvas);
    App.draw();
  }

  static copyFrame() {
    const frames = document.querySelector('.list__frames');
    const nextNumberFrame = frames.childNodes.length + 1;
    const frame = App.createFrame(nextNumberFrame);

    // const sourceCanvas = event.target.parentNode.firstChild;
    const distinationCanvas = frame.firstChild;
    const ctx = distinationCanvas.getContext('2d');

    App.copyMainCanvas();

    const canvas = document.querySelector('.canvas');
    ctx.drawImage(canvas, 0, 0, 500, 500, 0, 0, 200, 200);

    frames.append(frame);
  }

  start() {
    const canvas = createElement('canvas', 'canvas', this.text);
    canvas.width = 500;
    canvas.height = 500;

    const input = createElement('input');
    input.setAttribute('type', 'color');

    const label = createElement('label', 'label', 'Color: ', input);

    const frame = App.createFrame(1);
    const frames = createElement('ul', 'list__frames', frame);

    const animation = createElement('canvas', 'canvas__animation');
    animation.width = 300;
    animation.height = 300;

    document.body.append(label, frames, canvas, animation);

    App.draw();
    setInterval(App.startAnimation, 1000);
  }

  static draw() {
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

      App.getFrame();
    };

    canvas.addEventListener('mousedown', mouseDownHandler);
    canvas.addEventListener('mousemove', mouseMoveHandler);
    canvas.addEventListener('mouseup', mouseUpHandler);
  }

  static getFrame() {
    const canvas = document.querySelector('.canvas--active');
    const ctx = canvas.getContext('2d');

    const image = document.querySelector('.canvas');

    ctx.drawImage(image, 0, 0, 500, 500, 0, 0, 200, 200);
  }

  static startAnimation() {
    const frames = [...document.querySelector('.list__frames').children];
    const animation = document.querySelector('.canvas__animation');
    const ctx = animation.getContext('2d');

    frames.forEach((frame) => {
      setTimeout(() => ctx.drawImage(frame.firstChild, 0, 0, 200, 200, 0, 0, 300, 300), 500);
    });
  }
}
