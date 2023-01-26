import regexEmail from "regex-email";
import privateInfo from "../../config/privateInfo";
import fetch from "node-fetch"
import { getNoticeList, getNoticeId, getTosList, getFaqList,questionList,getFaqListId,questiondetails} from "./noticeProvider";
import {postQuestion } from "./noticeService";
import exp from "constants";
import { json } from "body-parser";
import { baseResponse, initResponse } from '../../config/baseResponse'


export const noticeList = async(req, res) => {
    if(!req.verifiedToken){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "no token"
        return res.status(401).json(baseResponse)
    }

    const getNotice = await getNoticeList()
    if(getNotice[0]){
        baseResponse.success = true
        baseResponse.data = getNotice
        baseResponse.error = null
        return res.status(200).json(baseResponse)
    }
    else{
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "공지가 없습니다"
        return res.status(404).json(baseResponse)
    }
}

export const selectnotice = async(req, res) => {
    if(!req.verifiedToken){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "no token"
        return res.status(401).json(baseResponse)
    }
    const {params:{noticeId}} = req
    if(!noticeId){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "공지 id가 없습니다"
        return res.status(400).json(baseResponse)
    }
    const getNoticeid = await getNoticeId(noticeId)
    
    if (getNoticeid[0]){
        baseResponse.success = true
        baseResponse.data = getNoticeid
        baseResponse.error = null
        return res.status(200).json(baseResponse)
    }
    else{
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "공지가 없습니다."
        return res.status(404).json(baseResponse)
    }
}

export const getTos = async(req, res) =>{
    if(!req.verifiedToken){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "no token"
        return res.status(401).json(baseResponse)
    }
    const gettos = await getTosList();
    if (gettos[0]){
        baseResponse.success = true
        baseResponse.data = gettos
        baseResponse.error = null
        return res.status(200).json(baseResponse)
    }
    else{
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "서비스 이용약관 데이터가 없습니다."
        return res.status(404).json(baseResponse)
    }
}

export const getquestionList = async(req, res) =>{
    if(!req.verifiedToken){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "no token"
        return res.status(401).json(baseResponse)
    }
    const {params:{userId}} = req
    if(!userId){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "userId 값이 없습니다."
        return res.status(400).json(baseResponse)
    }
    const list = await questionList(userId);
    //console.log("list ", list[0])
    if (list[0].length!=0){
        baseResponse.success = true
        baseResponse.data = list[0]
        baseResponse.error = null
        return res.status(200).json(baseResponse)
    }
    else{
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "데이터가 없습니다."
        return res.status(404).json(baseResponse)
    }
}


export const getquestionDetails = async(req, res) =>{
    if(!req.verifiedToken){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "no token"
        return res.status(401).json(baseResponse)
    }
    const {params:{questionId}} = req
    if(!questionId){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "questionId 값이 없습니다."
        return res.status(400).json(baseResponse)
    }
    const result = await questiondetails(questionId);
    if (result[0].length != 0){
        baseResponse.success = true
        baseResponse.data = result[0]
        baseResponse.error = null
        return res.status(200).json(baseResponse)
    }
    else{
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "데이터가 없습니다."
        return res.status(404).json(baseResponse)
    }
}


export const createQuestion = async(req, res) => {
    if(!req.verifiedToken){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "no token"
        return res.status(401).json(baseResponse)
    }
    const {userId} = req.verifiedToken;
    //console.log("user token", userId);
    const {email, text} = req.body
    //console.log(userId, email, text)
    if(!email){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "email이 없습니다."
        return res.status(400).json(baseResponse)
    }
    if(!regexEmail.test(email)){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "이메일 양식이 잘못되었습니다."
        return res.status(400).json(baseResponse)
    }
    if(!text){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "text가 없습니다."
        return res.status(400).json(baseResponse)      
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
        return res.status(201).json(baseResponse)
    }

}


export const getfaq = async(req, res) =>{
    if(!req.verifiedToken){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "no token"
        return res.status(401).json(baseResponse)
    }

    const getfaq = await getFaqList();
    if (getfaq[0]){
        baseResponse.success = true
        baseResponse.data = getfaq
        baseResponse.error = null
        return res.status(200).json(baseResponse)
    }
    else{
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "데이터가 없습니다."
        return res.status(404).json(baseResponse)
    }
}


export const getfaqid = async(req, res) =>{
    console.log("controller ")
    if(!req.verifiedToken){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "no token"
        return res.status(401).json(baseResponse)
    }
    const {params:{faqId}} = req
    console.log("id값", faqId)
    const getfaqId = await getFaqListId(faqId);
    if (getfaqId[0]){
        baseResponse.success = true
        baseResponse.data = getfaqId
        baseResponse.error = null
        return res.status(200).json(baseResponse)
    }
    else{
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "데이터가 없습니다."
        return res.status(404).json(baseResponse)
    }
}