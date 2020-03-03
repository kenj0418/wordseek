export class GridDirection {
  readonly x: number;
  readonly y: number;

  constructor(deltaX: number, deltaY: number) {
    this.x = deltaX;
    this.y = deltaY;
  }

  getX(): number {
    return this.x;
  }

  getY(): number {
    return this.y;
  }

  toString(): string {
    return `[${this.x},${this.y}]`;
  }

  public static readonly EAST = new GridDirection(1, 0);
  public static readonly WEST = new GridDirection(-1, 0);
  public static readonly SOUTH = new GridDirection(0, 1);
  public static readonly NORTH = new GridDirection(0, -1);
  public static readonly SOUTHEAST = new GridDirection(1, 1);
  public static readonly SOUTHWEST = new GridDirection(-1, 1);
  public static readonly NORTHEAST = new GridDirection(1, -1);
  public static readonly NORTHWEST = new GridDirection(-1, -1);
  public static readonly ALL_DIRECTIONS = [
    GridDirection.EAST,
    GridDirection.SOUTH,
    GridDirection.SOUTHEAST,
    GridDirection.WEST,
    GridDirection.NORTH,
    GridDirection.SOUTHWEST,
    GridDirection.NORTHEAST,
    GridDirection.NORTHWEST
  ];
}
