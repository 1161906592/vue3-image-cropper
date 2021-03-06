import {
  h,
  Fragment,
  defineComponent,
  PropType,
  ref,
  watchEffect,
  withModifiers,
  Teleport,
  toRef,
  nextTick,
  computed,
} from 'vue'
import useControls from './hooks/useControls'
import loadImage from './utils/loadImage'
import useMask from './hooks/useMask'
import usePreview from './hooks/usePreview'
import fileToSrc from './utils/fileToSrc'

const ImageCropper = defineComponent({
  props: {
    src: String as PropType<string>,
    file: Object as PropType<File>,
    size: { type: Number as PropType<number>, default: 400 },
    minSize: { type: Number as PropType<number>, default: 20 },
    showSize: { type: Boolean as PropType<boolean>, default: true },
    maskColor: { type: String as PropType<string>, default: '#00000032' },
    initPadding: { type: Number as PropType<number>, default: 0 },
    previewTo: Object as PropType<HTMLElement>,
    previewSize: { type: Number as PropType<number>, default: 50 },
    previewPixelRatio: { type: Number as PropType<number>, default: devicePixelRatio },
  },
  setup(props, { expose }) {
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

    const { previewCanvasRef, previewShapeRef } = usePreview({
      cropShapeRef,
      imageScaleRef,
      imageRef,
      previewSizeRef,
      previewPixelRatioRef,
    })

    const fileSrcRef = ref<string>()

    watchEffect(async () => {
      const { file } = props
      if (!file) {
        return
      }
      fileSrcRef.value = await fileToSrc(file)
    })

    const realSrcRef = computed(() => fileSrcRef.value || props.src)

    watchEffect(async () => {
      const src = realSrcRef.value
      if (src) {
        imageRef.value = await loadImage(src)
      }
    })

    expose({
      exportImage() {
        const image = imageRef.value
        if (!image) {
          return
        }
        const { previewPixelRatio } = props
        const canvas = document.createElement('canvas')
        const previewShape = previewShapeRef.value
        canvas.width = previewShape.width * previewPixelRatio
        canvas.height = previewShape.height * previewPixelRatio
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          return
        }
        const cropShape = cropShapeRef.value
        const { scale } = imageScaleRef.value
        ctx.drawImage(
          image,
          cropShape.x / scale,
          cropShape.y / scale,
          cropShape.width / scale,
          cropShape.height / scale,
          0,
          0,
          canvas.width,
          canvas.height
        )
        return canvas
      },
    })

    return () => {
      const { size, previewPixelRatio, previewSize } = props
      const imageShape = imageScaleRef.value
      const realPreviewSize = previewSize * previewPixelRatio
      return (
        <div class="cropper-wrapper" style={{ width: `${size}px`, height: `${size}px` }} draggable={false}>
          {!!imageRef.value && (
            <>
              <img
                src={realSrcRef.value}
                style={{ width: `${imageShape.width}px`, height: `${imageShape.height}px` }}
              />
              <canvas width={size} height={size} ref={maskCanvasRef} />
              <div
                class="cropper-controls"
                style={{
                  transform: `translate(${controlShapeReactive.x}px, ${controlShapeReactive.y}px)`,
                  width: `${controlShapeReactive.width}px`,
                  height: `${controlShapeReactive.height}px`,
                }}
                onMousedown={withModifiers(onContainerDrag, ['stop'])}
              >
                {!!props.showSize && (
                  <div
                    class="cropper-size"
                    style={{ transform: `translateY(${controlShapeReactive.y > 22 ? '-100%' : 0})` }}
                  >
                    {controlShapeReactive.width} x {controlShapeReactive.height}
                  </div>
                )}
                {controls.map((item) => (
                  <div
                    key={item.directions.join('')}
                    class={[...item.directions, 'cropper-control']}
                    onMousedown={withModifiers(item.onDrag, ['stop'])}
                    style={{ cursor: item.cursor }}
                  />
                ))}
              </div>
            </>
          )}
          {!!props.previewTo && (
            <Teleport to={props.previewTo}>
              <canvas width={realPreviewSize} height={realPreviewSize} ref={previewCanvasRef} class="cropper-preview" />
            </Teleport>
          )}
        </div>
      )
    }
  },
})

export default ImageCropper
