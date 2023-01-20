import  express  from "express";
import { getCategory, thumbCategory,getCategoryPaging } from './recipeController';
const recipeRouter = express.Router();

export default recipeRouter

recipeRouter.get('/category/', getCategory);
recipeRouter.get('/category/overView/:categoryId', thumbCategory);
recipeRouter.get('/category/paging/', getCategoryPaging);
