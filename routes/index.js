var express = require('express');
var router = express.Router();
//
var async = require('async');
var mysql = require('../src/mysql');

/* GET home page. */
router.get('/', function(req, res) {
    //res.render('index', { title: 'Express'});
    res.redirect("/login");
});
/* GET login page. */
router.get('/signin', function(req, res) {
    res.render('signin', {
        "layout": "layout_sign",
        "message": null
    });
});
router.get('/login', function(req, res) {
    res.render('login', {
        "layout": "layout_sign",
        "message": null
    });
});

/* GET app page. */
router.get('/app', function(req, res) {
    res.render('app', {
        "moduletitle": "app"
    });
});
router.get('/app/appedit', function(req, res) {
    res.render('appedit', {
        "moduletitle": "app"
    });
});


/* GET appgroup page. */
router.get('/appgroup', function(req, res) {
    res.render('appgroup', {
        "moduletitle": "appgroup"
    });
});
router.get('/appgroup/appgroupedit', function(req, res) {
    res.render('appgroupedit', {
        "moduletitle": "appgroup"
    });
});

/* GET adpeer page. */
router.get('/adpeer', function(req, res) {
    res.render('adpeer', {
        "moduletitle": "adpeer"
    });
});

router.get('/adpeer/adpeeredit', function(req, res) {
    res.render('adpeeredit', {
        "moduletitle": "adpeer"
    });
});

/* GET addeliver page. */
router.get('/addeliver', function(req, res) {
    res.render('addeliver', {
        "moduletitle": "addeliver"
    });
});
router.get('/addeliver/addeliveredit', function(req, res) {
    async.waterfall([
        function(callback){
            mysql.costomExecute(function(err, results){
                callback(err, results);
            }, 'SELECT id, ad_name FROM dsp_ad ORDER BY ad_name ASC');
        }
    ],  function(err, data){
        res.render('addeliveredit', {
            "moduletitle": "addeliver",
            "adData": data
        });
    });

});

/* GET report page. */
router.get('/report', function(req, res) {
    res.render('report', {
        "moduletitle": "report"
    });
});


module.exports = router;
