import pool from "../../config/database"
import { deleteCommentById, insertComment, selectInsertedCommentId, updateCommentById } from "./commentDao"
import { checkCommentExist, checkRecipeExist } from "./commentProvider"


export const createComment = async(userId, target , body) =>{


    const connection = await pool.getConnection(async conn => conn)
    
    // 댓글을 달려는 레시피가 디비에 있나 확인
    const isRecipeExist = await checkRecipeExist(target)
    
    if (isRecipeExist.length > 0){
        const insertParam = [userId, target, body]

        const result = await insertComment(connection, insertParam)
        connection.release()
        if (result > 0){
            const connection = await pool.getConnection(async conn => conn)
            const createdCommentId = await selectInsertedCommentId(connection,userId)
            connection.release()
            return {
                success : true,
                ownerId : userId,
                createdCommentId : createdCommentId[0].Id
            }
        }
    }
    else{
        return {
            success : false,
            error : "대상이 데이터베이스에 없습니다",
            errorType : "recipe not in database"
        }
    }
    
}

export const updateComment = async(userId, owner, target,newBody,errorResponseObj) =>{
    // 먼저 수정을 시도하는 유저와 로그인 된 유저 대조
    if (userId != owner){
        errorResponseObj.error = `댓글 작성자가 아닙니다`
        errorResponseObj.errorType = `not owner`
        return errorResponseObj
    }
    // 수정 대상이 데이터베이스에 있나?
    const checkResult = await checkCommentExist(target);

    if (checkResult.length > 0){
        const connection = await pool.getConnection(async conn => conn)
        const updateResult = await updateCommentById(connection,target,newBody)
        if (updateResult > 0){
            return{
                success : true
            }
        }
    }
    else{
        errorResponseObj.error = `수정 대상이 데이터베이스에 없습니다`
        errorResponseObj.errorType = `no comment in database`
    }
}

export const deleteCommentService = async(userId, owner, target, errorResponseObj) =>{
    //삭제하려는 유저가 소유자임?
    if (userId != owner){
        errorResponseObj.error = `댓글 작성자가 아닙니다`
        errorResponseObj.errorType = `not owner`
        return errorResponseObj
    }

    const checkResult = await checkCommentExist(target);

    if (checkResult.length > 0){
        const connection = await pool.getConnection(async conn => conn)
        const updateResult = await deleteCommentById(connection,target)
        if (updateResult > 0){
            return{
                success : true
            }
        }
    }
    else{
        errorResponseObj.error = `수정 대상이 데이터베이스에 없습니다`
        errorResponseObj.errorType = `no comment in database`
    }
}