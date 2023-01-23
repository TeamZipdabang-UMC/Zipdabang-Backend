import express from "express"
import {upload} from "../../config/middlewares.js"
import {jwtMiddleware} from "../../config/jwtMiddleware"
import { postDeleteRecipe, getCreateUserRecipe, getShowRecipeInfo, postStartChallenge, postCreateUserRecipe, postTempSaveUserRecipe,
    /*getCreateOfficialRecipe, postCreateOfficialRecipe,*/ saveImgURL, 
    getMyRecipes,
    getUpdateRecipe,
    postUpdateRecipe,
    postLike,
    postScrap} from "./recipeController.js";

const recipeRouter = express.Router();

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

recipeRouter.route("/:recipeId([0-9]+)/update")
.all(jwtMiddleware)
.get(getUpdateRecipe)
.post(postUpdateRecipe)

recipeRouter.route("/my-recipes")
.all(jwtMiddleware)
.get(getMyRecipes)

/*
recipeRouter.route("/create/official-recipe")
//.all(공식계정 확인 미들웨어)
.get(getCreateOfficialRecipe)
.post(postCreateOfficialRecipe)
*/

export default recipeRouter;