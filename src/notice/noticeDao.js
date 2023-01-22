export const getnoticeList = async(connection) =>{

    const selectNoticeQuery = 
    `SELECT title,created_at from notification;`;
    
    const categoryList = await connection.query(selectNoticeQuery);
    return categoryList[0];
}

export const getnoticeId = async(connection, noticeId) =>{

    const selectNoticeIdQuery = 
    `SELECT title,body from notification where id=?;`;
    
    const getnoticeId = await connection.query(selectNoticeIdQuery, noticeId);
    return getnoticeId[0];
}

export const getTosLists = async(connection) =>{

    const tosQuery = 
    `SELECT title, body from tos;`;
    
    const result = await connection.query(tosQuery);
    return result[0];
}