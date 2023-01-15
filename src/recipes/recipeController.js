import regexEmail from "regex-email";
import privateInfo from "../../config/privateInfo";
import fetch from "node-fetch"
import { getCategoryID } from "./recipeProcvider";

export const getCategory = async(req,res) =>{
    const {params:{categoryId}} = req;
    const getCategoryId = await getCategoryID(categoryId)
    res.send(getCategoryId);
}

