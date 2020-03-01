import Koa from 'koa'
import { Nuxt, Builder } from 'nuxt'
import { map, compose } from 'ramda'
import { resolve } from 'path'

// import { getWechat } from './wechat'

const r = path => resolve(__dirname, path)

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = !(process.env === 'production')
const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3000
const MIDDLEWARES = ['database', 'router']

export default class Server {
  constructor() {
    this.app = new Koa()
    this.useMiddleWares(this.app)(MIDDLEWARES)
  }

  useMiddleWares(app) {
    return map(compose(
      map(m => m(app)), // map可遍历对象
      require, // require后为对象如：{router: () =>{}}
      m => `${r('./middlewares')}/${m}`
    ))
  }

  async start() {
    // Instantiate nuxt.js
    const nuxt = new Nuxt(config)

    // Build in development
    if (config.dev) {
      const builder = new Builder(nuxt)
      await builder.build()
    }

    this.app.use(ctx => {
      ctx.status = 200
      ctx.respond = false // Mark request as handled for Koa
      ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
      nuxt.render(ctx.req, ctx.res)
    })

    this.app.listen(port, host)
    console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
    // getWechat()
  }
}

const app = new Server()
app.start()
