import { defineComponent, reactive, ref } from "vue"
import { NForm, NFormItem, NInput, NModal, NSpace, NButton, NSelect } from 'naive-ui'
import { ImageUpload } from '../../components/upload/upload'
import http from '../../api/index'
import { Country } from "../../types/api/common"

import type { FormRules } from "naive-ui"
import type { PropType } from 'vue'

interface Data {
  form: AnotherForm
  rules: FormRules,
  countryList: Country[]
}

interface AnotherForm {
  name?: string
  originalName?: string
  countryId?: number
}

export const AnotherModal = defineComponent({
  props: {
    show: {
      type: Boolean as PropType<boolean>
    }
  },
  emits: ['close', 'cancel', 'confirm'],
  setup (props, ctx) {
    const { emit } = ctx
    const formRef = ref()
    const data = reactive<Data>({
      countryList: [],
      form: {
        countryId: undefined
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
          trigger: ['blur', 'change']
        }
      }
    })

    const getData = () => {
      http({
        url: '/country/countryList',
        method: 'get'
      }).then(res => {
        data.countryList = res.data
        console.log(res)
      })
    }

    getData()

    
    return () => {
      return (
        <NModal 
          show={props.show} 
          preset="card" 
          title={"添加作者"}
          style={{
            width: '60vw'
          }}
          
          maskClosable={false}
          onUpdateShow={() => {
            console.log(2)
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
              <NInput clearable value={data.form.name} onChange={(val) => {
                data.form.name = val
              }}></NInput>
            </NFormItem>
            <NFormItem label="作者名称：" path="originalName">
              <NInput clearable value={data.form.originalName}  onChange={(val) => {
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
                }}
                onChange={(val) => {
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
                  console.log(data.form)
                  // formRef.value.validate((err: any) => {
                  //   if (!err) {
                  //     console.log('success')
                      http({
                        url: 'another/save',
                        method: 'post',
                        data: data.form
                      }).then(res => {
                        emit('confirm')
                      })
                    // }
                  // })
                 
                 
                }}>保存</NButton>
              </NSpace>
              
            </NFormItem>
          </NForm>
        </NModal>
      )
    }
  }
})