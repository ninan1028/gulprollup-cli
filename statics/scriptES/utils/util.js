import Promise from '../lib/promise'

function request(url, data, type) {
	var data = data || {};
	var url = url || '';
	var type = type || 'post';
	if(!url && typeof url != 'string') {
		console.log('传入的url有问题')
		return;
	}
	if(url.charAt(0) != '/') {
		url = '/' + url;
	}
	var param = {
		type: type,
		url: basePath + url,
		data: data
	}
	return new Promise((resolve, reject) => {
		GB.ajax2(param).done((result) => {
			resolve(result);
		}).fail((data) => {
			reject(data);
		})
	})
}

export let post = (url, data) => {
	return request(url, data, 'post')
}
export let get = (url, data) => {
	return request(url, data, 'get')
}

export class query {
	constructor(prefix) {
		if(!prefix || typeof prefix != 'string') throw new Error('prefix is undefine')
		if(prefix.charAt(prefix.length - 1) != '/') prefix += '/';
		this.prefix = prefix;
		//过滤器，默认直接将结果传递，如果需要单独处理需自己实现
		this.queryFilter = res => res;
		this.exceptFilter = res => {
			return Promise.reject(res);
		}
	}
	get(method, data) {
		return get(this.prefix + method, data).then(this.queryFilter).catch(this.exceptFilter);
	}
	post(method, data) {
		return post(this.prefix + method, data).then(this.queryFilter).catch(this.exceptFilter);
	}
}

const share = ({
	code,
	type = 1,
	platform = 0
}) => {
	GB.utils.send({
		'methodName': 'share',
		'data': {
			'type': type, //分享类型 1：新闻类分享  2：截图分享
			'code': code, //活动code，分享统计标示
			'platform': platform, //0:弹出选择平台 1:微信好友 2:微信朋友圈 3：QQ好友 4：QQ空间 5：复制链接
			'needLogin': '1',
			'pushShareMark': '1', //是否需要统计用户分享（挖金矿需求）
		},
		'responseCallback': function(responseData) {}
	})
}

//微信好友分享
export const shareWithFriend = (code) => {
	share({
		code,
		platform: 1
	})
}

//朋友圈分享
export const sharePublic = (code) => {
	share({
		code,
		platform: 2
	})
}

//选择平台分享
export const shareChoosePlatform = code => {
	share({
		code,
		platform: 0
	})
}

//wap端自定义分享内容 

export const getShareParams=(data)=>{
	var option={
		type:1,
		code:'',
		needLogin:'1',
		platform:'0',
		pushShareMark:'1',
		imageUrl:'',
		url:'',
		description:'',
		title:''
	}
	let option1=$.extend({},option,data)
	// GB.utils.send({
	// 	'methodName': 'getShareParams',
	// 	'data': {
	// 		'type':1,//分享类型 1：新闻类分享  2：截图分享
	// 		'code' : 'oldPullNew',//活动code，分享统计标示
	// 		'needLogin' : '1',
	// 		'platform' : '0',//0:弹出选择平台 1:微信好友 2:微信朋友圈 3：QQ好友 4：QQ空间 5：复制链接
	// 		'pushShareMark' : '1',//是否需要统计用户分享（挖金矿需求）
	// 		'title' : '黄金2016年会有大反弹',
	// 		'imageUrl' : 'http://static.huangjinqianbao.com/static/img/storeIcon/xinjiekouwanfeng.png',
	// 		'url':'https://www.g-banker.com/headline/detail?id=1ad22ebcef2e487dadc67a6f125db746',
	// 		'description':'周三美原油期货下跌0.46美元至每桶28.00美元，稍早曾跌至27.92美元，创2003年9月以来新低。'
	// 	},
	// 	'responseCallback': function(responseData) {}
	// })
	GB.utils.send({
		'methodName': 'getShareParams',
		'data': option1,
		'responseCallback': function(responseData) {}
	})


}

//跳转发短信

export const sendSMS = (telephone, smstext) => {

	var smsData = {
		"phoneNum": telephone,
		"smsText": smstext
	};
	GB.utils.send({
			'methodName': 'sendSMS',
			'data': smsData,
		    'responseCallback':function(responseData){}
	})
}

//截图分享
export const shareScreen = code => {
    share({
    	type:2,
        code,
        platform: 0
    })
}


//跳转到红包页
export const gotoGiftPage = () => {
	GB.utils.send({
		'methodName': 'openUrl',
		'data': {
			'url': 'gbanker://page_hongbao',
			"params": {
				"orderID": ""
			}
		},
		'responseCallback': function(responseData) {}
	})
}

export const gotoAllPage = () => {
	GB.utils.callCustomMethod('openUrl', {
		'url': 'gbanker://page_financing',
		"params": {}
	})
}

//跳转到首页，仅安卓可用
export const gotoHomePage = () => {
	GB.utils.callCustomMethod('openUrl', {
		'url': 'gbanker://page_home',
		"params": {}
	})
}

export const goBack = () => {
	GB.utils.send({
		methodName: 'goBack',
		data: {},
		'responseCallback': function(responseData) {}
	})
}

export const store = (data) => {
	GB.utils.send({
		methodName: 'saveAppStorage',
		data,
		'responseCallback': function(responseData) {}
	})
}

export const getStore = (key, cb) => {
	GB.utils.send({
		methodName: 'readAppStorage',
		data: {
			key
		},
		'responseCallback': function(responseData) {
			if(!responseData) {
				cb();
			} else {
				cb(JSON.parse(responseData))
			}

		}
	})
}

export const clear = (key) => {
	GB.utils.send({
		methodName: 'saveAppStorage',
		data: {
			[key]: null
		},
		'responseCallback': function(responseData) {}
	})
}

//ios单 webview 方法
export const pushState = (url) => {
	if(url.indexOf('?') == -1) {
		url += '?stay=1';
	} else {
		url += "&stay=1"
	}
	history.pushState({}, null, url)
	location.href = url;
}

export const forward = (url) => {
	if(url.indexOf('?') == -1) {
		url += '?stay=1';
	} else {
		url += "&stay=1"
	}
	console.log('forward===' + url);
	location.href = url;
}

export const replaceState = (url) => {
	if(url.indexOf('?') == -1) {
		url += '?stay=1';
	} else {
		url += "&stay=1"
	}
	history.replaceState({}, null, url)
	location.href = url;
}

// 判断是否是dev
export const isDev = () => {
	return /dev.huangjinqianbao.com/ig.test(location.href);
}

//得到测试环境 线上环境  安心计划  箱底金 月月生息 标的详情 地址
export const getLink=()=>{
	 var isDev = /dev\.huangjinqianbao/ig.test(location.href);
	 var financeLink = isDev ? "https://dev.huangjinqianbao.com/financeProduct/financeProduct.html?depositType=" : "https://static02.huangjinqianbao.com/static/html/app/financeProduct/financeProduct.html?depositType=";
	 var goldLink = isDev ? "https://dev.huangjinqianbao.com/depositDetail/demandGoldTagNew.html?depositType=" : "https://static02.huangjinqianbao.com/static/html/app/depositDetail/demandGoldTagNew.html?depositType=";
	 var mounthLink = isDev ? 'https://dev.huangjinqianbao.com/GBankerWebApp2/html/pages/monthIncrease/index.html?depositType=' : 'https://m.g-banker.com/GBankerWebApp/html/pages/monthIncrease/index.html?depositType=';
	 
	 let result={
	 	financeLink,goldLink,mounthLink
	 }
	 return result;
}

export const isWX=()=>{
	var ua = navigator.userAgent.toLowerCase();
	return /micromessenger/.test(ua);
}
export const toLogin=(context)=>{
	//需要传入上下文
	var context=context;
	if(!context){
		console.log('toLogin 请传入上下文');
	}
	if(!context.telephone){
		GB.utils.callCustomMethod("login",{});
		return false;
	}
	return true;
}


