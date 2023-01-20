import express from 'express'
import { jwtMiddleware } from '../../config/jwtMiddleware';
import { deleteMyScrap, findExistNickname, getMyChallenging, getMyComeplete, getMyPage,  getMyScrap,  googleLogin, kakaoLogin,  postUserDataSocial } from './userController';

const userRouter = express.Router();

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
userRouter.get('/:id([0-9]+)',jwtMiddleware,getMyPage)
userRouter.get('/:id([0-9]+)/my-scrap', jwtMiddleware,getMyScrap)
userRouter.get('/:id([0-9]+)/my-challenging', jwtMiddleware, getMyChallenging)
userRouter.get('/:id([0-9]+)/my-complete', jwtMiddleware, getMyComeplete)
userRouter.delete('/:id([0-9]+)/my-scrap/delete', jwtMiddleware, deleteMyScrap)


export default userRouter
