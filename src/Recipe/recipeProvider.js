import pool from "../../config/database";
import { checkRecipeExistsDao, checkTempSaveExists, checkUserExistsDao, getTempSavedInfos, selectMyRecipes, selectMyRecipesPaging } from "./recipeDao";

export const getTempSavedInfo = async(tempSaved, userId)=>{
    const connection = await pool.getConnection(async conn => conn)

    //넘어온 Temp result 값을 통해 저장된 정보들과 매칭
    const recipeId = tempSaved.target_recipe;

    const tempInfos= await getTempSavedInfos(connection, recipeId);
    /*
        tempInfos[0] : recipe의 모든 정보
        tempInfos[1] : catery 명
        tempInfos[2] : 들어가는 ingredient의 모든 정보
        tempInfos[3] : method의 모든 정보
    */

    //Json으로 변환해서 보내줍시다~~
    const JsonTempInfos = await(
        {
            userId,
            /*
            recipeId : tempInfos[0].Id,
            is_official : tempInfos[0].is_official,
            owner : tempInfos[0].owner,
            time : tempInfos[0].time,
            recipeName : tempInfos[0].name,
            recipeIntro : tempInfos[0].intro,
            thumb : tempInfos[0].image_url,
            review : tempInfos[0].review,
            */
            recipe : tempInfos[0], 
            category : tempInfos[1],
            ingredients : tempInfos[2],
            methods : tempInfos[3]
        }
    ).json();
    
    connection.release();

    return JsonTempInfos;
}

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