import express from 'express'
import { jwtMiddleware } from '../../config/jwtMiddleware';
import { deleteMyScrap, findExistNickname, getMyChallenging, getMyComeplete, getMyPage,  getMyScrap,  googleLogin, kakaoLogin,  postUserDataSocial } from './userController';

const userRouter = express.Router();

// 소셜 로그인
userRouter.post('/kakao/login', kakaoLogin);
userRouter.post('/google/login', googleLogin)

// 회원가입 정보 입력 프로세스 
userRouter.get('/exist-nickname',findExistNickname);
userRouter.post('/user-data',postUserDataSocial);

// 내 집다방 보여주기 프로세스
userRouter.get('/:id([0-9]+)',jwtMiddleware,getMyPage)

// 내 집다방 페이지에서 각각의 정보들 자세히 보기 프로세스
userRouter.get('/:id([0-9]+)/my-scrap', jwtMiddleware,getMyScrap)
userRouter.get('/:id([0-9]+)/my-challenging', jwtMiddleware, getMyChallenging)
userRouter.get('/:id([0-9]+)/my-complete', jwtMiddleware, getMyComeplete)

// 내 스크랩 지우기 프로세스
userRouter.delete('/:id([0-9]+)/my-scrap/delete', jwtMiddleware, deleteMyScrap)


export default userRouter
