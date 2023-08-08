import { defineComponent } from "vue"
import { NUpload, NUploadDragger, NIcon, NText, NButton } from "naive-ui"

export const ImageUpload = defineComponent({
  setup () {
    return () => {
      return (
        <NUpload>
          <NButton>上传封面</NButton>
        </NUpload>
      )
    }
  }
})