import { createApp } from 'vue'
import App from '@/App.vue'
// svg插件需要配置代码
import 'virtual:svg-icons-register'

import gloablComponent from '@/components/SvgIcon'
import router from '@/router'

// 引入模板的全局的样式
import '@/styles/index.scss'
/**
 *  element-plus 样式导入
 */
import 'element-plus/dist/index.css'
// 黑暗模式
import 'element-plus/theme-chalk/dark/css-vars.css'
// pinia
import pinia from '@/store'
// 全局指令
import vSlideIn from '@/directives/vSlideIn.ts'
import vLazy from '@/directives/vLazy.ts'
import vViewRequest from '@/directives/vViewRequest.ts'


// 获取应用实例对象
const app = createApp(App)
app.directive('slide-in',vSlideIn)
app.directive('lazy',vLazy)
app.directive('view-request',vViewRequest)
// 安装自定义插件
app.use(gloablComponent)
// 安装路由
app.use(router)
// 设置pinia
app.use(pinia)

app.mount('#app')
