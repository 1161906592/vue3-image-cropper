import { computed, nextTick, onMounted, reactive, ref, StyleValue, watch, watchEffect } from 'vue'
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
  length: number
}

const min = 20
const initPadding = 0

export function scaleCompute(shape: Shape, length: number) {
  if (shape.width > shape.height) {
    const scale = length / shape.width
    const height = ~~(shape.height * scale)
    const y = (length - height) / 2
    return {
      x: 0,
      y,
      width: length,
      height,
      maxWdith: length,
      maxHeight: y + height,
      scale,
    }
  }
  const scale = length / shape.height
  const width = ~~(shape.width * scale)
  const x = (length - width) / 2
  return {
    x,
    y: 0,
    width,
    height: length,
    maxWdith: x + width,
    maxHeight: length,
    scale,
  }
}

function useControls(props: Props) {
  const { length } = props
  const imageRawShape = reactive<Shape>({
    width: 0,
    height: 0,
  })
  const controlShape = reactive({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  })

  const imageShapeRef = computed(() => scaleCompute(imageRawShape, length))

  const imageStyleRef = computed(() => {
    const imageShape = imageShapeRef.value
    return { width: `${imageShape.width}px`, height: `${imageShape.height}px` }
  })

  const cropShapeRef = computed(() => {
    const imageShape = imageShapeRef.value
    return {
      x: controlShape.x - imageShape.x,
      y: controlShape.y - imageShape.y,
      width: controlShape.width,
      height: controlShape.height,
    }
  })

  watchEffect(() => {
    const imageShape = imageShapeRef.value
    controlShape.x = imageShape.x + initPadding
    controlShape.y = imageShape.y + initPadding
    controlShape.width = imageShape.width - initPadding * 2
    controlShape.height = imageShape.height - initPadding * 2
  })

  const maskCanvasRef = ref<HTMLCanvasElement>()
  const maskContextRef = ref<CanvasRenderingContext2D | null>()

  const renderMask = () => {
    const ctx = maskContextRef.value
    if (!ctx) {
      return
    }
    ctx.clearRect(0, 0, length, length)
    ctx.fillStyle = '#0005'
    ctx.fillRect(0, 0, length, controlShape.y)
    ctx.fillRect(0, controlShape.y, controlShape.x, controlShape.height)
    ctx.fillRect(
      controlShape.x + controlShape.width,
      controlShape.y,
      length - controlShape.x - controlShape.width,
      controlShape.height
    )
    ctx.fillRect(0, controlShape.y + controlShape.height, length, length - controlShape.y - controlShape.height)
  }

  watch(
    maskCanvasRef,
    (canvas) => {
      if (!canvas) {
        return
      }
      canvas.width = length
      canvas.height = length
      maskContextRef.value = canvas.getContext('2d')
      nextTick(renderMask)
    },
    { immediate: true }
  )

  watch(controlShape, renderMask)

  const onContainerDrag = useDrag(
    ({ x, y }) => {
      const { x: shapeX, y: shapeY } = controlShape
      const imageShape = imageShapeRef.value

      controlShape.x = Math.min(Math.max(controlShape.x + x, imageShape.x), imageShape.maxWdith - controlShape.width)
      controlShape.y = Math.min(Math.max(controlShape.y + y, imageShape.y), imageShape.maxHeight - controlShape.height)

      return { x: controlShape.x - shapeX, y: controlShape.y - shapeY }
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
          const { x: shapeX, y: shapeY, width: shapeWidth, height: shapeHeight } = controlShape
          const imageShape = imageShapeRef.value

          controlShape.x = Math.min(Math.max(controlShape.x + x, imageShape.x), shapeX + shapeWidth - min)
          controlShape.y = Math.min(Math.max(controlShape.y + y, imageShape.y), shapeY + shapeHeight - min)

          const offsetX = controlShape.x - shapeX
          const offsetY = controlShape.y - shapeY

          controlShape.width -= offsetX
          controlShape.height -= offsetY

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
          const { y: shapeY, height: shapeHeight } = controlShape
          const imageShape = imageShapeRef.value

          controlShape.y = Math.min(Math.max(controlShape.y + y, imageShape.y), shapeY + shapeHeight - min)

          const offsetY = controlShape.y - shapeY

          controlShape.height -= offsetY

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
          const { y: shapeY, width: shapeWidth, height: shapeHeight } = controlShape
          const imageShape = imageShapeRef.value

          controlShape.y = Math.min(Math.max(controlShape.y + y, imageShape.y), shapeY + shapeHeight - min)

          const offsetY = controlShape.y - shapeY

          controlShape.width = Math.min(Math.max(controlShape.width + x, min), imageShape.maxWdith - controlShape.x)
          controlShape.height = Math.min(
            Math.max(controlShape.height - offsetY, 0),
            imageShape.maxHeight - controlShape.y
          )

          return { x: controlShape.width - shapeWidth, y: offsetY }
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
          const { width: shapeWidth } = controlShape
          const imageShape = imageShapeRef.value

          controlShape.width = Math.min(Math.max(controlShape.width + x, min), imageShape.maxWdith - controlShape.x)

          return { x: controlShape.width - shapeWidth, y: 0 }
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
          const { width: shapeWidth, height: shapeHeight } = controlShape
          const imageShape = imageShapeRef.value

          controlShape.width = Math.min(Math.max(controlShape.width + x, min), imageShape.maxWdith - controlShape.x)
          controlShape.height = Math.min(Math.max(controlShape.height + y, min), imageShape.maxHeight - controlShape.y)

          return { x: controlShape.width - shapeWidth, y: controlShape.height - shapeHeight }
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
          const { height: shapeHeight } = controlShape
          const imageShape = imageShapeRef.value

          controlShape.height = Math.min(Math.max(controlShape.height + y, min), imageShape.maxHeight - controlShape.y)

          return { x: 0, y: controlShape.height - shapeHeight }
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
          const { x: shapeX, width: shapeWidth, height: shapeHeight } = controlShape
          const imageShape = imageShapeRef.value

          controlShape.x = Math.min(Math.max(controlShape.x + x, imageShape.x), shapeX + shapeWidth - min)

          const offsetX = controlShape.x - shapeX

          controlShape.width = Math.min(Math.max(controlShape.width - offsetX, 0), imageShape.maxWdith - controlShape.x)
          controlShape.height = Math.min(Math.max(controlShape.height + y, min), imageShape.maxHeight - controlShape.y)

          return { x: offsetX, y: controlShape.height - shapeHeight }
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
          const { x: shapeX, width: shapeWidth } = controlShape
          const imageShape = imageShapeRef.value

          controlShape.x = Math.min(Math.max(controlShape.x + x, imageShape.x), shapeX + shapeWidth - min)

          const offsetX = controlShape.x - shapeX

          controlShape.width = Math.min(Math.max(controlShape.width - offsetX, 0), imageShape.maxWdith - controlShape.x)

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
    controlShape,
    imageStyleRef,
    imageRawShape,
    controls,
    onContainerDrag,
    maskCanvasRef,
    cropShapeRef,
    imageShapeRef,
  }
}

export default useControls
