var express = require('express');
var async = require('async');
var mysql = require('../src/mysql');
var multipart = require('connect-multiparty'); //获取传统POST数据
var multipartMiddleware = multipart();
var moment = require('moment');
var _ = require('underscore');
var md5 = require('MD5');
//
var router = express.Router();
/**
 * APP
 */
router.get('/getAppDataList', function(request, response) {
    var sql = '';
    if(!!request.session && !!request.session.adx_name) {
        sql += 'SELECT id, appid, appname, adx_name FROM dsp_adx_app WHERE adx_name="' + request.session.adx_name + '"';
    }else{
        response.json({
            "data": []
        });
        return;
    }
    async.waterfall([
        function(callback){
            mysql.costomExecute(function(err, datas){
                callback(err, datas)
            }, sql)
        }
    ],  function(err, datas){
        response.json({
            "data": datas
        });
    });
});

router.get('/getAppDataListDetail', function(request, response) {
    var sql = '';
    if(!!request.session && !!request.session.adx_name) {
        sql += 'SELECT id, appid, appname, adx_name, country, size, os, category FROM dsp_adx_app_detail WHERE adx_name="' + request.session.adx_name + '"';
    }else{
        response.json({
            "data": []
        });
        return;
    }
    async.waterfall([
        function(callback){
            mysql.costomExecute(function(err, datas){
                callback(err, datas)
            }, sql)
        }
    ],  function(err, datas){
        response.json({
            "data": datas
        });
    });
});
router.get('/getAppMoreData', function(request, response) {
    var appid = request.query.appid, adx_name =  request.query.adx_name;
    if(!appid || !adx_name) {
        response.json([]);
        return;
    }
    async.waterfall([
        function(callback){
            mysql.costomExecute(function(err, datas){
                callback(err, datas);
            }, 'SELECT id, appid, appname, adx_name, country, size, os, traffic, category, foot_price, avg_bid_price FROM dsp_adx_app_detail WHERE appid="'+appid+'" AND adx_name="'+adx_name+'"');
        }
    ],  function(err, datas){
        response.json(datas);
    });
});
/**
 * APPGROUP
 */
router.get('/getAppgroupDataList', function(request, response) {
    var sql = '';
    if(!!request.session && !!request.session.adx_name) {
        sql += 'SELECT dsp_adx_app_group.id, dsp_adx_app_group.app_group_name, dsp_adx_app_group.app_list, dsp_adx_app_group.description, dsp_adx_app_group.adx_name, dsp_adx_mgr_user.user_name '+
            'FROM dsp_adx_app_group, dsp_adx_mgr_user '+
            'WHERE dsp_adx_app_group.mgr_user_id = dsp_adx_mgr_user.id AND dsp_adx_app_group.adx_name="'+request.session.adx_name.toLowerCase()+'"';
    }else{
        response.json({
            "data": []
        });
        return;
    }
    async.waterfall([
        function(callback){
            mysql.costomExecute(function(err,  datas){
                callback(err, datas);
            }, sql);

        }
    ],  function(err, datas){
        response.json({
            "data": datas
        });
    });
});
router.get('/getAppgroupData', function(request, response) {
    var uid = request.query.id, sql = '';
    if(!!uid && !!request.session && !!request.session.adx_name) {
        sql += 'SELECT * FROM dsp_adx_app_group WHERE id="'+uid+'" AND adx_name="' + request.session.adx_name + '"';
    }else{
        response.json({});
    }
    async.waterfall([
        function(callback){
            mysql.costomExecute(function(err, datas){
                callback(err, datas)
            }, sql);
        }
    ],  function(err, datas){
        response.json(datas.length ? datas[0] : {});
    });
});
router.post('/updateAppgroupData', multipartMiddleware ,function(request, response) {
    var datas = request.body;
    async.waterfall([
        function(callback){
            mysql.updateData(function(err, results){
                callback(err, results['affectedRows'])
            }, ["dsp_adx_app_group", datas, (datas.id || null)]);
        }
    ],  function(err, data){
        var body = data.toString();
        response.setHeader('Content-Type', 'text/plain');
        response.setHeader('Content-Length', body.length);
        response.end(body);
    });
});
router.get('/deleteAppgroupData', function(request, response) {
    var uid = request.query.id;
    if(!uid){
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.end("0");
    }
    async.waterfall([
        function(callback){
            mysql.deleteData(function(err, datas){
                callback(err, datas['affectedRows'])
            }, ["dsp_adx_app_group", uid]);
        }
    ],  function(err, data){
        var body = data.toString();
        response.setHeader('Content-Type', 'text/plain');
        response.setHeader('Content-Length', body.length);
        response.end(body);
    });
});
/**
 * ADDILIVER
 */
router.get('/getAddeliverDataList', function(request, response) {
    var sql = '';
    if(!!request.session && !!request.session.adx_name) {
        sql += 'SELECT dsp_adx_ad_strategy.id, dsp_adx_ad_strategy.app_list, dsp_adx_ad_strategy.adx_name, dsp_adx_ad_strategy.filter_list, dsp_adx_mgr_user.user_name, dsp_ad.ad_name '+
            'FROM dsp_adx_ad_strategy, dsp_adx_mgr_user, dsp_ad '+
            'WHERE dsp_adx_ad_strategy.ad_id = dsp_ad.id AND dsp_adx_ad_strategy.mgr_user_id = dsp_adx_mgr_user.id AND dsp_adx_ad_strategy.adx_name="'+request.session.adx_name.toLowerCase()+'"';
    }else{
        response.json({
            "data": []
        });
        return;
    }
    async.waterfall([
        function(callback){
            mysql.costomExecute(function(err,  datas){
                callback(err, datas)
            }, sql);
        }
    ],  function(err, datas){
        response.json({
            "data": datas
        });
    });
});
/*
router.get('/getAddliverData', function(request, response) {
    var uid = request.query.id;
    if(!uid) {
        response.json({});
    }
    async.waterfall([
        function(callback){
            mysql.getData(function(err, datas){
                callback(err, datas)
            }, ['dsp_adx_ad_strategy', uid]);
        }
    ],  function(err, datas){
        response.json(datas.length ? datas[0] : {});
    });
});
*/
//update app_list
router.post('/updateAppDataList', multipartMiddleware ,function(request, response) {
    var datas = request.body;
    async.waterfall([
        function(callback){
            mysql.costomExecute(function(err, results){
                callback(err, results['affectedRows']);
            }, 'UPDATE dsp_adx_ad_strategy SET app_list="'+datas['app_list']+'" WHERE id='+datas['id']);
        }
    ],  function(err, data){
        var body = data.toString();
        response.setHeader('Content-Type', 'text/plain');
        response.setHeader('Content-Length', body.length);
        response.end(body);
    });
});

router.post('/updateAddeliverData', multipartMiddleware ,function(request, response) {
    var datas = request.body;
    var newDatas = {
        "id": datas['id'],
        "ad_id": datas['ad_id'],
        "app_list": datas['app_list'],
        "adx_name": datas['adx_name'],
        "filter_list": JSON.stringify({
            "ovs": [datas['osv_s'], datas['osv_e']],
            "connectiontype": datas['connectiontype'],
            "gender": datas['gender'],
            "age": [datas['age_s'], datas['age_e']]
        }),
        "mgr_user_id": datas['mgr_user_id']
    };
    async.waterfall([
        function(callback){
            mysql.updateData(function(err, results){
                callback(err, results['affectedRows'])
            }, ["dsp_adx_ad_strategy", newDatas, (newDatas.id || null)]);
        }
    ],  function(err, data){
        var body = data.toString();
        response.setHeader('Content-Type', 'text/plain');
        response.setHeader('Content-Length', body.length);
        response.end(body);
    });
});

router.get('/deleteAddeliverData', function(request, response) {
    var uid = request.query.id;
    if(!uid){
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.end("0");
    }
    async.waterfall([
        function(callback){
            mysql.deleteData(function(err, datas){
                callback(err, datas['affectedRows'])
            }, ["dsp_adx_ad_strategy", uid]);
        }
    ],  function(err, data){
        var body = data.toString();
        response.setHeader('Content-Type', 'text/plain');
        response.setHeader('Content-Length', body.length);
        response.end(body);
    });
});
/**
 * ADPEER
 */
router.get('/getAdpeerDataList', function(request, response) {
    var sql = '';
    if(!!request.session && !!request.session.adx_name) {
        sql += 'SELECT dsp_adx_app.id, dsp_adx_app.appid, dsp_adx_app.appname, dsp_adx_app.adx_name, dsp_adx_mgr_user.user_name '+
            'FROM dsp_adx_app, dsp_adx_mgr_user '+
            'WHERE dsp_adx_app.adx_name="'+request.session.adx_name.toLowerCase()+'"';
    }else{
        response.json({
            "data": []
        });
        return;
    }
    async.waterfall([
        function(callback){
            mysql.costomExecute(function(err,  datas){
                callback(err, datas)
            }, sql);
        }
    ],  function(err, datas){
        response.json({
            "data": datas
        });
    });
});
router.get('/getAdpeerData', function(request, response) {
    var uid = request.query.id;
    if(!uid) {
         response.json({});
    }
    async.waterfall([
        function(callback){
            mysql.getData(function(err, datas){
                callback(err, datas)
            }, ['dsp_adx_app', uid]);
        }
    ],  function(err, datas){
         response.json(datas.length ? datas[0] : {});
    });
});
router.post('/updateAdpeerData', multipartMiddleware ,function(request, response) {
    var datas = request.body;
    async.waterfall([
        function(callback){
            mysql.updateData(function(err, results){
                callback(err, results['affectedRows'])
            }, ["dsp_adx_app", datas, (datas.id || null)]);
        }
    ],  function(err, data){
        var body = data.toString();
        response.setHeader('Content-Type', 'text/plain');
        response.setHeader('Content-Length', body.length);
        response.end(body);
    });
});
router.get('/deleteAdpeerData', function(request, response) {
    var uid = request.query.id;
    if(!uid){
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.end("0");
    }
    async.waterfall([
        function(callback){
            mysql.deleteData(function(err, datas){
                callback(err, datas['affectedRows']);
            }, ["dsp_adx_app", uid]);
        }
    ],  function(err, data){
        var body = data.toString();
        response.setHeader('Content-Type', 'text/plain');
        response.setHeader('Content-Length', body.length);
        response.end(body);
    });
});
/**
 * REPORT
 */
/*
router.get('/getReportDataList', function(request, response) {
    async.waterfall([
        function(callback){
            mysql.costomExecute(function(err, results){
                callback(err, results);
            }, "SELECT * FROM app_access_distri");
        }
    ],  function(err, datas){
        response.json({
            "data": datas
        });
    });
});
*/
router.get('/getReportDataListAd', function(request, response) {
    var sql = '';
    if(!!request.session && !!request.session.adx_name) {
        sql = "select                                                                          "+
            "partner,                                                                          "+
            "from_unixtime(date,'%Y-%m-%d') bizdate,                                           "+
            "sum(bid) bidTimes,                                                                "+
            "round(sum(bid_sum)/sum(bid),3) avgBidPrice,                                       "+
            "sum(win) winTimes,                                                                "+
            "round(sum(win_sum)/sum(win),3) avgWinPrice,                                       "+
            "round(sum(win)*100/sum(bid),3) winRate,                                           "+
            "sum(impression) impressionTimes,                                                  "+
            "sum(click) clickTimes,                                                            "+
            "round(sum(click)*100/sum(impression),3) CTR,                                      "+
            "sum(conversion) conversionTimes,                                                  "+
            "round(sum(conversion)*100/sum(click),3) CVR,                                      "+
            "round(sum(cost),3) costTotal,                                                     "+
            "round(sum(income),3) incomeTotal,                                                 "+
            "round((sum(income)-sum(cost))*100/sum(cost),3) ROI,                               "+
            "round(sum(income)*1000/sum(impression),3) eCPM,                                   "+
            "round(sum(income)/sum(click),3) eCPC,                                             "+
            "round(sum(income)/sum(conversion),3) eCPA                                         "+
            "from dsp_app_ad  where (date BETWEEN unix_timestamp()-7*86400 and unix_timestamp())"+
            "and partner='" + request.session.adx_name + "'"                                            +
            "group by partner,date                                                             ";
    }else{
        response.json({
            "data": []
        });
        return;
    }
    async.waterfall([
        function(callback){
            mysql.costomExecute(function(err, results){
                callback(err, results);
            }, sql);
        }
    ],  function(err, datas){
        response.json({
            "data": datas
        });
    });
});
/**
 * 登录
 */
router.post('/dosignin', multipartMiddleware, function(request, response) {
    var username = request.body.username.trim();
    var password = request.body.password;
    var reloadPage = function(msg){
        response.render("signin", {
            "layout": "layout_sign",
            "message": msg
        });
    };
    async.waterfall([
        function(callback){
            mysql.costomExecute(function(err, results){
                callback(err, results);
            }, "SELECT * FROM dsp_adx_mgr_user WHERE user_name='" + username+"'");
        }
    ],
    function(err, results){
        if(!err && !!results && results.length>0){
            var account = results[0];
            if(md5(password) == account.password){
                request.session.username = account.user_name;
                request.session.userid = account.id;
                response.redirect('/app');
                return;
            }
        }
        reloadPage("Login failed, please try again.");
    });
 });
/**
 * 退出系统
 */
router.get("/signout", function(request, response){
    request.session.username = null;
    request.session.userid = null;
    response.redirect("/signin");
});
/**
 * 注册
 */
router.post("/dologin", multipartMiddleware, function(request, response){
    var username = request.body.username.trim();
    var password = request.body.password;
    var repassword = request.body.repassword;
    var reloadPage = function(msg){
        response.render("login", {
            "layout": "layout_sign",
            "message": msg
        });
    };
    //不能为空
    if(!username || !password || !repassword){
        reloadPage("Fields do not match.");
        return
    }
    //不能少于两个字符
    if(username.length < 2 || password.length < 2 || repassword.length < 2){
        reloadPage("Minimum 2 characters required.");
        return
    }
    //两次输入密码不一致
    if(username && (password !== repassword)){
        reloadPage("Passwords, Repassword don't match.");
        return;
    }
    async.waterfall([
        function(callback){
            mysql.costomExecute(function(err, results){
                callback(err, results);
            }, "SELECT user_name FROM dsp_adx_mgr_user");
        },
        function(results, callback){
            var usernames = [];
            usernames = _.map(results, function(item){
                return item.user_name;
            });
            if(_.indexOf(usernames, username) > -1){
                callback(null, {
                    "state": 0,
                    "data": null,
                    "message": "username has already"
                });
            }else{
                mysql.updateData(function(err, results){
                    callback(err, {
                        "state": results['affectedRows'],
                        "data": results,
                        "message": "login success"
                    })
                },  [
                    "dsp_adx_mgr_user",
                    {
                       "user_name": username,
                        "password": md5(password)
                    }
                ]);
            }
        }
    ],
    function(err, results){
        if(results.state){
            //设置session
            request.session.username = username;
            request.session.userid = results.data.insertId;
            //跳转
            response.redirect("/app");
        }else{
            //用户名已被使用
            reloadPage(results.message);
            return;
        }
    });
});

/**
 * 删除账号
 */
router.get("/logout", function(request, response){
    response.redirect("/signin");
});

/**
 * 获取adx列表
 */
router.get("/getAdxList", function(request, response){
    async.waterfall([
        function(callback){
            mysql.costomExecute(function(err,  datas){
                callback(err, datas)
            }, 'SELECT id, adx_name FROM dsp_adx_list');
        }
    ],  function(err, datas){
        response.json(datas);
    });
});
/**
 * 设置adx_name的session
 */
router.get("/setAdxSession", function(request, response){
    try{
        request.session.adx_name = (request.query.adx_name || null);
        response.end("1");
    }catch(e){
        response.end("0");
    }
});
/**
 * 初始化 设置adx_name的session
 */
router.get("/initAdxSession", function(request, response){
    async.waterfall([
        function(callback){
            mysql.costomExecute(function(err, datas){
                if(datas.length){
                    request.session.adx_name = datas[0].adx_name;
                    response.locals.adx_name = datas[0].adx_name;
                    console.log("init session:" + request.session.adx_name);
                    callback(err, "1");
                }else{
                    callback(err, "0");
                }
            }, 'SELECT id, adx_name FROM dsp_adx_list');
        }
        ],  function(err, data){
            response.end(data);
        });
});


module.exports = router;
