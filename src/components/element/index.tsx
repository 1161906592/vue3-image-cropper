import { computed, defineComponent, PropType, ref, watch, watchEffect, withModifiers } from 'vue'
import useControls from '../../hooks/useControls'
import styles from './index.module.scss'

const Element = defineComponent({
  props: {
    src: String as PropType<string>,
    width: { type: Number as PropType<number>, required: true },
    height: { type: Number as PropType<number>, required: true },
    showSize: { type: Boolean as PropType<boolean>, default: true },
    previewContainer: Function as PropType<() => HTMLDivElement>,
  },
  setup(props) {
    const { shape, style, controls, onContainerDrag, maskCanvasRef } = useControls({
      defaultShape: { width: props.width, height: props.height },
    })

    const imgRef = ref<HTMLImageElement>()

    const previewContainer = computed(() => props.previewContainer?.())

    const previewContextRef = ref<CanvasRenderingContext2D | null>(null)

    watch(previewContainer, (previewContainer) => {
      if (!previewContainer) {
        return
      }
      const canvas = document.createElement('canvas')
      canvas.width = 50
      canvas.height = 50
      previewContainer.appendChild(canvas)
      previewContextRef.value = canvas.getContext('2d')
    })

    watchEffect(() => {
      const ctx = previewContextRef.value
      const img = imgRef.value
      if (!ctx || !img) {
        return
      }
      ctx.clearRect(0, 0, 50, 50)
      ctx.drawImage(img, shape.x, shape.y, shape.width, shape.height, 0, 0, 50, 50)
    })

    return () => (
      <div class={styles.wrapper} style={{ width: `${props.width}px`, height: `${props.height}px` }}>
        {!!props.src && (
          <>
            <img src={props.src} draggable={false} ref={imgRef} />
            <canvas class={styles.mask} ref={maskCanvasRef} />
            <div class={styles.controls} style={style.value} onMousedown={withModifiers(onContainerDrag, ['stop'])}>
              {!!props.showSize && (
                <div class={styles.size} style={{ transform: `translateY(${shape.y > 22 ? '-100%' : 0})` }}>
                  {shape.width} x {shape.height}
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
