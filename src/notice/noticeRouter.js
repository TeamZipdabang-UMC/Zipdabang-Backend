import  express  from "express";
import { noticeList, selectnotice, getTos } from './noticeController';

const noticeRouter = express.Router();
export default noticeRouter


noticeRouter.get('/', noticeList);
noticeRouter.get('/:noticeId([0-9]+)', selectnotice);
noticeRouter.get('/tos/', getTos);