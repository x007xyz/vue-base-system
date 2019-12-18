const path = require('path')
const resolve = dir => {
  return path.join(__dirname, dir)
}

module.exports = {
  productionSourceMap: false,
  publicPath: '/',
  devServer: {
    port: 8062,
    proxy: {
      '/admin': {
        target: 'http://localhost:3330',
        pathRewrite: {
          '^/admin': '/admin'
        }
      }
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@page', resolve('src/components/page'))
  }
}
