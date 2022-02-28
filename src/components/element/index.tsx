import { computed, defineComponent, PropType, ref, watchEffect, withModifiers, Teleport, toRef, reactive } from 'vue'
import useControls from '../../hooks/useControls'
import scaleCompute from '../../utils/scaleCompute'
import loadImage from '../../utils/loadImage'
import useMask from '../../hooks/useMask'
import styles from './index.module.scss'

const Element = defineComponent({
  props: {
    src: String as PropType<string>,
    size: { type: Number as PropType<number>, default: 400 },
    minSize: { type: Number as PropType<number>, default: 20 },
    showSize: { type: Boolean as PropType<boolean>, default: true },
    maskColor: { type: String as PropType<string>, default: '#00000032' },
    initPadding: { type: Number as PropType<number>, default: 0 },
    previewTo: Object as PropType<HTMLElement>,
    previewSize: { type: Number as PropType<number>, default: 50 },
    previewPixelRatio: { type: Number as PropType<number>, default: devicePixelRatio },
  },
  setup(props) {
    const sizeRef = toRef(props, 'size')
    const minSizeRef = toRef(props, 'minSize')
    const maskColorRef = toRef(props, 'maskColor')
    const initPaddingRef = toRef(props, 'initPadding')
    const imageSizesReactive = reactive({
      width: 0,
      height: 0,
    })
    const { controlShapeReactive, imageStyleRef, cropShapeRef, imageShapeRef, controls, onContainerDrag } = useControls(
      {
        sizeRef,
        minSizeRef,
        imageSizesReactive,
        initPaddingRef,
      }
    )

    const maskCanvasRef = useMask({
      sizeRef,
      maskColorRef,
      controlShapeReactive,
    })

    const imageRef = ref<HTMLImageElement>()

    const previewCanvasRef = ref<HTMLCanvasElement>()

    const previewContextRef = computed(() => previewCanvasRef.value?.getContext('2d'))

    const previewShapeRef = computed(() => scaleCompute(cropShapeRef.value, props.previewSize))

    watchEffect(() => {
      const ctx = previewContextRef.value
      const image = imageRef.value
      if (!ctx || !image) {
        return
      }
      const cropShape = cropShapeRef.value
      const previewShape = previewShapeRef.value
      const { scale } = imageShapeRef.value
      const { previewSize, previewPixelRatio } = props
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

    watchEffect(async () => {
      const src = props.src
      if (!src) {
        return
      }
      const image = await loadImage(src)
      imageRef.value = image
      imageSizesReactive.width = image.width
      imageSizesReactive.height = image.height
    })

    return () => {
      const { size, previewPixelRatio, previewSize } = props
      const realPreviewSize = previewSize * previewPixelRatio
      return (
        <div class={styles.wrapper} style={{ width: `${size}px`, height: `${size}px` }} draggable={false}>
          {!!imageRef.value && (
            <>
              <img src={props.src} style={imageStyleRef.value} />
              <canvas width={size} height={size} class={styles.mask} ref={maskCanvasRef} />
              <div
                class={styles.controls}
                style={{
                  transform: `translate(${controlShapeReactive.x}px, ${controlShapeReactive.y}px)`,
                  width: `${controlShapeReactive.width}px`,
                  height: `${controlShapeReactive.height}px`,
                }}
                onMousedown={withModifiers(onContainerDrag, ['stop'])}
              >
                {!!props.showSize && (
                  <div
                    class={styles.size}
                    style={{ transform: `translateY(${controlShapeReactive.y > 22 ? '-100%' : 0})` }}
                  >
                    {controlShapeReactive.width} x {controlShapeReactive.height}
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
          {!!props.previewTo && (
            <Teleport to={props.previewTo}>
              <canvas width={realPreviewSize} height={realPreviewSize} ref={previewCanvasRef} class={styles.preview} />
            </Teleport>
          )}
        </div>
      )
    }
  },
})

export default Element
