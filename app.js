// 系统配置
const config = require('config')
const port = config.server.port
const staticRoot = config.server.staticRoot
// 持久层相关
const nodebatis = require(__dirname + '/src/nodebatis/nodebatis.js')
const sequelize = require(__dirname + '/src/sequelize/sequelize.js')
// 应用中间件
const express = require('express')
const bodyParser = require('body-parser')
// const redis = require("redis")
const xcontroller = require('express-xcontroller')
const xmodel = require('express-xmodel')
const xbatis = require('express-xbatis')
const xnosql = require('express-xnosql')
const xerror = require('express-xerror')
const xauth = require('express-xauth')
const xlog = require('express-xlog')
// 日志相关
const log = require('tracer').colorConsole({ level: config.log.level })

// 初始化应用服务器
const app = express()
// 静态资源服务
app.use(staticRoot, express.static(__dirname + '/static'))
app.use(bodyParser.json())
app.use(xlog(config.log, (req) => { log.info('异步日志处理', req.body) }))
app.use(xauth(config.auth, (v) => v))                                          // 参数1：认证配置，参数2：TOKEN提取规则

// // 认证相关
// app.use(expressSession({
//     secret: 'cheneyxu',
//     resave: false,
//     saveUninitialized: false
// }))
// const expressSession = require('express-session')
// const passport = require(__dirname + '/src/auth/passport_config.js')
// const xauth = require(__dirname + '/src/auth/xauth.js')
// // 加载认证路由
// app.use(passport.initialize())
// app.use(passport.session())
// app.use('/', xauth)
// REDIS缓存服务
// const client = redis.createClient()
// client.on('connect',function(){
// client.set('author', 'cheneyxu',redis.print)
// client.get('author', redis.print)
// })

// 1、使用express-xcontroller中间件,加载所有控制器
xcontroller.init(app, config.server)
// 2、使用express-xmodel中间件
xmodel.init(app, sequelize, config.server) // 初始化mysql连接
// 3、使用express-xbatis中间件
xbatis.init(app, nodebatis, config.server) // 初始化mysql连接
// 4、使用express-xnosql中间件
xnosql.init(app, config.server)

app.use(xerror(config.error, (req, res, err) => { // 需要在最后一位路由处理
    log.info('额外可选错误处理')
    const result = { err: err.message }
    result.stack = err.stack
    res.status(200).send(result)
}))

// 开始服务监听
app.listen(port)
log.info(`XServer应用启动【执行环境:${process.env.NODE_ENV},端口:${port}】`)
log.warn(`静态资源访问路径【localhost:${port}${staticRoot}*】`)
log.info(`RESTful  API路径【localhost:${port}${config.server.controllerRoot}/MODULE_NAME/*】`)
log.info(`XModel服务已启动`)
log.info(`[POST]http://localhost:${port}/xmodel/MODEL/create`)
log.info(`[POST]http://localhost:${port}/xmodel/MODEL/update`)
log.info(`[POST]http://localhost:${port}/xmodel/MODEL/query`)
log.info(`[GET ]http://localhost:${port}/xmodel/MODEL/get/:id`)
log.info(`[GET ]http://localhost:${port}/xmodel/MODEL/destroy/:id`)
log.info(`===============================================================`)
log.warn(`XBatis服务已启动`)
log.info(`[POST]http://localhost:${port}/xbatis/MODEL_NAME/METHOD_NAME`)
log.info(`===============================================================`)
log.warn(`XNosql服务已启动`)
log.info(`[POST]http://localhost:${port}/xnosql/MODEL/create`)
log.info(`[POST]http://localhost:${port}/xnosql/MODEL/update`)
log.info(`[POST]http://localhost:${port}/xnosql/MODEL/query`)
log.info(`[GET ]http://localhost:${port}/xnosql/MODEL/get/:id`)
log.info(`[GET ]http://localhost:${port}/xnosql/MODEL/delete/:id`)
