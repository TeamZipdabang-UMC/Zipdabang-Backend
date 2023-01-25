
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
    console.log(selectUserNicknameQuery)
    const selectResult = await connection.query(selectUserNicknameQuery)
    return selectResult[0][0];
}

export const insertUserData = async(connection, dataParma, email) =>{
    const insertUserDataQuery = `update user set name = ?, phone_num = ?, age = ?, nickname = ?, gender = ? where email = '${email}'`
    console.log(insertUserDataQuery)
    const insertResult = await connection.query(insertUserDataQuery, dataParma)
    return insertResult
}

export const insertNewUser = async(connection, dataParam) =>{
    const insertUserQuery = `insert into user(name, email, phone_num, age, nickname, password,is_social,gender) values (?,?,?,?,?,?,0,?);`
    console.log(insertUserQuery)
    const insertResult = await connection.query(insertUserQuery, dataParam);
    return insertResult[0].affectedRows
}

export const selectByEmail = async(connection, email) =>{
    const selectQuery = `select Id from user where email = '${email}'`;
    console.log(selectQuery)
    const selectResult = await connection.query(selectQuery)
    return selectResult[0][0]
}

export const selectPassword = async(connection, email) =>{
    const selectPasswordQuery = `select Id, password from user where email = '${email}';`
    console.log(selectPasswordQuery)
    const selectResult = await connection.query(selectPasswordQuery);
    return selectResult[0][0]
}

export const selectUserScrapOverView = async(connection, userId) =>{
    const selectUserScrapFirstQuery = `select scrap.target_recipe as recipeId, recipe.likes as likes, recipe.name from scrap join recipe on scrap.target_recipe = recipe.Id where scrap.owner = ${userId} order by scrap.created_at DESC limit 2;`
    console.log(selectUserScrapFirstQuery)
    const selectResult = await connection.query(selectUserScrapFirstQuery);
    return selectResult[0]
}

export const selectUserChallenging = async(connection, userId) =>{
    const selectUserChallengingQuery = `select challenge.target_recipe as recipeId, recipe.likes as likes, recipe.name from challenge join recipe on challenge.target_recipe = recipe.Id where recipe.owner = ${userId} and challenge.status = 'challenging' order by challenge.created_at DESC limit 2;`
    console.log(selectUserChallengingQuery)
    const selectResult = await connection.query(selectUserChallengingQuery);
    return selectResult[0]
}

export const selectUserComplete = async(connection, userId) =>{
    const selectUserCompleteQuery = `select challenge.target_recipe as recipeId, recipe.likes as likes, recipe.name from challenge join recipe on challenge.target_recipe = recipe.Id where recipe.owner = ${userId} and challenge.status = 'complete' order by challenge.created_at DESC limit 2;`
    console.log(selectUserCompleteQuery)
    const selectResult = await connection.query(selectUserCompleteQuery)
    return selectResult[0]
}

export const selectAllScrap = async(connection, userId) =>{
    const selectUserScrapNextQuery = `select scrap.target_recipe as recipeId, recipe.likes as likes, image_url as image, recipe.name from scrap join recipe on scrap.target_recipe = recipe.Id where scrap.owner = ${userId} order by scrap.created_at DESC;`
    console.log(selectUserScrapNextQuery)
    const selectResult = await connection.query(selectUserScrapNextQuery)
    return selectResult[0]
}

export const selectAllChallenging = async(connection, userId) =>{
    const selectAllChallengingQuery = `select challenge.target_recipe as recipeId, recipe.likes as likes, image_url as image, recipe.name from challenge join recipe on challenge.target_recipe = recipe.Id where challenge.owner = ${userId} and challenge.status = 'challenging' order by challenge.created_at DESC;`
    console.log(selectAllChallengingQuery)
    const selectResult = await connection.query(selectAllChallengingQuery);
    return selectResult[0]
}

export const selectAllComplete = async(connection, userId) =>{
    const selectAllCompleteQuery = `select challenge.target_recipe as recipeId, recipe.likes as likes, image_url as image, recipe.name from challenge join recipe on challenge.target_recipe = recipe.Id where challenge.owner = ${userId} and challenge.status = 'complete' order by challenge.created_at DESC;`
    console.log(selectAllCompleteQuery)
    const selectResult = await connection.query(selectAllCompleteQuery);
    return selectResult[0]
}


export const deleteScrapRow = async(connection, deleteSubQuery,userId) =>{
    const deleteQuery = `delete from scrap where target_recipe in ` + deleteSubQuery +  ` and owner = ${userId}` + ';'
    console.log(deleteQuery)
    const deleteResult = await connection.query(deleteQuery);
    return deleteResult[0].affectedRows
}

export const updateNickname = async(connection, userId, nickname) =>{
    console.log("in dao", userId, nickname)
    const updateNicknameQuery = `update user set nickname = '${nickname}' where Id = ${userId};`
    console.log(updateNicknameQuery);
    const updateResult = await connection.query(updateNicknameQuery)
    return updateResult[0].affectedRows
}

export const updateInactive = async(connection, userId) =>{
    console.log("in dao" , userId)
    const quitQuery = `update user set status = 'INACTIVE' where Id = ${userId};`
    console.log(quitQuery)
    const quitResult = await connection.query(quitQuery)
    return quitResult[0].affectedRows
}