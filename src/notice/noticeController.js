import regexEmail from "regex-email";
import privateInfo from "../../config/privateInfo";
import fetch from "node-fetch"
import { getNoticeList, getNoticeId, getTosList, getFaqList } from "./noticeProvider";
import {postQuestion } from "./noticeService";
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
        baseResponse.error = null
        return res.status(200).send(JSON.stringify(baseResponse));
    }
    else{
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "공지가 없습니다"
        return res.status(404).send(JSON.stringify(baseResponse));
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
        baseResponse.data = null
        baseResponse.error = "공지 id가 없습니다"
        return res.status(400).send(JSON.stringify(baseResponse));
    }
    const getNoticeid = await getNoticeId(noticeId)
    
    if (getNoticeid[0]){
        baseResponse.success = true
        baseResponse.data = getNoticeid
        baseResponse.error = null
        return res.status(200).send(JSON.stringify(baseResponse));
    }
    else{
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "공지가 없습니다."
        return res.status(404).send(JSON.stringify(baseResponse));
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
        res.send(JSON.stringify(baseResponse));
    }
    else{
        baseResponse.success = false
        baseResponse.error = "데이터가 없습니다."
        res.send(JSON.stringify(baseResponse));
    }
}

export const createQuestion = async(req, res) => {
    if(!req.verifiedToken){
        baseResponse.success = false
        baseResponse.error = "no token"
        return res.status(401).send(JSON.stringify(baseResponse))
    }
    const {userId} = req.verifiedToken;
    const {email, text} = req.body
    console.log(userId, email, text)
    if(!email){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "email이 없습니다."
        return res.status(400).send(JSON.stringify(baseResponse))
    }
    // 이메일 양식 확인 코드 필요
    if(!text){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "text가 없습니다."
        return res.status(400).send(JSON.stringify(baseResponse))      
    }
    const postQuestiondata = await postQuestion(userId, email, text);
    const postedQuestion = {
        "userId" : userId,
        "email" : email,
        "text" : text
    }
    if(postQuestiondata){
        baseResponse.success = true
        baseResponse.data = postedQuestion
        baseResponse.error = null
        return res.status(201).send(JSON.stringify(baseResponse))
    }

}


export const getfaq = async(req, res) =>{
    initResponse;
    if(!req.verifiedToken){
        baseResponse.success = false
        baseResponse.error = "no token"
        return res.status(401).send(JSON.stringify(baseResponse))
    }

    const getfaq = await getFaqList();
    if (getfaq[0]){
        baseResponse.success = true
        baseResponse.data = getfaq
        baseResponse.error = null
        return res.status(200).send(JSON.stringify(baseResponse));
    }
    else{
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "데이터가 없습니다."
        return res.status(404).send(JSON.stringify(baseResponse));
    }
}
