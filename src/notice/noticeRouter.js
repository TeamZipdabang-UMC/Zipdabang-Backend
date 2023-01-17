import  express  from "express";
import { noticeList, selectnotice } from './noticeController';

const noticeRouter = express.Router();
export default noticeRouter


noticeRouter.get('/', noticeList);
noticeRouter.get('/:noticeId', selectnotice);