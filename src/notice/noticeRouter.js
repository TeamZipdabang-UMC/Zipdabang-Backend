import  express  from "express";
import { noticeList, selectnotice, getTos, createQuestion, getfaq,getfaqid,getquestionList,getquestionDetails } from './noticeController';
import { jwtMiddleware } from '../../config/jwtMiddleware';
const noticeRouter = express.Router();
export default noticeRouter


noticeRouter.get('/',jwtMiddleware, noticeList);
noticeRouter.get('/:noticeId([0-9]+)',jwtMiddleware, selectnotice);
noticeRouter.get('/tos',jwtMiddleware, getTos);

noticeRouter.post('/question',jwtMiddleware, createQuestion);
noticeRouter.get('/questionlist', jwtMiddleware, getquestionList)
noticeRouter.get('/questiondetail/:questionId([0-9]+)', jwtMiddleware, getquestionDetails)

noticeRouter.get('/faq',jwtMiddleware, getfaq);
noticeRouter.get('/faq/:faqId',jwtMiddleware, getfaqid);
