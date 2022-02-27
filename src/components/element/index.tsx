import { computed, defineComponent, PropType, ref, watch, watchEffect, withModifiers } from 'vue'
import useControls, { scaleCompute } from '../../hooks/useControls'
import styles from './index.module.scss'

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve) => {
    const image = new Image()
    image.onload = () => {
      resolve(image)
    }
    image.src = src
  })
}

const Element = defineComponent({
  props: {
    src: String as PropType<string>,
    length: { type: Number as PropType<number>, required: true },
    showSize: { type: Boolean as PropType<boolean>, default: true },
    previewContainer: Function as PropType<() => HTMLDivElement>,
  },
  setup(props) {
    const {
      controlShape,
      imageStyleRef,
      imageRawShape,
      controls,
      onContainerDrag,
      maskCanvasRef,
      cropShapeRef,
      imageShapeRef,
    } = useControls({
      length: props.length,
    })

    const imgRef = ref<HTMLImageElement>()

    const previewContainerRef = computed(() => props.previewContainer?.())

    const previewContextRef = ref<CanvasRenderingContext2D | null>(null)

    watch(previewContainerRef, (previewContainer) => {
      if (!previewContainer) {
        return
      }
      const canvas = document.createElement('canvas')
      canvas.width = 50
      canvas.height = 50
      previewContainer.appendChild(canvas)
      previewContextRef.value = canvas.getContext('2d')
    })

    const previewShapeRef = computed(() => scaleCompute(cropShapeRef.value, 50))

    watchEffect(() => {
      const ctx = previewContextRef.value
      const img = imgRef.value
      if (!ctx || !img) {
        return
      }
      const cropShape = cropShapeRef.value
      const previewShape = previewShapeRef.value
      const { scale } = imageShapeRef.value

      ctx.clearRect(0, 0, 50, 50)
      ctx.drawImage(
        img,
        cropShape.x / scale,
        cropShape.y / scale,
        cropShape.width / scale,
        cropShape.height / scale,
        previewShape.x,
        previewShape.y,
        previewShape.width,
        previewShape.height
      )
    })

    watchEffect(async () => {
      const src = props.src
      if (!src) {
        return
      }
      const image = await loadImage(src)
      imgRef.value = image
      imageRawShape.width = image.width
      imageRawShape.height = image.height
    })

    return () => (
      <div class={styles.wrapper} style={{ width: `${props.length}px`, height: `${props.length}px` }}>
        {!!props.src && (
          <>
            <img src={props.src} draggable={false} style={imageStyleRef.value} />
            <canvas class={styles.mask} ref={maskCanvasRef} />
            <div
              class={styles.controls}
              style={{
                transform: `translate(${controlShape.x}px, ${controlShape.y}px)`,
                width: `${controlShape.width}px`,
                height: `${controlShape.height}px`,
              }}
              onMousedown={withModifiers(onContainerDrag, ['stop'])}
            >
              {!!props.showSize && (
                <div class={styles.size} style={{ transform: `translateY(${controlShape.y > 22 ? '-100%' : 0})` }}>
                  {controlShape.width} x {controlShape.height}
                </div>
              )}
              {controls.map((item) => (
                <div
                  key={item.directions.join('')}
                  class={[...item.directions.map((d) => styles[d]), styles.control]}
                  onMousedown={withModifiers(item.onDrag, ['stop'])}
                  style={{ cursor: item.cursor }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    )
  },
})

export default Element
