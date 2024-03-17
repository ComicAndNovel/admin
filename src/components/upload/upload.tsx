import {defineComponent, defineEmits, reactive, ref, watch} from 'vue'
import type {PropType} from 'vue'
import {NUpload, NModal, NUploadDragger, NIcon, NImage, NButton} from 'naive-ui'
import './style.scss'

export type status = 'pending' | 'preview' | 'error'
export const ImageUpload = defineComponent({
  props: {
    value: {
      type: String,
    },
    type: {
      type: String,
    },
    description: {
      type: Array as PropType<string[]>,
      default() {
        return []
      },
    },
    ext: {
      type: Array,
      default() {
        return []
      },
    },
  },
  emits: ['change', 'remove'],
  setup(props, ctx) {
    console.log(ctx)
    const fileRef = ref()
    const showRef = ref(false)
    const status = ref<status>('pending')
    const uploadUrl = ref()
    const addIcon = (
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024'>
        <defs></defs>
        <path
          d='M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z'
          fill='currentColor'></path>
        <path
          d='M176 474h672q8 0 8 8v60q0 8-8 8H176q-8 0-8-8v-60q0-8 8-8z'
          fill='currentColor'></path>
      </svg>
    )
    const deleteIcon = (
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'>
        <path d='M12 12h2v12h-2z' fill='currentColor'></path>
        <path d='M18 12h2v12h-2z' fill='currentColor'></path>
        <path
          d='M4 6v2h2v20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8h2V6zm4 22V8h16v20z'
          fill='currentColor'></path>
        <path d='M12 2h8v2h-8z' fill='currentColor'></path>
      </svg>
    )

    watch(
      () => props.value,
      (val) => {
        if (val) {
          status.value = 'preview'
        }
        uploadUrl.value = val
        console.log(props.type, status.value, uploadUrl.value)
      },
      {immediate: true}
    )

    return () => {
      return (
        <section class='upload-container'>
          {/* 上传图片 */}
          {props.type === 'image' && status.value === 'pending' ? (
            <NUpload
              showFileList={false}
              defaultUpload={false}
              listType='image'
              onChange={(file) => {}}>
              <section class='image-upload-container'>
                <NIcon>{addIcon}</NIcon>
              </section>
            </NUpload>
          ) : null}
          {/* 上传文件 */}
          {props.type !== 'image' && !uploadUrl.value && !fileRef.value?.name ? (
            <NUpload
              showFileList={false}
              defaultUpload={false}
              onChange={(file) => {
                fileRef.value = file.file.file
                console.log(fileRef.value)
                ctx.emit('change', fileRef.value)
              }}>
                <NButton>上传文件</NButton>
              </NUpload>
          ) : props.type !== 'image' || fileRef.value?.name ? (
            <section class='space-between'>
              <span>{uploadUrl.value || fileRef.value.name}</span>
              <div
                onClick={() => {
                  fileRef.value = null
                  ctx.emit('remove')
                }}>
                <NIcon>{deleteIcon}</NIcon>
              </div>
            </section>
          ) : null}
          {props.type === 'image' && status.value === 'preview' ? (
            <section class='image-preview-container'>
              <NImage
                src={props.value}
                width={120}
                previewedImgProps={{
                  height: 400,
                }}></NImage>
              {/* <div class='image-preview-mask'>
                <div
                  onClick={() => {
                    console.log(1)
                    status.value = 'pending'
                    ctx.emit('remove')
                  }}>
                  <NIcon size={20}>{deleteIcon}</NIcon>
                </div>
              </div> */}
            </section>
          ) : null}

          {
            status.value !== 'preview'  && props.ext.length ? (
              <section class='upload-container-desc'>
                <span>格式仅支持：{props.ext.join('、')}</span>
                {props.description.map((item) => {
                  return <p>{item}</p>
                })}
              </section>
            ) : null
          }
         
        </section>
      )
    }
  },
})
