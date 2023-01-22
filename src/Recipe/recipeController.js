import regexEmail from "regex-email";
import privateInfo from "../../config/privateInfo";
import fetch from "node-fetch"
import { getCategoryID, getThumbCategoryID,getCategoryPagingID, getMainCategoryID, searchKeyword,getAllRecipesList } from "./recipeProvider";
import { json } from "express";
import { baseResponse, initResponse } from '../../config/baseResponse'


export const getCategory = async(req,res) =>{
    const {categoryId, main_page, is_official} = req.body;
    initResponse;
    if(!req.verifiedToken){
        baseResponse.success = false
        baseResponse.error = "no token"
        return res.status(401).send(JSON.stringify(baseResponse))
    }
    if(categoryId<1 || 6<categoryId ){
        baseResponse.success = false
        baseResponse.error = "없는 카테고리 입니다."
        res.send(baseResponse)
    }
    if(main_page==1){
        const getCategoryId = await getMainCategoryID(categoryId)
        if(getCategoryId[0]){
            baseResponse.success = true;
            baseResponse.data = getCategoryId;
            res.send(baseResponse)
            console.log(baseResponse)
        }
        else{
            baseResponse.success = false
            baseResponse.error = "데이터가 없습니다."
            res.send(JSON.stringify(baseResponse))        
        }
    }

    else{
        const getCategoryId = await getCategoryID(categoryId, is_official)
        if(getCategoryId[0]){
            baseResponse.success = true
            baseResponse.data = getCategoryId
            res.send(baseResponse);
        }
        else{
            res.send(JSON.stringify(responseObj))        
        }
    }
        
}


export const thumbCategory = async(req, res)=>{
    initResponse
    if(!req.verifiedToken){
        baseResponse.success = false
        baseResponse.error = "no token"
        return res.status(401).send(JSON.stringify(baseResponse))
    }
    const {params:{categoryId}} = req;
    if(categoryId<1 || 6<categoryId ){
        baseResponse.success = false
        baseResponse.error = "없는 카테고리 입니다."
        res.send(baseResponse)
    }
    const getCategoryId = await getThumbCategoryID(categoryId)
    if(getCategoryId[0]){
        baseResponse.success = true
        baseResponse.data = getCategoryId
        res.send(JSON.stringify(baseResponse));
    }
    else{
        baseResponse.success = false
        baseResponse.error = "데이터가 없습니다."
        res.send(JSON.stringify(responseObj))        
    }

}

export const getCategoryPaging = async(req,res) =>{
    initResponse
    if(!req.verifiedToken){
        baseResponse.success = false
        baseResponse.error = "no token"
        return res.status(401).send(JSON.stringify(baseResponse))
    }
    const {categoryId, last} = req.body;
    if(categoryId<1 || 6<categoryId ){
        baseResponse.success = false
        baseResponse.error = "없는 카테고리 입니다."
        res.send(baseResponse)
    }
    if(!categoryId){
        baseResponse.success = false
        baseResponse.error = "category 값을 넣어주세요"
        res.send(baseResponse)
    }

    if(!last){
        baseResponse.success = false
        baseResponse.error = "last 값을 넣어주세요"
        res.send(baseResponse)
    }

    const getCategoryId = await getCategoryPagingID(categoryId, last)
    if(getCategoryId[0]){
        baseResponse.success = true
        baseResponse.data = getCategoryId
        res.send(baseResponse)
    }
    else{
        baseResponse.success = false
        baseResponse.error = "데이터가 없습니다"
        res.send(baseResponse)        
    }

}


export const getAllRecipes = async(req, res)=>{
    initResponse
    if(!req.verifiedToken){
        baseResponse.success = false
        baseResponse.error = "no token"
        return res.status(401).send(JSON.stringify(baseResponse))
    }
    const {is_official} = req.body;
    const getRecipes = await getAllRecipesList(is_official)
    if(getRecipes[0]){
        baseResponse.success = true
        baseResponse.data = getRecipes
        res.send(baseResponse)
    }
    else{
        baseResponse.success = false
        baseResponse.error = "데이터기 없습니다"
        res.send(baseResponse)
    }

}


export const getSearch = async(req, res)=>{
    const {keyword} = req.query;
    initResponse
    if(!req.verifiedToken){
        baseResponse.success = false
        baseResponse.error = "no token"
        return res.status(401).send(JSON.stringify(baseResponse))
    }
    console.log(keyword)
    if(!keyword){
        baseResponse.success = false
        baseResponse.error = "키워드가 없습니다"
        res.send(baseResponse)
    }
    const coffeeSearch = await searchKeyword(keyword, 1);
    const beverageSearch = await searchKeyword(keyword, 2);
    const teaSearch = await searchKeyword(keyword, 3);
    const adeSearch = await searchKeyword(keyword, 4);
    const smoothieSearch = await searchKeyword(keyword, 5);
    const healthSearch = await searchKeyword(keyword, 6);

    const result = {
        coffeeSearch : coffeeSearch,
        beverageSearch : beverageSearch,
        teaSearch : teaSearch,
        adeSearch : adeSearch,
        smoothieSearch : smoothieSearch,
        healthSearch : healthSearch
    }

    if(result[0]){
        baseResponse.success = false
        baseResponse.data = result
        res.send(baseResponse)
    }
    else{
       baseResponse.success = false
       baseResponse.error = "데이터가 없습니다"
       res.send(baseResponse)
    }

}