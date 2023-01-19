import fetch from "node-fetch";
import { checkTempSave } from "./recipeProvider";
import { getTempSavedInfo, saveThumbURL, saveStepImgURL, saveRecipe, tempSaveRecipe } from "./recipeService";

export const getCreateUserRecipe = async(req,res)=>{

    const {userId} = req.verifiedToken;

    //임시저장 여부 체크
    const result = await checkTempSave(userId);
    
    if (result == null){
        return res.render(/*사용자 레시피 생성 페이지 */);
    } else{
        const JsonTempInfos = await getTempSavedInfo(result, userId);

        return res.render(/*사용자 레시피 생성 페이지 ,*/ JsonTempInfos);
    }
}

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

export const postCreateUserRecipe = async(req,res)=>{
    const {userId} = req.verifiedToken;

    const {/*recipeId, is_official, owner, time, recipeName, recipeIntro, review,*/
        recipe, category, ingredients, steps } = req.body;

    await saveRecipe(userId, recipe, category, ingredients, steps);

    return res.redirect();//레시피 상세정보 페이지 만들면 추가

}

//update랑 거의 똑같은 동작일 듯?
export const postTempSaveUserRecipe = async(req,res)=>{
    const {userId} = req.verifiedToken;

    const {/*recipeId, is_official, owner, time, recipeName, recipeIntro, review,*/
        recipe, category, ingredients, steps } = req.body;

    await tempSaveRecipe(userId, recipe, category, ingredients, steps);

    return res.redirect();//레시피 상세정보 페이지 만들면 추가
}

/*
export const getCreateOfficialRecipe = async(req,res)=>{
    return res.render(); //공식 레시피 생성 페이지
}

export const postCreateOfficialRecipe = async(req,res)=>{

}
*/