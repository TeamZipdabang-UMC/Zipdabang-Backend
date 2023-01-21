import regexEmail from "regex-email";
import privateInfo from "../../config/privateInfo";
import fetch from "node-fetch"
import { addUser, deleteScraps, finishSocialLogin, startWithGoogle, startWithKakao } from "./userService";
import { checkExistNickname, getMyChallengingAll, getMyChallengingOverView, getMyCompleteOverView,  getMyScrapAll,  getMyScrapOverView, getNextScrap } from "./userProvider";


export const kakaoLogin = async(req, res) =>{
    const {userEmail, userProfile} = req.body

    console.log(userEmail, userProfile)
    const result = await startWithKakao(userEmail, userProfile);
    res.send(JSON.stringify(result))
}

export const googleLogin = async(req, res) =>{
    const {userEmail, userProfile} = req.body

    const result = await startWithGoogle(userEmail, userProfile);
    res.send(JSON.stringify(result))
}

export const findExistNickname = async(req,res)=>{
    const {nickname} = req.query
    
    const result = await checkExistNickname(nickname);
    if (result){
        const responseObj = {
            exist : true,
            nickname
        }
        res.send(JSON.stringify(responseObj))
    }
    else{
        const responseObj = {
            exist : false,
        }
        res.send(JSON.stringify(responseObj))
    }
}

export const postUserDataSocial = async(req,res) =>{
    const {name, nickname, phoneNum, birth, email} = req.body

    const expressionErrorObj = {
        status : "expression error",
        type : ``
    }

    const existErrorObj = {
        status : "data exist error",
        type : ``
    }

    if (!name)
    {
        existErrorObj.type = `name`
        res.send(JSON.stringify(existErrorObj))
    }
    else if (!nickname){
        existErrorObj.type = `nickname`
        res.send(JSON.stringify(existErrorObj))
    }
    else if (!phoneNum){
        existErrorObj.type = `phoneNum`
        res.send(JSON.stringify(existErrorObj))
    }
    else if (!birth){
        existErrorObj.type = `birth`
        res.send(JSON.stringify(existErrorObj))
    }
    else if (!email){
        existErrorObj.type = `email`
        res.send(JSON.stringify(existErrorObj))
    }

    if (!regexEmail.test(email))
    {
        expressionErrorObj.type = `email`
        res.send(JSON.stringify(expressionErrorObj))
    }
    else if (name.length <= 0 || name.length > 10)
    {
        expressionErrorObj.type = `name`
        res.send(JSON.stringify(expressionErrorObj))
    }
    else if (nickname.length <= 1 || nickname.length > 10)
    {
        expressionErrorObj.type = `nickname`
        res.send(JSON.stringify(expressionErrorObj))
    }
    else if (phoneNum.length != 11)
    {
        expressionErrorObj.type = `phone number`
        res.send(JSON.stringify(expressionErrorObj))
    }
    else if (birth.length != 8 || birth[6] != '-'){
        expressionErrorObj.type = `birth`
        res.send(JSON.stringify(expressionErrorObj))
    }

    const dataObj = req.body
    const result = finishSocialLogin(dataObj);
    if (result)
    {
        const responseObj = {
            success: true,
            name : dataObj.name,
            nickname : dataObj.nickname,
            phoneNum : dataObj.phoneNum
        }

        res.send(JSON.stringify(responseObj));
    }
}


export const getMyPage = async(req, res) =>{
    const {userId, userEmail} = req.verifiedToken;
    const myScrapResult = await getMyScrapOverView(userId);
    const myChallengingResult = await getMyChallengingOverView(userId);
    const myCompleteResponse = await getMyCompleteOverView(userId);
    
    const myPageResponse = {
        myScrapOverView : myScrapResult,
        myChallengingOverView : myChallengingResult,
        myCompleteOverView : myCompleteResponse
    }

    res.send(JSON.stringify(myPageResponse))
}

export const getMyScrap = async(req, res) =>{
    const {userId, userEmail} = req.verifiedToken
    const myAllScrap = await getMyScrapAll(userId)
    
    const response = {
        myScrap : myAllScrap
    }
    res.send(JSON.stringify(response))
}

export const getMyChallenging = async(req, res) => {
    const {userId, userEmail} = req.verifiedToken
    const myAllChallenging = await getMyChallengingAll(userId)

    const response = {
        myChallenging : myAllChallenging
    }
    res.send(JSON.stringify(response))
}

export const getMyComeplete = async(req, res) =>{
    const {userId, userEmail} = req.verifiedToken
    const myAllComplete = await getMyChallengingAll(userId)

    const response = {
        myChallenging : myAllComplete
    }
    res.send(JSON.stringify(response))
}

export const deleteMyScrap = async(req, res) =>{
    const {target} = req.body
    
    if (!target)
    {
        const responseObj = {
            success : false,
            error : "삭제할 레시피들의 아이디를 보내주세요"
        }
        res.send(JSON.stringify(responseObj))
    }
    const result = await deleteScraps(target)
}