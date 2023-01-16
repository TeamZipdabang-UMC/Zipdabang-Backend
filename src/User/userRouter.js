import express from 'express'
import { findExistNickname, finishGoogleRedirect, finishKakaoRedirect, kakaoLogin, postUser, postUserDataSocial, signIn, startGoogleRedirect, startKakaoRedirect } from './userController';

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
