// 系统配置
const config = require('config')
const port = config.get('server').port
// 认证相关
const expressSession = require('express-session')
// 持久层相关
const modelDir = __dirname + config.get('server').modelDir
const fs = require('fs')
const sequelize = require(__dirname + '/src/sequelize/sequelize.js')
// 日志相关
const log = require('tracer').colorConsole({ level: config.get('log').level })
// 中间件应用服务
const express = require('express')
const bodyParser = require('body-parser')
const xmodel = require('express-xmodel')
const xbatis = require('express-xbatis')
const xnosql = require('express-xnosql')

// 初始化应用服务器
const app = express()
app.use(bodyParser.json())
app.use(expressSession({
    secret: 'cheneyxu',
    resave: false,
    saveUninitialized: false
}));
// 初始化调用 passport
// app.use(passport.initialize())
// app.use(passport.session())
// app.use(flash())
app.use('/',function(req,res,next){
    log.info('统一权限控制')
    if(true){
        next()
    }else{
        res.send('权限校验失败')
    }
})

// express-xmodel首先同步所有实体和数据库
fs.readdirSync(modelDir).forEach(function(filename) {
    require(modelDir + filename)
})
sequelize.sync().then(function() {
    log.info('express-xmodel所有实体已同步数据库')
})

// 使用express-xmodel中间件
xmodel.modelDir = modelDir
app.use('/xmodel/', xmodel)
// 使用express-xbatis中间件
app.use('/xbatis/', xbatis)
// 使用express-xnosql中间件
xnosql.dburl = 'mongodb://localhost:27017/test'
app.use('/xnosql/', xnosql)

// 开始服务监听
app.listen(port, function() {
    log.info(`xserver服务已启动,执行环境:${process.env.NODE_ENV},端口:${port}...`)
    log.warn('express-xmodel使用方式：')
    log.info(`[POST]http://host:${port}/xmodel/MODEL/create`)
    log.info(`[POST]http://host:${port}/xmodel/MODEL/update`)
    log.info(`[POST]http://host:${port}/xmodel/MODEL/query`)
    log.info(`[GET]http://host:${port}/xmodel/MODEL/get/:id`)
    log.info(`[GET]http://host:${port}/xmodel/MODEL/destroy/:id`)
    log.warn('express-xbatis使用方式：')
    log.info(`[POST]http://host:${port}/xbatis/MODEL_NAME/METHOD_NAME`)
    log.warn('express-xnosql使用方式：')
    log.info(`[POST]http://host:${port}/xnosql/MODEL/create`)
    log.info(`[POST]http://host:${port}/xnosql/MODEL/update`)
    log.info(`[POST]http://host:${port}/xnosql/MODEL/query`)
    log.info(`[GET]http://host:${port}/xnosql/MODEL/get/:id`)
    log.info(`[GET]http://host:${port}/xnosql/MODEL/destroy/:id`)
})
