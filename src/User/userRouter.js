import express from 'express'
import { jwtMiddleware } from '../../config/jwtMiddleware';
import { findExistNickname, getMyPageFirst, getMyScrapUpdate, googleLogin, kakaoLogin,  postUserDataSocial } from './userController';

const userRouter = express.Router();

export default userRouter

// userRouter.get('/kakao/start', startKakaoRedirect);
// userRouter.get('/kakao/finish', finishKakaoRedirect);
userRouter.post('/kakao/login', kakaoLogin);
userRouter.post('/google/login', googleLogin)
// userRouter.get('/google/start',startGoogleRedirect);
// userRouter.get('/google/finish',finishGoogleRedirect);

userRouter.get('/exist-nickname',findExistNickname);
userRouter.post('/user-data',postUserDataSocial);
// userRouter.post('/new-user',postUser)
// userRouter.post('/sign-in',signIn)
userRouter.get('/:id([0-9]+)',jwtMiddleware,getMyPageFirst)
userRouter.get('/:id([0-9]+)/next-scrap', jwtMiddleware,getMyScrapUpdate)
