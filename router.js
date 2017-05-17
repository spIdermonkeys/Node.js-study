// 创建路由对象
// 加载 express 模块
var express = require('express');
var handler = require('./handler.js');

// 创建路由对象
var router = express.Router();


// 为路由对象挂载各种路由

// 当 get 请求 / 路径时，返回 index.html 的内容
router.get('/', handler.index);

// 当 get 请求 /index 路径时，返回 index.html 的内容
router.get('/index', handler.index);

// 当 get 请求 /students 路径时，返回学员列表页
router.get('/students', handler.students);

// 当 get 请求 /add 路径时，渲染出一个 添加学员的页面。
router.get('/add', handler.add);

// 当 post 请求 /add 路径时， 将用户提交的数据保存到数据库
router.post('/add', handler.addPost);


// 当 get 请求 /info 路径时，渲染一个学员详情页面
router.get('/info', handler.info);


// 当 get 请求 /edit 路径时，渲染一个 编辑页面
router.get('/edit', handler.edit);

// 当 post 请求 /edit 路径时，更新用户提交的数据
router.post('/edit', handler.editPost);


// 当 get 请求 /delete 页面时， 删除一条记录
router.get('/delete', handler.delete);



// 把路由对象暴露出去
module.exports = router;