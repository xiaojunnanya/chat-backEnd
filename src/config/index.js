// 定义常量

// jwt秘钥
const SECRET_KEY = 'xjnchatjl'

// 上传图片保存位置
const UPLOAD_PATH = './uploads'

// chat聊天的同源路径
const ORIGIN_URL = ['http://localhost:5000', '62.234.178.157:84']

// token解析忽略文件路径
const TOKEN_PATCH = ["/login","/register",/^\/getImg\/.*/, '/getImg','/storageChat', '/test']

module.exports = {
    SECRET_KEY,
    UPLOAD_PATH,
    ORIGIN_URL,
    TOKEN_PATCH
}