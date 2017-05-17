// 处理业务模块

// 加载 mongodb 模块
var mongodb = require('mongodb');
// 加载 config 模块
var config = require('./config.js');

// 处理 / 和 /index 请求的方法
module.exports.index = function(req, res) {
  // 会读取 views 下的 index.ejs 文件，并将其渲染出去
  res.render('index');
};


// 处理 /students 请求的方法
module.exports.students = function(req, res) {
  // 1. 连接数据库，读取数据库中的数据
  // 创建一个 MongoClient 对象
  var MongoClient = mongodb.MongoClient;

  // 调用 MongoClient 的 connet 方法, 连接数据库
  MongoClient.connect(config.conUrl, function(err, db) {
    // 判断连接是否出错
    if (err) {

      if (db) {
        db.close();
      }

      throw err;
    }


    // 如果 不出错 ，就要通过 db 进行数据查询
    db.collection('students').find().toArray(function(err, docs) {
      // 判断是否出错
      if (err) {
        if (db) {
          db.close();
        }
        throw err;
      }

      // 如果查询不出错，那么把查询到的结果直接渲染出去
      // 2. 把读取到的数据传递个 res.render 方法，进行模板替换
      res.render('students', { list: docs });
      db.close();
    });
  });
};


// 处理 /add 路径的 get 请求
module.exports.add = function(req, res) {

  // 1. 从数据库中读取 城市信息
  var MongoClient = mongodb.MongoClient;

  // 连接数据库
  MongoClient.connect(config.conUrl, function(err, db) {
    if (err) {
      if (db) {
        db.close();
      }
      throw err;
    }

    // 查询城市信息
    db.collection('cities').find().toArray(function(err, docs_city) {
      if (err) {
        db.close();
        throw err;
      }

      // // 2. 从数据库中读取 专业信息.查询专业信息
      db.collection('majors').find().toArray(function(err, docs_major) {
        if (err) {
          db.close();
          throw err;
        }

        // 3. 渲染 add 页面, 渲染 add 页面的同时，把前两步读取到的数据传递个模板引擎
        res.render('add', { cities: docs_city, majors: docs_major });
        db.close();
      });
    });
  });
};


// 处理 /add 路径的 post 请求
module.exports.addPost = function(req, res) {
  // 1. 获取用户 post 提交过过来的数据
  // req.body

  // 2. 把用户提交的数据插入到数据库中
  var MongoClient = mongodb.MongoClient;
  MongoClient.connect(config.conUrl, function(err, db) {
    if (err) {
      if (db) {
        db.close();
      }
      throw err;
    }

    // 把数据插入数据库中的某个集合中（表中）
    var doc = {
      sno: req.body.sno,
      sname: req.body.sname,
      sgender: req.body.sgender.toLowerCase() === 'm' ? '男' : '女',
      sbirthday: req.body.sbirthday,
      sphone: req.body.sphone,
      saddr: req.body.saddr,
      smajor: req.body.smajor
    };


    db.collection('students').insertOne(doc, function(err, result) {
      if (err) {
        db.close();
        throw err;
      }

      db.close();
      // 3. 重定向到 /students 列表页面
      res.redirect('/students');
    })
  });
};


// 处理 /info 路径的 get 请求
module.exports.info = function(req, res) {
  // 1. 获取用户传递过来的参数 _id 的值
  // req.query._id

  // 2. 根据 _id 的值，从数据库中查询出对应的数据
  var MongoClient = mongodb.MongoClient;
  MongoClient.connect(config.conUrl, function(err, db) {
    if (err) {
      if (db) {
        db.close();
      }
      throw err;
    }

    // 根据 _id 去数据库中查询数据
    // 把 req.query._id 转换为 ObjectID
    var objId = new mongodb.ObjectID(req.query._id);

    db.collection('students').findOne({ _id: objId }, function(err, doc) {
      // 判断是否出错
      if (err) {
        db.close();
        throw err;
      }

      res.render('info', { item: doc });

      db.close();
    });

  });

  // 3. 根据查询出的数据 渲染 info 页面
};


// 处理 /edit 路径的 get 请求
module.exports.edit = function(req, res) {

  // 1. 获取用户提交过来的 _id
  // req.query._id


  // 2. 根据 _id 去数据库中执行查询
  var MongoClient = mongodb.MongoClient;
  MongoClient.connect(config.conUrl, function(err, db) {
    if (err) {
      if (db) {
        db.close();
      }
      throw err;
    }

    // 执行查询
    var objId = new mongodb.ObjectID(req.query._id);
    db.collection('students').findOne({ _id: objId }, function(err, doc) {
      if (err) {
        db.close();
        throw err;
      }


      // 查询 籍贯信息
      db.collection('cities').find().toArray(function(err, docs_city) {
        if (err) {
          db.close();
          throw err;
        }


        // 查询专业信息
        db.collection('majors').find().toArray(function(err, docs_major) {
          if (err) {
            db.close();
            throw err;
          }

          // 3. 根据查询到的数据渲染 edit 页面
          res.render('edit', { item: doc, cities: docs_city, majors: docs_major });
          db.close();
        });
      });
    });
  });
};




// 处理 /edit 路径的 post 请求
module.exports.editPost = function(req, res) {
  // 1. 获取用户 post 提交过来的数据
  // req.body
  // req.body._id

  // 2. 根据用户提交过来的数据更新数据库
  var MongoClient = mongodb.MongoClient;
  MongoClient.connect(config.conUrl, function(err, db) {
    if (err) {
      if (db) {
        db.close();
      }
      throw err;
    }

    // 进行更新操作
    var objId = new mongodb.ObjectID(req.body._id);
    var doc = {
      sno: req.body.sno,
      sname: req.body.sname,
      sgender: req.body.sgender.toLowerCase() === 'm' ? '男' : '女',
      sbirthday: req.body.sbirthday,
      sphone: req.body.sphone,
      saddr: req.body.saddr,
      smajor: req.body.smajor
    };
    db.collection('students').updateOne({ _id: objId }, { $set: doc }, function(err, result) {
      // 更新完毕后的回调函数
      if (err) {
        db.close();
        throw err;
      }
      db.close();
      // 3. 重定向到 列表页 /students
      res.redirect('/students');
    });
  });
};


// 处理 /delete 路径的 get 请求
module.exports.delete = function (req, res) {
  // 1. 获取用户提交过来的 _id
  // req.query._id

  // 2. 根据 _id 去数据库中执行删除操作
  var MongoClient = mongodb.MongoClient;
  MongoClient.connect(config.conUrl, function (err, db) {
    if (err) {
      if (db) {
        db.close();
      }
      throw err;
    }

    // 执行删除操作
    var objId = new mongodb.ObjectID(req.query._id);
    db.collection('students').deleteOne({_id: objId}, function (err, result) {
      if (err) {
        db.close();
        throw err;
      }

      db.close();
      // 3. 重定向到 /students 列表页面
      res.redirect('/students');
    });
  });
};
