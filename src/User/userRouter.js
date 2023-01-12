import express from 'express'
import { finishKakaoRedirect, kakaoLogin, startKakaoRedirect } from './userController';

const userRouter = express.Router();

export default userRouter

userRouter.get('/kakao/start', startKakaoRedirect);
userRouter.get('/kakao/finish', finishKakaoRedirect);
// userRouter.post('/new-user')