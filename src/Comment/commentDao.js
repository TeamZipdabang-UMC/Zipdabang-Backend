

export const insertComment = async(connection, insertParam) =>{
    const insertCommentQuery = `insert into comment(owner, target_recipe, body) value (?, ?, ?);`
    const insertResult = await connection.query(insertCommentQuery, insertParam)
    
    return insertResult[0].affectedRows
    
}

export const selectInsertedCommentId = async(connection, userId) =>{
    const selectInsertedCommentIdQuery = `select Id from comment where owner = ${userId} order by created_at DESC limit 1;`
    const selectResult = await connection.query(selectInsertedCommentIdQuery)
    return selectResult[0]
}

export const selectRecipeById = async(connection, target) =>{
    const selectRecipeByIdQuery = `select Id from recipe where Id = ${target};`
    const selectResult = await connection.query(selectRecipeByIdQuery)
    return selectResult[0]
}

export const selectCommentJoin = async(connection, target) =>{
    const selectCommentJoinQuery = `select comment.body, comment.created_at, user.nickname from comment inner join user on comment.owner = User.Id where comment.target_recipe = ${target} order by comment.created_at DESC  limit 3;`
    const selectResult = await connection.query(selectCommentJoinQuery);
    return selectResult[0]
}

export const selectCommentJoinMany = async(connection, target) =>{
    const selectCommentJoinManyQuery = `select comment.Id as commentId, comment.owner, comment.body, comment.created_at, user.nickname from comment inner join user on comment.owner = User.Id where comment.target_recipe = ${target} order by comment.created_at DESC limit 8;`
    const selectResult = await connection.query(selectCommentJoinManyQuery);
    return selectResult[0]
}

export const selectCommentJoinManyMore = async(connection, target, last) =>{
    const selectCommentJoinManyMoreQuery = `select comment.Id as commentId, comment.owner, comment.body, comment.created_at, user.nickname from comment inner join user on comment.owner = User.Id where comment.target_recipe = ${target} and comment.created_at < (select comment.created_at from comment where Id = ${last}) order by comment.created_at DESC limit 8;`
    const selectResult = await connection.query(selectCommentJoinManyMoreQuery);
    return selectResult[0]
}

export const selectCommentById = async(connection, target) =>{
    const selectCommentByIdQuery = `select Id from comment where Id = ${target};`
    const selectResult = await connection.query(selectCommentByIdQuery)
    return selectResult[0]
}

export const updateCommentById = async(connection, target, newBody) =>{
    const updateCommentQuery = `update comment set body = '${newBody}', updated_at = (current_timestamp(6)) where Id = ${target};`
    const updateResult = await connection.query(updateCommentQuery)
    return updateResult[0].affectedRows
}

export const deleteCommentById = async(connection, target) =>{
    const deleteCommentQuery = `delete from comment where Id = ${target};`
    const updateResult = await connection.query(deleteCommentQuery)
    return updateResult[0].affectedRows
}