// 1. 加载各种模块
// 1.1 加载 express 模块
var express = require('express');
// 1.2 加载路由模块
var router = require('./router.js');
// 1.3 加载配置模块
var config = require('./config.js');
// 1.4 加载 body-parser
var bodyParser = require('body-parser');
// 1.5 加载 path 模块
var path = require('path');


// 创建 express 实例
var app = express();


// 2. 挂载各种 中间件

// 2.1 因为肯定知道后面会使用 body-parser，所以先挂载
// 挂载完 body-parser 后，在后面的 request 对象中可以直接使用 request.body 来获取 post 提交的数据
// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json 
app.use(bodyParser.json());



// 2.2 因为肯定知道后面会使用模板引擎，所以先挂载
// 设置好了模板文件的路径
app.set('views', path.join(__dirname, 'views'));
// 设置使用的模板引擎
app.set('view engine', 'ejs');





// 挂载路由
app.use(router);



// 3. 启动服务
app.listen(config.port, function () {
  // body...
  console.log('http://localhost:' + config.port);
});


