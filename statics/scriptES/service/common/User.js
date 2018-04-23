import Promise from '../../lib/promise'
export default class User {
    constructor() {
        this.hadTriedToGetTelephone = false;
        this.isLogin = false;
        this.telephone = ''
    }

    login() {
        return new Promise((resolve, reject) => {
            sessionProObj.storeSession((res) => {
                if (res.telephone) {
                    this.isLogin = true;
                    this.telephone = res.telephone;
                    resolve(this.telephone);
                } else{
                    reject();
                }
            })
        })

    }

    getTelephone() {
        if (this.telephone) {
            return Promise.resolve(this.telephone);
        }
        return new Promise((reslove) => {
            if (!this.hadTriedToGetTelephone) {
                this.hadTriedToGetTelephone = true;
                sessionProObj.getUserInfo(res => {
                    this.telephone = res.telephone;
                    reslove(this.telephone);
                })
            } else {
                resolve(this.telephone);
            }
        })

    }

    callAppLogin() {
        if (this.isLogin) return;
        GB.utils.send({
            'methodName': 'login',
            'data': {},
            'responseCallback': function (responseData) {}
        })
    }
}