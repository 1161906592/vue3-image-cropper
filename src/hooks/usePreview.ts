import { computed, Ref, ref, watchEffect } from 'vue'
import scaleCompute from '../utils/scaleCompute'
import { Shape } from './useMask'

interface Props {
  cropShapeRef: Ref<Shape>
  imageScaleRef: Ref<ReturnType<typeof scaleCompute>>
  previewSizeRef: Ref<number>
  previewPixelRatioRef: Ref<number>
  imageRef: Ref<HTMLImageElement | undefined>
}

function usePreview(props: Props) {
  const { cropShapeRef, imageScaleRef, previewSizeRef, previewPixelRatioRef, imageRef } = props

  const previewCanvasRef = ref<HTMLCanvasElement>()

  const previewContextRef = computed(() => previewCanvasRef.value?.getContext('2d'))

  const previewShapeRef = computed(() => scaleCompute(cropShapeRef.value, previewSizeRef.value))

  watchEffect(() => {
    const ctx = previewContextRef.value
    const image = imageRef.value
    if (!ctx || !image) {
      return
    }
    const cropShape = cropShapeRef.value
    const previewShape = previewShapeRef.value
    const { scale } = imageScaleRef.value
    const previewSize = previewSizeRef.value
    const previewPixelRatio = previewPixelRatioRef.value
    const size = previewSize * previewPixelRatio

    ctx.clearRect(0, 0, size, size)
    ctx.drawImage(
      image,
      cropShape.x / scale,
      cropShape.y / scale,
      cropShape.width / scale,
      cropShape.height / scale,
      previewShape.x * previewPixelRatio,
      previewShape.y * previewPixelRatio,
      previewShape.width * previewPixelRatio,
      previewShape.height * previewPixelRatio
    )
  })

  return { previewCanvasRef, previewShapeRef }
}

export default usePreview
