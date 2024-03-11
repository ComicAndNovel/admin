import { defineComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { NDataTable, NButton, NImage, NSpace, NTag, NPagination, NInput, useDialog, useMessage } from 'naive-ui'
import http from '../../api/index'
import type { Author } from '../../types/api/author'
import { AuthorModal } from '../../modal/authorModal/authorModal'
import { Container } from '../../components/container/container'
import { LoQuery, LoQueryItem } from '../../components/query/query'
import './style.scss'

interface Data {
  data: Author[]
  page: number
  pageSize: number
  total: number
  authorModalQuery: Partial<Author>
  query: {
    name?: string,
    originalName?: string,
  }
}

export default defineComponent({
  setup () {
    const dialog = useDialog()
    const message = useMessage()
    const router = useRouter()
    const data = reactive<Data>({
      data: [],
      page: 1,
      pageSize: 10,
      total: 0,
      authorModalQuery: {},
      query: {}
    })
    const show = ref(false)
    const columns = [
      {
        title: '译名',
        key: 'name',
        render (row: Author) {
          return (
            <div>{row.name}</div>
          )
        }
      },
      {
        title: '名称',
        key: 'originalName',
        render (row: Author) {
          return (
            <div>{row.originalName}</div>
          )
        }
      },
      {
        title: '国籍',
        key: 'title',
        render (row: Author) {
          return (
            <span>{row.country.name}</span>
          )
        }
      },
      {
        title: '操作',
        key: 'actions',
        width: 200,
        render (row: Author) {
          return (
            <NSpace>
              <NButton 
                onClick={() => {
                  http({
                    url: '/author/authorDetail',
                    method: 'get',
                    params: {
                      id: row.id
                    }
                  }).then((res) => {
                    data.authorModalQuery = res.data
                    show.value = true
                  })
                }}>编辑</NButton>
               <NButton type="error" onClick={() => {
                const d = dialog.warning({
                  title: '警告',
                  content: '是否确定要删除当前行',
                  positiveText: '确定',
                  negativeText: '取消',
                  onPositiveClick: () => {
                    d.loading = true
                    return new Promise(resolve => {
                      http({
                        url: '/author/remove',
                        method: 'delete',
                        params: {
                          id: row.id
                        }
                      }).then(res => {
                        message.success(res.message)
                        getData()
                      }).finally(() => {
                        // d.loading
                        resolve(null)
                      })
                    })
                  },
                  onNegativeClick: () => {

                  }
                })
              }}>删除</NButton>
            </NSpace>
          )
        }
      }
    ]

    const getData = (page = 1) => {
      http({
        url: '/author/authorList',
        method: 'post',
        data: {
          page,
          pageSize: data.pageSize,
          ...data.query
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
      const slots = {
        search: () => (
          <LoQuery labelWidth={80} onSearch={getData}>
            <LoQueryItem label="名称：">
              <NInput clearable onUpdate:value={(val) => {
                data.query.name = val
              }}></NInput>
            </LoQueryItem>
            <LoQueryItem label="原名：">
              <NInput clearable onUpdate:value={(val) => {
                data.query.originalName = val
              }}></NInput>
            </LoQueryItem>
          </LoQuery>
        ),
        action: () => (
          <NButton onClick={() => {
            show.value = true
          }}>添加</NButton>
        )
      }
      return (
        <Container v-slots={slots}>
          <NSpace vertical size={20}>
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
          <AuthorModal 
            show={show.value}
            query={data.authorModalQuery}
            onConfirm={() => {
              show.value = false
            }}
            onCancel={() => {
              show.value = false
            }}
            onClose={() => {
              show.value = false
            }}
            ></AuthorModal>
          </NSpace>
        </Container>  
      )
    }
  }
})
