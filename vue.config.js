const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
module.exports = {
  publicPath: './', //基本路径
  outputDir: 'dist', //输出文件目录
  assetsDir: 'static', //css js 等静态文件目录
  productionSourceMap: false, //生产环境的 source map，默认true
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
  }
}
