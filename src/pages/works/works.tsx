import { defineComponent, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { NDataTable, NButton, NImage, NSpace, NTag } from 'naive-ui'
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
        fixed: 'left',
        render (row: Novel) {
          console.log(row)
          return (
            <div>
              <NSpace>
                  {/* <img src={row.cover}></img> */}
                  <NImage 
                    src={row.cover} 
                    width={80}
                    fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"></NImage>
                  <NSpace vertical>
                    <span>{row.name}</span>
                    <NSpace>
                      {
                        row.another?.map(item => {
                          return (
                            <NTag>{item.name}</NTag>
                          )
                        })
                      }
                    </NSpace>
                  </NSpace>
              </NSpace>
              
            </div>
          )
        }
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
        key: 'area'
      },
      {
        title: '语言',
        key: 'language'
      },
      {
        title: '发售时间',
        key: ''
      },
      {
        title: '更新状态',
        key: 'updateStatus'
      },
      {
        title: '操作',
        key: 'actions',
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
      data: []
    })

    const getData = () => {
      http({
        url: '/novel/novelList',
        method: 'post'
      }).then(res => {
        console.log(res)
        data.data = res.data.list
      })
    }
    getData()

    return () => {
      return (
        <NSpace vertical size={20}>
          <section style={{textAlign: "right"}}>
            <NButton onClick={() => {
              router.push('worksDetail')
            }}>添加</NButton>
          </section>
          <NDataTable 
            singleLine={false}
            data={data.data} 
            columns={columns}
            pagination={{
              pageSize: 10
            }}></NDataTable>
        </NSpace>
      )
    }
  }
})
