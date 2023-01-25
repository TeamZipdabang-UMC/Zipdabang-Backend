import regexEmail from "regex-email";
import privateInfo from "../../config/privateInfo";
import fetch from "node-fetch"
import { getCategoryID, getThumbCategoryID,getCategoryPagingID, getMainCategoryID, searchKeyword,getAllRecipesList, getAllViewPaging } from "./recipeProvider";
import { json } from "express";
import { baseResponse, initResponse } from '../../config/baseResponse'
import { type } from "os";


export const getCategory = async(req,res) =>{
    const {categoryId, main_page, is_official} = req.body
    if(!req.verifiedToken){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "no token"
        return res.status(401).json(baseResponse)
    }
    if(categoryId<1 || 6<categoryId ){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "없는 카테고리 입니다."
        return res.status(400).json(baseResponse);
    }
    if(typeof main_page == 'undefined'){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "main page 값이 없습니다."
        return res.status(400).json(baseResponse);     
    }
    /* 1 or 0 
    if(is_official == undifined){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "is_official 값이 없습니다."
        return res.status(400).json(baseResponse);     
    }
    */
    if(typeof is_official == 'undefined'){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "is_official 값이 없습니다."
        return res.status(400).json(baseResponse);     
    }

    if(is_official !=0 && is_official != 1 ){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "잘못된 is_official값 입니다."
        return res.status(400).json(baseResponse);
    }

    if(main_page==1){
        const getCategoryId = await getMainCategoryID(categoryId)
        console.log("체크해보자 ", getCategoryId)
        if(getCategoryId[0]){
            baseResponse.success = true;
            baseResponse.error = null
            baseResponse.data = getCategoryId;
            return res.status(200).json(baseResponse);
        }
        else{
            baseResponse.success = false
            baseResponse.data = null
            baseResponse.error = "데이터가 없습니다."
            return res.status(404).json(baseResponse);       
        }
    }

    else{
        const getCategoryId = await getCategoryID(categoryId, is_official)
        if(getCategoryId[0]){
            baseResponse.success = true
            baseResponse.data = getCategoryId
            baseResponse.error = null
            return res.status(200).json(baseResponse);
        }
        else{
            baseResponse.success = false
            baseResponse.data = null
            baseResponse.error = "데이터가 없습니다."
            return res.status(404).json(baseResponse)        
        }
    }
        
}


export const thumbCategory = async(req, res)=>{
    if(!req.verifiedToken){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "no token"
        return res.status(401).json(baseResponse)
    }
    const {params:{categoryId}} = req;
    if(!categoryId){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "categoryId 값이 없습니다."
        return res.status(400).json(baseResponse);     
    }
    if(categoryId<1 || 6<categoryId ){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "없는 카테고리 입니다."
        return res.status(400).json(baseResponse);
    }

    const getCategoryId = await getThumbCategoryID(categoryId)
    if(getCategoryId[0]){
        baseResponse.success = true
        baseResponse.data = getCategoryId
        baseResponse.error = null
        return res.status(200).json(baseResponse);
    }
    else{
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "데이터가 없습니다."
        return res.status(404).json(baseResponse);      
    }

}

export const getCategoryPaging = async(req,res) =>{
    if(!req.verifiedToken){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "no token"
        return res.status(401).json(baseResponse)
    }
    const {categoryId, last} = req.body;
    if(!categoryId){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "categoryId 값이 없습니다."
        return res.status(400).json(baseResponse);     
    }
    if(!last){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "last 값이 없습니다."
        return res.status(400).json(baseResponse);     
    }
    if(categoryId<1 || 6<categoryId ){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "없는 카테고리 입니다."
        return res.status(400).json(baseResponse);
    }


    const getCategoryId = await getCategoryPagingID(categoryId, last)
    if(getCategoryId[0]){
        baseResponse.success = true
        baseResponse.data = getCategoryId
        baseResponse.error = null
        return res.status(200).json(baseResponse);
    }
    else{
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "데이터가 없습니다"
        return res.status(404).json(baseResponse);     
    }

}


export const getAllRecipes = async(req, res)=>{
    if(!req.verifiedToken){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "no token"
        return res.status(401).json(baseResponse)
    }
    const {is_official} = req.body;
    if(typeof is_official == 'undefined'){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "is_official 값이 없습니다."
        return res.status(400).json(baseResponse);     
    }

    
    if(is_official !=0 && is_official != 1 ){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "잘못된 is_official값 입니다."
        return res.status(400).json(baseResponse);
    }
    
    const getRecipes = await getAllRecipesList(is_official)
    //console.log("check!! ", getRecipes[0])
    //if(getRecipes[0]) console.log("반응");
    if(getRecipes[0]){
        baseResponse.success = true
        baseResponse.data = getRecipes
        baseResponse.error = null
        return res.status(200)(JSON.stringify( baseResponse));
    }
    else{
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "데이터가 없습니다"
        return res.status(404)(JSON.stringify( baseResponse));
    }

}


export const getAllRecipesPaging = async(req,res) =>{
    if(!req.verifiedToken){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "no token"
        return res.status(401).json(baseResponse)
    }
    const {is_official, last} = req.body;
    if(typeof is_official == 'undefined'){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "is_official 값이 없습니다."
        return res.status(400).json(baseResponse);     
    }

    if(!last){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "last 값이 없습니다."
        return res.status(400).json(baseResponse);     
    }
    if(is_official !=0 && is_official != 1 ){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "잘못된 is_official값 입니다."
        return res.status(400).json(baseResponse);
    }


    const getAllViewPagingData = await getAllViewPaging(is_official, last)

    if(getCategoryId[0]){
        baseResponse.success = true
        baseResponse.data = getAllViewPagingData
        baseResponse.error = null
        return res.status(200).json(baseResponse);
    }
    else{
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "데이터가 없습니다"
        return res.status(404).json(baseResponse);     
    }

}



export const getSearch = async(req, res)=>{
    const {keyword} = req.query;
    //console.log("keyword ", keyword)
    //console.log("초기화 후", baseResponse)
    if(!req.verifiedToken){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "no token"
        return res.status(401).json(baseResponse)
    }
    if(!keyword){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "키워드가 없습니다"
        return res.status(400).json(baseResponse)
    }

    let count=0
    const coffeeSearch = await searchKeyword(keyword, 1);
    if(coffeeSearch[0].length == 0) count+=1
    const beverageSearch = await searchKeyword(keyword, 2);
    if(beverageSearch[0].length == 0) count+=1
    //console.log("be ", beverageSearch.length)
    const teaSearch = await searchKeyword(keyword, 3);
    if(teaSearch[0].length == 0) count+=1
    const adeSearch = await searchKeyword(keyword, 4);
    if(adeSearch[0].length == 0) count+=1
    const smoothieSearch = await searchKeyword(keyword, 5);
    if(smoothieSearch[0].length == 0) count+=1
    const healthSearch = await searchKeyword(keyword, 6);
    if(healthSearch[0].length == 0) count+=1
    if( count == 6 ){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "데이터가 없습니다."
        return res.status(400).json(baseResponse)
         
    }
    const result = {
        coffeeSearch : coffeeSearch,
        beverageSearch : beverageSearch,
        teaSearch : teaSearch,
        adeSearch : adeSearch,
        smoothieSearch : smoothieSearch,
        healthSearch : healthSearch
    }
    //console.log("result ", result)
    if(result){
        baseResponse.success = true
        baseResponse.error = null
        baseResponse.data = result
        return res.status(200).json(baseResponse)
    }

}