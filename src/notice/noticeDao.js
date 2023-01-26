import { constants } from "buffer";

export const getnoticeList = async(connection) =>{

    const selectNoticeQuery = 
    `SELECT id, title,created_at from notification;`;
    
    const categoryList = await connection.query(selectNoticeQuery);
    return categoryList[0];
}

export const getnoticeId = async(connection, noticeId) =>{

    const selectNoticeIdQuery = 
    `SELECT title,body, created_at from notification where id=?;`;
    
    const getnoticeId = await connection.query(selectNoticeIdQuery, noticeId);
    return getnoticeId[0];
}

export const getTosLists = async(connection) =>{

    const tosQuery = 
    `SELECT title, body from tos;`;
    
    const result = await connection.query(tosQuery);
    return result[0];
}


export const postQuestionData = async(connection,userId, email, text) =>{
    const postQuestionQuery =
    `insert into question (owner, contact_email, body) values (${userId}, '${email}', '${text}');`;
    const result = await connection.query(postQuestionQuery, userId, email, text);
    return result;
}

export const getUserQuestionId = async(connection,userId) =>{
    const postQuestionQuery =
    `SELECT id, body, created_at from question where owner = '${userId}' order by created_at desc;`;
    const result = await connection.query(postQuestionQuery);
    return result;
}


export const getUserQuestiondetails = async(connection,questionId) =>{
    const questionDetailsQuery =
    `SELECT contact_email, body, created_at from question where id = '${questionId}';`;
    const result = await connection.query(questionDetailsQuery);
    return result;
}


export const getFaq = async(connection) =>{

    const faqQuery = 
    `SELECT id, question from faq order by created_at desc`;
    const result = await connection.query(faqQuery);
    return result[0];
}

export const getFaqId = async(connection, faqId) =>{
    const faqQuery = 
    `SELECT answer from faq where id = '${faqId}' order by created_at desc`;
    const result = await connection.query(faqQuery, faqId);
    return result[0];
}
