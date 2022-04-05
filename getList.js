const lx = init("getList.js");

/****************
1. 务必遵守疫情防控、法律法规、校规！
2. 至少正常请假一次，本脚本才能运行。
3. 脚本没有对服务器上的数据进行操作。
4. 仅供交流学习，请在下载后24小时内删除。一切责任由使用者自负，与作者无关。

Quantumult X 配置参考，其他软件类似
[rewrite]
脚本: getList.js
类型: script-response-body
url: ^https://student\.wozaixiaoyuan\.com/leave2/getList\.json

[Mitm]
主机名: student.wozaixiaoyuan.com

****************/

if (!lx.isResponse()) {
  lx.log("$response不存在，启动方式错误，应以rewrite和mitm方式启动");
  lx.done()
};

//请假理由//(留空则不修改)
title = "清明节回家探亲";    //(留空则不修改)

//请假类型 事假 病假 实习 科研 出差 回家
type = "回家";     //(留空则不修改)

//指定假期开始时间结束时间 格式 "2021-06-28 10:00"
//不指定则默认开始时间为当前 前1小时，结束时间当前 后2小时，不同时间打开会改变
start = "2022-04-03 10:00";
end = "2022-04-05 20:00";

//假条状态 3假期中
state = 3;

Date.prototype.format=function(fmt){var o={"M+":this.getMonth()+1,"d+":this.getDate(),"h+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),"S":this.getMilliseconds()};if(/(y+)/.test(fmt)){fmt=fmt.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length))};for(var k in o){if(new RegExp("("+k+")").test(fmt)){fmt=fmt.replace(RegExp.$1,(RegExp.$1.length==1)?(o[k]):(("00"+o[k]).substr((""+o[k]).length)))}};return fmt};

function getFormatTime(time, flag) {
  if (flag === 1) {
    return time.format("yyyy-MM-dd hh:mm")
  } else {
    return time.format("MM-dd hh:mm")
  }
};

//生成时间
var time = new Date();
time.setMinutes(0, 0, 0);
if (start === "" && end === "") {
  time.setHours(time.getHours() - 1);
  start = getFormatTime(time, 1);//开始时间
  time.setHours(time.getHours() + 3);
  end = getFormatTime(time, 1);//结束时间
};

bd = lx.toObj($response.body);
data = bd["data"][0];

if ("finishDate" in data) { delete data["finishDate"] };
if (start) { data["start"] = start; };
if (end) { data["end"] = end; };
if (state) { data["state"] = state };
if (title) { data["title"] = title };
if (type) { data["type"] = type };

function init(name){const startTime=new Date().getTime();const isRequest=function(){return"undefined"!==typeof $request};const isResponse=function(){return"undefined"!==typeof $response};const isPost=function(){return"POST"===$request.method};const isGet=function(){return"GET"===$request.method};const isNode=function(){return'undefined'!==typeof module&&!!module.exports};const isQuanX=function(){return'undefined'!==typeof $task};const isSurge=function(){return'undefined'!==typeof $httpClient&&'undefined'===typeof $loon};const isLoon=function(){return'undefined'!==typeof $loon};const toObj=function(str,defaultValue=null){try{return JSON.parse(str)}catch{return defaultValue}};const toStr=function(obj,defaultValue=null){try{return JSON.stringify(obj)}catch{return defaultValue}};const msg=function(title,subtitle='',desc=''){if(isQuanX()){$notify(title,subtitle,desc)}else if(isSurge()||isLoon()){$notification.post(title,subtitle,desc)}};const log=function(...logs){if(logs.length>0){logs=[...logs]};console.log(logs.join("\n"))};const get=async function(opts,callback){if(isSurge()||isLoon()){await $httpClient.get(opts,function(err,res,body){if(!err&&res){res.body=body;res.statusCode=res.status};callback(err,res,body)})}else if(isQuanX()){opts.method="GET";await $task.fetch(opts).then(function(res){const{statusCode:status,statusCode,headers,body}=res;callback(null,{status,statusCode,headers,body},body)},function(err){callback(err)})}};const post=async function(opts,callback=function(){}){if(isSurge()||isLoon()){await $httpClient.post(opts,function(err,res,body){if(!err&&res){res.body=body;res.statusCode=res.status};callback(err,res,body)})}else if(isQuanX()){opts.method="POST";await $task.fetch(opts).then(function(res){const{statusCode:status,statusCode,headers,body}=res;callback(null,{status,statusCode,headers,body},body)},function(err){callback(err)})}};const r=function(key){if(isQuanX()){return $prefs.valueForKey(key)}else if(isSurge()||isLoon()){return $persistentStore.read(key)}};const w=function(val,key){if(isQuanX()){return $prefs.setValueForKey(val,key)}else if(isSurge()||isLoon()){return $persistentStore.write(val,key)}};const wait=function(time){return new Promise(function(resolve){setTimeout(resolve,time)})};const done=function(val={}){const endTime=new Date().getTime();const costTime=(endTime-startTime)/1000;log(name+" 结束运行，耗时："+costTime);if(isQuanX()||isSurge()||isLoon()){$done(val)}};return{msg,log,get,post,done,r,w,wait,toObj,toStr,isLoon,isNode,isQuanX,isSurge,isRequest,isResponse,isPost,isGet};};

lx.done({ body: lx.toStr(bd) });
