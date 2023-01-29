import pool from "../../config/database"

import { getCategoryList, getThumbCategoryList, getCategoryPagingList, getMainCategoryList,getRecipesList, searchKeywordList,getViewPaging, checkRecipeExistsDao, selectAllOficial, selectAllUsers, selectLikes, checkUserExistsDao, checkTempSaveExists, selectChallenge, selectMyRecipes, selectMyRecipesPaging,selectLikeByUser, selectTempByUser, selectLastInserted, selectThumb, selectStepPicture, selectAllMyRecipes } from "./recipeDao";

export const getCategoryID = async(categoryId, is_official)=>{
    const connection = await pool.getConnection(async conn => conn);
    const result = await getCategoryList(connection, categoryId, is_official);
    connection.release();
    return result
}

export const getMainCategoryID = async(categoryId)=>{
    const connection = await pool.getConnection(async conn => conn);
    const result = await getMainCategoryList(connection, categoryId);
    connection.release();
    return result
}

export const getThumbCategoryID = async(categoryId)=>{
    const connection = await pool.getConnection(async conn => conn);
    const result = await getThumbCategoryList(connection, categoryId);
    connection.release();
    return result
}

export const getCategoryPagingID = async(categoryId, last, isMain, isOfficial)=>{
    const connection = await pool.getConnection(async conn => conn);
    if (isMain == 1)
        isOfficial = null
    const result = await getCategoryPagingList(connection, categoryId, last, isOfficial);
    connection.release();
    return result
}

export const getAllViewPaging = async(is_official, last)=>{
    const connection = await pool.getConnection(async conn => conn);
    const result = await getViewPaging(connection, is_official, last);
    connection.release();
    return result
}

export const getAllRecipesList = async(is_official)=>{
    const connection = await pool.getConnection(async conn => conn);
    const result = await getRecipesList(connection, is_official);
    connection.release();
    return result
}
export const searchKeyword = async(keyword, category)=>{
    const connection = await pool.getConnection(async conn => conn);
    const result = await searchKeywordList(connection, keyword, category);
    connection.release();
    return result
}


//44444444444444444444444444444


export const checkRecipeExists = async(recipeId)=>{

    const connection = await pool.getConnection(async conn => conn)

    const result = await checkRecipeExistsDao(connection,recipeId);

    connection.release();

    return result;
}

export const checkUserExists = async(userId) =>{
    const connection = await pool.getConnection(async conn => conn)

    const result = await checkUserExistsDao(connection,userId);

    connection.release();

    return result;
}

export const checkTempSave = async(userId)=>{

    const connection = await pool.getConnection(async conn => conn)

    const result = await checkTempSaveExists(connection, userId);

    if (result == null){
        connection.release();
        return null;
    } else{
        connection.release();
        return result[0][0];
    }
}

export const getExtistingInfo = async(userId, recipeId)=>{

    const connection = await pool.getConnection(async conn => conn)

    //Dao의 getTempSavedInfos가 확정되면 거의 그대로 가져오면 됨

    connection.release();

}

export const MyRecipeList = async (userId, last)=>{
    const connection = await pool.getConnection(async conn => conn)

    let result;

    if(last == null){
        result = await selectAllMyRecipes(connection, userId);
    }
    else{
        result = await selectMyRecipesPaging(connection, userId, last);
    }

    connection.release();

    return result;
}

export const getChallengeStatus = async(userId, recipeId)=>{
    console.log("in provider", userId, recipeId)

    const connection = await pool.getConnection(async conn => conn)
    const result = await selectChallenge(connection,userId,recipeId);
    connection.release()
    return result;
}

export const checkRecipeLikes = async(recipeId) =>{
    const connection = await pool.getConnection(async conn => conn)
    const result = await selectLikes(connection, recipeId);
    connection.release()
    return result
}

export const getAllOfficailProvider = async(last) =>{
    const connection = await pool.getConnection(async conn => conn)
    const result = await selectAllOficial(connection, last)
    connection.release()
    return result
}

export const getAllUsersProvider = async(last) =>{
    const connection = await pool.getConnection(async conn => conn)
    const result = await selectAllUsers(connection, last)
    connection.release()
    return result
}

export const getLike = async(userId, recipeId) =>{
    const connection = await pool.getConnection(async conn => conn)
    const result = await selectLikeByUser(connection, userId, recipeId)
    connection.release()
    return result
}

export const getTempProvider = async(userId) =>{
    console.log("in provider", userId)
    const connection = await pool.getConnection(async conn => conn)
    const result = await selectTempByUser(connection, userId)
    connection.release()
    return result
}

export const catchLastProvider = async(userId) =>{
    const connection = await pool.getConnection(async conn => conn)
    const result = await selectLastInserted(connection, userId)
    connection.release()
    return result
}

export const getRecipeThumb = async(recipeId) =>{
    const connection = await pool.getConnection(async conn => conn)
    const result = await selectThumb(connection, recipeId);
    connection.release()
    return result
}

export const getStepPictures = async(recipeId) =>{
    const connection = await pool.getConnection(async conn => conn)
    const result = await selectStepPicture(connection, recipeId)
    connection.release()
    return result
}