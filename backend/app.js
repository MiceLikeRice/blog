const express=require("express")
const cors=require("cors")
const config=require("./config/config.js")
const console = require('console')
const router=require("./routes/index.js");
const bodyParser=require("body-parser");
const port=config.development.serve.port
const app=express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false })); // for url-encoded data
app.use(bodyParser.json()); // for JSON data

//app.use(require("./middlewares/AuthMiddleware"));

app.use("/api",router); //所有的请求


app.listen(port,()=>console.log(`开始监听${port}端口`))