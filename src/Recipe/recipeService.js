import pool from "../../config/database";
import { selectScrapByUser } from "../User/userDao";
import { checkStepExists, createRecipeForThumb, createStepForImg, deleteChallengeTable, deleteLikes, deleteRecipeDao, deleteTemp, getChallenger, getComment, getScrap, insertChallengeTable, insertLike, insertRecipe, insertScrap, minusLike, selectIngredients, selectLikeByUser, selectMethods, selectRecipeInfo, updateChallengeTable, updateLikes, updateRecipeDao, updateStepURL, updateThumbURL } from "./recipeDao";
import { checkRecipeExists, getChallengeStatus, getLike, getTempProvider } from "./recipeProvider";

export const saveThumbURL = async(userId, recipeId, dest)=>{

    const connection = await pool.getConnection(async conn => conn)

    const result = await checkRecipeExists(recipeId);

    if(result != null){
        //1. 이미 레시피 id가 있을 때 기존 recipe id에 저장
        await updateThumbURL(connection, recipeId, dest);
        console.log("기존 레시피 정보에 thumb 추가");

        connection.release();

        return null;
    }
    else{
        //2. 레시피id가 없을 때 -> 새 레시피id를 생성하여 저장
        const newRecipeId = await createRecipeForThumb(connection, userId, dest);
        console.log("새 레시피 정보에 thumb 추가");

        connection.release();

        return newRecipeId;
    }
}

export const saveStepImgURL = async(recipeId, step, dest)=>{

    const connection = await pool.getConnection(async conn => conn)
    
    const stepInfo = await checkStepExists(connection, recipeId,step);

    if(stepInfo != null){
        //1. 이미 스텝넘버가 있을 때(description만 먼저 있을 때) -> 기존 스텝에 저장
        const stepId = stepInfo[0].id;

        await updateStepURL(connection, stepId, dest);
        console.log("기존 step 정보에 img 추가");

        connection.release();

        return null;
    }
    else{
        //2. 스텝넘버가 없을 때 -> 새 id를 생성하여 저장
        const newStepId = await createStepForImg(connection, dest);
        console.log("새 레시피 정보에 thumb 추가");

        connection.release();

        return newStepId;
    }
}



export const updateRecipe = async(userId, recipe, category, ingredients, steps)=>{
    const connection = await pool.getConnection(async conn => conn)

    const result  = updateRecipeDao(connection,recipe, category, ingredients, steps);

    connection.release();

    if(result != null){
        return {
            success : true,
            recipeId : recipe.id
           };
    }
    else{
        return {
            success : false,
            error : "DB-레시피 수정 실패"
           }
    }
}

export const deleteRecipe = async(userId, target) =>{

    const connection = await pool.getConnection(async conn => conn)

    let deleteSubQuery = target.join(",")
    deleteSubQuery = '(' + deleteSubQuery + ')'

    console.log(deleteSubQuery)
    const result = await deleteRecipeDao(connection, userId, deleteSubQuery)

    connection.release();
    if (result[0].affectedRows > 0){
        return {
            success : true
           }
    }
    else {
        return {
            success : false
           }
    }
}

export const getSavedInfo = async(userId, recipeId) =>{

    const connection = await pool.getConnection(async conn => conn)

    const recipeInfo = await selectRecipeInfo(connection,recipeId);
    const ingredientInfo = await selectIngredients(connection,recipeId);
    const methodInfo = await selectMethods(connection,recipeId);
    let liked = await selectLikeByUser(connection, userId, recipeId);
    let scraped = await selectScrapByUser(connection,userId, recipeId);
    let challenger = await getChallenger(connection, recipeId);
    let comments = await getComment(connection, recipeId);
    let scraps = await getScrap(connection, recipeId);
    let isChallenge = await getChallengeStatus(userId, recipeId);
    // console.log(recipeInfo, ingredientInfo, methodInfo, liked, scraped, comments, scraps)
    connection.release();

    liked = liked.length > 0 ? true : false
    scraped = scraped.length > 0 ? true : false
    if (isChallenge.length == 0)
        isChallenge = 0
    else if (isChallenge[0].status == "challenging")
        isChallenge = 1
    else if (isChallenge[0].status == "complete")
        isChallenge = 2
    const dataObj = {
        recipe : recipeInfo,
        ingredient : ingredientInfo,
        steps : methodInfo,
        liked,
        scraped,
        challenger,
        comments,
        scraps,
        isChallenge
    }
    
    console.log(dataObj)
    return dataObj
}

export const changeChallengeStatus = async(userId, recipeId) =>{

    console.log("in service", userId, recipeId)
    const connection = await pool.getConnection(async conn => conn)

    const challengeStatus = await getChallengeStatus(userId, recipeId);

    console.log("check status", challengeStatus[0])
    let result;
    if (challengeStatus.length == 0){
        result = await insertChallengeTable(connection, userId, recipeId);
    }
    else if (challengeStatus[0].status == 'challenging'){
        result = await updateChallengeTable(connection, userId, recipeId);
    }

    connection.release();

    console.log(result[0].affectedRows)
    if(result[0].affectedRows > 0){
        if (challengeStatus.length == 0)
            return {
                success : true,
                data : 'challenging'
            }
        else{
            return{
                success : true,
                data : 'complete'
            }
        }
    }
    else{
        return {
            success : false
        }
    }
}

export const addLikeToRecipe = async(userId,recipeId)=>{
    const connection = await pool.getConnection(async conn => conn)
    const plusResult = await updateLikes(connection, recipeId);
    const insertResult = await insertLike(connection, userId, recipeId)
    connection.release();

    console.log(plusResult, insertResult)
    if(plusResult[0].affectedRows > 0 && insertResult[0].affectedRows > 0){
        return {
            success : true
        }
    }
    else{
        return {
            success : false,
           }
    }
}

export const ScrapRecipe = async(userId, recipeId)=>{
    const connection = await pool.getConnection(async conn => conn)

    const result = await insertScrap(connection, userId,recipeId);

    connection.release();

    console.log(result[0])
    if(result[0].affectedRows > 0){
        return {
            success : true,
        }
    }
    else{
        return {
            success : false,
           }
    }
}

export const deleteLiketoRecipe = async(userId, recipeId) =>{
    const connection = await pool.getConnection(async conn => conn)
    const minusResult = await minusLike(connection,userId, recipeId)
    const deleteResult = await deleteLikes(connection, userId, recipeId)
    connection.release()

    console.log(minusResult, deleteResult)
    if (minusResult[0].affectedRows > 0 && minusResult[0].affectedRows > 0){
        return {
            success : true
        }
    }
    else{
        return{
            success : false
        }
    }
}

export const saveRecipe = async(userId,recipe, ingredient, steps) =>{
    const existRecipe = await getTempProvider(userId)
    console.log("in service, check exist", existRecipe)

    const connection = await pool.getConnection(async conn => conn)
    if (existRecipe.length > 0){
        const {target_recipe:targetId} = existRecipe[0]
        const deleteResult = await deleteTemp(connection, targetId)
        if(deleteResult.recipeDelete[0].affectedRows <=0 || deleteResult.tempDelete[0].affectedRows <=0){
            connection.release()
            return{
                success : false,
                error : "기존 recipe 삭제 실패"
            }
        }
    }

    const newRecipeId = await insertRecipe(connection, userId, recipe, ingredient, steps)

    connection.release()
    if(newRecipeId == undefined){
        return {
            success : false,
            error : "레시피 저장 실패"
        }
    }
    else{
        return{
            success: true,
            newRecipeId
        }
    }
}

export const saveTemp = async(userId, newRecipeId)=>{
    const connection = await pool.getConnection(async conn => conn)

    const createTempTable = await insertTempRecipe(connection, userId, newRecipeId);
    connection.release()
    if(createTempTable[0].affectedRows > 0){
        return{
            success : true
        }
    }
    else{
        return {
            success : false,
            error : "임시저장 실패"
        }
    }
}