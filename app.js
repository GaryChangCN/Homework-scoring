require('events').EventEmitter.prototype._maxListeners = 100;
var http = require("http");
var express = require("express");
var app = express();
var formidable = require("formidable");
var fs = require("fs");
var loginVerify = require("loginVerify");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var uploadFile = require("uploadFile");
var teacherControl = require("teacherControl");
app.on('error', function(err) {
    console.log(err);
})
var compression = require('compression');
app.use(compression());
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
        } else if (view == "TinKeyAdmin") {
            res.redirect(301, "/teacher.html");
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
//判断是否已经登录（有session）的中间件
app.use(function(req, res, next) {
    var view = req.session.view;
    if (view == "TinKey") {
        res.cookie("userId", req.session.userId);
        next();
    } else if (view == "TinKeyAdmin") {
        next();
    } else {
        res.redirect(301, '/');
    }
});
//退出
app.get('/logout', function(req, res, next) {
    res.cookie("nsession", " ");
    res.cookie("userId", " ");
    res.redirect(301, "/login.html");
});
//静态资源模块
app.use(express.static('public', { "index": "login.html" }));
//获取本组信息
app.get('/Tinformation', function(req, res) {
    if (req.session.view == "TinKey") {
        loginVerify.getInformation(req, res);
    } else {
        res.end('{"code":"limit"}');
    }
});
//获取小组列表
app.get('/TgetGroupList', function(req, res) {
    if (req.session.view == "TinKeyAdmin") {
        teacherControl.getGroupList(req, res);
    } else {
        res.end('{"code":"limit"}');
    }
});
//获取别的组对本组打分
app.get("/TgetOtherScore", function(req, res) {
    if (req.session.view == "TinKeyAdmin") {
        teacherControl.getOtherScore(req, res);
    } else {
        res.end('{"code":"limit"}');
    }
});
//获取老师给的分数
app.get('/TgetTeacherScore', function(req, res) {
    if (req.session.view == "TinKeyAdmin") {
        teacherControl.getTeacherScore(req, res);
    } else {
        res.end('{"code":"limit"}');
    }
});
//上传老师打分以及总分
app.get('/TsetTeacherScore', function(req, res) {
    if (req.session.view == "TinKeyAdmin") {
        teacherControl.setTeacherScore(req, res);
    } else {
        res.end('{"code":"limit"}');
    }
});
//获取本组对其他组打分
app.get('/TgetSetScore', function(req, res) {
    if (req.session.view == "TinKeyAdmin") {
        teacherControl.getSetScore(req, res);
    } else {
        res.end('{"code":"limit"}');
    }
});
//教师更改打分是否有效
app.get('/Tinvalid', function(req, res) {
    if (req.session.view == "TinKeyAdmin") {
        teacherControl.invalid(req, res);
    } else {
        res.end('{"code":"limit"}');
    }
});
//获取小组文件
app.get('/TgetGroupFile',function(req,res){
    if(req.session.view=="TinKeyAdmin"){
        teacherControl.getGroupFile(req,res);
    }else{
        res.end('{"code":"limit"}');
    }
});
//获取其他组信息及你对其他组打分
app.get('/Tall', function(req, res) {
    if (req.session.view == "TinKey") {
        loginVerify.getAll(req, res);
    } else {
        res.end('{"code":"limit"}');
    }
});
//提交打分数
app.get('/submitScore', function(req, res) {
    if (req.session.view == "TinKey") {
        loginVerify.setScore(req, res);
    } else {
        res.end('{"code":"limit"}');
    }
});
//上传文件
app.post("/Tpost", function(req, res) {
    if (req.session.view == "TinKey") {
        uploadFile.uploadFile(req, res);
    } else {
        res.end('{"code":"limit"}');
    }
});
app.use(function(req, res) {
    res.redirect(301, "404.html");
});
console.log("listen on 80");
app.listen(80);
