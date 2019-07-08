# x-express
xserver应用中间件组件服务express版本

[传送门：XServer官网文档](http://www.xserver.top)

框架目录结构
>
	├── app.js
	├── config
	│   ├── default.json
	│   ├── develop.json
	│   └── production.json
	├── node_modules
	├── package.json
	├── src
	│   ├── auth（已弃用，不再支持passport集成，现使用基于JWT的身份令牌识别替换）
	│   ├── controller
	│   ├── model
	│   ├── nodebatis
	│   ├── sequelize
	│   └── yaml
	└── static
	    └── test.html

帮助联系
>
	作者:cheneyxu
	邮箱:457299596@qq.com
	QQ:457299596

更新日志
>
	2017.05.08:集成passport认证中间件
	2017.05.09:集成redis缓存服务，集成acl角色权限控制服务
	2017.06.11:重构数据库连接方式
	2017.12.05:更新所有依赖
	2017.12.27:引入全新框架中间件，弃用passport
	2018.10.15:更新所有依赖
	2018.10.29:更新所有依赖
	2019.01.13:更新所有依赖
	2019.01.15:更新所有依赖
	2019.07.08:更新所有依赖