import regexEmail from "regex-email";
import privateInfo from "../../config/privateInfo";
import fetch from "node-fetch"
import { getCategoryID, getThumbCategoryID,getCategoryPagingID } from "./recipeProvider";
import { json } from "express";

export const getCategory = async(req,res) =>{
    const {params:{categoryId}} = req;
    const getCategoryId = await getCategoryID(categoryId)
    
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