import { computed, nextTick, onMounted, reactive, ref, StyleValue, watch } from 'vue'
import useDrag from './useDrag'

type Direction = 'n' | 'e' | 's' | 'w' | 'c'

interface Control {
  directions: Direction[]
  onDrag: ReturnType<typeof useDrag>
  cursor: string
}

interface Shape {
  width: number
  height: number
}

interface Props {
  defaultShape: Shape
}

const min = 20
const initPadding = 20

function useControls(props: Props) {
  const { defaultShape } = props
  const shape = reactive({
    x: initPadding,
    y: initPadding,
    width: defaultShape.width - 2 * initPadding,
    height: defaultShape.height - 2 * initPadding,
  })

  const style = computed<StyleValue>(() => {
    return {
      transform: `translate(${shape.x}px, ${shape.y}px)`,
      width: `${shape.width}px`,
      height: `${shape.height}px`,
    }
  })

  const maskCanvasRef = ref<HTMLCanvasElement>()
  const maskContextRef = ref<CanvasRenderingContext2D | null>()

  const renderMask = () => {
    const ctx = maskContextRef.value
    if (!ctx) {
      return
    }
    ctx.clearRect(0, 0, defaultShape.width, defaultShape.height)
    ctx.fillStyle = '#0005'
    ctx.fillRect(0, 0, defaultShape.width, shape.y)
    ctx.fillRect(0, shape.y, shape.x, shape.height)
    ctx.fillRect(shape.x + shape.width, shape.y, defaultShape.width - shape.x - shape.width, shape.height)
    ctx.fillRect(0, shape.y + shape.height, defaultShape.width, defaultShape.height - shape.y - shape.height)
  }

  watch(
    maskCanvasRef,
    (canvas) => {
      if (!canvas) {
        return
      }
      canvas.width = defaultShape.width
      canvas.height = defaultShape.height
      maskContextRef.value = canvas.getContext('2d')
      nextTick(renderMask)
    },
    { immediate: true }
  )

  watch(shape, renderMask)

  const onContainerDrag = useDrag(
    ({ x, y }) => {
      const { x: shapeX, y: shapeY } = shape

      shape.x = Math.min(Math.max(shape.x + x, 0), defaultShape.width - shape.width)
      shape.y = Math.min(Math.max(shape.y + y, 0), defaultShape.height - shape.height)

      return { x: shape.x - shapeX, y: shape.y - shapeY }
    },
    {
      cursor: 'move',
    }
  )

  const controls: Control[] = [
    {
      directions: ['n', 'w'],
      onDrag: useDrag(
        ({ x, y }) => {
          const { x: shapeX, y: shapeY, width: shapeWidth, height: shapeHeight } = shape

          shape.x = Math.min(Math.max(shape.x + x, 0), shapeX + shapeWidth - min)
          shape.y = Math.min(Math.max(shape.y + y, 0), shapeY + shapeHeight - min)

          const offsetX = shape.x - shapeX
          const offsetY = shape.y - shapeY

          shape.width -= offsetX
          shape.height -= offsetY

          return { x: offsetX, y: offsetY }
        },
        {
          cursor: 'nw-resize',
        }
      ),
      cursor: 'nw-resize',
    },
    {
      directions: ['n', 'c'],
      onDrag: useDrag(
        ({ y }) => {
          const { y: shapeY, height: shapeHeight } = shape

          shape.y = Math.min(Math.max(shape.y + y, 0), shapeY + shapeHeight - min)

          const offsetY = shape.y - shapeY

          shape.height -= offsetY

          return { x: 0, y: offsetY }
        },
        {
          cursor: 'n-resize',
        }
      ),
      cursor: 'n-resize',
    },
    {
      directions: ['n', 'e'],
      onDrag: useDrag(
        ({ x, y }) => {
          const { y: shapeY, width: shapeWidth, height: shapeHeight } = shape
          shape.y = Math.min(Math.max(shape.y + y, 0), shapeY + shapeHeight - min)

          const offsetY = shape.y - shapeY

          shape.width = Math.min(Math.max(shape.width + x, min), defaultShape.width - shape.x)
          shape.height = Math.min(Math.max(shape.height - offsetY, 0), defaultShape.height - shape.y)

          return { x: shape.width - shapeWidth, y: offsetY }
        },
        {
          cursor: 'ne-resize',
        }
      ),
      cursor: 'ne-resize',
    },
    {
      directions: ['e', 'c'],
      onDrag: useDrag(
        ({ x }) => {
          const { width: shapeWidth } = shape

          shape.width = Math.min(Math.max(shape.width + x, min), defaultShape.width - shape.x)

          return { x: shape.width - shapeWidth, y: 0 }
        },
        {
          cursor: 'e-resize',
        }
      ),
      cursor: 'e-resize',
    },
    {
      directions: ['s', 'e'],
      onDrag: useDrag(
        ({ x, y }) => {
          const { width: shapeWidth, height: shapeHeight } = shape
          shape.width = Math.min(Math.max(shape.width + x, min), defaultShape.width - shape.x)
          shape.height = Math.min(Math.max(shape.height + y, min), defaultShape.height - shape.y)

          return { x: shape.width - shapeWidth, y: shape.height - shapeHeight }
        },
        {
          cursor: 'se-resize',
        }
      ),
      cursor: 'se-resize',
    },
    {
      directions: ['s', 'c'],
      onDrag: useDrag(
        ({ y }) => {
          const { height: shapeHeight } = shape
          shape.height = Math.min(Math.max(shape.height + y, min), defaultShape.height - shape.y)

          return { x: 0, y: shape.height - shapeHeight }
        },
        {
          cursor: 's-resize',
        }
      ),
      cursor: 's-resize',
    },
    {
      directions: ['s', 'w'],
      onDrag: useDrag(
        ({ x, y }) => {
          const { x: shapeX, width: shapeWidth, height: shapeHeight } = shape
          shape.x = Math.min(Math.max(shape.x + x, 0), shapeX + shapeWidth - min)

          const offsetX = shape.x - shapeX

          shape.width = Math.min(Math.max(shape.width - offsetX, 0), defaultShape.width - shape.x)
          shape.height = Math.min(Math.max(shape.height + y, min), defaultShape.height - shape.y)

          return { x: offsetX, y: shape.height - shapeHeight }
        },
        {
          cursor: 'sw-resize',
        }
      ),
      cursor: 'sw-resize',
    },
    {
      directions: ['w', 'c'],
      onDrag: useDrag(
        ({ x }) => {
          const { x: shapeX, width: shapeWidth } = shape
          shape.x = Math.min(Math.max(shape.x + x, 0), shapeX + shapeWidth - min)

          const offsetX = shape.x - shapeX

          shape.width = Math.min(Math.max(shape.width - offsetX, 0), defaultShape.width - shape.x)

          return { x: offsetX, y: 0 }
        },
        {
          cursor: 'w-resize',
        }
      ),
      cursor: 'w-resize',
    },
  ]

  return {
    shape,
    style,
    controls,
    onContainerDrag,
    maskCanvasRef,
  }
}

export default useControls
