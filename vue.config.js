const path = require('path')
const bodyParser = require('body-parser')
const resolve = dir => {
  return path.join(__dirname, dir)
}

module.exports = {
  productionSourceMap: false,
  publicPath: '/',
  devServer: {
    port: 8062,
    before: app => {
      app.use(bodyParser.json())
      console.log('app')
      app.post('/admin/user/token', (req, res) => {
        const { username } = req.body
        if (username === 'admin') {
          res.cookie('jwt', '001')
          res.json({
            code: 10000,
            data: username
          })
        } else if (username === 'chen') {
          res.cookie('jwt', '002')
          res.join({
            code: 10000,
            data: username
          })
        } else {
          res.json({
            code: 10001,
            message: '用户名或密码错误'
          })
        }
      })
      app.get('/admin/user/info', (req, res) => {
        const id = req.get('token')
        if (id === '001') {
          res.json({
            id, username: 'admin', roles: ['admin'], code: 10000
          })
        } else if (id === '002') {
          res.json({
            id, username: 'chen', roles: ['member'], code: 10000
          })
        } else {
          res.json({
            code: 10006
          })
        }
      })
    }
    // proxy: {
    //   '/admin': {
    //     target: 'http://localhost:3330',
    //     pathRewrite: {
    //       '^/admin': '/admin'
    //     }
    //   }
    // }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@page', resolve('src/components/page'))
  }
}
