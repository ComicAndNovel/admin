import { defineComponent, reactive, ref, watch } from "vue"
import { NForm, NFormItem, NInput, NModal, NSpace, NButton, NSelect } from 'naive-ui'
import { ImageUpload } from '../../components/upload/upload'
import http from '../../api/index'
import { Country } from "../../types/api/common"

import type { FormRules } from "naive-ui"
import type { PropType } from 'vue'

interface Publisher {
  id?: number
  name?: string
}
interface Data {
  form: PublisherForm
  rules: FormRules,
  countryList: Country[]
}

interface PublisherForm {
  name?: string
  originalName?: string
  countryId?: number
}

export const PublisherModal = defineComponent({
  props: {
    type: {
      type: String as PropType<'add' | 'edit'>,
      default: 'add'
    },
    show: {
      type: Boolean as PropType<boolean>
    },
    query: {
      type: Object as PropType<Partial<Publisher>>,
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
        ...props.query
      },
      rules: {
        name: {
          required: true,
          message: '请输入出版社名称',
          trigger: 'blur'
        },
        originalName: {
          required: true,
          message: '请输入名称',
          trigger: ['blur']
        }
      }
    })

    watch(() => props.show, () => {
      if (props.type !== 'edit') {
        data.form = {}
      }
    }, {immediate: true})
  
    watch(() => props.query, (val) => {
      if (props.type === 'edit') {
        data.form = {
          ...val
        }
      }
    }, {immediate: true})

    return () => {
      return (
        <NModal 
          show={props.show} 
          preset="card" 
          title={props.type === 'add' ? '添加出版社' : '编辑出版社'}
          style={{
            width: '500px'
          }}
          maskClosable={false}
          onClose={() => {
            console.log(1)
            emit('close')
          }}
          onUpdateShow={() => {
            console.log(2)
            emit('close')
          }}>
          <NForm 
            labelPlacement="left" 
            labelWidth={150}
            requireMarkPlacement="left"
            model={data.form}
            rules={data.rules}
            ref={formRef}>
            <NFormItem label="出版社译名：" path="name">
              <NInput clearable value={data.form.name} onUpdate:value={(val) => {
                data.form.name = val
              }}></NInput>
            </NFormItem>
            <NFormItem label="出版社名称：" path="originalName">
              <NInput clearable value={data.form.originalName}  onUpdate:value={(val) => {
                data.form.originalName = val
              }}></NInput>
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
                        url: 'publisher/save',
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