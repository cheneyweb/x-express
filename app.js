// 系统配置
const config = require('config')
const port = config.server.port
const staticRoot = config.server.staticRoot
const controllerRoot = config.server.controllerRoot
const controllerDir = __dirname + config.server.controllerDir
// 认证相关
const expressSession = require('express-session')
const passport = require(__dirname + '/src/auth/passport_config.js')
const xauth = require(__dirname + '/src/auth/xauth.js')
// 持久层相关
const nodebatis = require(__dirname + '/src/nodebatis/nodebatis.js')
const sequelize = require(__dirname + '/src/sequelize/sequelize.js')
const modelDir = __dirname + config.server.modelDir
// 中间件应用服务
const express = require('express')
const bodyParser = require('body-parser')
const redis = require("redis")
const xcontroller = require('express-xcontroller')
const xmodel = require('express-xmodel')
const xbatis = require('express-xbatis')
const xnosql = require('express-xnosql')
// 日志相关
const log = require('tracer').colorConsole({ level: config.log.level })

// 初始化应用服务器
const app = express()
app.use(bodyParser.json())
app.use(expressSession({
    secret: 'cheneyxu',
    resave: false,
    saveUninitialized: false
}))
// const client = redis.createClient()
// client.on('connect',function(){
// client.set('author', 'cheneyxu',redis.print)
// client.get('author', redis.print)
// })

// 加载认证路由
app.use(passport.initialize())
app.use(passport.session())
app.use('/', xauth)

// 静态资源服务
app.use(staticRoot, express.static(__dirname + '/static'))

// 1、使用express-xcontroller中间件,加载所有控制器
xcontroller.loadController(app, controllerRoot, controllerDir)					// 应用实例,访问根路径,控制器目录路径
// 2、使用express-xmodel中间件
xmodel.initConnect(modelDir, sequelize)  // 初始化mysql连接
app.use('/xmodel/', xmodel)
// 3、使用express-xbatis中间件
xbatis.initConnect(nodebatis)           // 初始化mysql连接
app.use('/xbatis/', xbatis)
// 4、使用express-xnosql中间件
xnosql.initConnect(config.mongodb.url)  // 初始化mongodb连接
app.use('/xnosql/', xnosql)

// 开始服务监听
app.listen(port)
log.info(`XServer应用启动【执行环境:${process.env.NODE_ENV},端口:${port}】`)
log.warn(`静态资源访问路径【localhost:${port}${staticRoot}*】`)
log.warn(`RESTful  API路径【localhost:${port}${controllerRoot}MODULE_NAME/*】`)
log.info(`===============================================================`)
log.warn(`XModel服务已启动`)
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
log.info(`[GET ]http://localhost:${port}/xnosql/MODEL/destroy/:id`)
