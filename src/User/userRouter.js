import express from 'express'
import { jwtMiddleware } from '../../config/jwtMiddleware';
import { findExistNickname, finishGoogleRedirect, finishKakaoRedirect, getMyPage, getMyPageFirst, getMyScrapUpdate, kakaoLogin, postUser, postUserDataSocial, signIn, startGoogleRedirect, startKakaoRedirect } from './userController';

const userRouter = express.Router();

export default userRouter

userRouter.get('/kakao/start', startKakaoRedirect);
userRouter.get('/kakao/finish', finishKakaoRedirect);
userRouter.get('/google/start',startGoogleRedirect);
userRouter.get('/google/finish',finishGoogleRedirect);
userRouter.get('/exist-nickname',findExistNickname);
userRouter.post('/user-data/social-login',postUserDataSocial);
userRouter.post('/new-user',postUser)
userRouter.post('/sign-in',signIn)
userRouter.get('/:id([0-9]+)',jwtMiddleware,getMyPageFirst)
userRouter.get('/:id([0-9]+)/next-scrap', jwtMiddleware,getMyScrapUpdate)
