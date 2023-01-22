import regexEmail from "regex-email";
import privateInfo from "../../config/privateInfo";
import fetch from "node-fetch"
import { getNoticeList, getNoticeId, getTosList } from "./noticeProvider";
import exp from "constants";
import { json } from "body-parser";
import { baseResponse, initResponse } from '../../config/baseResponse'

export const noticeList = async(req, res) => {
    initResponse;
    if(!req.verifiedToken){
        baseResponse.success = false
        baseResponse.error = "no token"
        return res.status(401).send(JSON.stringify(baseResponse))
    }

    const getNotice = await getNoticeList()
    if(getNotice){
        baseResponse.success = true
        baseResponse.data = getNotice
        res.send(baseResponse)
    }
    else{
        baseResponse.success = false
        baseResponse.error = "공지가 없습니다"
        res.send(baseResponse)
    }
}

export const selectnotice = async(req, res) => {
    initResponse;
    if(!req.verifiedToken){
        baseResponse.success = false
        baseResponse.error = "no token"
        return res.status(401).send(JSON.stringify(baseResponse))
    }
    const {params:{noticeId}} = req;
    if(!noticeId){
        baseResponse.success = false
        baseResponse.error = "공지 id가 없습니다"
        res.send(baseResponse)
    }
    const getNoticeid = await getNoticeId(noticeId)
    
    if (getNoticeid[0]){
        baseResponse.success = true
        baseResponse.data = getNoticeid
        res.send(baseResponse)
    }
    else{
        baseResponse.success = false
        baseResponse.error = "공지가 없습니다."
        res.send(baseResponse)
    }
}

export const getTos = async(req, res) =>{
    initResponse;
    if(!req.verifiedToken){
        baseResponse.success = false
        baseResponse.error = "no token"
        return res.status(401).send(JSON.stringify(baseResponse))
    }
    const gettos = await getTosList();
    if (gettos[0]){
        baseResponse.success = true
        baseResponse.data = gettos
        res.send(baseResponse)
    }
    else{
        baseResponse.success = false
        baseResponse.error = "데이터가 없습니다."
        res.send(baseResponse)
    }
}