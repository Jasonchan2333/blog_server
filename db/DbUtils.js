const mysql = require("mysql");

module.exports = {
    // 数据库配置信息
    config: {
        host: "localhost",
        port: 3306,
        user: "root",
        password: "sowhat98418.",
        database: "blogDatabase",
    },
    sqlConnect: function(sql, sqlArr, callback) {
        var pool = mysql.createPool(this.config)
        pool.getConnection((err, conn) => {
            if (err) {
                throw err
                console.log("连接sql数据库失败");
            } else {
                console.log("连接sql数据库成功");
                // 访问数据库操作
                conn.query(sql, sqlArr, callback)
                    // 释放连接
                conn.release()
            }

        })

    }
}