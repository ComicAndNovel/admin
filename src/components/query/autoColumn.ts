// 每行需要渲染多少个
export interface columnCount {
  xs: number
  sm: number
  md: number
  lg: number
  xl: number
  xxl: number
  xxxl: number
  xxxxl: number
}

export interface AutoColumnOptions {
  maxLine: number
  defaultColumn: number
  collapse: boolean
  columnCount: columnCount
  children: any
}

export class AutoColumn {
  options: AutoColumnOptions
  // maxLine: number
  column: number

  constructor (options: AutoColumnOptions) {
    this.options = options
    this.column = this.options.defaultColumn
    // this.collapse = true

    if (this.options.collapse) {
      this.collapseQuery()
    }
    
  }
  resize () {
    const { row } = this.getRow()
    const { maxLine } = this.options

    if (row > maxLine) {
      // 计算需要渲染的 column
      this.getColumn()
      // 屏幕缩小的时候进行折叠
      this.collapseQuery()
      // 屏幕变大的时候进行恢复
      this.recovery()
    }
  }
  recovery () {
    const { maxLine, children } = this.options
    // const children = []
    const len = children.length
    const max = maxLine * 24
    let current = 0

    // if (len > 0) {
    // children.map((item) => {
    //     const span = item.columnSpan
    //     const exclude = item.exclude

    //     if (span && !exclude) {
    //       if (current < max) {
    //         current += span
    //         item.collapse = true
    //       }
    //     }
    //   })
    // }
  }
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

    this.column = result ? this[result] : this.col
    this.currentSize = result
  }
  // 折叠搜索条件
  collapseQuery (collapse: boolean = true) {
    const { children, maxLine } = this.options
    const len = children.length
    const max = maxLine * 24

    // debugger
    if (len > 0) {
      let { total } = this.getRow()
      
      for (let i = children.length - 1; i >= 0; i--) {
        const sub = children[i]
        const props = sub?.component?.props
        // 计算 子组件实际需要占的比例
        const colSize = Math.floor(24 / this.column)
        const span = props.column * colSize
        const exclude = props.exclude
        
        // debugger
        if (exclude) continue
        if (span && !exclude) {
          total -= span
          if (total < max) {
            break
          } else {
            props.show = false
          }

          if (!collapse) {
            props.show = true
          }
        }
      }
    }
  }
  getRow () {
    const { children, maxLine } = this.options
    const len = children.length

    if (len > 0) {
      const result = children.reduce((total: number, current: any) => {
        const props = current?.component?.props

        if (props?.column) {
          const size = 24 / this.column
          const span = props.column * size

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
    } else {
      return {
        len: 0,
        total: 0,
        row: maxLine
      }
    }
  }
}