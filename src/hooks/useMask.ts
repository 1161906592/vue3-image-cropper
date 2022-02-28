import { computed, Ref, ref, watchEffect } from 'vue'

interface Props {
  sizeRef: Ref<number>
  maskColorRef: Ref<string>
  controlShapeReactive: Shape
}

function useMask(props: Props) {
  const { sizeRef, maskColorRef, controlShapeReactive } = props

  const maskCanvasRef = ref<HTMLCanvasElement>()
  const maskContextRef = computed(() => maskCanvasRef.value?.getContext('2d'))

  watchEffect(() => {
    const ctx = maskContextRef.value
    if (!ctx) {
      return
    }
    const size = sizeRef.value
    const maskColor = maskColorRef.value
    ctx.clearRect(0, 0, size, size)
    ctx.fillStyle = maskColor
    ctx.fillRect(0, 0, size, controlShapeReactive.y)
    ctx.fillRect(0, controlShapeReactive.y, controlShapeReactive.x, controlShapeReactive.height)
    ctx.fillRect(
      controlShapeReactive.x + controlShapeReactive.width,
      controlShapeReactive.y,
      size - controlShapeReactive.x - controlShapeReactive.width,
      controlShapeReactive.height
    )
    ctx.fillRect(
      0,
      controlShapeReactive.y + controlShapeReactive.height,
      size,
      size - controlShapeReactive.y - controlShapeReactive.height
    )
  })

  return { maskCanvasRef }
}

export default useMask
