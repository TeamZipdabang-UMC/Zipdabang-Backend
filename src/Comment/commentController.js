import { commentsOverView, commentsViewFirst, commentsViewMore } from "./commentProvider"
import { createComment, deleteCommentService, updateComment } from "./commentService"


export const newComment = async(req, res) => {
    let baseResponse = {
        success : false,
        data : null,
        error : null
    }
    if (!req.verifiedToken){
        baseResponse.error = 'no token'
        return res.status(401).json(baseResponse)
    }

    const {userId} = req.verifiedToken
    const {target, body} = req.body

    console.log("in controller",userId, target, body)
    if (!target)
    {
        baseResponse.error = `대상 레시피 아이디 누락`
        return res.status(400).json(baseResponse)
    }
    else if (!body)
    {
        baseResponse.error = '댓글 내용 누락'
        return res.status(400).json(baseResponse)
    }

    const result = await createComment(userId, target, body, baseResponse)
    console.log("result",result)
    return res.json(result)
}

export const getCommentsOverView = async(req, res) =>{
    let baseResponse = {
        success : false,
        data : null,
        error : null
    }
    if (!req.verifiedToken){
        baseResponse.error = 'no token'
        return res.status(401).json(baseResponse)
    }
    const {recipe:target} = req.query

    if(!target){
        baseResponse.error = "레시피 아이디 주세요"
        return res.status(400).json(baseResponse)
    }
    console.log("controller", target)
    const result = await commentsOverView(target)

    baseResponse.success = true
    baseResponse.data = {
        comments : result
    }
    return res.json(baseResponse)
}

export const getCommentsFirst = async(req, res) =>{
    let baseResponse = {
        success : false,
        data : null,
        error : null
    }
    if (!req.verifiedToken){
        baseResponse.error = 'no token'
        return res.status(401).json(baseResponse)
    }
    const {recipe:target} = req.query

    if(!target){
        baseResponse.error = "레시피 아이디 주세요"
        return res.status(400).json(baseResponse)
    }
    console.log("controller", target)
    const result = await commentsViewFirst(target)

    baseResponse.data = {
        comments : result
    }

    return res.json(baseResponse)
}

export const getCommentsMore = async(req, res) =>{
    let baseResponse = {
        success : false,
        data : null,
        error : null
    }
    if (!req.verifiedToken){
        baseResponse.error = 'no token'
        return res.status(401).json(baseResponse)
    }
    const {recipe:target, last} =  req.query
    if (!target || !last){
        baseResponse.error = "레시피 아이디 혹은 마지막 댓글 아이디 주세여"
        return res.status(400).json(baseResponse)
    }
    const result = await commentsViewMore(target, last)

    baseResponse.data = {
        comments : result
    }

    console.log(baseResponse)
    return res.json(baseResponse)
}

export const patchComment = async(req, res) =>{
    let baseResponse = {
        success : false,
        data : null,
        error : null
    }
    if (!req.verifiedToken){
        baseResponse.error = 'no token'
        return res.json(baseResponse)
    }
    const {owner, commentId:target, newBody} = req.body
    const {userId} = req.verifiedToken

    if (!owner){
        baseResponse.error = `소유자 아이디를 넘겨주세요`
        return res.status(400).json(baseResponse)
    }
    else if (!target){
        baseResponse.error = `수정 대상 댓글 아이디를 넘겨주세요`
        return res.status(400).json(baseResponse)
    }
    else if (!newBody){
        baseResponse.error = `수정할 내용 넘겨주세요`
        return res.status(400).json(baseResponse)
    }


    const result = await updateComment(userId, owner, target,newBody,baseResponse);

    res.json(result)
}

export const deleteCommentController = async(req, res) =>{
    let baseResponse = {
        success : false,
        data : null,
        error : null
    }
    if (!req.verifiedToken){
        baseResponse.error = 'no token'
        return res.status(401).json(baseResponse)
    }
    const {owner, commentId:target} = req.body
    const {userId} = req.verifiedToken

    if (!owner){
        baseResponse.error = `소유자 아이디를 넘겨주세요`
        return res.status(400).json(baseResponse)
    }
    else if (!target){
        baseResponse.error = `삭제 대상 댓글 아이디를 넘겨주세요`
        return res.status(400).json(baseResponse)
    }

    const result = await deleteCommentService(userId, owner, target, baseResponse);
    res.json(result)
}