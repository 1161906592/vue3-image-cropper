# vue3-image-cropper

一个vue3的图片裁剪组件

## 效果图

![效果图](preview.png)

## 用法

目前还没有发布npm包，如果有使用需求可联系我发包~ ^_^

```typescript jsx
import { defineComponent, ref } from 'vue'
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

```

## API

| 名称      | 类型          | 默认值              | 说明              |
|---------|-------------|------------------|-----------------|
| src     | string      | -                | 原始图片地址          |
| size    | number      | 400              | 裁剪器的尺寸          |
| minSize | number      | 20               | 图片可被裁剪的最小尺寸     |
| showSize | number      | true             | 左上角显示当前裁剪区域的尺寸  |
| maskColor | string      | #00000032        | 遮罩层的颜色          |
| initPadding | number      | 0                | 初始裁剪区域距离图片四周的距离 |
| previewTo | HTMLElement | -                | 预览图片的dom        |
| previewSize | number      | 50               | 预览图片的尺寸         |
| previewPixelRatio | number      | devicePixelRatio | 预览图片渲染的像素比      |
