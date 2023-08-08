import { defineComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { NDataTable, NButton, NImage, NSpace, NTag } from 'naive-ui'
import http from '../../api/index'
import type { Another } from '../../types/api/another'
import type { ResponseData } from '../../types/api'
import { AnotherModal } from '../../modal/anotherModal/anotherModal'
import './style.scss'

interface Data {
  data: Another[]
}

export default defineComponent({
  setup () {
    const router = useRouter()
    const data = reactive<Data>({
      data: []
    })
    const show = ref(false)
    const columns = [
      {
        title: '译名',
        key: 'no',
        render (row: Another) {
          return (
            <div>{row.name}</div>
          )
        }
      },
      {
        title: '名称',
        key: 'no',
        render (row: Another) {
          return (
            <div>{row.originalName}</div>
          )
        }
      },
      {
        title: '国籍',
        key: 'title'
      },
      {
        title: '操作',
        key: 'actions',
        width: 200,
        render () {
          return (
            <NSpace>
              <NButton onClick={() => {
                show.value = true
              }}>编辑</NButton>
              <NButton type="error">删除</NButton>
            </NSpace>
          )
        }
      }
    ]
    const total = ref(0)
    const page = ref(1)

    const getData = () => {
      http({
        url: '/another/anotherList',
        method: 'post'
      }).then((res) => {
        data.data = res.data.list
        total.value = res.data.total
        page.value = res.data.page
        console.log(res)
      })
    }
    getData()
    
    return () => {
      
      return (
        <NSpace vertical size={20}>
          <section style={{textAlign: "right"}}>
            <NButton onClick={() => {
              show.value =  true
            }}>添加</NButton>
          </section>
          <NDataTable 
            singleLine={false}
            data={data.data} 
            columns={columns}
            pagination={{
              page: page.value,
              itemCount: total.value,
              pageSize: 10,
              showQuickJumper: true
            }}></NDataTable>
          <AnotherModal 
            show={show.value}
            onCancel={() => {
              show.value = false
            }}
            onClose={() => {
              show.value = false
            }}
            ></AnotherModal>
        </NSpace>
      )
    }
  }
})
