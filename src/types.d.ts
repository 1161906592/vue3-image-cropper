declare interface Shape {
  x: number
  y: number
  width: number
  height: number
}

declare type Sizes = Omit<Shape, 'x' | 'y'>

declare interface Offset {
  x: number
  y: number
}
