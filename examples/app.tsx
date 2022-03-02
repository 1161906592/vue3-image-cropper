import { h, defineComponent, ref } from 'vue'
import ImageCropper from 'vue3-image-cropper'
import 'vue3-image-cropper/styles/index.css'

const app = defineComponent({
  setup() {
    const previewRef = ref<HTMLDivElement>()

    return () => (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <ImageCropper
          src="https://p9-dcd-sign.byteimg.com/tos-cn-i-0004/84e59cc74c1d44d1bcb0359826b827d5~tplv-resize:640:0.png?x-expires=1646632870&x-signature=wSglv1afZgHKK2r4%2FFD5n6dN9ac%3D"
          size={400}
          minSize={10}
          previewSize={200}
          previewTo={previewRef.value as HTMLDivElement}
          initPadding={20}
          // maskColor="red"
        />
        <div
          ref={previewRef}
          style={{
            position: 'relative',
            width: '200px',
            height: '200px',
            background: '#f2f4fa',
            marginLeft: '50px',
            borderRadius: '50%',
            overflow: 'hidden',
          }}
        />
      </div>
    )
  },
})

export default app
