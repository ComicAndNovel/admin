import { defineComponent } from 'vue'
import useCounterStore from './store/index'
import './App.scss'
import { RouterView } from 'vue-router'

export default defineComponent({
  setup () {
    const counterStore = useCounterStore()

    return () => {
      return (
        <section class="container">
          <RouterView></RouterView>
        </section>
      )
    }
  }
})