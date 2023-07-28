// 用户的信息

const express = require('express')
const userInfo = express()
const { getUserOnlyId } = require('../utils/getUserId')
const { db } = require('../sql/sql')
userInfo.get('/getUserInfo',async (req, res)=>{
    let userId = await getUserOnlyId(req.auth)

    let sql = `select username, userId, img from userinfo where userid = ?`
    db.query(sql, [userId], (err, result) =>{
        if(!err){
            res.send({
                code:200,
                data:result[0],
                message:'success'
            })
        }
    })
})

module.exports = {
    userInfo
}