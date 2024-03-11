import { defineComponent, ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NDataTable, NButton, NImage, NSpace, NTag, NPagination, NInput, useDialog, useMessage, NTabs, NTabPane } from 'naive-ui'
import { LoQuery, LoQueryItem } from '../../components/query/query'
import { Container } from '../../components/container/container'
import http from '../../api/index'
import './style.scss'
import { Novel } from '../../types/api/novel'

export default defineComponent({
  setup () {
    const router = useRouter()
    const route = useRoute()
    const dialog = useDialog()
    const message = useMessage()
    const show = ref(false)
    const tab = reactive({
      tableOfContents: {
        name: '目录',
        props: {
          rowKey: (item: any) => item.id
        },
        data: [{
          title: '123',
          page: 1
        }],
        page: 1,
        pageSize: 10,
        total: 0,
        columns: [
          {
            title: '标题',
            key: 'name'
          },
          {
            title: '页码',
            key: 'page'
          }
        ]
      },
      chapter: {
        name: '内容',
        props: {},
        data: [{
          content: '这是内容',
          page: 1
        }],
        page: 1,
        pageSize: 10,
        total: 0,
        columns: [
          {
            title: '页码',
            key: 'page',
          },
          {
            title: '内容',
            ellipsis: true,
            // render (row: any) {
            //   return (
            //     <section innerHTML={row.content} style={{
            //       maxHeight: '50px'
            //     }}></section>
            //   )
            // },
            key: 'content'
          }
        ],
      }
    })

    const data = reactive({
      tab: '内容'
    })

    const getData = (page = 1) => {
      http({
        url: '/volume/content',
        method: 'get',
        params: {
          id: route.query.id
        },
      }).then(res => {
        tab.chapter.data = res.data.list
        tab.chapter.page = res.data.page
        tab.chapter.pageSize = res.data.pageSize
        tab.chapter.total = res.data.total
      })

      http({
        url: '/volume/catelog',
        method: 'get',
        params: {
          id: route.query.id
        },
      }).then(res => {
        tab.tableOfContents.data = res.data
        // tab.tableOfContents.page = res.data.page
        // tab.tableOfContents.pageSize = res.data.pageSize
        // tab.tableOfContents.total = res.data.total
      })
    }
    getData()

    return () => {
      const paginationSlots = {
        prefix: ({ itemCount }: { itemCount: number }) => (
          <section>总共{itemCount}条</section>
        )
      }

      return (
        <Container>
            <NSpace justify='center' vertical size={20}>
              <NTabs>
                {
                  Object.entries(tab).map((item) => {
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
                              v-slots={paginationSlots}>
                            </NPagination>
                          </NSpace>
                        </NSpace>
                      </NTabPane>
                    )
                  })
                }
              </NTabs>
            </NSpace>
        </Container>
      )
    }
  }
})
