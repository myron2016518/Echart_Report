import Vue from 'vue'
import Element from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import 'element-ui/lib/theme-chalk/index.css'

// eslint-disable-next-line import/no-named-as-default
import DigitRoll from "digit-roll";

export default () => {
    // Vue.use(Element, { locale })
    Vue.use(Element, { 'en': locale, 'zh-cn': zhLocale })
    Vue.use(DigitRoll, { /* options全局默认参数 见props */ });
}
