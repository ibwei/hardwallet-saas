const vueServe = require('./vue.serve')
const vueBuild = require('./vue.build')

const IS_DEV = process.env.NODE_ENV === 'production' ? false : true

const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
module.exports = {
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: false,
  devServer: {
    host: 'localhost',
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: '<url>',
        ws: true,
        changeOrigin: true
      }
    }
  },
  configureWebpack: {
    plugins: [new VuetifyLoaderPlugin()]
  },
  chainWebpack: webpackConfig => {
    IS_DEV ? vueServe(webpackConfig) : vueBuild(webpackConfig)
  }
}
