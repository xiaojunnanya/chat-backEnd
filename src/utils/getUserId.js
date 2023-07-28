// 用name和password来获取用户id

const express = require('express');
const getUserId = express();
const { db } = require('../sql/sql');


function getUserOnlyId(res) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT userId FROM userinfo WHERE username = ? AND password = ?`;
      db.query(sql, [res.username, res.password], (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (result.length > 0) {
          resolve(result[0].userId);
        } else {
          reject(new Error('User not found.'));
        }
      });
    });
}

// call back方式

// function getOnlyUserId(username, password, callback) {
//   const sql = `SELECT userId FROM userinfo WHERE username = ? AND password = ?`;
//   db.query(sql, [username, password], (err, result) => {
//     if (err) {
//       callback(err, null);
//       return;
//     }

//     if (result.length > 0) {
//       callback(null, result[0].userId);
//     } else {
//       callback(new Error('User not found.'), null);
//     }
//   });
// }

// getOnlyUserId('aa', '112233', (err, userId) => {
//   if (err) {
//     console.error(err);
//     return;
//   }

//   console.log('User ID:', userId);
// });

module.exports = {
  getUserOnlyId,
};
