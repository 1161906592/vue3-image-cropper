import { h, Fragment, defineComponent, ref } from 'vue'
import ImageCropper from 'vue3-image-cropper'
import 'vue3-image-cropper/styles/index.css'

const App = defineComponent({
  setup() {
    const previewRef = ref<HTMLDivElement>()
    const cropperRef = ref()
    const fileRef = ref<File>()

    return () => (
      <>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <input
            type="file"
            onChange={(e: Event) => {
              fileRef.value = (e.target as HTMLInputElement).files?.[0]
            }}
          />
          <button
            onClick={() => {
              const canvas = cropperRef.value?.exportImage()
              const a = document.createElement('a')
              a.href = canvas.toDataURL()
              a.download = 'test.png'
              a.click()
            }}
          >
            导出
          </button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <ImageCropper
            src="https://p9-dcd-sign.byteimg.com/tos-cn-i-0004/84e59cc74c1d44d1bcb0359826b827d5~tplv-resize:640:0.png?x-expires=1646632870&x-signature=wSglv1afZgHKK2r4%2FFD5n6dN9ac%3D"
            file={fileRef.value}
            size={400}
            minSize={10}
            previewSize={200}
            previewTo={previewRef.value as HTMLDivElement}
            initPadding={20}
            // maskColor="red"
            ref={cropperRef}
            previewPixelRatio={4}
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
      </>
    )
  },
})

export default App
