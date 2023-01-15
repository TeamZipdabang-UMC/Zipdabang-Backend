import  express  from "express";
import { getCategory, a } from './recipeController';
const recipeRouter = express.Router();

export default recipeRouter

recipeRouter.get('/category/:categoryId', getCategory);
