import {defineComponent, reactive, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  useMessage,
  NGrid,
  NGridItem,
  NRadioGroup,
  NRadio,
  NButton,
  NDatePicker,
  NSelect,
  NImage,
} from 'naive-ui'
import dayjs from 'dayjs'

import {ImageUpload} from '../../components/upload/upload'
import type {FormRules} from 'naive-ui'
import http from '../../api/index'
import {Country, Language} from '../../types/api/common'
import {Author} from '../../types/api/author'

interface FormProps {
  file?: File | string
  cover?: string
  name?: string
  originalName?: string
  description?: string
  ISBN?: string
  volumeNumber?: number
  totalPage?: number
  releaseTime?: string
  countryId?: number
  languageId?: number
  authorId?: number[]
  publisherId?: number[]
  updateStatus: 1 | 2 | 3
  bookUrl?: string
  type?: 'light_novel' | 'comic'
}

interface ReactiveData {
  form: FormProps
  rules: FormRules
  countryList: Country[]
  languageList: Language[]
  authorList: Author[],
  publisherList: any
}

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    const formRef = ref()
    const loadingRef = ref(false)
    const books = route.query.type === 'books'

    const data = reactive<ReactiveData>({
      form: {
        type: 'light_novel',
        updateStatus: 1
      },
      rules: {
        name: {
          required: true,
          message: '请输入译名',
          trigger: 'blur',
        },
        originalName: {
          required: true,
          message: '请输入名称',
          trigger: ['blur'],
        },
        volumeNumber: {
          required: true,
          message: '请输入卷号',
          type: 'number',
          trigger: ['blur', 'change']
        },
        authorId: {
          required: true,
          message: '请选择作者',
          type: 'array',
          trigger: 'blur'
        },
        description: {
          required: true,
          message: '请输入简介',
          trigger: 'blur'
        },
        publisherId: {
          required: true,
          message: '请选择出版社',
          type: 'array',
          trigger: 'blur'
        },
        ISBN: {
          required: true,
          message: '请输入ISBN',
          trigger: ['blur'],
        },
        // volume: {
        //   required: true,
        //   message: '卷数不能为空',
        //   trigger: ['change']
        // },
        countryId: {
          required: true,
          message: '请选择出版国家/地区',
          trigger: ['blur', 'change'],
        },
      },
      countryList: [],
      authorList: [],
      languageList: [],
      publisherList: []
    })
    const message = useMessage()
    const getData = () => {
      http({
        url: '/language/list',
        method: 'get',
      }).then((res) => {
        data.languageList = res.data
      })
      http({
        url: '/country/list',
        method: 'get',
        data: {},
      }).then((res) => {
        data.countryList = res.data
      })
      http({
        url: '/publisher/list',
        method: 'get',
        data: {},
      }).then((res) => {
        data.publisherList = res.data
      })
    }

    const getAuthorList = (name: string = '') => {
      http({
        url: '/author/authorList',
        method: 'post',
        data: {
          page: 1,
          pageSize: 10,
          name
        },
      }).then((res) => {
        data.authorList = res.data.list
      })
    }

    const getDetailData = () => {
      if (route.query.id) {
        http({
          url: books ? '/books/detail' : '/volume/detail',
          method: 'get',
          params: {
            id: route.query.id,
          },
        }).then((res) => {
          console.log(res.data)
          data.form = {
            ...res.data,
            languageId: res.data.language?.id || null,
            countryId: res.data.country?.id || null,
            authorId: res.data.authors?.map((item: Author) => item.id),
            publisherId: res.data.publishers?.map((item: Author) => item.id),
          }
        })
      }
    }

    getDetailData()
    getAuthorList()
    getData()

    const booksElment = [
      <NFormItem label='作者：' path='authorId'>
        <NSelect
          multiple
          remote
          filterable
          options={data.authorList}
          value={data.form.authorId}
          labelField='name'
          valueField='id'
          onSearch={getAuthorList}
          onUpdate:value={(val) => {
            data.form.authorId = val
            console.log(val)
          }}></NSelect>
      </NFormItem>,
      <NFormItem label='出版社：' path='publisherId'>
        <NSelect
          multiple
          remote
          filterable
          options={data.publisherList}
          value={data.form.publisherId}
          labelField='name'
          valueField='id'
          onSearch={getAuthorList}
          onUpdate:value={(val) => {
            data.form.publisherId = val
            console.log(val)
          }}></NSelect>
      </NFormItem>,
      <NFormItem label='出版地区：'>
        <NSelect
          options={data.countryList}
          value={data.form.countryId}
          labelField='name'
          valueField='id'
          onUpdate:value={(val) => {
            data.form.countryId = val
            console.log(val)
          }}></NSelect>
      </NFormItem>,
      <NFormItem label='语言：'>
        <NSelect
          options={data.languageList}
          value={data.form.languageId}
          labelField='name'
          valueField='id'
          onUpdate:value={(val) => {
            data.form.languageId = val
            console.log(val)
          }}></NSelect>
      </NFormItem>,
      <NFormItem label='类型：'>
       <NRadioGroup value={data.form.type} onUpdate:value={(val) => {
         data.form.type = val
       }}>
         <NRadio value="light_novel">轻小说</NRadio>
         <NRadio value="comic">漫画</NRadio>
       </NRadioGroup>
     </NFormItem>,
      <NFormItem label='当前状态：'>
        <NRadioGroup value={data.form.updateStatus} onUpdate:value={(val) => {
          data.form.updateStatus = val
        }}>
          <NRadio value={1}>未出版</NRadio>
          <NRadio value={2}>连载中</NRadio>
          <NRadio value={3}>已完结</NRadio>
        </NRadioGroup>
      </NFormItem>,
    ]

    const volumeElement = [
     
      <NFormItem label='ISBN：' path='ISBN'>
        <NInput
          clearable
          value={data.form.ISBN}
          onUpdate:value={(val: string | undefined) => {
            data.form.ISBN = val
          }}></NInput>
      </NFormItem>,
      <NFormItem label='发售时间：' path='releaseTime'>
        <NDatePicker
          value-format='yyyy-MM-dd'
          value={
            data.form.releaseTime
              ? dayjs(data.form.releaseTime).valueOf()
              : undefined
          }
          onUpdate:formattedValue={(val) => {
            data.form.releaseTime = val
          }}></NDatePicker>
      </NFormItem>,
      <NFormItem label='卷号：' path='volumeNumber'>
        <NInputNumber
          value={data.form.volumeNumber}
          onUpdate:value={(val) => {
            data.form.volumeNumber = val as number
          }}></NInputNumber>
      </NFormItem>,
      // <NFormItem label='总页数：' path='totalPage'>
      //   <NInputNumber
      //     value={data.form.totalPage}
      //     onUpdate:value={(val) => {
      //       data.form.totalPage = val as number
      //     }}></NInputNumber>
      // </NFormItem>,
    ]

    return () => {
      return (
        <section
          style={{
            padding: '20px',
            width: '400px',
          }}>
          <NForm
            labelPlacement='left'
            labelWidth={100}
            model={data.form}
            rules={data.rules}
            ref={formRef}
            requireMarkPlacement='left'>
            {
              !books ? <NFormItem label='书籍内容：' path='cover'>
              <ImageUpload
                ext={['epub', 'pdf']}
                value={data.form.bookUrl}
                onChange={(file) => {
                  data.form.file = file
                }}
                onRemove={() => {
                  data.form.bookUrl = ''
                }}></ImageUpload>
              </NFormItem> : null
            }
            <NFormItem label='封面：' path='cover'>
              <NImage
                src={data.form.cover}
                width={120}
                previewedImgProps={{
                  height: 400,
                }}></NImage>
              {/* <ImageUpload
                type='image'
                value={data.form.cover}
                ext={['jpg', 'jpeg', 'webp', 'png']}
                description={[
                  '如果不上传封面，将默认读取书的封面'
                ]}
                onRemove={() => {
                  data.form.cover = ''
                }}></ImageUpload> */}
            </NFormItem>
            <NFormItem label='作品译名：' path='name'>
              <NInput
                clearable
                value={data.form.name}
                onUpdate:value={(val: string | undefined) => {
                  data.form.name = val
                }}></NInput>
            </NFormItem>
            <NFormItem label='作品名称：' path='originalName'>
              <NInput
                clearable
                value={data.form.originalName}
                onUpdate:value={(val) => {
                  data.form.originalName = val
                }}></NInput>
            </NFormItem>
            <NFormItem label='作品简介：' path='description'>
              <NInput
                type='textarea'
                value={data.form.description}
                clearable
                autosize={{
                  maxRows: 10,
                }}
                onUpdate:value={(val) => {
                  data.form.description = val
                }}></NInput>
            </NFormItem>
            {
              books ? booksElment : volumeElement
            }
            <NFormItem label=' '>
              <NButton
                type='primary'
                loading={loadingRef.value}
                onClick={() => {
                  console.log(data.form)

                  formRef.value.validate((err: any) => {
                    if (!err) {
                      loadingRef.value = true
                      http({
                        url: books ? '/books/save' : '/volume/save',
                        method: 'post',
                        headers: {
                          'Content-Type': !books ? 'multipart/form-data' : 'application/json',
                        },
                        data: {
                          ...data.form,
                          id: route.query.id,
                          novelId: route.query.novelId
                        },
                      })
                        .then((res) => {
                          message.success(res.message)
                         
                          router.go(-1)
                          console.log(data.form)
                        })
                        .finally(() => {
                          loadingRef.value = false
                        })
                    }
                  })
                }}>
                保存
              </NButton>
            </NFormItem>
          </NForm>
        </section>
      )
    }
  },
})
