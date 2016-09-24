var express = require('express');
var router = express.Router();
var crypto = require('crypto');


router.get('/', function (req, res, next) {
  res.send("hello");
})
//微信验证流程
const token = '41qH05vmjG37sD7Q42eUfhm33QGo09FN';
 
/* WeChat verify */
const handleWechatRequest = function (req, res, next) {
  const {signature, timestamp, nonce, echostr} = req.query;
  if (!signature || !timestamp || !nonce ) {
    return res.send('invalid request');
  }
  if(req.method==='POST'){
    console.log('handleWechatRequest.post',{body:req.body,query:req.query});
  }
  if(req.method ==='GET'){
    console.log('handleWechatRequest.get',{get:req.body})
    if(!echostr)
    {
       res.send('invalid request');
    }
  }
  
  // 1）将token、timestamp、nonce三个参数进行字典序排序
  const params = [token, timestamp, nonce];
  params.sort();

  // 2）将三个参数字符串拼接成一个字符串进行sha1加密
  const hash = crypto.createHash('sha1');
  const sign = hash.update(params.join('')).digest('hex');
  // 3）开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
  if (sign === signature) {
    if(req.method ==='GET')
    {
        res.send(echostr?echostr : 'invalid request');
    }
  } else {
    res.send('invalid signature');
  }
};


router.get('/api',handleWechatRequest);
router.post('/api',handleWechatRequest)
module.exports = router;