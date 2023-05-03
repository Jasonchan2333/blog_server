const express = require("express")
const router = express.Router()
const sqlConfig = require("../db/DbUtils")
const plug = require("../plugin/uuid")
    /**
     * 类型种类分类API
     * */


// 列表接口
router.get("/getcategory", (req, res) => {
    let sql = "select * from category"
    let sqlArr = []
    let callback = (err, result) => {
        if (err) {
            console.log("查询失败");
            throw err
        } else {
            console.log("查询成功");
            res.send({
                "data": result
            })
        }
    }

    sqlConfig.sqlConnect(sql, sqlArr, callback)
})




// 添加
router.post("/add", (req, res) => {
    let { name } = req.body
        // 检查是否重复类名
    let sql = "select * from category where name =?"
    let sqlArr = [name]
    let callback = (err, result) => {
        if (err) {
            throw err
        } else {
            if (result.length == 0) {
                console.log("允许并开始添加类名");
                // sql操作⬇️ 正式添加类名

                // #region
                let id = plug.uuid(6, 8)
                let add_sql = "INSERT INTO category (id,name) VALUES (?,?)"
                let add_sqlArr = [id, name]
                let add_sql_callback = (err, result) => {
                        if (err) {
                            throw err
                            console.log("添加失败");
                        } else {
                            res.send({
                                "mas": "200",
                                "data": {
                                    "id": id,
                                    "name": name
                                }
                            })
                        }
                    }
                    // #endregion

                // sql操作⬆️
                sqlConfig.sqlConnect(add_sql, add_sqlArr, add_sql_callback)
            } else {
                console.log("数据库存在相同类名");
                res.send({
                    "msg": "类名重复"
                })
            }
        }
    }

    sqlConfig.sqlConnect(sql, sqlArr, callback)
})

// 修改
router.post("/update", (req, res) => {
    let { id, newName } = req.body
    let sql = "UPDATE category SET name = ? WHERE id=?"
    let sqlArr = [newName, id]
    let callback = (err, result) => {
        if (err) {
            throw err
        } else {
            console.log("修改类名成功");
            res.send({
                "msg": "200",
                "data": req.body
            })
        }
    }
    sqlConfig.sqlConnect(sql, sqlArr, callback)
})


// 删除
router.post("/delete", (req, res) => {
    let { id } = req.body
    let sql = "DELETE FROM category WHERE id=?"
    let sqlArr = [id]
    let callback = (err, result) => {
        if (err) {
            console.log("删除失败");
            throw err
        } else {
            console.log("删除成功");
            res.send({
                "msg": "删除成功"
            })
        }
    }
    sqlConfig.sqlConnect(sql, sqlArr, callback)
})




module.exports = router