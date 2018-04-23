/**
 * Created by ckid_hjqb on 2017/7/11.
 * 
 * 公共的请求服务
 */

import {DEV_USER_PRIVILEGE_URL, USER_PRIVILEGE_URL} from  '../../config/baseConfig';
import {isDev,post,get} from '../../utils/util';
import {getNewUserGoldInfo} from '../digGold/service';


export const  gotoUserPrivilege = ()=>{
    let url = isDev()?DEV_USER_PRIVILEGE_URL: USER_PRIVILEGE_URL;
    getNewUserGoldInfo().then((res)=>{
        if(+res.code === 0){
            let marketPrice = Math.floor(res.data.salePrice/100);
            let depositType = res.data.depositType;
            location.href = url+ `${marketPrice}.html?depositType=${depositType}`;
        }
    })
}

/*****
 * 获取当前金价
 */

 export const getPrice=()=>{
     return   $.ajax({
          url:basePath+'/info/price',
          data:{queryFlag:3,random:Math.random()},
          type:'get'
     }) 
 }

/****
 * 获取验证码
 */
export const getYzm=(data)=>{
    return post('/regist/getYzm',data);
}

/****
 * 获取验证码 这个接口有判断是否是新老用户
 */
export const getCode=(data)=>{
    return post('/regist/getCode',data);
}
/****
 * 验证码登录
 */
 export const loginByValid=(data)=>{
    return post('/user/loginByValid',data);
 }
/****
 * 验证码注册
 */
 export const registerByValid=(data)=>{
    return post('/user/registerByValid',data);
 }

 /****
  * 验证码注册 这里可以传入 channelCode 及 userCode
  */

  export const userRegisterByValid=(data)=>{
    return post('/regist/userRegisterByValid',data);
  }

 
 /****
 * 判断是否是新用户
 */
 export const checkPhoneNum=(telephone)=>{
    return post('/regist/checkPhoneNum',{telephone});
 }
 /****
  * 判断用户是否是新用户 node封装
  * 参数 telephone
  */
   export const checkPhoneNode=(data)=>{
    return post('/regist/checkPhoneNode',data);
 }

 /****
  *  获取用户手机号码 在session中获取135****4444
  */
export const userInfo=(data)=>{
    return  post('/info/userInfo',data);
}

export const logout=(data)=>{
    return  get('/user/newlogout',data);
}

// 获取用户的 姓
export const getRealName=(data)=>{
    return  post('/activity/getRealName',data);
}

// 根据depositType 来判断是否可以购买
export const getGoldCanSellStatus=(data)=>{
    return  post('/activity/getGoldCanSellStatus',data);
}
// 获取banner list 链接
export const getHomeBannerList=(data)=>{
    return  post('/info/getHomeBannerList',data);
}

// 根据depositType 来判断是否可以购买
export const getDepositTypeByTagName=(data)=>{
    return  post('/activity/getDepositTypeByTagName',data);
}

// 获取node端的毫秒数

export const getServerTime=()=>{
    return  get('/info/getServerTime',{random:Math.random()});
}




