function scaleCompute(shape: Sizes, size: number) {
  if (shape.width > shape.height) {
    const scale = size / shape.width
    const height = ~~(shape.height * scale)
    const y = (size - height) / 2
    return {
      x: 0,
      y,
      width: size,
      height,
      maxWidth: size,
      maxHeight: y + height,
      scale,
    }
  }
  const scale = size / shape.height
  const width = ~~(shape.width * scale)
  const x = (size - width) / 2
  return {
    x,
    y: 0,
    width,
    height: size,
    maxWidth: x + width,
    maxHeight: size,
    scale,
  }
}

export default scaleCompute
