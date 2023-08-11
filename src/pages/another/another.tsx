import { defineComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { NDataTable, NButton, NImage, NSpace, NTag, NPagination } from 'naive-ui'
import http from '../../api/index'
import type { Another } from '../../types/api/another'
import type { ResponseData } from '../../types/api'
import { AnotherModal } from '../../modal/anotherModal/anotherModal'
import './style.scss'

interface Data {
  data: Another[]
  page: number
  pageSize: number
  total: number
}

export default defineComponent({
  setup () {
    const router = useRouter()
    const data = reactive<Data>({
      data: [],
      page: 1,
      pageSize: 10,
      total: 0
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

    const getData = (page = 1) => {
      http({
        url: '/another/anotherList',
        method: 'post',
        data: {
          page,
          pageSize: data.pageSize
        }
      }).then((res) => {
        data.data = res.data.list
        data.page = res.data.page
        data.pageSize = res.data.pageSize
        data.total = res.data.total
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
            pagination={false}></NDataTable>
             <NSpace justify='center'>
              <NPagination 
                itemCount={data.total} 
                pageSize={data.pageSize} 
                page={data.page}
                onUpdate:page={getData}>
              </NPagination>
            </NSpace>
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
