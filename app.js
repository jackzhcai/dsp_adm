var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');

var compress = require('compression');

var session = require('express-session');
var _ = require("underscore");

// 加载hbs模块
//var hbs = require('hbs');
//引入路由
var routes = require('./routes/index');
var users = require('./routes/users');
var data = require('./routes/data');

var app = express();
//
app.use(partials());

// 设置视图文件所在位置
app.set('views', path.join(__dirname, 'views'));
// 设置视图引擎
app.set('view engine', 'ejs');
//app.set('view engine', 'html');
// 运行hbs模块
//app.engine('html', hbs.__express);

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
//压缩响应体
app.use(compress());
//
app.use(logger('dev'));
// 解析application/json
app.use(bodyParser.json());
// 解析application/vnd.api+json 作为json
//app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
// 解析application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));
//指定静态文件所在位置
app.use(express.static(path.join(__dirname, 'public')));
// 设置 Cookie
app.use(cookieParser('dsp-adm-'));
// 设置 Session
app.use(session({
    name :'dsp-adm-session',
    resave: true,
    saveUninitialized: true,
    cookie: {
        secret :true,
        maxAge: 6000000
    },
    secret: 'dsp-adm'
}));
//
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(request, response, next){
    try{
        if(!!request.session && !!request.session.adx_name) {
            response.locals.adx_name = request.session.adx_name;
        }
        //
        if(!!request.session && !!request.session.username){
            response.locals.username = request.session.username;
            response.locals.userid = request.session.userid;
            next();
        }else if(_.indexOf(["/signin", "/login", "/data/dosignin", "/data/dologin"], request.url) > -1){
            next();
        }else{
            response.redirect('/signin');
        }
    }catch (e){
        console.log(e.message);
    }
});

// 设置路由
app.use('/', routes);
app.use('/users', users);
app.use('/data', data);
//
//
app.use(function(request, response, next){
    if(!!request.session && !!request.session.adx){
        //设置session adx_name


        next();
        return;
    }
    next();
});

//捕获404并对跳转错误进行处理
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// 开发环境错误处理
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// 生产环境错误处理。
// 没有堆栈跟踪泄露给用户。
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
