var mongodb = require('./db');

function Post(title, tag, text, publish,time) {
	  this.time = time;
	  this.title = title;
	  this.tag = tag;
	  this.text = text;
	  this.publish = publish;
}
module.exports = Post;

//存储一篇文章及其相关信息
Post.prototype.save = function(callback) {
  var date = new Date();
  //存储各种时间格式，方便以后扩展
  var time = {
      date: date,
      year : date.getFullYear(),
      month : date.getFullYear() + "-" + (date.getMonth() + 1),
      day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
      minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
      date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()),
      second : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
      date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())+
      ":" + (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
  }
  //要存入数据库的文档
  var post = {
      time: time,
      title:this.title,
      tag: this.tag,
      text: this.text,
	  publish: this.publish,
	  pv:0
  };
  
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posttab1', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //将文档插入 posts 集合
      collection.insert(post, {
        safe: true
      }, function (err) {
        mongodb.close();
        if (err) {
          return callback(err);//失败！返回 err
        }
        callback(null);//返回 err 为 null
      });
    });
  });
};

//一次获取多篇文章
Post.getPosts = function(admin,callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posttab1', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //使用 count 返回特定查询的文档数 total
      collection.count({}, function (err, total) {
        collection.find({
		}, {
          skip: 0,
          limit: 50
        }).sort({
          time: -1
        }).toArray(function (err, docs) {
          mongodb.close();
          if (err) {
            return callback(err);
          }
		 var posts=[];
         docs.forEach(function (doc) {
			 if(admin){
				 var post = new Post(doc.title,doc.tag,doc.text,doc.publish,doc.time);
				 posts.push(post);
			 } else{
				 if(doc.publish=="1"){
					  var post = new Post(doc.title,doc.tag,doc.text,doc.publish,doc.time);
					  posts.push(post);
				 }
			 }
          }); 	
          callback(null,posts,total);
        });
      });
    });
  });
}

//一次获取多篇文章（index）
Post.getPosts_index = function(admin,callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posttab1', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //使用 count 返回特定查询的文档数 total
      collection.count({}, function (err, total) {
        collection.find({
		}, {
          skip: 0,
          limit: 10
        }).sort({
          time: -1
        }).toArray(function (err, docs) {
          mongodb.close();
          if (err) {
            return callback(err);
          }
		 var posts=[];
         docs.forEach(function (doc) {
			 if(admin){
				 var post = new Post(doc.title,doc.tag,doc.text,doc.publish,doc.time);
				 posts.push(post);
			 } else{
				 if(doc.publish=="1"){
					  var post = new Post(doc.title,doc.tag,doc.text,doc.publish,doc.time);
					  posts.push(post);
				 }
			 }
          }); 	
          callback(null,posts,total);
        });
      });
    });
  });
}
//一次获取多篇文章（按照tag）
Post.getPosts_tag = function(admin,tag,callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posttab1', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //使用 count 返回特定查询的文档数 total
      collection.count({}, function (err, total) {
        collection.find({
			"tag":tag
		}, {
          skip: 0,
          limit: 10
        }).sort({
          time: -1
        }).toArray(function (err, docs) {
          mongodb.close();
          if (err) {
            return callback(err);
          }
		 var posts=[];
         docs.forEach(function (doc) {
			 if(admin){
				 var post = new Post(doc.title,doc.tag,doc.text,doc.publish,doc.time);
				 posts.push(post);
			 } else{
				 if(doc.publish=="1"){
					  var post = new Post(doc.title,doc.tag,doc.text,doc.publish,doc.time);
					  posts.push(post);
				 }
			 }
          }); 	
          callback(null,posts,total);
        });
      });
    });
  });
}
//获取一篇文章
Post.getOne = function(day, title, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posttab1', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //根据用户名、发表日期及文章名进行查询
      collection.findOne({
        "time.day": day,
        "title": title
      }, function (err, doc) {
        if (err) {
          mongodb.close();
          return callback(err);
        }
        if (doc) {
          //每访问 1 次，pv 值增加 1
          collection.update({
            "time.day": day,
            "title": title
          }, {
            $inc: {"pv": 1}
          }, function (err) {
            mongodb.close();
            if (err) {
              return callback(err);
            }
          });
          callback(null, doc);//返回查询的一篇文章
        }
      });
    });
  });
};

//返回原始发表的内容
Post.edit = function(day, title, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posttab1', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //根据用户名、发表日期及文章名进行查询
      collection.findOne({
        "time.day": day,
        "title": title
      }, function (err, doc) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null, doc);//返回查询的一篇文章
      });
    });
  });
};


//删除一篇文章
Post.remove = function( second, title, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posttab1', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //查询要删除的文档
      collection.remove({
        "time.second": second,
        "title": title
      }, function (err) {
        if (err) {
          mongodb.close();
          return callback(err);
        }
         mongodb.close();
		 callback(null);
      });
    });
  });
};
//更新一篇文章及其相关信息
Post.update = function(day, title, text, publish, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posttab1', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //更新文章内容
      collection.update({
        "time.day": day,
        "title": title
      }, {
        $set: {text: text, publish:publish}
      }, function (err) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null);
      });
    });
  });
};


