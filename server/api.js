var models = require('./db');//数据库链接信息
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('./sqlfun');//sql语句

// 连接数据库
var conn = mysql.createConnection(models.mysql);

conn.connect();
var jsonWrite = function(res, ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code: '1',
            msg: '操作失败'
        });
    } else {
        res.json(ret);
    }
};

// 登录用户接口
router.post('/login', (req, res) => {
    console.log('登陆');
    
    var sql = $sql.user.login;    
    var params = req.body; 
    console.log("sql",sql);
    console.log("params",params);
    conn.query(sql, [params.username], function(err, result) {    
        if (err) {       
            console.log(err);
        }        
        if (result) {
            jsonWrite(res, result);
            for(var i = 0; i < result.length; i++){
                console.log("请求回来！",result[i])
                console.log("请求结果！",typeof result[i],result[i].userpsw);
                if (result[i].userpsw == params.userpsw) {
                    res.send("返回回来了！");
                }
            }
            res.end('is over');
        }
    })
});
// 增加用户接口
router.post('/addUser', (req, res) => {
    var sql = $sql.user.add;    
    var params = req.body; 
    console.log("sql",sql);
    console.log("params",params);
    conn.query(sql, [params.username,params.userpsw], function(err, result) {    
        if (err) {       
            console.log(err);
        }        
        if (result) {
            jsonWrite(res, result);
            for(var i = 0; i < result.length; i++){
                console.log("请求回来！",result[i])
                console.log("请求结果！",typeof result[i],result[i].userpsw);
                if (result[i].userpsw == params.userpsw) {
                    res.send("返回回来了！");
                }
            }
            res.end('is over');
        }
    })
});
//list
router.get('/list', (req, res) => {
    res.json({
        "ds": '哈哈哈123'
    })
    console.log('req===>', res.json);
});
//loginTest
router.post('/loginTest', (req, res) => {
    console.log('登陆');
    
    var sql = $sql.user.login;    
    var params = req.body; 
    console.log("sql",sql);
    console.log("params",params);
    conn.query(sql, [params.username], function(err, result) {    
        if (err) {       
            console.log(err);
        }        
        if (result) {
            jsonWrite(res, result);
            for(var i = 0; i < result.length; i++){
                console.log("请求回来！",result[i])
                console.log("请求结果！",typeof result[i],result[i].userpsw);
                if (result[i].userpsw == params.userpsw) {
                    res.send("返回回来了！");
                }
            }
            res.end('is over');
        }
    })
});
module.exports = router;
