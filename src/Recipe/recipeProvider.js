import pool from "../../config/database"
import { getCategoryList, getThumbCategoryList, getCategoryPagingList } from "./recipeDao";

export const getCategoryID = async(categoryId)=>{
    const connection = await pool.getConnection(async conn => conn);
    const result = await getCategoryList(connection, categoryId);
    return result
}

export const getThumbCategoryID = async(categoryId)=>{
    const connection = await pool.getConnection(async conn => conn);
    const result = await getThumbCategoryList(connection, categoryId);
    return result
}

export const getCategoryPagingID = async(categoryId, last)=>{
    const connection = await pool.getConnection(async conn => conn);
    const result = await getCategoryPagingList(connection, categoryId, last);
    return result
}