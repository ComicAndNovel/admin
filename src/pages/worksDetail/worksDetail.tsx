import { defineComponent, reactive, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { NForm, NFormItem, NInput, NInputNumber, useMessage, NRadioGroup, NRadio, NButton, NDatePicker, NSelect } from 'naive-ui'

import { ImageUpload } from '../../components/upload/upload'
import type { FormRules } from "naive-ui"
import http from '../../api/index'

interface FormProps {
  cover?: string
  name?: string
  originalName?: string
  desc?: string
  volume?: number
  page?: number
  releaseTime?: string
}

interface ReactiveData {
  form: FormProps
  rules: FormRules,
}

export default defineComponent({
  setup () {
    const route = useRoute()
    const router = useRouter()
    const formRef = ref()
    const areaOptions = [
      {
        label: '中国大陆'
      },
      {
        label: '中国港澳'
      },
      {
        label: '中国台湾'
      },
      {
        label: '日本'
      }
    ]
    const languageOptions = [
      {
        label: '中国大陆（简体中文）'
      },
      {
        label: '中国港澳（繁体中文）'
      },
      {
        label: '中国台湾（繁体中文）'
      },
      {
        label: '日本（日语）'
      }
    ]
    const anotherOptions = [
      {
        label: 'ねことうふ'
      }
    ]

    const data = reactive<ReactiveData>({
      form: {},
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
        // volume: {
        //   required: true,
        //   message: '卷数不能为空',
        //   trigger: ['change']
        // },
        countryId: {
          required: true,
          message: '请选择国家/地区',
          trigger: ['blur', 'change']
        }
      }
    })
    const message = useMessage()

    return () => {
      return (
        <section>
          <NForm 
            labelPlacement="left" 
            labelWidth={100}
            model={data.form}
            rules={data.rules}
            ref={formRef}
            requireMarkPlacement="left">
            <NFormItem label="作品封面：" path="cover">
              <ImageUpload></ImageUpload>
            </NFormItem>

            <NFormItem label="作品译名：" path="name">
              <NInput clearable onUpdate:value={(val) => {
                data.form.name = val
              }}></NInput>
            </NFormItem>
            <NFormItem label="作品名称：" path="originalName">
              <NInput clearable onUpdate:value={(val) => {
                data.form.originalName = val
              }}></NInput>
            </NFormItem>
            <NFormItem label="作品简介：" path="desc">
              <NInput type="textarea" clearable onUpdate:value={(val) => {
                data.form.desc = val
              }}></NInput>
            </NFormItem>
            {/* <NFormItem label="作者：">
              <NSelect options={anotherOptions}></NSelect>
            </NFormItem> */}
            <NFormItem label="当前卷数：" path="volume">
              <NInputNumber onUpdate:value={(val) => {
                data.form.volume = val as number
              }}></NInputNumber>
            </NFormItem>
            <NFormItem label="页数：" path="page">
              <NInputNumber onUpdate:value={(val) => {
                data.form.page = val as number
              }}></NInputNumber>
            </NFormItem>
            {/* <NFormItem label="地区：">
              <NSelect options={areaOptions}></NSelect>
            </NFormItem>
            <NFormItem label="语言：">
              <NSelect options={languageOptions}></NSelect>
            </NFormItem> */}
            <NFormItem label="发售时间：" path="releaseTime">
              <NDatePicker value-format="yyyy-MM-dd" onUpdate:formattedValue={(val) => {
                data.form.releaseTime = val
              }}></NDatePicker>
            </NFormItem>
            {/* <NFormItem label="当前状态：">
              <NRadioGroup>
                <NRadio value="未开始">未开始</NRadio>
                <NRadio value="更新中">更新中</NRadio>
                <NRadio value="已完结">已完结</NRadio>
              </NRadioGroup>
            </NFormItem> */}
            <NFormItem label=" ">
              <NButton type="primary" onClick={() => {
                console.log(data.form)
                formRef.value.validate((err: any) => {
                  if (!err) {
                    http({
                      url: 'novel/save',
                      method: 'post',
                      data: data.form
                    }).then(res => {
                      message.success(res.message)
                      router.push({
                        name: 'worksList'
                      })
                      console.log(data.form)
                    })
                  }
                })
               
              }}>保存</NButton>
            </NFormItem>
          </NForm>
        </section>
      )
    }
  }
})