import { defineComponent } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { NMenu, NLayoutSider, NLayout, NConfigProvider, NMessageProvider, NDialogProvider } from 'naive-ui'
import { zhCN, dateZhCN } from 'naive-ui'
import type { MenuOption } from 'naive-ui'


import './style.scss'

export default defineComponent({
  setup () {
    const route = useRoute()
    const menuOptions: MenuOption[] = [
      {
        key: '/author',
        label: () => <RouterLink to="/author">作者列表</RouterLink>
      },
      {
        key: '/publisher',
        label: () => <RouterLink to="/publisher">出版社列表</RouterLink>
      },
      {
        key: '/books',
        label: () => <RouterLink to="/books">漫画小说列表</RouterLink>
      },
    ]

    return () => {
      return (
        <div class="container">
          <NLayout hasSider>
            <NLayoutSider 
              bordered 
              collapseMode="width" 
              inverted={true}
              width={200}>
              <NMenu options={menuOptions} inverted={true} defaultValue={route.fullPath}></NMenu>
            </NLayoutSider>
            <NLayout>
              <div class="main-container">
                <NConfigProvider locale={zhCN} dateLocale={dateZhCN}>
                  <NDialogProvider>
                    <NMessageProvider>
                      <RouterView></RouterView>
                    </NMessageProvider>
                  </NDialogProvider>
                </NConfigProvider>
                
              </div>
              
            </NLayout>
          </NLayout>
        </div>
      )
    }
  }
})
