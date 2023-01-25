import regexEmail from "regex-email";
import privateInfo from "../../config/privateInfo";
import {getMyScrapOverView} from '../User/userProvider';
import {getThumbCategoryID} from '../Recipe/recipeProvider';
import { baseResponse, initResponse } from '../../config/baseResponse'

export const enterMain = async(req, res)=>{
    const {userId, userEmail} = req.verifiedToken;
    const myScrapResult = await getMyScrapOverView(userId);
    let count=0
    const coffeeCategoryOverView = await getThumbCategoryID(1);
    if(typeof coffeeCategoryOverView[0] == 'undefined') count+=1
    const beverageCategoryOverView = await getThumbCategoryID(2);
    if(typeof beverageCategoryOverView[0] == 'undefined') count+=1
    const teaCategoryOverView = await getThumbCategoryID(3);
    if(typeof teaCategoryOverView[0] == 'undefined') count+=1
    const adeCategoryOverView = await getThumbCategoryID(4);
    if(typeof adeCategoryOverView[0] == 'undefined') count+=1
    const smoothieCategoryOverView = await getThumbCategoryID(5);
    if(typeof smoothieCategoryOverView[0] == 'undefined') count+=1
    const healthCategoryOverView = await getThumbCategoryID(6);
    if(typeof healthCategoryOverView[0] == 'undefined') count+=1
    console.log(count)
    if( count == 6 ){
        baseResponse.success = false
        baseResponse.data = null
        baseResponse.error = "데이터가 없습니다."
        return res.status(404).json(baseResponse)
         
    }
    const mainPageResponse = {
        myScrapOverView : myScrapResult,
        coffeeCategoryOverView : coffeeCategoryOverView,
        beverageCategoryOverView : beverageCategoryOverView,
        teaCategoryOverView : teaCategoryOverView,
        adeCategoryOverView : adeCategoryOverView,
        smoothieCategoryOverView : smoothieCategoryOverView,
        healthCategoryOverView : healthCategoryOverView
    }
    if(mainPageResponse){
        baseResponse.success = true
        baseResponse.data = mainPageResponse
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