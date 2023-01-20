import express from 'express'
import { jwtMiddleware } from '../../config/jwtMiddleware';
import { enterMain } from './rootController';

const rootRouter = express.Router();
export default rootRouter

rootRouter.get('/', jwtMiddleware,enterMain);

