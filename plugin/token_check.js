module.exports.checkToken =
    function(callback) {
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
                    callback()
                        // #endregion
                        // ⬆️
                } else {
                    console.log("token验证失败");
                }
            }
        })
    }