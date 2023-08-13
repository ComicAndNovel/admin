<template>
    <section
      class="lo-query-item"
      :span="columnSpan"
      :style="{
        display: collapse ? 'flex' : 'none',
        width: 100 / query.column + '%'
      }">
      <n-form-item v-bind="$attrs" >
        <slot></slot>
      </n-form-item>
    </section>

</template>

<script>
import { NForm, NFormItem, NGridItem, NCol } from 'naive-ui'
export default {
  name: 'lo-query-item',
  components: {
    NFormItem,
    NGridItem,
    NCol
  },
  props: {
    // 如果存在，将直接过滤，不参与折叠组件渲染
    exclude: Boolean,
    col: {
      type: Number,
      default: 1
    },
  },
  inject: {
    query: {}
  },
  data () {
    return {
      collapse: true
    }
  },
  computed: {
    columnSpan () {
      const colSize = Math.floor(24 / this.query.column)

      return this.col * colSize
    }
  },
  created () {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.lo-query-item {
  display: flex;
}
</style>
