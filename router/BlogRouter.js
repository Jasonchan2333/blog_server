const express = require("express")
const router = express.Router()
const sqlConfig = require("../db/DbUtils")
const plugin = require("../plugin/uuid")

// token验证模版（狗屎版）
// const { token } = req.headers
// let admin_token_sql = "SELECT * FROM admin WHERE token = ?"
// let admin_token_sqlArr = [token]
// sqlConfig.sqlConnect(admin_token_sql,admin_token_sqlArr,(err,result)=>{
//     if(err){
//         throw err
//     }else{
//         if(result.length != 0){
//             console.log("token验证通过");
//             // ⬇️ 最终修改sql操作
//             // #region

//             // #endregion
//             // ⬆️
//         }else{
//             console.log("token验证失败");
//         }
//     }
// })

// 添加博客
router.post("/add", (req, res) => {

    const { token } = req.headers
    let admin_token_sql = "SELECT * FROM admin WHERE token = ?"
    let admin_token_sqlArr = [token]
        // token验证⬇️
    sqlConfig.sqlConnect(admin_token_sql, admin_token_sqlArr, (err, result) => {
        if (err) {
            throw err
        } else {
            if (result.length != 0) {
                console.log("token验证通过");
                // ⬇️ 最终修改sql操作
                // #region
                let { title, category_id, content } = req.body
                let id = plugin.uuid(12, 8)
                let create_time = new Date().valueOf()
                let sql = "INSERT INTO blog(id,category_id,title,content,create_time) VALUES(?,?,?,?,?)"
                let sqlArr = [id, category_id, title, content, create_time]
                let callback = (err, result) => {
                    if (err) {
                        console.log("添加失败");
                        throw err
                    } else {
                        res.send({
                            id,
                            ...req.body,
                            create_time
                        })
                    }
                }
                sqlConfig.sqlConnect(sql, sqlArr, callback)
                    // #endregion
                    // ⬆️
            } else {
                console.log("token验证失败");
            }
        }
    })
})

// 修改博客
router.put("/update", (req, res) => {
    const { token } = req.headers
        // 校验TOKEN
    let admin_token_sql = "SELECT * FROM admin WHERE token = ?"
    let admin_token_sqlArr = [token]
    sqlConfig.sqlConnect(admin_token_sql, admin_token_sqlArr, (err, result) => {
        if (err) {
            throw err
        } else {
            if (result.length != 0) {
                console.log("token验证通过");
                // sql操作⬇️ 验证通过正式修改
                // #region
                let { id, title, category_id, content } = req.body
                let sql = "UPDATE blog SET title = ?,category_id=?,content =? WHERE id=?"
                let sqlArr = [title, category_id, content, id]
                let callback = (err, result) => {
                        if (err) {
                            throw err
                            console.log("修改失败");
                        } else {
                            res.send({
                                "msg": "200",
                                id
                            })
                        }
                    }
                    // #endregion
                    // sql操作⬆️
                sqlConfig.sqlConnect(sql, sqlArr, callback)
            } else {
                console.log("token验证失败");
            }
        }
    })



})

// 删除博客
router.post("/delete", (req, res) => {
    const { token } = req.headers
    let admin_token_sql = "SELECT * FROM admin WHERE token = ?"
    let admin_token_sqlArr = [token]
    sqlConfig.sqlConnect(admin_token_sql, admin_token_sqlArr, (err, result) => {
        if (err) {
            throw err
        } else {
            if (result.length != 0) {
                console.log("token验证通过");
                // ⬇️ 最终修改sql操作
                // #region
                let { id } = req.body
                let sql = "DELETE FROM blog WHERE id=?"
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
                    // #endregion
                sqlConfig.sqlConnect(sql, sqlArr, callback)
                    // ⬆️
            } else {
                console.log("token验证失败");
            }
        }
    })



})

// 查询博客(难点)
router.get("/search", (req, res) => {
        let { keyword, category_id, page, pageSize } = req.query

        // 处理空请求值
        page = page == null ? 1 : page
        pageSize = pageSize == null ? 10 : pageSize
        keyword = keyword == null ? "" : keyword
        category_id = category_id == null ? 0 : category_id

        // 拼接sql语句
        let sqlArr = [] //sql参数
        let whereSqls = [] //where语句
        if (category_id != 0) {
            console.log("有分类id传入:", category_id);
            whereSqls.push(" category_id = ? ")
            sqlArr.push(category_id)
        }

        if (keyword.length > 0) {
            console.log("有关键词传入", keyword);
            whereSqls.push(" (title LIKE ? OR content LIKE ?) ") //模糊搜索
            sqlArr.push('%' + keyword + '%')
            sqlArr.push('%' + keyword + '%')
        }

        let whereSqlStr = ""
        if (whereSqls.length >= 1) {
            whereSqlStr = "WHERE" + whereSqls.join(" AND ") //拼接
        }
        console.log("最终WHERE函数：", whereSqlStr);
        // 查询分页数据
        let searchSql = " SELECT * FROM blog " + whereSqlStr + " ORDER BY create_time DESC LIMIT ?,?" //正式拼接，带有分页信息
        let searchSqlArr = sqlArr.concat([(page - 1) * pageSize, pageSize]) //添加分页信息参数

        // 查询数据总数
        let searchCount_sql = "SELECT count(*) FROM blog " + whereSqlStr;
        let searchCount_sqlArr = sqlArr

        sqlConfig.sqlConnect(searchCount_sql, searchCount_sqlArr, (err, result) => {
            let allRes = []
            if (err) {
                throw err
            } else {
                allRes.push(JSON.parse(JSON.stringify(result[0])))
                sqlConfig.sqlConnect(searchSql, searchSqlArr, (err, result) => {
                    if (err) {
                        throw err
                        res.send({
                            code: 500,
                            msg: "查询失败"
                        })
                    } else {
                        allRes.push(result)
                        res.send({
                            code: 200,
                            msg: "查询成功",
                            data: {
                                keyword,
                                category_id,
                                page,
                                pageSize,
                                count: allRes[0]['count(*)'],
                                rows: allRes[1]
                            }
                        })

                    }
                })
            }
        })
    })
    /**
     *  
     */

module.exports = router