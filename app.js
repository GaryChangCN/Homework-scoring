 require('events').EventEmitter.prototype._maxListeners = 100;
// var emitter=require("events").EventEmitter;
// emitter.setMaxListeners(30);
var http = require("http");
var express = require("express");
var app = express();
var formidable = require("formidable");
var fs = require("fs");
var loginVerify = require("loginVerify");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var uploadFile = require("uploadFile");
app.on('error', function(err) {
    console.log(err);
})
app.use(cookieParser());
app.use(session({
    secret: 'Tinytin',
    resave: false,
    saveUninitialized: true,
    "key": "nsession"
}));
//判断是否已经登录而选择进入login页面还是首页
app.use(function(req, res, next) {
    if ((req.path == "/") || (req.path == "/login.html")) {
        var view = req.session.view;
        if (view == "TinKey") {
            res.redirect(301, "/myHomeWork.html");
        } else {
            res.sendFile(__dirname + '/public/login.html');
        }
    } else {
        next();
    }
});
//登录模块  添加session值
app.get('/Tlogin', function(req, res) {
    loginVerify.loginVerify(req, res);
});
//判断是否已经登录（有session）的中间件，静态资源不影响
app.use(function(req, res, next) {
    var view = req.session.view;
    if (view == "TinKey") {
        res.cookie("userId", req.session.userId);
        next();
    } else {
        res.redirect(301, '/');
    }
});
//打开document下文件
app.use(function(req, res, next) {
    var path = req.path;
    fs.exists(__dirname + "/document" + path, function(e) {
        if (e) {
            res.sendFile(__dirname + "/document/" + path);
        } else {
            next();
        }
    });
});
//退出
app.get('/logout', function(req, res, next) {
    res.cookie("nsession", " ");
    res.cookie("userId", " ");
    res.redirect(301, "/login.html");
});
//静态资源模块
app.use(express.static('public', { "index": "login.html" }));
app.get('/Tinformation', function(req, res) {
    loginVerify.getInformation(req, res);
});
app.get('/Tall',function(req,res){
    loginVerify.getAll(req,res);
})
app.post("/Tpost", function(req, res) {
    uploadFile.uploadFile(req, res);
});
app.use(function(req, res) {
    res.redirect(301, "404.html");
});
console.log("listen on 80");
app.listen(80);
