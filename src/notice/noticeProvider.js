import pool from "../../config/database"
import { getnoticeList,getnoticeId } from "./noticeDao";


export const getNoticeList = async()=>{
    const connection = await pool.getConnection(async conn => conn);
    const result = await getnoticeList(connection);
    return result
}

export const getNoticeId = async(noticeId)=>{
    const connection = await pool.getConnection(async conn => conn);
    const result = await getnoticeId(connection, noticeId);
    return result
}