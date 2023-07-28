const express = require("express");
const { Server } = require("socket.io");
const { db } = require('../sql/sql')
const { getUserOnlyId } = require('../utils/getUserId')
// 实时聊天
const chat = express(); 
const io = new Server(4000, {
    cors:{
        origin:'*'
    }
 });


let userList = []
io.on("connection", (socket) => {
    const { userId, username } = socket.handshake.query
    if(!userId) return
    const userInfo = userList.find(item => item.userId === userId)
    // 如果不存在
    if(!userInfo){
        userList.push({
            username,
            userId,
            socketId:socket.id
        })
    }else{
        // 存在的话要更新id
        userInfo.socketId = socket.id
    }
    // 广播上线
    io.emit('online',{
        userList
    })

    socket.on('sendMsg', (msg)=>{
        // 广播
        // io.emit('msg', msg)
        // 私聊
        socket.to(msg.acceptSocketId).emit("msg",  msg);
        // 私聊的同时将信息存入数据库中
        const sql = `insert into chatinfo (userSendId, userAcceptId, content) value (?, ?, ?)`
        db.query(sql, [msg.sendId, msg.acceptId, msg.message])

    })



    socket.on('disconnect',()=>{
        // console.log("有人走了");
        const index = userList.findIndex(item => item.socketId === socket.id)
        if (index !== -1) {
            userList.splice(index, 1);
            // 广播离线
            io.emit('online', {
                userList
            });
        }
    })
});


// 当用户不在线的时候走这个
chat.post('/storageChat',(req, res)=>{
    const sql = `insert into chatinfo (userSendId, userAcceptId, content, isSocketMsg) value (?, ?, ?, ?)`
    db.query(sql, [req.body.sendId, req.body.acceptId, req.body.message, '0'],(err, result)=>{
        res.send({
            code:200,
            message:"success"
        })
    })
})

chat.use(express.json())
// 用户获取聊天纪录和所有好友的聊天纪录，不是好友的就不用查了
chat.post('/getChat',async (req, res)=>{
    let userId = await getUserOnlyId(req.auth)
    const sql = `select userSendId as sendId, userAcceptId as acceptId, content as message, sendTime 
    from chatinfo where ( userSendId = ? and userAcceptId = ? ) or ( userSendId = ? and userAcceptId = ?  ) `
    db.query(sql, [userId, req.body.data, req.body.data, userId],(err, result)=>{
        if(!err){
            res.send({
                code:200,
                data:result,
                message:"success"
            })
        }
    })
})

module.exports = {
    chat
}