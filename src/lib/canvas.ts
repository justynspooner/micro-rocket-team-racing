export default class Canvas {
  elem: HTMLCanvasElement;
  height: number;
  width: number;
  context: CanvasRenderingContext2D | null;

  constructor(elem: HTMLCanvasElement) {
    this.elem = elem;
    this.height = elem.height;
    this.width = elem.width;
    this.context = elem.getContext("2d");
  }

  clear() {
    this.elem.height = this.elem.height;
    this.elem.width = this.elem.width;
  }
}
