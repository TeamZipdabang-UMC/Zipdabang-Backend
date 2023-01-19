import regexEmail from "regex-email";
import privateInfo from "../../config/privateInfo";
import fetch from "node-fetch"
import { getCategoryID, getThumbCategoryID,getCategoryPagingID, getMainCategoryID, searchKeyword } from "./recipeProvider";
import { json } from "express";

export const getCategory = async(req,res) =>{
    const {categoryId, main_page, is_official} = req.body;
    const responseObj = {
        status : "category not exist",
    }
    if(main_page==1){
        const getCategoryId = await getMainCategoryID(categoryId)
        if(getCategoryId[0]){
            res.send(JSON.stringify(getCategoryId));
        }
        else{
            res.send(JSON.stringify(responseObj))        
        }
    }

    else{
        const getCategoryId = await getCategoryID(categoryId, is_official)
        if(getCategoryId[0]){
            res.send(JSON.stringify(getCategoryId));
        }
        else{
            res.send(JSON.stringify(responseObj))        
        }
    }
        
}


export const thumbCategory = async(req, res)=>{
    const {params:{categoryId}} = req;
    const getCategoryId = await getThumbCategoryID(categoryId)
    if(getCategoryId[0]){
        res.send(JSON.stringify(getCategoryId));
    }
    else{
        const responseObj = {
            status : "category not exist",
        }
        res.send(JSON.stringify(responseObj))        
    }

}

export const getCategoryPaging = async(req,res) =>{
    const {categoryId, last} = req.body;
    const existErrorObj={
        status : "data exist error",
        type : ``
    }
    if(!categoryId){
        existErrorObj.type = `category`
        res.send(json.stringify(existErrorObj));
    }
    else if(!last){
        existErrorObj.type = `last`
        res.send(json.stringify(existErrorObj));       
    }

    const getCategoryId = await getCategoryPagingID(categoryId, last)
    if(getCategoryId[0]){
        res.send(JSON.stringify(getCategoryId));
    }
    else{
        const responseObj = {
            status : "category & id not match",
        }
        res.send(JSON.stringify(responseObj))        
    }

}

export const getSearch = async(req, res)=>{
    const {keyword} = req.query;
    console.log(keyword)

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
        res.send(JSON.stringify(result));
    }
    else{
        const responseObj = {
            status : "keyword not exist",
        }
        res.send(JSON.stringify(responseObj))        
    }

}