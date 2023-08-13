<template>
  <div :class="['lo-query', $attrs.size === 'small' ? 'lo-query-size-small' : '']" ref="query">
    <n-form 
      v-bind="$attrs" 
      :model="model" 
      :label-width="labelWidth"
      label-placement="left"
      inline
      ref="form">
      <slot></slot>
      <section class="end">
        <slot name="search">
          <n-button type="primary" @click="search">查询</n-button>
          <n-button @click="reset">重置</n-button>
        </slot>
        <n-button v-show="show" type="text">
          {{ collapse ? '展开' : '收起' }}
          <i :class="[`n-icon-arrow-${collapse ? 'down' : 'up'}`]"></i>
        </n-button>
      </section>
    </n-form>
    {{ currentSize }} === {{ $props.currentSize }}
  </div>
</template>

<script>
// import queryItem from './queryItem'
import cloneDeep from 'lodash/cloneDeep'
import { NForm, NFormItem, NButton } from 'naive-ui'
export default {
  name: 'lo-query',
  components: {
    NForm,
    NFormItem,
    NButton
  //   queryItem
  },
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
    col: {
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
  provide () {
    return {
      query: this
    }
  },
  data () {
    return {
      model: this.resetState(),
      show: false,
      column: this.col,
      currentSize: undefined,
      collapse: false
    }
  },
  created () {
    console.log(this.$props)
    this.getColumn()
  },
  mounted () {
    if (this.defaultCollapse) {
      this.collapseBtn()
    }
    this.$refs?.query?.style.setProperty('--lable-width', this.$attrs['lable-width'])
    console.log(this.$refs)
    window.addEventListener('resize', this.resize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    resize () {
      const { row } = this.getRow()

      if (row > this.maxLine) {
        // 计算需要渲染的 column
        this.getColumn()
        // 屏幕缩小的时候进行折叠
        this.collapseQuery()
        // 屏幕变大的时候进行恢复
        this.recovery()
      }
    },
    resetState () {
      return cloneDeep(this.value)
    },
    reset () {
      this.$emit('update:model', this.resetState())
      this.$emit('reset')
    },
    search () {
      this.$emit('search')
    },
    recovery () {
      const children = this.$children[0].$children
      const len = children.length
      const arr = children.slice(0, len - 1)
      const max = this.maxLine * 24

      let current = 0

      if (len > 0) {
        for (let i = 0; i < arr.length; i++) {
          const sub = children[i]
          const span = sub.columnSpan
          const exclude = sub.exclude

          if (span && !exclude) {
            if (current < max) {
              current += span
              children[i].collapse = true
            } else {
              break
            }
          }
        }
      }
    },
    getColumn () {
      const w = window.innerWidth
      const map = {
        xs: 768,
        sm: 768,
        md: 992,
        lg: 1200,
        xl: 1600,
        xxl: 1920,
        xxxl: 2560,
        xxxxl: 3840
      }

      const keys = Object.keys(map)
      const result = keys.find((key, index) => {
        if (key === 'xs' && w < map[key]) {
          return true
        } else {
          if (index === keys.length - 1) return true
          if (index < keys.length) {
            if (w >= map[key] && w < map[keys[index + 1]]) {
              return true
            }
          }
        }
      })

      console.log(result)
      this.column = result ? this[result] : this.col
      this.currentSize = result
    },
    collapseBtn () {
      this.collapse = !this.collapse

      this.collapseQuery()
    },
    collapseQuery () {
      const children = this.$children[0].$children
      const len = children.length
      const arr = children.slice(0, len - 2)
      const max = this.maxLine * 24

      let { total } = this.getRow()

      this.show = total  > max

      if (len > 0) {
        for (let i = arr.length; i >= 0; i--) {
          const sub = children[i]
          const span = sub.columnSpan
          const exclude = sub.exclude

          if (exclude) continue
          if (span && !exclude) {
            total -= span
            if (total < max) {
              break
            } else {
              children[i].collapse = false
            }

            if (!this.collapse) {
              children[i].collapse = true
            }
          }
        }
      }
    },
    getRow () {
      const children = this.$children[0].$children
      const len = children.length

      if (len > 0) {
        const arr = children.slice(0, len - 1)
        const result = arr.reduce((total, current) => {
          if (current.col) {
            const size = 24 / this.column
            const span = current.col * size

            return total + span
          } else {
            return total
          }
        }, 0)

        return {
          len,
          total: result,
          row: Math.ceil(result / 24)
        }
      }


    }
  }
}
</script>

<style lang="scss" scoped>
  .lo-query {
    width: 100%;
    overflow: hidden;

    // &::v-deep .n-select, &::v-deep .n-input {
    //   width: 100%;
    // }
    
    // &::v-deep .n-form-item {
    //   width: 100%;
    //   margin-right: 0;
    //   // height: 30px !important;
    //   // line-height: 30px !important;
    // }
    //  &::v-deep .n-form-item__content  {
    //    width: calc(100% - var(--labn-width));
    //  }

     .end {
      //  float: right;
       display: inline-flex;
      //  justify-content: flex-end;
      //  align-items: flex-end;
     }
  }

</style>
