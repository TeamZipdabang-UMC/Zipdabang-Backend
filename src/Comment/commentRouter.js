import express from "express"
import { jwtMiddleware } from "../../config/jwtMiddleware";
import {  deleteCommentController, getCommentsFirst, getCommentsMore, getCommentsOverView, newComment, patchComment } from "./commentController";


const commentRouter = express.Router()

commentRouter.post('/new-comment',jwtMiddleware,newComment);
commentRouter.get('/comments-overview',jwtMiddleware,getCommentsOverView)
commentRouter.get('/comments-view-first', jwtMiddleware,getCommentsFirst)
commentRouter.get('/comments-view-more', jwtMiddleware, getCommentsMore)
commentRouter.patch('/comments-update', jwtMiddleware, patchComment)
commentRouter.delete('/comments-delete',jwtMiddleware, deleteCommentController)
export default commentRouter;