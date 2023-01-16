
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
    const selectUserNicknameQuery = `select Id from user where nickname = '${nickname}'`;
    const selectResult = await connection.query(selectUserNicknameQuery)
    return selectResult[0][0];
}

export const insertUserData = async(connection, dataParma, email) =>{
    const insertUserDataQuery = `update user set name = ?, phone_num = ?, age = ?, nickname = ?, gender = ? where email = '${email}'`
    const insertResult = await connection.query(insertUserDataQuery, dataParma)
    return insertResult
}

export const insertNewUser = async(connection, dataParam) =>{
    const insertUserQuery = `insert into user(name, email, phone_num, age, nickname, password, gender) values (?,?,?,?,?,?,?);`
    const insertResult = await connection.query(insertUserQuery, dataParam);
    return insertResult[0].affectedRows
}

export const selectByEmail = async(connection, email) =>{
    const selectQuery = `select Id from user where email = '${email}'`;
    const selectResult = await connection.query(selectQuery)
    return selectResult[0][0]
}

export const selectPassword = async(connection, email) =>{
    const selectPasswordQuery = `select Id, password from User where email = '${email}';`
    const selectResult = await connection.query(selectPasswordQuery);
    return selectResult[0][0]
}