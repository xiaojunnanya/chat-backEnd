// 关于用户头像的

const express = require('express')
const headImg = express()
const multer = require('multer')
const { db } = require('../sql/sql')
const { getUserOnlyId } = require('../utils/getUserId')
const { UPLOAD_PATH } = require('../config/index')
const { upImgPath } = require('../sql/sql')
// require('../../uploads/1689699354346-赵今麦1.jpg')

const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, UPLOAD_PATH)
    },
    filename(req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
  })
const upload = multer({ storage })

// 上传头像，纪录头像的信息
headImg.post('/avatar',upload.single('headImg'),async (req, res )=>{
    let userId = await getUserOnlyId(req.auth)
    // 优化：如果headimg那个表有这个userId，我就执行改的操作
    let sql = `INSERT INTO headimg (userId, filename, imgType) VALUES (?, ?, ? );`
    
    const { filename, mimetype } = req.file

    db.query(sql,[ userId , filename, mimetype ], (err,result)=>{
        console.log(err);
        if(!err){
            res.send({
                code:200,
                data:true,
                message:"上传成功"
            })

            // 上传成功之后，更新用户表里的地址字段
            const img = `${upImgPath}/${filename}`
            let sql2 = `update userinfo set img = ? where userId = ? `
            db.query(sql2, [img, userId], (err, result)=>{

            })
        }else{
            res.send({
                code:500,
                data:true,
                message:"上传失败"
            })
        }
    })
})


// 直接查看头像接口
const fs = require('fs')
headImg.get('/getImg/:path', (req, res) => {
    const {path} = req.params
    const imagePath = `./uploads/${path}`;
    const image = fs.readFileSync(imagePath);
    res.writeHead(200, { 'Content-Type': 'image/jpeg' });
    res.end(image, 'binary');
});

module.exports = {
    headImg
}