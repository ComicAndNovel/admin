import { defineComponent, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { NDataTable, NButton, NImage, NSpace, NTag, NPagination, NInput, NSelect } from 'naive-ui'
import { LoQuery, LoQueryItem } from '../../components/query/query'
import { Container } from '../../components/container/container'
import http from '../../api/index'
import './style.scss'
import { Novel } from '../../types/api/novel'

export default defineComponent({
  setup () {
    const router = useRouter()
    const show = ref(false)
    const columns = [
      {
        title: '名称',
        key: 'name',
        fixed: 'left' as 'left',
        width: 350,
        render (row: Novel) {
          console.log(row)
          return (
              <section style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr',
                gap: '10px'
              }}>
                <section style={{
                  width: '100%',
                  height: '114px',
                  background: 'rgb(62 55 55 / 8%)',
                  // borderRadius: '4px'
                }}>
                  <NImage 
                    src={row.cover} 
                    height={114}
                    fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"></NImage>
                </section>
                  
                  <NSpace vertical>
                    <span>{row.name}</span>
                    <NSpace>
                      {
                        row.author?.map(item => {
                          return (
                            <NTag>{item.name}</NTag>
                          )
                        })
                      }
                    </NSpace>
                  </NSpace>
              </section>
          )
        }
      },
      {
        title: '原名',
        key: 'originalName',
      },
      {
        title: '卷数',
        key: 'volume',
      },
      {
        title: '页数',
        key: 'page',
      },
      
      {
        title: '地区',
        key: 'area',
        render (row: Novel) {
          return (
            <section>{row.country?.name}</section>
          )
        }
      },
      {
        title: '语言',
        render (row: Novel) {
          return (
            <section>{row.language?.name}</section>
          )
        }
      },
      {
        title: '发售时间',
        key: 'releaseTime'
      },
      {
        title: '更新状态',
        key: 'updateStatus'
      },
      {
        title: '操作',
        key: 'actions',
        width: 220,
        render (row: Novel) {
          return (
            <NSpace>
              <NButton onClick={() => router.push({
                name: 'worksDetail',
                query: {
                  id: row.id
                }
              })}>编辑</NButton>
              <NButton type="primary">详情</NButton>
              <NButton type="error">删除</NButton>
            </NSpace>
          )
        }
      }
    ]
    const data = reactive({
      data: [],
      page: 1,
      pageSize: 5,
      total: 0,
      query: {
        name: '',
        originalName: '',
        authorName: ''
      }
    })

    const getData = (page = 1) => {
      http({
        url: '/novel/novelList',
        method: 'post',
        data: {
          page,
          pageSize: data.pageSize,
          ...data.query
        }
      }).then(res => {
        data.data = res.data.list
        data.page = res.data.page
        data.pageSize = res.data.pageSize
        data.total = res.data.total
      })
    }
    getData()

    return () => {
      const slots = {
        search: () => (
          <LoQuery 
            labelWidth={80} 
            onSearch={() => {
              getData()
              // console.log(query)
            }}>
            <LoQueryItem label="名称：">
              <NInput clearable onUpdate:value={(val) => {
                data.query.name = val
                // data.form.name = val
              }}></NInput>
            </LoQueryItem>
            <LoQueryItem label="原名：">
              <NInput clearable onUpdate:value={(val) => {
                data.query.originalName = val
                // data.form.name = val
              }}></NInput>
            </LoQueryItem>
            <LoQueryItem label="作者：">
              <NInput clearable onUpdate:value={(val) => {
                data.query.authorName = val
                // data.form.name = val
              }}></NInput>
            </LoQueryItem>
          </LoQuery>
        ),
        action: () => (
          <NButton onClick={() => {
            router.push('worksDetail')
          }}>添加</NButton>
        )
      }
      const paginationSlots = {
        prefix: ({ itemCount }: { itemCount: number }) => (
          <section>总共{itemCount}条</section>
        )
      }

      return (
        <Container v-slots={slots}>
            <NSpace justify='center' vertical size={20}>
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
                  onUpdate:page={getData}
                  v-slots={paginationSlots}>
                </NPagination>
              </NSpace>
            </NSpace>
        </Container>
      )
    }
  }
})
