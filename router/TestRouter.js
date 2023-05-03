const express = require("express")
const router = express.Router()
const sqlConfig = require("../db/DbUtils")


router.get("/admindata", (req, res) => {
    let sql = "select * from admin"
    let sqlArr = []
    let callback = (err, result) => {
        if (err) {
            console.log("数据库查询失败");
            return
        } else {
            console.log("数据库查询成功");
            res.send(result)
        }
    }
    sqlConfig.sqlConnect(sql, sqlArr, callback)
})

module.exports = router