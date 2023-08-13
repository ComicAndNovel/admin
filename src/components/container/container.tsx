import { defineComponent } from "vue"
import './style.scss'

export const Container = defineComponent({
  setup (props, ctx) {
    console.log(ctx.slots)
    return () => {
      return (
        <section class="container-box">
          <header>
            <section>
              {ctx.slots.search?.()}
            </section>
            <section style={{
              textAlign: 'right'
            }}>
              { ctx.slots.action?.()}
            </section>
          </header>
          {ctx.slots.default?.()}
        </section>
      )
    }
  }
})