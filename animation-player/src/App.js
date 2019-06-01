import createElement from './lib';

export default class App {
  constructor() {
    this.text = 'Your browser is not supported canvas!';
  }

  start() {
    const canvas = createElement('canvas', 'canvas', this.text);

    canvas.width = 500;
    canvas.height = 500;

    document.body.append(canvas);

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
    };

    canvas.addEventListener('mousedown', mouseDownHandler);
    canvas.addEventListener('mousemove', mouseMoveHandler);
    canvas.addEventListener('mouseup', mouseUpHandler);
  }
}
