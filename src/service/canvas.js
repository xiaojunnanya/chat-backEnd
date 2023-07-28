// 共享画板
const express = require("express");
const { Server } = require("socket.io");
// 实时聊天
const canvas = express(); 
const io = new Server(4001, {
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

    // 共享画板
    socket.on('canvasMsg', (msg)=>{
        // console.log(data);
        // 消息广播
        io.emit('canvasData', msg)
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


module.exports = {
    canvas
}