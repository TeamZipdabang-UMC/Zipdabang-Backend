export const getnoticeList = async(connection) =>{

    const selectNoticeQuery = 
    `SElECT title,created_at from notification;`;
    
    const categoryList = await connection.query(selectNoticeQuery);
    return categoryList[0];
}

export const getnoticeId = async(connection, noticeId) =>{

    const selectNoticeIdQuery = 
    `SElECT title,body from notification where id=?;`;
    
    const getnoticeId = await connection.query(selectNoticeIdQuery, noticeId);
    return getnoticeId[0];
}