import { defineComponent, reactive, ref, watch } from "vue"
import { NForm, NFormItem, NInput, NModal, NSpace, NButton, NSelect } from 'naive-ui'
import { ImageUpload } from '../../components/upload/upload'
import http from '../../api/index'
import { Country } from "../../types/api/common"

import type { FormRules } from "naive-ui"
import type { PropType } from 'vue'
import { Author } from "../../types/api/author"

interface Data {
  form: AuthorForm
  rules: FormRules,
  countryList: Country[]
}

interface AuthorForm {
  name?: string
  originalName?: string
  countryId?: number
}

export const AuthorModal = defineComponent({
  props: {
    type: {
      type: String as PropType<'add' | 'edit'>,
      default: 'add'
    },
    show: {
      type: Boolean as PropType<boolean>
    },
    query: {
      type: Object as PropType<Partial<Author>>,
      default: () => {}
    }
  },
  emits: ['close', 'cancel', 'confirm'],
  setup (props, ctx) {
    const { emit } = ctx
    const formRef = ref()
    const data = reactive<Data>({
      countryList: [],
      form: {
        ...props.query,
        countryId: props.query.country?.id
      },
      rules: {
        name: {
          required: true,
          message: '请输入译名',
          trigger: 'blur'
        },
        originalName: {
          required: true,
          message: '请输入名称',
          trigger: ['blur']
        },
        countryId: {
          required: true,
          message: '请选择国家/地区',
          type: 'number',
          trigger: ['blur', 'change']
        }
      }
    })
    const getData = () => {
      http({
        url: '/country/list',
        method: 'get'
      }).then(res => {
        data.countryList = res.data
      })
    }
    watch(() => props.show, () => {
      if (props.type !== 'edit') {
        data.form = {}
      }
      if (props.show) {
        getData()
      }
    }, {immediate: true})
  
    watch(() => props.query, (val) => {
      if (props.type === 'edit') {
        data.form = {
          ...val,
          countryId: val.country?.id
        }
      }
    }, {immediate: true})

    return () => {
      return (
        <NModal 
          show={props.show} 
          preset="card" 
          title={props.type === 'add' ? '添加作者' : '编辑作者'}
          style={{
            width: '500px'
          }}
          maskClosable={false}
          onClose={() => {
            emit('close')
          }}
          onUpdateShow={() => {
            emit('close')
          }}>
          <NForm 
            labelPlacement="left" 
            labelWidth={100}
            requireMarkPlacement="left"
            model={data.form}
            rules={data.rules}
            ref={formRef}>
            <NFormItem label="作者译名：" path="name">
              <NInput clearable value={data.form.name} onUpdate:value={(val) => {
                data.form.name = val
              }}></NInput>
            </NFormItem>
            <NFormItem label="作者名称：" path="originalName">
              <NInput clearable value={data.form.originalName}  onUpdate:value={(val) => {
                data.form.originalName = val
              }}></NInput>
            </NFormItem>
            <NFormItem label="国家/地区：" path="countryId">
              <NSelect 
                options={data.countryList} 
                value={data.form.countryId}
                labelField="name" 
                valueField="id"
                onUpdate:value={(val) => {
                  data.form.countryId = val
                }}></NSelect>
            </NFormItem>
            <NFormItem label=" ">
              <NSpace>
                <NButton onClick={() => {
                  formRef.value.restoreValidation()
                  emit('cancel')
                  }}>取消</NButton>
                <NButton type="primary" onClick={() => {
                  formRef.value.validate((err: any) => {
                    if (!err) {
                      http({
                        url: 'author/save',
                        method: 'post',
                        data: data.form
                      }).then(res => {
                        emit('confirm')
                      })
                    }
                  })
                }}>保存</NButton>
              </NSpace>
              
            </NFormItem>
          </NForm>
        </NModal>
      )
    }
  }
})