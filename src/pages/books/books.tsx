import {defineComponent, ref, reactive} from 'vue'
import {useRouter} from 'vue-router'
import {
  NDataTable,
  NButton,
  NImage,
  NSpace,
  NTag,
  NPagination,
  NInput,
  useDialog,
  useMessage,
  NTabs,
  NTabPane,
} from 'naive-ui'
import {LoQuery, LoQueryItem} from '../../components/query/query'
import {Container} from '../../components/container/container'
import http from '../../api/index'
import './style.scss'
import {Novel} from '../../types/api/novel'

export default defineComponent({
  setup() {
    const router = useRouter()
    const dialog = useDialog()
    const message = useMessage()
    const show = ref(false)
    const columns = [
      {
        title: '名称',
        key: 'name',
        fixed: 'left' as 'left',
        width: 350,
        render(row: Novel) {
          return (
            <section
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr',
                gap: '10px',
              }}>
              <section
                style={{
                  width: '100%',
                  height: '114px',
                  background: 'rgb(62 55 55 / 8%)',
                  // borderRadius: '4px'
                }}>
                <NImage
                  src={row.cover}
                  height={114}
                  fallback-src='https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg'></NImage>
              </section>

              <NSpace vertical>
                <span>{row.name}</span>
                <NSpace>
                  {row.authors?.map((item) => {
                    return <NTag>{item.name}</NTag>
                  })}
                </NSpace>
              </NSpace>
            </section>
          )
        },
      },
      {
        title: '原名',
        key: 'originalName',
      },
      {
        title: '总卷数',
        key: 'totalVolume',
      },
      {
        title: '出版社',
        render(row: any) {
          return (
            <NSpace vertical>
              <NSpace>
                {row.publisher?.map((item: {name: string}) => {
                  return <NTag>{item.name}</NTag>
                })}
              </NSpace>
            </NSpace>
          )
        },
        key: '',
      },
      {
        title: '出版地区',
        key: 'area',
        render(row: Novel) {
          return <section>{row.country?.name}</section>
        },
      },
      {
        title: '语言',
        key: '',
        render(row: Novel) {
          return <section>{row.language?.name}</section>
        },
      },
      {
        title: '更新状态',
        key: 'updateStatus',
      },
      {
        title: '文档类型',
        key: 'contentType',
      },
      {
        title: '操作',
        key: 'actions',
        width: 220,
        render(row: Novel) {
          return (
            <NSpace>
              <NButton
                onClick={() =>
                  router.push({
                    name: 'booksDetail',
                    query: {
                      id: row.id,
                      type: 'books',
                    },
                  })
                }>
                编辑
              </NButton>
              <NButton
                type='primary'
                onClick={() => router.push(`/volume?id=${row.id}`)}>
                详情
              </NButton>
              <NButton
                type='error'
                onClick={() => {
                  const d = dialog.warning({
                    title: '警告',
                    content: '是否确定要删除当前书籍',
                    positiveText: '确定',
                    negativeText: '取消',
                    onPositiveClick: () => {
                      d.loading = true
                      return new Promise((resolve) => {
                        http({
                          url: '/novel/remove',
                          method: 'delete',
                          params: {
                            id: row.id,
                          },
                        })
                          .then((res: any) => {
                            message.success(res.message)
                            getData()
                          })
                          .finally(() => {
                            // d.loading
                            resolve(null)
                          })
                      })
                    },
                    onNegativeClick: () => {},
                  })
                }}>
                删除
              </NButton>
            </NSpace>
          )
        },
      },
    ]
    const tab = reactive({
      novel: {
        name: '小说',
        props: {
          rowKey: (item: any) => item.id,
        },
        data: [],
        page: 1,
        pageSize: 10,
        total: 0,
        columns,
      },
      comic: {
        name: '漫画',
        props: {},
        data: [],
        page: 1,
        pageSize: 10,
        total: 0,
        columns,
      },
    })

    const data = reactive({
      tab: 'novel',
      query: {
        name: '',
        originalName: '',
        authorName: '',
      },
    })

    type bookType =  'novel' | 'comic'
    const getData = (page = 1) => {
      http({
        url: `/books/${data.tab}List`,
        method: 'post',
        data: {
          page,
          pageSize: tab[data.tab as bookType].pageSize,
          ...data.query,
        },
      }).then((res) => {
        tab[data.tab as bookType].data = res.data.list
        tab[data.tab as bookType].page = res.data.page
        tab[data.tab as bookType].pageSize = res.data.pageSize
        tab[data.tab as bookType].total = res.data.total
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
            <LoQueryItem label='名称：'>
              <NInput
                clearable
                onUpdate:value={(val) => {
                  data.query.name = val
                  // data.form.name = val
                }}></NInput>
            </LoQueryItem>
            <LoQueryItem label='原名：'>
              <NInput
                clearable
                onUpdate:value={(val) => {
                  data.query.originalName = val
                  // data.form.name = val
                }}></NInput>
            </LoQueryItem>
            <LoQueryItem label='作者：'>
              <NInput
                clearable
                onUpdate:value={(val) => {
                  data.query.authorName = val
                  // data.form.name = val
                }}></NInput>
            </LoQueryItem>
          </LoQuery>
        ),
        action: () => (
          <NButton
            onClick={() => {
              router.push('booksDetail?type=books')
            }}>
            添加
          </NButton>
        ),
      }
      const paginationSlots = {
        prefix: ({itemCount}: {itemCount: number}) => (
          <section>总共{itemCount}条</section>
        ),
      }

      return (
        <Container v-slots={slots}>
          <NSpace justify='center' vertical size={20}>
            <NTabs value={data.tab} onUpdate:value={(val) => {
              data.tab = val
              getData()
            }}>
              {Object.entries(tab).map((item) => {
                const [key, data] = item

                return (
                  <NTabPane tab={data.name} name={key} key={key}>
                    <NSpace justify='center' vertical size={20}>
                      <NDataTable
                        singleLine={false}
                        data={data.data}
                        columns={data.columns}
                        {...data?.props}
                        pagination={false}></NDataTable>
                      <NSpace justify='center'>
                        <NPagination
                          itemCount={data.total}
                          pageSize={data.pageSize}
                          page={data.page}
                          onUpdate:page={getData}
                          v-slots={paginationSlots}></NPagination>
                      </NSpace>
                    </NSpace>
                  </NTabPane>
                )
              })}
            </NTabs>
          </NSpace>
        </Container>
      )
    }
  },
})
