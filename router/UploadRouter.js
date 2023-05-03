const express = require("express")
const router = express.Router()
const fs = require("fs")
const sqlConfig = require("../db/DbUtils")


router.post("/editor_upload", async(req, res) => {
    if (!req.files) {
        res.send({
            "errno": 1, // 只要不等于 0 就行
            "message": "失败信息"
        })
    } else {
        // 上传成功
        let files = req.files;
        let return_files = []

        for (let file of files) {
            let file_suffix = file.originalname.substring(file.originalname.lastIndexOf("."));
            let file_name = file.filename + file_suffix
                //修改名字=》移动路径
            fs.renameSync(
                process.cwd() + "/public/upload/temp/" + file.filename,
                process.cwd() + "/public/upload/" + file_name
            )
            return_files.push("/upload/" + file_name)
        }

        res.send({
            "errno": 0, // 注意：值是数字，不能是字符串
            "data": {
                "url": return_files[0],
            }
        })

    }
})

module.exports = router