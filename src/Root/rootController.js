import regexEmail from "regex-email";
import privateInfo from "../../config/privateInfo";
import {getMyScrapOverView} from '../User/userProvider';
import {getThumbCategoryID} from '../Recipe/recipeProvider';


export const enterMain = async(req, res)=>{
    let baseResponse = {
        success : false,
        data : null,
        error : null
    }
    if (!req.verifiedToken){
        baseResponse.error = 'no token'
        return res.status(401).json(baseResponse)
    }
    const {userId} = req.verifiedToken;
    const myScrapResult = await getMyScrapOverView(userId);
    const coffeeCategoryOverView = await getThumbCategoryID(1);
    const beverageCategoryOverView = await getThumbCategoryID(2);
    const teaCategoryOverView = await getThumbCategoryID(3);
    const adeCategoryOverView = await getThumbCategoryID(4);
    const smoothieCategoryOverView = await getThumbCategoryID(5);
    const healthCategoryOverView = await getThumbCategoryID(6);
    
    baseResponse.data = {
        myScrapOverView : myScrapResult,
        coffeeCategoryOverView : coffeeCategoryOverView,
        beverageCategoryOverView : beverageCategoryOverView,
        teaCategoryOverView : teaCategoryOverView,
        adeCategoryOverView : adeCategoryOverView,
        smoothieCategoryOverView : smoothieCategoryOverView,
        healthCategoryOverView : healthCategoryOverView
    }

    baseResponse.success = true

    return res.json(baseResponse)
}