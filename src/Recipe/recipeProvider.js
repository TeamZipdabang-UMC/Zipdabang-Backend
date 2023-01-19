import pool from "../../config/database";
import { checkTempSaveExists } from "./recipeDao";

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