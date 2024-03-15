import { defineComponent, reactive, ref, onMounted, onUnmounted } from "vue"
import { NForm, NFormItem, NButton, NSpace, FormItemProps } from 'naive-ui'
import { AutoColumn } from './autoColumn'
import './style.scss'

export const LoQuery = defineComponent({
  props: {
    value: {
      type: Object,
      default () {
        return {}
      }
    },
    xs: {
      type: Number,
      default: 1
    },
    sm: {
      type: Number,
      default: 1
    },
    md: {
      type: Number,
      default: 2
    },
    lg: {
      type: Number,
      default: 3
    },
    xl: {
      type: Number,
      default: 4
    },
    xxl: {
      type: Number,
      default: 4
    },
    xxxl: {
      type: Number,
      default: 5
    },
    xxxxl: {
      type: Number,
      default: 6
    },
    maxLine: {
      type: Number,
      default: 2
    },
    defaultColumn: {
      type: Number,
      default: 3
    },
    labelWidth: {
      type: Number,
      default: 80
    },
    defaultCollapse: {
      type: Boolean,
      default: true
    }
  },
  emits: ['search'],
  setup (props, ctx) {
    const data = reactive({
      model: {},
      show: false,
      currentSize: undefined,
      collapse: true
    })
    const autoColumn = ref()
    const vnode = ctx.slots.default?.()
   
    onMounted(() => {
      autoColumn.value = new AutoColumn({
        maxLine: props.maxLine,
        defaultColumn: props.defaultColumn,
        children: vnode,
        collapse: data.collapse,
        columnCount: {
          xs: props.xs,
          sm: props.sm,
          md: props.md,
          lg: props.lg,
          xl: props.xl,
          xxl: props.xxl,
          xxxl: props.xxxl,
          xxxxl: props.xxxxl
        }
      })
      // if (this.defaultCollapse) {
      //   this.collapseBtn()
      // }
      // // this.$refs?.query?.style.setProperty('--lable-width', this.$attrs['lable-width'])
      // console.log(this.$refs)
      
      window.addEventListener('resize', () => autoColumn.value.resize)
    })

    return () => {
      const slots = {
        search: () => (
          <>
            <NButton type="primary" onClick={() => {
              ctx.emit('search')
            }}>查询</NButton>
            <NButton onClick={() => {}}>重置</NButton>
          </>
        )
      }
      return (
        <section class="lo-query">
          <NForm 
            model={data.model} 
            labelWidth={props.labelWidth}
            labelPlacement="left"
            inline
            ref="form">
            {vnode}
            <section class="end">
              <NSpace>
                  {ctx.slots.search ? ctx.slots.search(): slots.search()}
                  <NButton onClick={() => {
                    data.collapse = !data.collapse
                    autoColumn.value.collapseQuery(data.collapse)
                  }}>
                    { data.collapse ? '展开' : '收起' }
                  </NButton>
                </NSpace>
              
            </section>
          </NForm>
        </section>
      )
    }
  }
})

export type LoQueryItemProps = {
  exclude: boolean
  column: number
  show: boolean
} & FormItemProps

export const LoQueryItem = defineComponent({
  props: {
    // 如果存在，将直接过滤，不参与折叠组件渲染
    exclude: Boolean,
    column: {
      type: Number,
      default: 1
    },
    show: {
      type: Boolean,
      default: true
    }
  },
  setup(props: LoQueryItemProps, ctx) {
      return () => {
        return props.show ? (
          <section
            class="lo-query-item"
            style={{
              // display: true ? 'flex' : 'none',
              // width: `33%`w
            }}>
              <NFormItem {...ctx.attrs}>
                {ctx.slots.default?.()}
              </NFormItem>
          </section>
        ) : null
      }
  },
})