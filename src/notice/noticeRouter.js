import  express  from "express";
import { noticeList, selectnotice, getTos, createQuestion, getfaq } from './noticeController';
import { jwtMiddleware } from '../../config/jwtMiddleware';
const noticeRouter = express.Router();
export default noticeRouter


noticeRouter.get('/',jwtMiddleware, noticeList);
noticeRouter.get('/:noticeId([0-9]+)',jwtMiddleware, selectnotice);
noticeRouter.get('/tos',jwtMiddleware, getTos);

noticeRouter.post('/question',jwtMiddleware, createQuestion);
noticeRouter.get('/faq',jwtMiddleware, getfaq);