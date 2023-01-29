import  express  from "express";
import { jwtMiddleware } from '../../config/jwtMiddleware';
import { tokenAndBodyCheck, tokenCheckPicture, uploadPicture } from "../../config/middlewares";
import { getCategory, thumbCategory,getCategoryPaging, getSearch, getAllRecipes,getAllRecipesPaging, postDeleteRecipe, getShowRecipeInfo, postStartChallenge, postLike, postScrap, getMyRecipes, getAllOfficail, getAllUsers, getTemp, postTemp, postThumPicture, postStepPicture, postSave } from './recipeController';
const recipeRouter = express.Router();


// 카테고리별 레시피  ( 최근 2개, 최근 12개, 12개씩 페이징)
recipeRouter.get('/category/over-view/:categoryId',jwtMiddleware, thumbCategory);
recipeRouter.get('/category',jwtMiddleware, getCategory); // 
recipeRouter.get('/category/paging',jwtMiddleware, getCategoryPaging);

// 전체 레시피 출력

recipeRouter.get('/all-view', jwtMiddleware, getAllRecipes)
recipeRouter.get('/all-view/paging', jwtMiddleware, getAllRecipesPaging)
// 레시피 검색 
recipeRouter.get('/search',jwtMiddleware, getSearch);




recipeRouter.route("/info")
.all(jwtMiddleware)
.get(getShowRecipeInfo)

recipeRouter.route("/:recipeId([0-9]+)/challenge")
.all(jwtMiddleware)
.post(postStartChallenge)

recipeRouter.route("/:recipeId([0-9]+)/like")
.all(jwtMiddleware)
.post(postLike)

recipeRouter.route("/:recipeId([0-9]+)/scrap")
.all(jwtMiddleware)
.post(postScrap)

recipeRouter.route("/my-recipes/delete")
.all(jwtMiddleware)
.post(postDeleteRecipe)

// recipeRouter.route("/my-recipes")
// .all(jwtMiddleware)
// .get(getMyRecipes)

// 무한 스크롤 제외
recipeRouter.route("/my-recipes")
.all(jwtMiddleware)
.get(getMyRecipes)

recipeRouter.get('/official-recipe',jwtMiddleware,getAllOfficail)
recipeRouter.get('/user-recipe',jwtMiddleware,getAllUsers)


// ]
recipeRouter.post('/new-recipe', jwtMiddleware,postSave)

recipeRouter.route('/temp-recipe').all(jwtMiddleware).get(getTemp).post(postTemp)
recipeRouter.post('/thumb-picture',jwtMiddleware,tokenCheckPicture,uploadPicture.single("img"),postThumPicture)
recipeRouter.post('/step-picture', jwtMiddleware, tokenCheckPicture, uploadPicture.single("img"),postStepPicture)
export default recipeRouter
