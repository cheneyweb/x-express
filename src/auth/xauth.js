// 路由相关
const express = require('express')
const router = express.Router()
// 认证相关
const passport = require(__dirname + '/passport_config.js')

// 角色权限
let acl = require('acl')
acl = new acl(new acl.memoryBackend())
acl.allow('admin', 'xbatis', 'remove')

/**
 * 登录认证
 */
router.post('/xauth/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) { return next(err) }
        if (user) {
            return req.logIn(user,function(){
                res.send('Y')
                acl.addUserRoles(user.id, 'admin')// 添加用户与其角色，这里模拟使用admin
            })
        } else {
            return res.send(info)
        }
    })(req, res, next)
})

/**
 * 登出认证
 */
router.get('/xauth/logout', function (req, res) {
    req.logout()
    res.send('Y')
})

// 认证测试
router.post('/xauth/test', function (req, res) {
    if (req.isAuthenticated()) {
        res.send('认证通过')
    } else {
        res.sendStatus(401)
    }
})

// 以下为自定义需要身份认证的路由
router.post('/xbatis/*/remove', async function (req, res, next) {
    if (req.isAuthenticated()) {
        // 权限判断
        let aclResult = await acl.isAllowed(req.session.passport.user.id, 'xbatis', 'remove')
        // 根据权限认证结果返回
        if(aclResult){
            return await next()
        }else{
            res.sendStatus(401)
        }
    } else {
        res.sendStatus(401)
    }
})

module.exports = router