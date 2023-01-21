import pool from "../../config/database"
import { selectCommentById, selectCommentJoin, selectCommentJoinMany, selectCommentJoinManyMore, selectRecipeById } from "./commentDao"


export const checkRecipeExist = async(target) => {
    const connection = await pool.getConnection(async conn => conn)
    const existResult = await selectRecipeById(connection, target)
    connection.release()
    return existResult
}

export const commentsOverView = async(target) =>{
    const connection = await pool.getConnection(async conn => conn)
    const result = await selectCommentJoin(connection, target)
    connection.release()
    return result
}

export const commentsViewFirst = async(target) =>{
    const connection = await pool.getConnection(async conn => conn)
    const result = await selectCommentJoinMany(connection, target)
    connection.release()
    return result
}

export const commentsViewMore = async(target, last) =>{
    const connection =  await pool.getConnection(async conn => conn)
    const result = await selectCommentJoinManyMore(connection, target, last)
    connection.release()
    return result
}

export const checkCommentExist = async(target) =>{
    const connection = await pool.getConnection(async conn => conn)
    const result = await selectCommentById(connection, target)
    connection.release()
    return result
}
