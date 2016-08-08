/**
 * Created by FantasyGao on 2016/7/24.
 */
var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../model/user.js');
var Post = require('../model/post.js');

router.get('/', function(req, res, next) {
    res.render('login', {
        title: 'admin_login',
        success: req.flash('success').toString(),
        fail: req.flash('error').toString()
    });
});
//脚本作用固定设置管理员密码
router.get('/set_the_key', function(req, res) {
    var md5 = crypto.createHash('md5');
    var newUser = new User({
        name:'Fantasy1',
        password: md5.update('aaa1994gtr').digest('hex')
    });
    newUser.save(function (err, user) {
        if (err) {
            req.flash('error', err);
        }
    });
    res.redirect('/404');
});
router.post('/',function(req, res){
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('hex');
    User.get(req.body.name, function(err, user) {
        if (!user) {
            req.flash('error', '非管理员用户名');
            return res.redirect('/admin');
        }

        if (user.password != password) {
            req.flash('error', '用户名或密码错误');
            return res.redirect('/admin');
        }
        req.session.user = user;
        req.flash('success', '登录成功');
        res.redirect('/admin/index');
    });

});
router.get('/index', function(req, res, next) {
    if(!req.session.user){
        return res.redirect('/404');
    }
    Post.getPosts(true,function (err, posts, total) {
        if (err) {
            posts = [];
        }
        res.render('admin', {
            title: 'admin_index',
            posts: posts,
            count:total,
            success: req.flash('success').toString(),
            fail: req.flash('error').toString()
        });
    });
});
router.get('/post', function(req, res, next) {
    if(!req.session.user){
        return res.redirect('/404');
    }
    res.render('post', {
        title: 'admin_post',
        success: req.flash('success').toString(),
        fail: req.flash('error').toString()
    });
});
router.post('/post', function(req, res, next) {
    var post = new Post( req.body.title, req.body.tag, req.body.text, req.body.publish );
    //console.log(req.body.publish);
    post.save(function (err) {
        if (err) {
            req.flash('error', '发布出错！');
            return res.redirect('/admin/post');
        }
        req.flash('success', '发布成功!');
        res.redirect('/admin/index');//发表成功跳转到主页
    });
});

router.get('/edit/:title/:day',function (req, res) {
    if(!req.session.user){
        return res.redirect('/404');
    }
    Post.edit(req.params.day, req.params.title, function (err, post) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/admin/index');
        }
        res.render('edit', {
            title: 'admin_edit',
            post: post,
            success: req.flash('success').toString(),
            fail: req.flash('error').toString()
        });
    });
})

router.post('/edit/:title/:day',function (req, res) {
    Post.update( req.params.day, req.params.title, req.body.text, req.body.publish, function (err) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/admin/edit/:title/:day');
        }
        req.flash('success', '修改成功!');
        res.redirect('/admin/index');//发表成功跳转到主页
    });
})

router.get('/remove/:title/:second',function (req, res,next) {
    if(!req.session.user){
        return res.redirect('/404');
    }
    Post.remove(req.params.second, req.params.title, function (err) {
        if (err) {
            req.flash('error', "删除失败");
            return res.redirect('/admin/index');
        }
        req.flash('success', "删除成功！");
        res.redirect('/admin/index');
    });
})

module.exports = router;