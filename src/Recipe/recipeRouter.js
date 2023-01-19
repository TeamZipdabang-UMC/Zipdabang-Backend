import express from "express"
import {upload} from "../../config/middlewares.js"
import {jwtMiddleware} from "../../config/jwtMiddleware"
import { getCreateUserRecipe, postCreateUserRecipe, postTempSaveUserRecipe,
    /*getCreateOfficialRecipe, postCreateOfficialRecipe,*/ saveImgURL } from "./recipeController.js";

const recipeRouter = express.Router();

recipeRouter.route("/create/user-recipe")
.all(jwtMiddleware)
.get(getCreateUserRecipe)//레시피 작성 페이지
.post(postCreateUserRecipe);

recipeRouter.route("/create/user-recipe/temp-save")
.all(jwtMiddleware)
.post(postTempSaveUserRecipe);

recipeRouter.route("/create/save-img/:recipeId([0-9]+)")
.post(upload.single("img"), saveImgURL);

/*
recipeRouter.route("/create/official-recipe")
//.all(공식계정 확인 미들웨어)
.get(getCreateOfficialRecipe)
.post(postCreateOfficialRecipe)
*/

export default recipeRouter;