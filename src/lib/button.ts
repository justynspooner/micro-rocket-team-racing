export default class Button {
  text: string;
  fillColor: string;
  textColor: string;
  x: number = 0;
  y: number = 0;
  width: number = 0;
  height: number = 0;

  constructor(text: string, fillColor = "#ffffff", textColor = "#000000") {
    this.text = text;
    this.fillColor = fillColor;
    this.textColor = textColor;
  }

  draw(c: CanvasRenderingContext2D) {
    c.fillStyle = this.fillColor;
    c.fillRect(this.x, this.y, this.width, this.height);

    c.fillStyle = this.textColor;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.font = "25px arial";
    c.fillText(
      this.text,
      this.x + this.width / 2,
      this.y + this.height / 2,
      this.width
    );
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  inBounds(mouseX: number, mouseY: number) {
    return !(
      mouseX < this.x ||
      mouseX > this.x + this.width ||
      mouseY < this.y ||
      mouseY > this.y + this.height
    );
  }
}
