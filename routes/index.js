var express = require('express');
var router = express.Router();
var Post = require('../model/post.js');

/* GET home page. */
router.get('/',function(req, res ,next){
    res.render('face', {
        title: "FantasyGao's Blog",
        success: req.flash('success').toString(),
        fail: req.flash('error').toString()
    });
})
router.get('/about',function(req, res ,next){
    res.render('about', {
        title: "about blog",
        success: req.flash('success').toString(),
        fail: req.flash('error').toString()
    });
})
router.get('/index', function(req, res, next) {
    Post.getPosts_index(false,function (err, posts, total) {
        if (err) {
            posts = [];
        }
        res.render('index', {
            title: "首页",
            posts: posts,
            count:total,
            success: req.flash('success').toString(),
            fail: req.flash('error').toString()
        });
    });
});
router.get('/tagone', function(req, res, next) {
    Post.getPosts_tag(false,"技术篇",function (err, posts, total) {
        if (err) {
            posts = [];
        }
        res.render('tag_one', {
            title: "tag_one",
            posts: posts,
            count:total,
            success: req.flash('success').toString(),
            fail: req.flash('error').toString()
        });
    });
});
router.get('/tagtwo', function(req, res, next) {
    Post.getPosts_tag(false,"心情篇",function (err, posts, total) {
        if (err) {
            posts = [];
        }
        res.render('tag_two', {
            title: "tag_two",
            posts: posts,
            count:total,
            success: req.flash('success').toString(),
            fail: req.flash('error').toString()
        });
    });
});
router.get('/tagthree', function(req, res, next) {
    Post.getPosts_tag(false,"感悟篇",function (err, posts, total) {
        if (err) {
            posts = [];
        }
        res.render('tag_three', {
            title: "tag_three",
            posts: posts,
            count:total,
            success: req.flash('success').toString(),
            fail: req.flash('error').toString()
        });
    });
});
router.get('/tagfour', function(req, res, next) {
    Post.getPosts_tag(false,"生活篇",function (err, posts, total) {
        if (err) {
            posts = [];
        }
        res.render('tag_four', {
            title: "tag_four",
            posts: posts,
            count:total,
            success: req.flash('success').toString(),
            fail: req.flash('error').toString()
        });
    });
});
router.get('/tagfive', function(req, res, next) {
    Post.getPosts_tag(false,"其他篇",function (err, posts, total) {
        if (err) {
            posts = [];
        }
        res.render('tag_five', {
            title: "tag_five",
            posts: posts,
            count:total,
            success: req.flash('success').toString(),
            fail: req.flash('error').toString()
        });
    });
});
router.get('/404', function(req, res, next) {
  res.send('page eror');
});
router.get('/article/:title/:day',function (req, res, next) {
  Post.getOne(req.params.day, req.params.title, function (err, post) {
    if (err) {
      req.flash('error', err);
      return res.redirect('/');
    }
    res.render('article', {
      title: req.params.title,
      post: post,
      success: req.flash('success').toString(),
      fail: req.flash('error').toString()
    });
      //console.log(typeof  post.text);
  });

})

module.exports = router;
