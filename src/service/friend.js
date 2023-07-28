const express = require('express')
const friend = express()
const { db } = require('../sql/sql')
const { getUserOnlyId } = require('../utils/getUserId')
friend.get('/getFriend',async (req, res)=>{
    let userId = await getUserOnlyId(req.auth)
    const sql = `SELECT username, userId, img from userinfo where userId in 
    (select b.friendId FROM userinfo a join friendinfo b on a.userId= b.userId 
        where a.userId = ? ) order by id asc `

    db.query(sql,[ userId ], (err,result)=>{
        res.send({
            code:200,
            data:result,
            message:"success"
        })
    })
})



module.exports = {
    friend
}