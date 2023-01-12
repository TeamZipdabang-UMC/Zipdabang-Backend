
export const selectSingleEmail = async(connection, email) =>{
    const selectEmailQuery = `SELECT Id FROM USER WHERE EMAIL ='${email}'`

    const existUserId = await connection.query(selectEmailQuery)

    return existUserId[0].length > 0
}

export const createUserEmail = async(connection, userEmail, userProfile) =>{
    const createUserEmailQuery = `insert into user(email, profile_url) values ('${userEmail}', '${userProfile}');`
    const insertResult = await connection.query(createUserEmailQuery)
    return insertResult[0].affectedRows
}