const express = require('express')
const login = express()
const crypto = require("crypto")
const { db } = require('../sql/sql')
const { SECRET_KEY } = require('../config/index')
const { upImgPath } = require('../sql/sql')
// 生成token
const jwt = require('jsonwebtoken')
// 唯一id
const uuid = crypto.randomUUID({ disableEntropyCache: true })

db.connect()


// 登录
login.post('/login',(req, res)=>{
    const sql = `select * from userinfo where username = ? && password = ? `
    db.query(sql,[ req.body.username, req.body.password ], (err,result)=>{
        if(!err){
            if(result.length !== 0){
                const Authorization = 'Bearer ' +  jwt.sign( req.body , SECRET_KEY, { expiresIn: '2 days' } )
                res.send({
                    code:200,
                    data:true,
                    message:"登录成功",
                    Authorization
                })
            }else{
                res.send({
                    code:200,
                    message:"账号或密码错误",
                    data:false
                })
            }
        }else{
            res.send({
                code:500,
                data:true,
                message:"登录失败，请稍后重试",
            })
        }
    })
})


// 注册
login.post('/register',(req, res)=>{
    const sql = `insert into userinfo (userId, username, password, img) value (?, ?, ?, ?)`
    const baseHeadImg = `${upImgPath}/1.jpg`
    db.query(sql,[ uuid, req.body.regSername, req.body.regPassword, baseHeadImg ], (err,result)=>{
        if(!err){
            res.send({
                code:201,
                data:true,
                message:"注册成功"
            })
        }else{
            res.send({
                code:500,
                data:true,
                message:"注册失败，请稍后重试"
            })
        }
    })
})

login.get('/test',(req, res)=>{
    res.send({
        code:200,
        data:'hhh',
        message:"success"
    })
})

db.connect()

module.exports = {
    login
}