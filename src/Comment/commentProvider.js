import pool from "../../config/database"
import { selectCommentById, selectCommentJoin, selectCommentJoinMany, selectCommentJoinManyMore, selectRecipeById } from "./commentDao"


export const checkRecipeExist = async(target) => {
    const connection = await pool.getConnection(async conn => conn)
    const existResult = await selectRecipeById(connection, target)
    connection.release()
    return existResult
}

export const commentsOverView = async(target, userId) =>{
    const connection = await pool.getConnection(async conn => conn)
    const result = await selectCommentJoin(connection, target, userId)
    connection.release()
    return result
}

export const commentsViewFirst = async(target, userId) =>{
    const connection = await pool.getConnection(async conn => conn)
    const result = await selectCommentJoinMany(connection, target, userId)
    connection.release()
    return result
}

export const commentsViewMore = async(target, last,userId) =>{
    const connection =  await pool.getConnection(async conn => conn)
    const result = await selectCommentJoinManyMore(connection, target, last, userId)
    connection.release()
    return result
}

export const checkCommentExist = async(target) =>{
    const connection = await pool.getConnection(async conn => conn)
    const result = await selectCommentById(connection, target)
    connection.release()
    return result
}
