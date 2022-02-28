import { defineComponent, PropType, ref, watchEffect, withModifiers, Teleport, toRef } from 'vue'
import useControls from './hooks/useControls'
import loadImage from './utils/loadImage'
import useMask from './hooks/useMask'
import usePreview from './hooks/usePreview'
import styles from './styles/index.module.scss'

const ImageCropper = defineComponent({
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
    const previewSizeRef = toRef(props, 'previewSize')
    const previewPixelRatioRef = toRef(props, 'previewPixelRatio')

    const imageRef = ref<HTMLImageElement>()

    const { controlShapeReactive, cropShapeRef, imageScaleRef, controls, onContainerDrag } = useControls({
      sizeRef,
      minSizeRef,
      initPaddingRef,
      imageRef,
    })

    const { maskCanvasRef } = useMask({
      sizeRef,
      maskColorRef,
      controlShapeReactive,
    })

    const { previewCanvasRef } = usePreview({
      cropShapeRef,
      imageScaleRef,
      imageRef,
      previewSizeRef,
      previewPixelRatioRef,
    })

    watchEffect(async () => {
      const src = props.src
      if (src) {
        imageRef.value = await loadImage(src)
      }
    })

    return () => {
      const { size, previewPixelRatio, previewSize } = props
      const imageShape = imageScaleRef.value
      const realPreviewSize = previewSize * previewPixelRatio
      return (
        <div class={styles.wrapper} style={{ width: `${size}px`, height: `${size}px` }} draggable={false}>
          {!!imageRef.value && (
            <>
              <img src={props.src} style={{ width: `${imageShape.width}px`, height: `${imageShape.height}px` }} />
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

export default ImageCropper
