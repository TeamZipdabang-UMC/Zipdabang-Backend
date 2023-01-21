import pool from "../../config/database"
import { checkStepExists,
    createRecipeForThumb, createStepForImg,
    deleteChallengeTable,
    deleteRecipeDao,
    insertChallengeTable, insertScrap,
    updateChallengeTable,
    updateLikes,
    updateRecipeDao,
    updateStepURL, updateThumbURL } from "./recipeDao";
import { checkRecipeExists, checkTempSave } from "./recipeProvider";

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

    const result = await deleteRecipeDao(connection, userId, deleteSubQuery)

    connection.release();

    if (result != null){
        return {
            success : true
           }
    }
    else {
        return {
            success : false,
            error : "DB-레시피 삭제 실패"
           }
    }
}

export const getSavedInfo = async(userId, recipeId) =>{

    const connection = await pool.getConnection(async conn => conn)

    //전체 정보 가져오는 Dao 호출
    //const result = await ; //getTempSavedInfos가 확정되면 거의 그대로 가져오면 됨

    connection.release();

    return result;
}

export const changeChallengeStatus = async(userId, recipeId, challengeStatus) =>{

    const connection = await pool.getConnection(async conn => conn)

    let result;

    if(challengeStatus == null){ //or ''
        //challengeStatus -> insert 하면서 challenge로 변경
        result = await insertChallengeTable(connection, userId, recipeId);
    }
    else if(challengeStatus == 'challenge'){
        //challengeStatus -> update complete
        result = await updateChallengeTable(connection, userId, recipeId);
    }
    else if(challengeStatus == 'complete'){
        //관련 challenge table 삭제
        result = await deleteChallengeTable(connection, userId, recipeId);
    }

    connection.release();

    if(result != null){
        return {
            success : true,
        }
    }
    else{
        return {
            success : false,
            error : "DB 실패"
           }
    }
}

export const addLikeToRecipe = async(recipeId)=>{
    const connection = await pool.getConnection(async conn => conn)

    const result = await updateLikes(connection, recipeId);

    connection.release();

    if(result != null){
        return {
            success : true,
        }
    }
    else{
        return {
            success : false,
            error : "DB 실패"
           }
    }
}

export const ScrapRecipe = async(userId, recipeId)=>{
    const connection = await pool.getConnection(async conn => conn)

    const result = await insertScrap(connection, userId,recipeId);

    connection.release();

    if(result != null){
        return {
            success : true,
        }
    }
    else{
        return {
            success : false,
            error : "DB 실패"
           }
    }
}