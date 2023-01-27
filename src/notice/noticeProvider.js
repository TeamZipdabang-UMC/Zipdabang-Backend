import pool from "../../config/database"
import { getnoticeList,getnoticeId, getTosLists, getFaq ,getFaqId,getUserQuestionId,getUserQuestiondetails} from "./noticeDao";


export const getNoticeList = async()=>{
    const connection = await pool.getConnection(async conn => conn);
    const result = await getnoticeList(connection);
    connection.release();
    return result
}

export const getNoticeId = async(noticeId)=>{
    const connection = await pool.getConnection(async conn => conn);
    const result = await getnoticeId(connection, noticeId);
    connection.release();
    return result
}

export const getTosList = async()=>{
    const connection = await pool.getConnection(async conn => conn);
    const result = await getTosLists(connection);
    connection.release();
    return result
}

export const questionList = async(userId)=>{
    const connection = await pool.getConnection(async conn => conn);
    const result = await getUserQuestionId(connection, userId);
    connection.release();
    return result
}

export const questiondetails = async(questionId)=>{
    const connection = await pool.getConnection(async conn => conn);
    const result = await getUserQuestiondetails(connection, questionId);
    connection.release();
    return result
}
export const getFaqList = async()=>{
    const connection = await pool.getConnection(async conn => conn);
    const result = await getFaq(connection);
    connection.release();
    return result
}


export const getFaqListId = async(faqId)=>{
    const connection = await pool.getConnection(async conn => conn);
    const result = await getFaqId(connection, faqId);
    connection.release();
    return result
}