
const { chat } = require('./service/chart')
const { friend } = require('./service/friend')
const { headImg } = require('./service/headImg')
const { login } = require('./service/login')
const { canvas } = require('./service/canvas')
const { userInfo } = require('./service/userInfo')
const { praseToken } = require('./utils/token')
const { corsOrigin } = require('./utils/cors')
const express = require('express')
const app = express()


app.use(corsOrigin)
app.use(express.json())
app.use(praseToken)
// // 在所有页面都可以获取id：let userId = await getUserOnlyId(req.auth)
app.use(login)
app.use(friend)
app.use(headImg)
app.use(userInfo)
app.use(express.static('./uploads'))
app.use(chat)
app.use(canvas)

app.listen(9002, ()=>{
    console.log("express服务器启动成功,9002端口");
})