import pool from "../../config/database"
import { getCategoryList, getThumbCategoryList, getCategoryPagingList, getMainCategoryList,getRecipesList, searchKeywordList, getViewPaging } from "./recipeDao";

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

export const getCategoryPagingID = async(categoryId, last)=>{
    const connection = await pool.getConnection(async conn => conn);
    const result = await getCategoryPagingList(connection, categoryId, last);
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