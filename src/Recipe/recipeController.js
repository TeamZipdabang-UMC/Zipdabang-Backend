import fetch from "node-fetch";
import { MyRecipeList, getExtistingInfo, checkRecipeExists, checkUserExists } from "./recipeProvider";
import { saveThumbURL, saveStepImgURL, deleteRecipe, updateRecipe, getSavedInfo, changeChallengeStatus, addLikeToRecipe, ScrapRecipe } from "./recipeService";


export const saveImgURL = async(req,res)=>{
    const {userId} = req.verifiedToken;
    const {file} = req;
    const {recipeId} = req.params;

    const filename = file[0].originalname;
    const dest = file[0].destination+file[0].filename;

    if (filename == "thumb"){
        const newRecipeId = await saveThumbURL(userId, recipeId, dest);
        //프론트에서 반환받은 recipeId값 저장해서 post때 같이 보내줘야 함~
        if(newRecipeId != null)
            return newRecipeId;
    }
    else if(filename.substr(0,3) == 'img'){
        const step = filename.substr(3);
        const newStepId = saveStepImgURL(recipeId,step, dest);
        if(newStepId != null)
            return newStepId;
    }
}





export const getUpdateRecipe = async(req,res)=>{
    const {userId} = req.verifiedToken;
    const {recipeId} = req.params;

    const JsonTempInfos = await getExtistingInfo(userId, recipeId);

    return JsonTempInfos;
}

/*
 img는 이전에 구현한것처럼 각 사진 등록할때마다 바로 저장.
 따라서 업데이트 때는 따로 안 만들어도 됨
*/
export const postUpdateRecipe = async(req,res)=>{
    const {userId} = req.verifiedToken;
    const {recipe, category, ingredients, steps } = req.body;

    /*미들웨어나 직접 추가로 userId, recipeId 존재 확인 */

    const recipeId = await updateRecipe(userId, recipe, category, ingredients, steps);

    return recipeId;
}


export const getShowRecipeInfo = async(req,res) =>{
    const {userId} = req.verifiedToken;
    const {recipeId} = req.params;

    if (await checkRecipeExists(recipeId) == null){
        return {
            success : false,
            error : "데이터베이스에 없습니다"
           }
    }

    if (await checkUserExists(userId) == null){
        return {
            success : false,
            error : "데이터베이스에 없습니다"
           }
    }

    const JsonRecipeInfos = await getSavedInfo(userId, recipeId);

    //Json에 코멘트 정보 추가

    return JsonRecipeInfos;
}

export const postStartChallenge = async(req,res)=>{
    const {userId} = req.verifiedToken;
    const {recipeId} = req.params;
    const {challengeStatus} = req.body;

    if (await checkRecipeExists(recipeId) == null){
        return {
            success : false,
            error : "데이터베이스에 없습니다"
           }
    }

    if (await checkUserExists(userId) == null){
        return {
            success : false,
            error : "데이터베이스에 없습니다"
           }
    }

    await changeChallengeStatus(userId, recipeId, challengeStatus);
}

export const postLike = async(req,res)=>{
    const {recipeId} = req.params;

    if (await checkRecipeExists(recipeId) == null){
        return {
            success : false,
            error : "데이터베이스에 없습니다"
           }
    }

    await addLikeToRecipe(recipeId);
}

export const postScrap = async(req,res)=>{
    const {userId} = req.verifiedToken;
    const {recipeId} = req.params;

    if (await checkRecipeExists(recipeId) == null){
        return {
            success : false,
            error : "데이터베이스에 없습니다"
           }
    }

    await ScrapRecipe(userId, recipeId);
}

export const postDeleteRecipe = async(req,res)=>{
    const {userId} = req.verifiedToken;
    const {target} = req.params;

    await deleteRecipe(userId, target);
}

export const getMyRecipes = async(req,res)=>{
    const {userId} = req.verifiedToken;
    const {last} = req.body;
    //last == 마지막으로 보여진 recipId.

    const list = await MyRecipeList(userId, last);

    if(list == null){
        return{
            success : true,
            message : "생성된 레시피가 없습니다"
           }
    }
    else{
        return JSON.stringify(list[0]);
    }
}

/*
export const getCreateOfficialRecipe = async(req,res)=>{
    return res.render(); //공식 레시피 생성 페이지
}

export const postCreateOfficialRecipe = async(req,res)=>{

}
*/