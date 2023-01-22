import  express  from "express";
import { jwtMiddleware } from '../../config/jwtMiddleware';
import { getCategory, thumbCategory,getCategoryPaging, getSearch, getAllRecipes } from './recipeController';
const recipeRouter = express.Router();

export default recipeRouter

// 카테고리별 레시피  ( 최근 2개, 최근 12개, 12개씩 페이징)
recipeRouter.get('/category/overView:categoryId',jwtMiddleware, thumbCategory);
recipeRouter.get('/category/',jwtMiddleware, getCategory); // 
recipeRouter.get('/category/paging/',jwtMiddleware, getCategoryPaging);

// 전체 레시피 출력
recipeRouter.get('/allView/', jwtMiddleware, getAllRecipes)

// 레시피 검색 
recipeRouter.get('/search/',jwtMiddleware, getSearch);
