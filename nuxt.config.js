import pkg from './package'

export default {
    server: {
        port: 3002, // default: 3000
        // host: '172.18.15.92' // default: localhost,
    },
    mode: 'spa',

    /*
     ** Headers of the page
     */
    head: {
        title: pkg.name,
        meta: [
            { charset: 'utf-8' },
            { name: 'referrer', content: 'no-referrer' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: pkg.description }
        ],
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    },

    /*
     ** Customize the progress-bar color
     */
    loading: { color: '#fff' },
    // loading: '~/components/loading.vue'

    /*
     ** Global CSS
     */
    css: ['@/assets/stylus/main.styl'],

    /*
     ** Plugins to load before mounting the App
     */
    plugins: [
        '@/plugins/element-ui',
        '@/plugins/main',
        '@/plugins/i18n',
        '@/plugins/filters',
    ],

    router: {
        middleware: 'auth'
    },

    /*
     ** Nuxt.js modules
     */
    modules: [
        // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/axios'
    ],
    buildModules: [
        '@nuxt/typescript-build'
    ],
    /*
     ** Axios module configuration
     */

    axios: {
        proxy: true
        // See https://github.com/nuxt-community/axios-module#options
    },
    proxy: {
        '/tcchart': {
            target: 'http://aws.ithinkcar.com/',  // 正式环境
            pathRewrite: { '^/tcchart': '' }
        },
        '/tcchorlist': {
            target: 'http://ledger.mythinkcar.cn/',  // 正式环境
            pathRewrite: { '^/tcchorlist': '' }
        },

    },
    generate: {
        routes: [
            // '/welcome/frontend',
            // '/welcome/android',
            // '/welcome/backend',
            // '/welcome/ai',
            // '/welcome/ios',
            // '/welcome/freebie',
            // '/welcome/article'
        ],
    },

    /*
     ** Build configuration
     */
    build: {
        transpile: [/^element-ui/],

        /*
         ** You can extend webpack config here
         */
        extend (config, ctx) {
            // Run ESLint on save
            if (ctx.isDev && ctx.isClient) {
                config.module.rules.push({
                    enforce: 'pre',
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    exclude: /(node_modules)/
                })
            }
        }
    }
}
