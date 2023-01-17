import regexEmail from "regex-email";
import privateInfo from "../../config/privateInfo";
import fetch from "node-fetch"
import { getNoticeList, getNoticeId } from "./noticeProvider";

export const noticeList = async(req, res) => {
    const getNotice = await getNoticeList()
    res.send(getNotice);
}

export const selectnotice = async(req, res) => {
    const {params:{noticeId}} = req;
    if(!noticeId){
        
    }
    const getNoticeid = await getNoticeId(noticeId)
    res.send(getNoticeid);
}