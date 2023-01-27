import regexEmail from "regex-email";
import privateInfo from "../../config/privateInfo";
import fetch from "node-fetch"
import { type } from "os";
import { getCategoryID, getThumbCategoryID,getCategoryPagingID, getMainCategoryID, searchKeyword,getAllRecipesList,getAllViewPaging,checkRecipeExists, checkRecipeLikes, MyRecipeList, getAllOfficailProvider, getAllUsersProvider, checkUserExists,getLike, getTempProvider } from "./recipeProvider";

import { json } from "express";
import { baseResponse, initResponse } from '../../config/baseResponse'
import { addLikeToRecipe, changeChallengeStatus, deleteLiketoRecipe, deleteRecipe, getSavedInfo, saveStepImgURL, saveTemp, ScrapRecipe } from "./recipeService";


export const getCategory = async(req,res) =>{
    const {categoryId, main_page, is_official} = req.query;
    console.log(categoryId, main_page, is_official)
    initResponse()
    if(!req.verifiedToken){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "no token"
        return res.status(401).json(baseResponse)
    }
    if(categoryId<1 || 6<categoryId ){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "없는 카테고리 입니다."
        return res.status(400).json(baseResponse);
    }
    if(typeof main_page == 'undefined'){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "main page 값이 없습니다."
        return res.status(400).json(baseResponse);     
    }
    /* 1 or 0 
    if(is_official == undifined){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "is_official 값이 없습니다."
        return res.status(400).json(baseResponse);     
    }
    */
    if(typeof is_official == 'undefined'){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "is_official 값이 없습니다."
        return res.status(400).json(baseResponse);     
    }

    if(is_official !=0 && is_official != 1 ){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "잘못된 is_official값 입니다."
        return res.status(400).json(baseResponse);
    }

    if(main_page==1){
        const getCategoryId = await getMainCategoryID(categoryId)
        console.log("체크해보자 ", getCategoryId)
        if(getCategoryId[0]){
            baseResponse.success = true;
            baseResponse.error = null
            baseResponse.data = getCategoryId;
            return res.status(200).json(baseResponse);

        }
        else{
            baseResponse.success = false
            baseResponse.data = null
            baseResponse.error = "데이터가 없습니다."
            return res.status(404).json(baseResponse);       

        }
    }

    else{
        const getCategoryId = await getCategoryID(categoryId, is_official)
        if(getCategoryId[0]){
            baseResponse.success = true
            baseResponse.data = getCategoryId
            baseResponse.error = null
            return res.status(200).json(baseResponse);
        }
        else{
            baseResponse.success = false
            baseResponse.data = null
            baseResponse.error = "데이터가 없습니다."
            return res.status(404).json(baseResponse)        
        }
    }
        
}


export const thumbCategory = async(req, res)=>{
    if(!req.verifiedToken){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "no token"
        return res.status(401).json(baseResponse)
    }
    const {params:{categoryId}} = req;
    if(!categoryId){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "categoryId 값이 없습니다."
        return res.status(400).json(baseResponse);     
    }
    if(categoryId<1 || 6<categoryId ){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "없는 카테고리 입니다."
        return res.status(400).json(baseResponse);

    }

    const getCategoryId = await getThumbCategoryID(categoryId)
    if(getCategoryId[0]){
        baseResponse.success = true
        baseResponse.data = getCategoryId
        baseResponse.error = null
        return res.status(200).json(baseResponse);
    }
    else{
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "데이터가 없습니다."
        return res.status(404).json(baseResponse);      
    }

}

export const getCategoryPaging = async(req,res) =>{
    if(!req.verifiedToken){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "no token"
        return res.status(401).json(baseResponse)
    }
    const {categoryId, last,isMain, isOfficial} = req.query;
    if(categoryId<1 || 6<categoryId ){
        baseResponse.success = false
        baseResponse.error = "없는 카테고리 입니다."
        return res.status(400).json(baseResponse)
    }
    if(!categoryId){
        baseResponse.success = false
        baseResponse.error = "category 값을 넣어주세요"
        return res.status(400).json(baseResponse); 
    }
    if(!last){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "last 값이 없습니다."
        return res.status(400).json(baseResponse);     
    }
    if(categoryId<1 || 6<categoryId ){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "없는 카테고리 입니다."
        return res.status(400).json(baseResponse);
    }
    if (typeof isMain == "undefined"){
        baseResponse.success = false
        baseResponse.error = "메인페이지 여부를 알려주세요"
        return res.status(400).json(baseResponse)
    }

    const getCategoryId = await getCategoryPagingID(categoryId, last, isMain, isOfficial)
    if(getCategoryId[0]){
        baseResponse.success = true
        baseResponse.data = getCategoryId
        baseResponse.error = null
        return res.status(200).json(baseResponse);
    }
    else{
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "데이터가 없습니다"
        return res.status(404).json(baseResponse);     

    }

}


export const getAllRecipes = async(req, res)=>{
    if(!req.verifiedToken){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "no token"
        return res.status(401).json(baseResponse)
    }
    const {is_official} = req.query;
    if(typeof is_official == 'undefined'){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "is_official 값이 없습니다."
        return res.status(400).json(baseResponse);     
    }

    
    if(is_official !=0 && is_official != 1 ){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "잘못된 is_official값 입니다."
        return res.status(400).json(baseResponse);
    }
    
    const getRecipes = await getAllRecipesList(is_official)
    //console.log("check!! ", getRecipes[0])
    //if(getRecipes[0]) console.log("반응");
    if(getRecipes[0]){
        baseResponse.success = true
        baseResponse.data = getRecipes

        baseResponse.error = null
        return res.status(200).json(baseResponse);
    }
    else{
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "데이터가 없습니다"
        return res.status(404).json(baseResponse);

    }

}


export const getAllRecipesPaging = async(req,res) =>{
    if(!req.verifiedToken){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "no token"
        return res.status(401).json(baseResponse)
    }
    const {is_official, last} = req.query;
    if(typeof is_official == 'undefined'){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "is_official 값이 없습니다."
        return res.status(400).json(baseResponse);     
    }

    if(!last){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "last 값이 없습니다."
        return res.status(400).json(baseResponse);     
    }
    if(is_official !=0 && is_official != 1 ){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "잘못된 is_official값 입니다."
        return res.status(400).json(baseResponse);
    }


    const getAllViewPagingData = await getAllViewPaging(is_official, last)

    if(getCategoryId[0]){
        baseResponse.success = true
        baseResponse.data = getAllViewPagingData
        baseResponse.error = null
        return res.status(200).json(baseResponse);
    }
    else{
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "데이터가 없습니다"
        return res.status(404).json(baseResponse);     
    }

}



export const getSearch = async(req, res)=>{
    const {keyword} = req.query;
    if(!req.verifiedToken){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "no token"
        return res.status(401).json(baseResponse)
    }
    if(!keyword){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "키워드가 없습니다"
        return res.status(400).json(baseResponse)
    }

    let count=0
    const coffeeSearch = await searchKeyword(keyword, 1);
    if(coffeeSearch[0].length == 0) count+=1
    const beverageSearch = await searchKeyword(keyword, 2);
    if(beverageSearch[0].length == 0) count+=1
    //console.log("be ", beverageSearch.length)
    const teaSearch = await searchKeyword(keyword, 3);
    if(teaSearch[0].length == 0) count+=1
    const adeSearch = await searchKeyword(keyword, 4);
    if(adeSearch[0].length == 0) count+=1
    const smoothieSearch = await searchKeyword(keyword, 5);
    if(smoothieSearch[0].length == 0) count+=1
    const healthSearch = await searchKeyword(keyword, 6);
    if(healthSearch[0].length == 0) count+=1
    if( count == 6 ){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "데이터가 없습니다."
        return res.status(400).json(baseResponse)
         
    }

    const result = {
        coffeeSearch : coffeeSearch,
        beverageSearch : beverageSearch,
        teaSearch : teaSearch,
        adeSearch : adeSearch,
        smoothieSearch : smoothieSearch,
        healthSearch : healthSearch
    }
    //console.log("result ", result)
    if(result){
        baseResponse.success = true
        baseResponse.error = null
        baseResponse.data = result
        return res.status(200).json(baseResponse)
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
    const {recipe:recipeId} = req.query

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
        return res.json(baseResponse)
    }
    else{
        baseResponse.error = 'server Error'
        return res.status(500).json(baseResponse)
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
    const {userId} = req.verifiedToken
    const {recipeId} = req.params;
    
    if ((await checkRecipeExists(recipeId)).length == 0){
        baseResponse.error = '레시피가 데이터베이스에 없습니다'
        return res.status(404).json(baseResponse)
    }

    const checkRecipe = await checkRecipeLikes(recipeId)
    const likeExist = await getLike(userId, recipeId)
    if (likeExist.length > 0){
        const result = await deleteLiketoRecipe(userId, recipeId)
        if (result.success){
            baseResponse.success = true
            baseResponse.data = {likes : checkRecipe[0].likes - 1}
            return res.json(baseResponse)
        }
        else{
            baseResponse.error = 'server error'
            return res.status(500).json(baseResponse)
        }
    }
    else{
        const result = await addLikeToRecipe(userId,recipeId);
        if(result.success){
            baseResponse.success = true
            baseResponse.data = {likes : checkRecipe[0].likes + 1}
            return res.json(baseResponse)
        }
        else{
            baseResponse.error = 'server error'
            return res.status(500).json(baseResponse)
        }
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
        return res.json(baseResponse)
    }
    else{
        baseResponse.success = true
        baseResponse.data = list[0]
        return res.json(baseResponse)
    }
}

/*
export const getCreateOfficialRecipe = async(req,res)=>{
    return res.render(); //공식 레시피 생성 페이지
}

export const postCreateOfficialRecipe = async(req,res)=>{

}
*/

export const getAllOfficail = async(req, res) =>{
    console.log(req.verifiedToken)
    let baseResponse = {
        success : false,
        data : null,
        error : null
    }
    if (!req.verifiedToken){
        baseResponse.error = 'no token'
        return res.status(401).json(baseResponse)
    }

    let {last} = req.query
    console.log("last", last)

    if(!last)
        last = null
    const result = await getAllOfficailProvider(last)
    if(result){
        baseResponse.success = true
        baseResponse.data = result
        return res.json(baseResponse)
    }
}

export const getAllUsers = async(req, res) =>{
    let baseResponse = {
        success : false,
        data : null,
        error : null
    }
    if (!req.verifiedToken){
        baseResponse.error = 'no token'
        return res.status(401).json(baseResponse)
    }   

    let {last} = req.query
    console.log(last)

    if (!last)
        last = null
    const result = await getAllUsersProvider(last)
    if (result){
        baseResponse.success = true,
        baseResponse.data = result
        console.log(baseResponse)
        return res.json(baseResponse)
    }
}

export const getTemp = async(req, res) =>{
    let baseResponse = {
        success : false,
        data : null,
        error : null
    }
    if (!req.verifiedToken){
        baseResponse.error = 'no token'
        return res.status(401).json(baseResponse)
    }   
    const {userId} = req.verifiedToken
    const tempExist = await getTempProvider(userId)
    if (tempExist.length == 0){
        baseResponse.success = true
        res.json(baseResponse)
    }
    else{
        const {target_recipe:recipeId} = tempExist[0]
    }
}

export const postTemp = async(req, res) =>{
    let baseResponse = {
        success : false,
        data : null,
        error : null
    }
    if (!req.verifiedToken){
        baseResponse.error = 'no token'
        return res.status(401).json(baseResponse)
    }

    const {recipe, ingredient, steps} = req.body
    const {userId} = req.verifiedToken
    console.log(req.body)
    const saveInfo = await saveTemp(userId, recipe, ingredient, steps)
}

export const postThumPicture = async(req, res) =>{
    const obj = {
        success : true,
        data :{image :  req.file.location},
        error : null
    }
    res.json(obj)
}


export const postStepPicture = async(req, res) =>{
    const obj = {
        success : true,
        data : {
            image : req.file.location,
            stepNum : req.params.stepNum
        },
        error : null
    }
    res.json(obj)
}
