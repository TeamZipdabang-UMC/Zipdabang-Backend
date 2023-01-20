import pool from "../../config/database"
import { checkRelatedTablesExist, checkStepExists,
    createRecipeForThumb, createStepForImg,
    deleteChallengeTable,
    deleteRecipeDao,
    deleteTempSavedInfo, insertChallengeTable, insertTempRecipe,
    updateChallengeTable,
    updateRecipeDao,
    updateR_InsertCIS, updateStepURL, updateThumbURL } from "./recipeDao";
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

export const saveRecipe = async(userId, recipe, category, ingredients, steps) =>{
    await save(userId, recipe, category, ingredients, steps, false);
}

export const tempSaveRecipe = async(userId, recipe, category, ingredients, steps) =>{
    // userId 하나당 임시저장은 하나까지만 가능함!
    await save(userId, recipe, category, ingredients, steps, true);
}

const save = async(userId, recipe, category, ingredients, steps, is_tempSave)=>{

    const connection = await pool.getConnection(async conn => conn)

    //1. 해당 recipeId가 있는지 확인
    const recipeId = await checkRecipeExists(recipe.Id);

    //recipeId가 이미 존재할 때
    if (recipeId != null){

        await checkInsertUpdateTables(connection, userId, recipe, category, ingredients, steps)

        //2. 임시저장인지 확인
        const tempSavedInfo = await checkTempSave(userId);

        if(tempSavedInfo != null && tempSavedInfo.target_recipe == recipe.id){
            //임시저장된 내용이 있음

            //일반 저장 시 기존 임시저장 정보 삭제
            if(!is_tempSave)
                await deleteTempSavedInfo(connection, tempSaved.id); 
            }

        else if (tempSavedInfo != null && tempSavedInfo.target_recipe != recipe.id){
            //지금 작성한 내용과 별개로 임시저장 레시피가 있음
            if(is_tempSave)
            {
                //3. 만약 임시저장 페이지가 존재하는데, 새로 임시저장을 원하면 기존 임시저장 테이블을 삭제하고
                //새로운 레시피를 임시저장 테이블에 등록
                await deleteTempSavedInfo(connection, tempSaved.id);
            }
        }
    }
    //recipeId가 없을 때
    else{
            if(is_tempSave)
                //4. 아무것도 거리낄 것이 없는 임시저장
                await insertTempRecipe(connection, recipe, category,ingredients);
            //그냥 저장을 하려면, 사진이 꼭 생성되어야 하기 때문에 recipeId가 있을 수 밖에 없음.
            //따라서 임시저장의 경우만 고려함.
    }

    connection.release();

    return; //레시피Id
}

const checkInsertUpdateTables = async(connection, userId, recipe, category, ingredients, steps)=>{
    const checkResult = await checkRelatedTablesExist(connection, recipe.id);

    let check;

    if(checkResult == null){
        await updateR_InsertCIS(connection, userId, recipe, category,ingredients, steps);
    }
    else {
        check = checkResult[0][0];
    }

    if(check.categoryId != null && check.ingredientId == null && check.stepId == null){
        await updateRC_InsertIS(connection, userId, recipe, category,ingredients, steps);
    }
    else if(check.categoryId == null && check.ingredientId != null && check.stepId == null){
        await updateRI_InsertCS(connection, userId, recipe, category,ingredients, steps);
    }
    else if(check.categoryId == null && check.ingredientId == null && check.stepId != null){
        await updateRS_InsertIS(connection, userId, recipe, category,ingredients, steps);
    }
    else if(check.categoryId != null && check.ingredientId != null && check.stepId == null){
        await updateRCI_InsertS(connection, userId, recipe, category,ingredients, steps);
    }
    else if(check.categoryId != null && check.ingredientId == null && check.stepId != null){
        await updateRCS_InsertI(connection, userId, recipe, category,ingredients, steps);
    }
    else if(check.categoryId == null && check.ingredientId != null && check.stepId != null){
        await updateRIS_InsertC(connection, userId, recipe, category,ingredients, steps);
    }
    else if(check.categoryId != null && check.ingredientId != null && check.stepId != null){
        await updateRCIS(connection, userId, recipe, category,ingredients, steps);
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