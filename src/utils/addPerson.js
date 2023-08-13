function addPerson(socket, userList){
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

    return userList
}

module.exports = {
    addPerson
}