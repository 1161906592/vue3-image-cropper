# vue3-image-cropper

一个vue3的图片裁剪组件

## 效果图

![效果图](preview.png)

## 用法

目前还没有发布npm包，如果有使用需求可联系我发包~ ^_^

```typescript jsx
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
              cropperRef.value?.exportImage().then((canvas: HTMLCanvasElement) => {
                console.log(canvas.toDataURL())
              })
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
```

## API

| 名称                | 类型          | 默认值              | 说明              |
|-------------------|-------------|------------------|-----------------|
| file              | File        | -                | 图片文件，优先级高于src   |
| src               | string      | -                | 原始图片地址          |
| size              | number      | 400              | 裁剪器的尺寸          |
| minSize           | number      | 20               | 图片可被裁剪的最小尺寸     |
| showSize          | number      | true             | 左上角显示当前裁剪区域的尺寸  |
| maskColor         | string      | #00000032        | 遮罩层的颜色          |
| initPadding       | number      | 0                | 初始裁剪区域距离图片四周的距离 |
| previewTo         | HTMLElement | -                | 预览图片的dom        |
| previewSize       | number      | 50               | 预览图片的尺寸         |
| previewPixelRatio | number      | devicePixelRatio | 预览图片渲染的像素比      |
