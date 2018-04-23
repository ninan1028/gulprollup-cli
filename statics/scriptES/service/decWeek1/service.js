/**
 * Created by wanglin on 2017/7/24.
 */
import {
    query
} from '../../utils/util'
let request = new query('/activity')

//资产活动 第一周 获取 活动状态及 开始 结束时间
export const decWeek1status = (data) => {
    return request.get("decWeek1status",data);
}

