
export const selectSingleEmail = async(connection, email) =>{
    const selectEmailQuery = `SELECT Id FROM USER WHERE EMAIL ='${email}'`

    const existUserId = await connection.query(selectEmailQuery)
    
    return existUserId[0];
}

export const createUserEmail = async(connection, userEmail, userProfile) =>{
    const createUserEmailQuery = `insert into user(email, profile_url, is_social) values ('${userEmail}', '${userProfile}', true);`
    const insertResult = await connection.query(createUserEmailQuery)
    return insertResult[0].affectedRows
}

export const selectUserByNickname = async(connection, nickname) =>{
    const selectUserNicknameQuery = ``;
    const selectResult = await connection.query(selectEmailQuery)
    console.log(selectResult);
}

export const insertUserData = async(connection, dataParma, email) =>{
    const insertUserDataQuery = `update user set name = ?, phone_num = ?, age = ?, nickname = ?, gender = ? where email = '${email}'`
    const insertResult = await connection.query(insertUserDataQuery, dataParma)
    return insertResult
}
