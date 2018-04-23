import User from '../service/common/User';
export default class pageBase{
    constructor(){
        this.User = new User();
        this.requestParam = GB.utils.GetRequest();
        this.isNeedLogin = false;
    }

    init(){
        
    }

    login(){
        return this.User.login();
    }
        
}