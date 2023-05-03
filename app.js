/**
 * multer   处理上床数据的中间件
 * uuid     随机码生成
 * mysql    
 */
const express = require("express")
const multer = require("multer")
const app = express()

const port = 3000
    //JSON处理中间件
app.use(express.json())
    //开放跨域
app.all("*", function(req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "*");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    if (req.method == 'OPTIONS')
        res.sendStatus(200); //让options尝试请求快速结束
    else
        next();
});
app.use(express.static(__dirname + '/public')); //定向静态目录
// 处理上传
const upload = multer({
    dest: "./public/upload/temp"
})
app.use(upload.any())

/**
 * 
 */

app.use("/test", require("./router/TestRouter"))
app.use("/admin", require("./router/AdminRouter"))
app.use("/category", require("./router/CategoryRouter"))
app.use("/blog", require("./router/BlogRouter"))
app.use("/upload", require("./router/UploadRouter"))




// 监听端口
app.listen(port, () => {
    console.log(`_server running at port of ${port}_`);
})