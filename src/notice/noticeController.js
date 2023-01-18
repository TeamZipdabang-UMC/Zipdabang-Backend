import regexEmail from "regex-email";
import privateInfo from "../../config/privateInfo";
import fetch from "node-fetch"
import { getNoticeList, getNoticeId, getTosList } from "./noticeProvider";
import exp from "constants";
import { json } from "body-parser";

export const noticeList = async(req, res) => {
    const getNotice = await getNoticeList()
    res.send(JSON.stringify(getNotice));
}

export const selectnotice = async(req, res) => {
    const {params:{noticeId}} = req;

    const getNoticeid = await getNoticeId(noticeId)
    
    if (getNoticeid[0]){
        res.send(JSON.stringify(getNoticeid));
    }
    else{
        const responseObj = {
            status : "notice not exist",
        }
        res.send(JSON.stringify(responseObj))
    }
}

export const getTos = async(req, res) =>{
    
    const gettos = await getTosList();
    res.send(JSON.stringify(gettos));
}