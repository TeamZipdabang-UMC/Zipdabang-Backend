import { commentsOverView, commentsViewFirst, commentsViewMore } from "./commentProvider"
import { createComment, deleteCommentService, updateComment } from "./commentService"


export const newComment = async(req, res) => {
    const {userId, userEmail} = req.verifiedToken
    const {target, body} = req.body

    const errResponseObj = 
    {
        success : false,
        error : ``,
        errorType : ``
    }

    if (!target)
    {
        errResponseObj.error = `대상 레시피 아이디 누락`,
        errResponseObj.errorType = `no recipe sent`
    }
    else if (!body)
    {
        errResponseObj.error = `댓글 내용 누락`,
        errResponseObj.errorType = `no comment body sent`
    }

    const result = await createComment(userId, target, body)
    res.send(JSON.stringify(result))
}

export const getCommentsOverView = async(req, res) =>{
    const {recipe:target} = req.query
    const result = await commentsOverView(target)

    const responseObj = {
        comments : result
    }

    return res.send(JSON.stringify(responseObj))
}

export const getCommentsFirst = async(req, res) =>{
    const {recipe : target} = req.query
    const result = await commentsViewFirst(target)

    const responseObj = {
        comments : result
    }

    return res.send(JSON.stringify(responseObj))
}

export const getCommentsMore = async(req, res) =>{
    const {recipe:target, last} =  req.query
    const result = await commentsViewMore(target, last)

    const responseObj = {
        comments : result
    }

    return res.send(JSON.stringify(responseObj))
}

export const patchComment = async(req, res) =>{
    const {owner, commentId:target, newBody} = req.body
    const {userId} = req.verifiedToken

    const errorResponseObj = {
        success : false,
        error : ``,
        errorType : ``
    }
    if (!owner){
        errorResponseObj.error = `소유자 아이디를 넘겨주세요`,
        errorResponseObj.errorType = `no owner Id`
        res.send(JSON.stringify(errorResponseObj))
    }
    else if (!target){
        errorResponseObj.error = `수정 대상 댓글 아이디를 넘겨주세요`,
        errorResponseObj.errorType = `no comment Id`
        res.send(JSON.stringify(errorResponseObj))
    }


    const result = await updateComment(userId, owner, target,newBody,errorResponseObj);

    res.send(JSON.stringify(result))
}

export const deleteCommentController = async(req, res) =>{
    const {owner, commentId:target} = req.body
    const {userId} = req.verifiedToken

    const errorResponseObj = {
        success : false,
        error : ``,
        errorType : ``
    }
    if (!owner){
        errorResponseObj.error = `소유자 아이디를 넘겨주세요`,
        errorResponseObj.errorType = `no owner Id`
        res.send(JSON.stringify(errorResponseObj))
    }
    else if (!target){
        errorResponseObj.error = `삭제 대상 댓글 아이디를 넘겨주세요`,
        errorResponseObj.errorType = `no comment Id`
        res.send(JSON.stringify(errorResponseObj))
    }

    const result = await deleteCommentService(userId, owner, target, errorResponseObj);
    res.send(JSON.stringify(result))
}