import { GridDirection } from "./GridDirection";

export class WordLocation {
  readonly x: number;
  readonly y: number;
  readonly direction: GridDirection;

  constructor(x: number, y: number, direction: GridDirection) {
    this.x = x;
    this.y = y;
    this.direction = direction;
  }

  getX(): number {
    return this.x;
  }

  getY(): number {
    return this.y;
  }

  getDirection(): GridDirection {
    return this.direction;
  }
}
