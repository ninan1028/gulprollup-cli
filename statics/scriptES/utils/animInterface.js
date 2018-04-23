export default class AnimInterface {
    /**
     * 
     * @param  @type {奖品配置，根据奖品类型定位动画位置} prizeAnimConfig 
     */
    constructor(prizeAnimConfig) {
        this.prizeAnimConfig = prizeAnimConfig;
    }
    
    /**
     * 动画到某个位置
     */
    animTo(pos) {
        throw new Error('animTo undefined!');
    }

    /**
     * 设置动画回调。
     */
    doneCb() {
        throw new Error('animCb undefined!');
    }

    /**
     * 获取动画位置   非抽象方法
     */
    getAnimType(prizeType){
        if(this.prizeAnimConfig[prizeType]){
            return this.prizeAnimConfig[prizeType];
        }
        throw new Error('奖品配置未找到');
    }
}