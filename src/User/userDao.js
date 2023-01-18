
export const selectSingleEmail = async(connection, email) =>{
    const selectEmailQuery = `select Id from user where email= '${email}';`

    const existUserId = await connection.query(selectEmailQuery)
    
    return existUserId[0];
}

export const createUserEmail = async(connection, userEmail, userProfile) =>{
    const createUserEmailQuery = `insert into user(email, profile_url) values ('${userEmail}', '${userProfile}');`
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
    const insertUserQuery = `insert into user(name, email, phone_num, age, nickname, password,is_social,gender) values (?,?,?,?,?,?,0,?);`
    const insertResult = await connection.query(insertUserQuery, dataParam);
    return insertResult[0].affectedRows
}

export const selectByEmail = async(connection, email) =>{
    const selectQuery = `select Id from user where email = '${email}'`;
    const selectResult = await connection.query(selectQuery)
    return selectResult[0][0]
}

export const selectPassword = async(connection, email) =>{
    const selectPasswordQuery = `select Id, password from user where email = '${email}';`
    const selectResult = await connection.query(selectPasswordQuery);
    return selectResult[0][0]
}

export const selectUserScrapFirst = async(connection, userId) =>{
    const selectUserScrapFirstQuery = `select target_recipe from scrap where owner = ${userId} order by created_at DESC LIMIT 3;`
    const selectResult = await connection.query(selectUserScrapFirstQuery);
    return selectResult[0]
}

export const selectUserScrapNext = async(connection, userId, recipeId) =>{
    const selectUserScrapNextQuery = `select target_recipe from scrap where owner = ${userId} and created_at < (select created_at from scrap where target_recipe = ${recipeId}) order by created_at DESC LIMIT 3;`
    const selectResult = await connection.query(selectUserScrapNextQuery)
    return selectResult[0]
}