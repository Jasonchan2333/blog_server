const express = require("express")
const router = express.Router()
const { v4: uuidv4 } = require("uuid")
const sqlConfig = require("../db/DbUtils")


router.post("/login", (req, res) => {
    let { userName, userPwd } = req.body
    let sql = "select * from admin where userName = ? AND userPwd = ?" //sql语句区域
    let sqlArr = [userName, userPwd]
    let callback = (err, result) => {
        /**
         * 回调函数区域
         * */
        if (err) {
            throw err
            console.log("查询数据库失败");
        } else {
            if (result.length == 0) {
                console.log("登陆失败");
                res.send({
                    "status": "500"
                })
            } else {
                // sql操作⬇️  给登陆ID添加token操作
                //#region
                let sql_res = JSON.parse(JSON.stringify(result))
                console.log(sql_res[0].id);
                let token = uuidv4()
                let update_token_sql = "UPDATE admin SET token = ? where id = ?"
                let update_token_sqlArr = [token, sql_res[0].id]
                let update_token_sql_callback = (err, result) => {
                    if (err) { throw err } else {
                        console.log("token更新成功:" + token);
                    }
                }
                sqlConfig.sqlConnect(update_token_sql, update_token_sqlArr, update_token_sql_callback)
                    //#endregion
                    // sql操作⬆️
                console.log("登陆成功");
                res.send({
                    "status": "200",
                    "data": {
                        "id": sql_res[0].id,
                        "userName": sql_res[0].userName,
                        "token": token
                    }
                })
            }

        }
        // 
    }
    sqlConfig.sqlConnect(sql, sqlArr, callback)
})

module.exports = router