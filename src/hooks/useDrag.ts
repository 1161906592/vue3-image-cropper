interface Option {
  cursor: string
}

function useDrag(onDrag: (offset: Offset) => Offset, option: Option) {
  const { cursor } = option
  return (e: MouseEvent) => {
    const originCursor = document.body.style.cursor
    document.body.style.cursor = cursor
    const curPosition = {
      x: e.clientX,
      y: e.clientY,
    }
    const handleMousemove = (e: MouseEvent) => {
      const { x, y } = onDrag({
        x: e.clientX - curPosition.x,
        y: e.clientY - curPosition.y,
      })
      curPosition.x += x
      curPosition.y += y
    }
    const handleMouseup = () => {
      document.removeEventListener('mousemove', handleMousemove)
      document.removeEventListener('mouseup', handleMouseup)
      document.body.style.cursor = originCursor
    }
    document.addEventListener('mousemove', handleMousemove)
    document.addEventListener('mouseup', handleMouseup)
  }
}

export default useDrag
