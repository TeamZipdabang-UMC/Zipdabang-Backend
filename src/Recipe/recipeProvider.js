import pool from "../../config/database";
import { checkRecipeExistsDao, checkTempSaveExists, checkUserExistsDao, selectMyRecipes, selectMyRecipesPaging } from "./recipeDao";



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
        result = await selectMyRecipes(connection, userId);
    }
    else{
        result = await selectMyRecipesPaging(connection, userId, last);
    }

    connection.release();

    return result;
}