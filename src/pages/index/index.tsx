import { defineComponent, ref } from 'vue'
import Element from '../../components/element'

const home = defineComponent({
  setup() {
    const srcRef = ref<string>()
    const handleChange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) {
        return
      }
      const fr = new FileReader()
      fr.onload = (e) => {
        const result = e.target?.result as string
        if (!result) {
          return
        }
        srcRef.value = result
      }
      fr.readAsDataURL(file)
    }
    return () => (
      <>
        <input type="file" onChange={handleChange} />
        <Element
          src={srcRef.value}
          width={400}
          height={400}
          previewContainer={() => document.getElementById('preivew') as HTMLDivElement}
        />
        <div id="preivew" style={{ width: '50px', height: '50px' }} />
      </>
    )
  },
})

export default home
