import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'

const app = defineComponent({
  setup() {
    return () => <RouterView />
  },
})

export default app
