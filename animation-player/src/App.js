import createElement from './lib';

export default class App {
  constructor() {
    this.text = 'Your browser is not supported canvas!';
  }

  start() {
    const canvas = createElement('canvas', 'canvas', this.text);

    canvas.width = 500;
    canvas.height = 500;

    const input = createElement('input');
    input.setAttribute('type', 'color');

    const label = createElement('label', 'label', 'Color: ', input);

    const frameCanvas = createElement('canvas', 'frame__canvas');
    frameCanvas.width = 200;
    frameCanvas.height = 200;
    const frame = createElement('li', 'frames__item', frameCanvas);
    const frames = createElement('ul', 'list__frames', frame);

    document.body.append(label, frames, canvas);

    App.draw();
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
    const canvas = document.querySelector('.frame__canvas');
    const ctx = canvas.getContext('2d');

    const image = document.querySelector('.canvas');

    ctx.drawImage(image, 0, 0, 500, 500, 0, 0, 200, 200);
  }
}
