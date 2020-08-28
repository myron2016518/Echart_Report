import request from '@/service'
const qs = require('qs');


// 列表
export const getUserList = async (store: any, params: any) => {
    return await request.get('/lyegg/user', { params: params })
}
// 新增
export const addUserList = async (store: any, params: any) => {
    return await request.post('/lyegg/user', qs.stringify(params))
}

// ehart1 全球注册用户数 http://aws.ithinkcar.com/AdPush/api/searchUserArea
export const searchUserArea = async (store: any, params: any) => {
    return await request.get('/tcchart/AdPush/api/searchUserArea', { params: params })
}
// ehart2 全球用户报告数 mapRecord
export const mapRecord = async (store: any, params: any) => {
    return await request.get('/tcchart/AdPush/api/mapRecord', { params: params })
}
// ehart3  用户活跃度 countUserAct
export const countUserAct = async (store: any, params: any) => {
    return await request.get('/tcchart/AdPush/api/countUserAct', { params: params })
}
// ehart4  报告数，	软件购买趋势  http://ledger.mythinkcar.cn/Api/Sync/orderList
export const ehartOrderList = async (store: any, params: any) => {
    return await request.get('/tcchorlist/Api/Sync/orderList', { params: params })
}
// ehart5  报告数，	帖子浏览总数，APP PV数 searchPv
export const searchPv = async (store: any, params: any) => {
    return await request.get('/tcchart/AdPush/api/searchPv', { params: params })
}


