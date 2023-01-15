import pool from "../../config/database"
import { getCategoryList } from "./recipeDao";

export const getCategoryID = async(categoryId)=>{
    const connection = await pool.getConnection(async conn => conn);
    const result = await getCategoryList(connection, categoryId);
    return result
}