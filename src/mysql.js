/**
 * Created by cai on 2014/12/2.
 */
var mysql = require("mysql");
var constants = require("./constants");
//var connection = mysql.createConnection(constants.mysql_dev);
var connection = mysql.createConnection(constants.mysql_pro);
/**
 * 连接表
 */
connection.connect(function(err){
    if(err){
        console.error("error connection: " + err.stack);
        return;
    }
    console.log("connection as id: " + connection.threadId);
});

/**
 * 获取全部数据
 * @param callback
 * @param paras
 */
var getDataList = function(callback, paras){
    connection.query('SELECT * FROM ??', paras,  function(err, results){
        if (err) {
            console.log("ERROR");
            throw err;
        }
        console.log("success");
        callback(err, results);
    });
};
/**
 * 获取单行数据
 * @param callback
 * @param paras
 */
var getData = function(callback, paras){
    connection.query('SELECT * FROM ?? WHERE id=?', paras, function(err, results){
        if (err) throw err;
        callback(err, results);
    });
};
/**
 * 新建或编辑单行数据
 * @param callback
 * @param paras
 */
var updateData = function(callback, paras){
    if(!!(paras[2])){
        connection.query('UPDATE ?? SET ? WHERE id=?', paras, function(err, results){
            if (err) throw err;
            callback(err, results);
        });
    }else{
        connection.query('INSERT INTO ?? SET ?', paras, function(err, results){
            if (err) throw err;
            callback(err, results);
        });
    }
}
/**
 * 删除单行数据
 * @param callback
 * @param paras
 */
var deleteData = function(callback, paras){
    connection.query('DELETE FROM ?? WHERE id=?', paras, function(err, results){
        if (err) throw err;
        callback(err, results);
    });
};

/**
 * 自定义获取数据
 * @param callback
 * @param sql
 */
var costomExecute = function(callback, sql){
    connection.query(sql, function(err, results){
        if (err) throw err;
        callback(err, results);
    });
}

/**
 * 获取全部数据
 * @param callback
 * @param paras
 */
/*
var getReportDataList = function(callback, paras){
    connection_report.query('SELECT * from ??', paras,  function(err, results){
        if (err) throw err;
        callback(err, results);
    });
};
*/

exports.getDataList = getDataList;
exports.getData = getData;
exports.updateData = updateData;
exports.deleteData = deleteData;
exports.costomExecute = costomExecute;
//exports.getReportDataList = getReportDataList;




