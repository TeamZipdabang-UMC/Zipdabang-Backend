import pool from "../../config/database"
import { deleteCommentById, insertBannedComment, insertComment, insertReportedComment, selectInsertedCommentId, updateCommentById } from "./commentDao"
import { checkCommentExist, checkRecipeExist } from "./commentProvider"


export const createComment = async(userId, target , body,baseResponse) =>{

    console.log("in service", userId, target, body)

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
            baseResponse.success = true
            baseResponse.data = {
                ownerId : userId,
                createdCommentId : createdCommentId[0].Id
            }
            return baseResponse
        }
    }
    else{
        connection.release();
        baseResponse.error = "레시피 데이터베이스에 없음"
        return baseResponse
    }
    
}

export const updateComment = async(userId, owner, target,newBody,baseResponse) =>{
    // 먼저 수정을 시도하는 유저와 로그인 된 유저 대조
    if (userId != owner){
        baseResponse.error = `댓글 작성자가 아닙니다`
        return baseResponse
    }
    // 수정 대상이 데이터베이스에 있나?
    const checkResult = await checkCommentExist(target);

    if (checkResult.length > 0){
        const connection = await pool.getConnection(async conn => conn)
        const updateResult = await updateCommentById(connection,target,newBody)
        connection.release();
        if (updateResult > 0){
            baseResponse.success = true
            return baseResponse
        }
    }
    else{
        connection.release();
        baseResponse.error = "수정대상이 디비에 없습니다"
        return baseResponse
    }
}

export const deleteCommentService = async(userId, owner, target, baseResponse) =>{
    //삭제하려는 유저가 소유자임?
    if (userId != owner){
        baseResponse.error = `댓글 작성자가 아닙니다`
        return baseResponse
    }

    const checkResult = await checkCommentExist(target);

    if (checkResult.length > 0){
        const connection = await pool.getConnection(async conn => conn)
        const updateResult = await deleteCommentById(connection,target)
        connection.release();
        if (updateResult > 0){
            baseResponse.success = true
            return baseResponse
        }
    }
    else{
        connection.release();
        baseResponse.error = `수정 대상이 데이터베이스에 없습니다`
        return baseResponse
    }
}

export const addCommentReport= async(reporter, target, crime, baseResponse)=>{
    const checkResult = await checkCommentExist(target);

    if (checkResult.length > 0){
        const insertParam = [reporter, target,crime]

        const connection = await pool.getConnection(async conn => conn)
        const result = await insertReportedComment(connection, insertParam)
        connection.release();
        if (result > 0){
            baseResponse.success = true
            return baseResponse
        }
        else{
            baseResponse.error = `데이터베이스에 정보를 추가하지 못했습니다.(서버오류)`
            return baseResponse
        }
    }
    else{
        baseResponse.error = `신고 대상이 데이터베이스에 없습니다`
        return baseResponse
    }
}

export const addCommentBan = async(owner, blocked, baseResponse)=>{
    const checkResult = await checkCommentExist(blocked);

    if (checkResult.length > 0){
        const insertParam = [owner, blocked]

        const connection = await pool.getConnection(async conn => conn)
        const result = await insertBannedComment(connection, insertParam)
        connection.release();
        if (result > 0){
            baseResponse.success = true
            return baseResponse
        }
        else{
            baseResponse.error = `데이터베이스에 정보를 추가하지 못했습니다.(서버오류)`
            return baseResponse
        }
    }
    else{
        baseResponse.error = `차단 대상이 데이터베이스에 없습니다`
        return baseResponse
    }
}