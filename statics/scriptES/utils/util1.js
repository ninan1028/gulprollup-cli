 const util = {
  /**
   * 消息消失框
   */
  toast(msg = '', time = 1500) {
    var toast = document.createElement('div')
    toast.className = 'common-toast common-toast-show'
    toast.innerHTML = msg
    document.body.appendChild(toast)
    toast.style.display = 'block';
    var timer = setTimeout(() => {
      toast.className = 'common-toast common-toast-hide'
      clearTimeout(timer)
      var timer2 = setTimeout(() => {
        document.body.removeChild(toast)
        clearTimeout(timer2)
      }, 200)
    }, time)
  },
  /**验证方法**/
  valid: {
    checkTelephone(telephone) {
      if (!telephone) {
        util.toast('请输入手机号码');
        return false
      }
      if (!/1[3457869]\d{9}/.test(telephone) || telephone.length != 11) {
        util.toast('手机号格式错误');
        return false
      }
      return true;
    },
    checkPassword(password) {
      if (!password) {
        util.toast('密码不能为空');
        return false
      }
      if (!/[0-9]{6}/.test(password)) {
        util.toast('密码格式不正确');
        return false
      }
      return true;
    },
     checkYzm(yzm) {
      if (!yzm) {
        util.toast('请输入短信验证码');
        return false
      }
      if (!/^\d{6}$/.test(yzm)) {
        util.toast('验证码格式错误');
        return false
      }
      return true;
    },
    checkIdCard(idcard) {
      var reg = /^[1-9][0-7]\d{4}((19\d{2}(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(19\d{2}(0[13578]|1[02])31)|(19\d{2}02(0[1-9]|1\d|2[0-8]))|(19([13579][26]|[2468][048]|0[48])0229))\d{3}(\d|X|x)?$/;
      if (!reg.test(idcard)) {
        util.toast('身份证格式不正确');
        return false;
      }
      return true
    },
    notEmpty(param, title) {
      if (!param) {
        util.toast(title + '不能为空');
        return false
      }
      return true
    },
    isInt(v,title){
    	if(parseFloat(v)<1||v.indexOf('.')>-1){
    		return false
    	}
    	return true;
    },
    limitNumber(num,s){
    	var regparam="(^[0-9]([0-9]+)?(\\.[0-9]{0,"+s+"})?$)";
    	var reg=new RegExp(regparam);
    	if(!reg.test(num)){
    		return false
    	}
    	return true
    }
  },
  qs(obj) {
    return obj;
  },
  toCent(num) {
    var numReal;
    try{
       numReal =parseFloat(num);
    } catch(e){
      return 0;
    }
    var numStr = numReal+'';
    if(typeof(numReal) !== 'number' || numStr.length===0 || num === '0' || num ===0) return 0;
    var decLength = 0;
    try {
      decLength = numStr.split('.')[1].length;
    } catch (e) {}
    numStr = numStr.replace('.', '');
    numStr = parseInt(numStr);
    if (decLength === 0) return numStr * 100;
    if (decLength == 1) return numStr + '0';
    if (decLength == 2) return numStr
  },
  clearNumber(value,num){
  	var  num=num||2;
  	var value = value.replace(/[^\d.]/g, ""); // 清除“数字”和“.”以外的字符
    while(value&&value[0]=='.'){
      value = value.replace(/^\./g, ""); // 验证第一个字符是数字而不是.
    }

    value = value.match(/(.{0,12})/g)[0];
    value = value.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的
    value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    value = value.replace(new RegExp("^(\\-)*(\\d+)\\.(\\d{0," + num + "}).*$", "gmi"), '$1$2.$3');
    return value;
  },
  isIE(){
  	var Sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var s;
    (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
    (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :0;
    if(Sys.ie){
    	return true;
    }  else{
    	return false;
    }

  	
  },
  trim(s){ 	
  	return  s.replace(/^\s+|\s+$/gm,'');
  },
  dateReplace(s){
  	return s.replace(/\-/g,'\/')
  }
}
export default util
