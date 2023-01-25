import  express  from "express";
import { jwtMiddleware } from '../../config/jwtMiddleware';
import { getCategory, thumbCategory,getCategoryPaging, getSearch, getAllRecipes, postDeleteRecipe, getShowRecipeInfo, postStartChallenge, postLike, postScrap, getMyRecipes, getAllOfficail, getAllUsers } from './recipeController';
const recipeRouter = express.Router();


// 카테고리별 레시피  ( 최근 2개, 최근 12개, 12개씩 페이징)
recipeRouter.get('/category/over-view/:categoryId',jwtMiddleware, thumbCategory);
recipeRouter.get('/category',jwtMiddleware, getCategory); // 
recipeRouter.get('/category/paging',jwtMiddleware, getCategoryPaging);

// 전체 레시피 출력
recipeRouter.get('/allView', jwtMiddleware, getAllRecipes)

// 레시피 검색 
recipeRouter.get('/search',jwtMiddleware, getSearch);


// recipeRouter.route("/create/user-recipe")
// .all(jwtMiddleware)
// .get(getCreateUserRecipe)
// .post(postCreateUserRecipe);

// recipeRouter.route("/create/user-recipe/temp-save")
// .all(jwtMiddleware)
// .get(getTempSaveUserRecipe)
// .post(postTempSaveUserRecipe);

// recipeRouter.route("/create/save-img/:recipeId([0-9]+)")
// .post(upload.single("img"), saveImgURL);

recipeRouter.route("/:recipeId([0-9]+)/info")
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

// recipeRouter.route("/:recipeId([0-9]+)/update")
// .all(jwtMiddleware)
// .get(getUpdateRecipe)
// .post(postUpdateRecipe)

recipeRouter.route("/my-recipes")
.all(jwtMiddleware)
.get(getMyRecipes)

recipeRouter.get('/official-recipe',jwtMiddleware,getAllOfficail)
recipeRouter.get('/user-recipe',jwtMiddleware,getAllUsers)

/*
recipeRouter.route("/create/official-recipe")
//.all(공식계정 확인 미들웨어)
.get(getCreateOfficialRecipe)
.post(postCreateOfficialRecipe)
*/




// [

//     data :{
//         reicpe: {
//             name,
//             category <- 
//             ... 
//         },
//         ingredient:{
//             [{name,qun},{} ... ]
//         },
//         steps:{
//             [{number, detail, stepImg}, {} ...]
//         }
//     }

// ]

export default recipeRouter
