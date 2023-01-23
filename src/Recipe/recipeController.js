import fetch from "node-fetch";
import { MyRecipeList, getExtistingInfo, checkRecipeExists, checkUserExists, checkRecipeLikes } from "./recipeProvider";
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
    let baseResponse = {
        success : false,
        data : null,
        error : null
    }
    if (!req.verifiedToken){
        baseResponse.error = 'no token'
        return res.status(401).json(baseResponse)
    }
    const {userId} = req.verifiedToken;
    const {recipeId} = req.params;

    if ((await checkRecipeExists(recipeId)).length == 0){
        baseResponse.error = '레시피가 데이터베이스에 없습니다'
        return res.status(400).json(baseResponse)
    }

    if (await checkUserExists(userId) == null){
        baseResponse.error = '유저가 데이터베이스에 없습니다'
        return res.status(400).json(baseResponse)
    }

    const JsonRecipeInfos = await getSavedInfo(userId, recipeId);

    baseResponse.success = true
    baseResponse.data = JsonRecipeInfos
    return res.json(baseResponse);
}

export const postStartChallenge = async(req,res)=>{
    let baseResponse = {
        success : false,
        data : null,
        error : null
    }
    if (!req.verifiedToken){
        baseResponse.error = 'no token'
        return res.status(401).json(baseResponse)
    }
    const {userId} = req.verifiedToken;
    const {recipeId} = req.params;

    // if (await checkRecipeExists(recipeId) == null)
    if ((await checkRecipeExists(recipeId)).length == 0){
        baseResponse.error = "레시피가 데이터베이스에 없습니다"
        return res.status(404).json(baseResponse)
    }

    // if (await checkUserExists(userId) == null)
    if ((await checkUserExists(userId)).length == 0){
        baseResponse.error = "사용자가 데이터베이스에 없습니다"
        return res.status(404).json(baseResponse)
    }

    const result = await changeChallengeStatus(userId, recipeId);
    if(result.success){
        baseResponse.success = true
        baseResponse.data = result.data
        res.json(baseResponse)
    }
    else{
        baseResponse.error = 'server Error'
        res.status(500).json(baseResponse)
    }
}

export const postLike = async(req,res)=>{
    let baseResponse = {
        success : false,
        data : null,
        error : null
    }
    if (!req.verifiedToken){
        baseResponse.error = 'no token'
        return res.status(401).json(baseResponse)
    }
    const {recipeId} = req.params;

    const checkRecipe = await checkRecipeLikes(recipeId)
    if ((await checkRecipeExists(recipeId)).length == 0){
        baseResponse.error = '레시피가 데이터베이스에 없습니다'
        return res.status(404).json(baseResponse)
    }

    const result = await addLikeToRecipe(recipeId);
    if(result.success){
        baseResponse.success = true
        baseResponse.data = checkRecipe[0].likes + 1
        res.json(baseResponse)
    }
    else{
        baseResponse.error = 'server error'
        res.status(500).json(baseResponse)
    }
}

export const postScrap = async(req,res)=>{
    let baseResponse = {
        success : false,
        data : null,
        error : null
    }
    if (!req.verifiedToken){
        baseResponse.error = 'no token'
        return res.status(401).json(baseResponse)
    }
    const {userId} = req.verifiedToken;
    const {recipeId} = req.params;

    if ((await checkRecipeExists(recipeId)).length == 0){
        baseResponse.error = "레시피가 데이터베이스에 없습니다"
        return res.status(404).json(baseResponse)
    }

    const result = await ScrapRecipe(userId, recipeId);
    if (result.success){
        baseResponse.success = true
        return res.json(baseResponse)
    }else{
        baseResponse.error = 'server error'
        return res.status(500).json(baseResponse)
    }
}

export const postDeleteRecipe = async(req,res)=>{
    let baseResponse = {
        success : false,
        data : null,
        error : null
    }
    if (!req.verifiedToken){
        baseResponse.error = 'no token'
        return res.status(401).json(baseResponse)
    }
    const {userId} = req.verifiedToken;
    // const {target} = req.params;
    // const {recipeId} = req.params
    const {owner, target} = req.body
    if (!owner){
        baseResponse.error = '레시피 소유자를 보내주세요'
        return res.status(400).json(baseResponse)
    }
    if (!target || target.length == 0){
        baseResponse.error = '삭제할 레시피 아이디를 보내주세요'
        return res.status(400).json(baseResponse)
    }
    console.log(userId, target)
    const result = await deleteRecipe(userId, target);
    if (result.success){
        baseResponse.success = true
        return res.json(baseResponse)
    }
    else{
        baseResponse.error = 'server error'
        return res.json(baseResponse)
    }
}

export const getMyRecipes = async(req,res)=>{
    let baseResponse = {
        success : false,
        data : null,
        error : null
    }
    if (!req.verifiedToken){
        baseResponse.error = 'no token'
        return res.status(401).json(baseResponse)
    }
    const {userId} = req.verifiedToken;
    let {last} = req.query;
    //last == 마지막으로 보여진 recipId.
    if (!last)
        last = null
    const list = await MyRecipeList(userId, last);

    console.log(list[0])
    if(list[0].length == 0){
        baseResponse.success = true
        baseResponse.data = []
        res.json(baseResponse)
    }
    else{
        baseResponse.success = true
        baseResponse.data = list[0]
        res.json(baseResponse)
    }
}

/*
export const getCreateOfficialRecipe = async(req,res)=>{
    return res.render(); //공식 레시피 생성 페이지
}

export const postCreateOfficialRecipe = async(req,res)=>{

}
*/